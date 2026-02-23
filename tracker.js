/**
 * Settlement Claims Tracker
 * Manages discovered settlements and filing status
 */

const fs = require('fs').promises;
const path = require('path');

class SettlementTracker {
  constructor(trackingFile) {
    this.trackingFile = trackingFile || path.join(__dirname, '../memory/settlement-claims.json');
    this.data = {
      settlements: [],
      stats: {
        totalDiscovered: 0,
        totalFiled: 0,
        totalEarned: 0,
        lastScanDate: null
      }
    };
  }

  /**
   * Load existing tracking data
   */
  async load() {
    try {
      const content = await fs.readFile(this.trackingFile, 'utf-8');
      this.data = JSON.parse(content);
      console.log(`[Tracker] Loaded ${this.data.settlements.length} tracked settlements`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('[Tracker] No existing data - starting fresh');
        await this.save();
      } else {
        console.error('[Tracker] Load error:', error.message);
      }
    }
  }

  /**
   * Save tracking data
   */
  async save() {
    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(this.trackingFile), { recursive: true });
      
      await fs.writeFile(
        this.trackingFile,
        JSON.stringify(this.data, null, 2),
        'utf-8'
      );
      console.log(`[Tracker] Saved ${this.data.settlements.length} settlements`);
    } catch (error) {
      console.error('[Tracker] Save error:', error.message);
    }
  }

  /**
   * Add new settlements (deduplicate by ID)
   */
  async addSettlements(newSettlements) {
    const existingIds = new Set(this.data.settlements.map(s => s.id));
    const actuallyNew = newSettlements.filter(s => !existingIds.has(s.id));
    
    if (actuallyNew.length > 0) {
      this.data.settlements.push(...actuallyNew);
      this.data.stats.totalDiscovered += actuallyNew.length;
      this.data.stats.lastScanDate = new Date().toISOString();
      await this.save();
      
      console.log(`[Tracker] Added ${actuallyNew.length} new settlements`);
      return actuallyNew;
    }
    
    console.log('[Tracker] No new settlements found');
    return [];
  }

  /**
   * Get settlements by status
   */
  getByStatus(status) {
    return this.data.settlements.filter(s => s.status === status);
  }

  /**
   * Update settlement status
   */
  async updateStatus(settlementId, status, metadata = {}) {
    const settlement = this.data.settlements.find(s => s.id === settlementId);
    
    if (settlement) {
      settlement.status = status;
      settlement.lastUpdated = new Date().toISOString();
      Object.assign(settlement, metadata);
      
      if (status === 'filed') {
        this.data.stats.totalFiled++;
      }
      
      await this.save();
      console.log(`[Tracker] Updated ${settlementId} -> ${status}`);
      return true;
    }
    
    return false;
  }

  /**
   * Record payout received
   */
  async recordPayout(settlementId, amount) {
    const settlement = this.data.settlements.find(s => s.id === settlementId);
    
    if (settlement) {
      settlement.status = 'paid';
      settlement.payoutAmount = amount;
      settlement.payoutDate = new Date().toISOString();
      this.data.stats.totalEarned += parseFloat(amount);
      
      await this.save();
      console.log(`[Tracker] Recorded payout: $${amount} for ${settlementId}`);
      return true;
    }
    
    return false;
  }

  /**
   * Get statistics
   */
  getStats() {
    const now = new Date();
    const thisMonth = this.data.settlements.filter(s => {
      const date = new Date(s.discoveredAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    const pending = this.getByStatus('new').length;
    const inProgress = this.getByStatus('filing').length;
    const filed = this.getByStatus('filed').length;
    const paid = this.getByStatus('paid').length;

    return {
      ...this.data.stats,
      thisMonth: thisMonth.length,
      pending,
      inProgress,
      filed,
      paid,
      conversionRate: this.data.stats.totalDiscovered > 0 
        ? ((this.data.stats.totalFiled / this.data.stats.totalDiscovered) * 100).toFixed(1) + '%'
        : '0%'
    };
  }

  /**
   * Get priority settlements (high value, expiring soon)
   */
  getPriority() {
    const now = new Date();
    
    return this.data.settlements
      .filter(s => s.status === 'new')
      .map(s => {
        let priority = 0;
        
        // Priority for deadline proximity
        if (s.deadline) {
          const deadline = new Date(s.deadline);
          const daysUntil = Math.floor((deadline - now) / (1000 * 60 * 60 * 24));
          if (daysUntil < 7) priority += 50;
          else if (daysUntil < 30) priority += 30;
          else if (daysUntil < 60) priority += 10;
        }
        
        // Priority for estimated amount
        if (s.estimatedAmount) {
          const amount = parseFloat(s.estimatedAmount.replace(/[^0-9.]/g, ''));
          if (amount > 100) priority += 40;
          else if (amount > 50) priority += 20;
          else if (amount > 25) priority += 10;
        }
        
        return { ...s, priority };
      })
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10);
  }
}

module.exports = SettlementTracker;
