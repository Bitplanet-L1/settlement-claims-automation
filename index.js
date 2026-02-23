#!/usr/bin/env node

/**
 * Settlement Claims Automation - Main Orchestrator
 * 
 * Usage:
 *   node index.js scan              # Scan for new settlements
 *   node index.js fill <id>         # Auto-fill claim form
 *   node index.js stats             # Show statistics
 *   node index.js priority          # Show priority claims
 *   node index.js run               # Run full automation cycle
 */

const TopClassActionsScraper = require('./scrapers/topclassactions');
const ClassActionScraper = require('./scrapers/classaction');
const ClaimFiller = require('./auto-fill/claim-filler');
const EmailNotifier = require('./notification/email-notifier');
const SettlementTracker = require('./tracker');
const fs = require('fs').promises;
const path = require('path');

class SettlementClaimsAutomation {
  constructor() {
    this.tracker = new SettlementTracker();
    this.notifier = new EmailNotifier();
    
    this.config = {
      recipientEmail: process.env.NOTIFY_EMAIL || 'your-email@example.com',
      scanInterval: 24 * 60 * 60 * 1000, // Daily
      maxClaimsPerRun: 5
    };
  }

  /**
   * Initialize system
   */
  async init() {
    console.log('🚀 Settlement Claims Automation Starting...\n');
    await this.tracker.load();
    await this.notifier.init();
  }

  /**
   * Scan all sources for new settlements
   */
  async scanSettlements() {
    console.log('🔍 Scanning settlement sources...\n');
    
    const scrapers = [
      new TopClassActionsScraper(),
      new ClassActionScraper()
    ];

    let allSettlements = [];
    
    for (const scraper of scrapers) {
      const settlements = await scraper.scrapeSettlements();
      allSettlements.push(...settlements);
      await this.delay(2000); // Polite delay between sources
    }

    console.log(`\n✅ Total found: ${allSettlements.length} settlements\n`);

    // Add to tracker
    const newSettlements = await this.tracker.addSettlements(allSettlements);

    // Send notification if new settlements found
    if (newSettlements.length > 0) {
      await this.notifier.notifyNewSettlements(newSettlements, this.config.recipientEmail);
    }

    return newSettlements;
  }

  /**
   * Auto-fill claim form
   */
  async fillClaim(settlementId) {
    const settlement = this.tracker.data.settlements.find(s => s.id === settlementId);
    
    if (!settlement) {
      console.error(`❌ Settlement ${settlementId} not found`);
      return;
    }

    console.log(`\n📝 Auto-filling claim for: ${settlement.title}\n`);

    // Load user profile
    const profilePath = path.join(__dirname, 'templates/user-profile.json');
    const userProfile = JSON.parse(await fs.readFile(profilePath, 'utf-8'));

    // Initialize filler
    const filler = new ClaimFiller(userProfile);
    await filler.init();

    // Determine claim form URL
    let claimUrl = settlement.claimFormUrl || settlement.url;
    
    // Fill form
    const result = await filler.fillClaim(claimUrl, settlement);
    
    if (result.success) {
      console.log(`\n✅ ${result.message}`);
      console.log(`📸 Screenshots saved in settlement-claims/screenshots/\n`);
      
      // Update tracker
      await this.tracker.updateStatus(settlementId, 'filing', {
        filledAt: new Date().toISOString(),
        filledFields: result.filledFields
      });

      console.log('⚠️  IMPORTANT: Review screenshots and manually submit the form!');
    } else {
      console.error(`\n❌ Failed: ${result.error}\n`);
    }

    // Keep browser open for manual review
    console.log('\n⏸️  Browser will stay open for 60 seconds for review...');
    await this.delay(60000);
    
    await filler.close();
  }

  /**
   * Show statistics
   */
  async showStats() {
    const stats = this.tracker.getStats();
    
    console.log('\n📊 Settlement Claims Statistics\n');
    console.log('═══════════════════════════════════════');
    console.log(`Total Discovered:     ${stats.totalDiscovered}`);
    console.log(`Total Filed:          ${stats.totalFiled}`);
    console.log(`Total Earned:         $${stats.totalEarned.toFixed(2)}`);
    console.log(`Conversion Rate:      ${stats.conversionRate}`);
    console.log('───────────────────────────────────────');
    console.log(`This Month:           ${stats.thisMonth} new`);
    console.log(`Pending:              ${stats.pending}`);
    console.log(`In Progress:          ${stats.inProgress}`);
    console.log(`Filed:                ${stats.filed}`);
    console.log(`Paid:                 ${stats.paid}`);
    console.log('═══════════════════════════════════════');
    console.log(`Last Scan:            ${stats.lastScanDate || 'Never'}\n`);
  }

  /**
   * Show priority claims
   */
  async showPriority() {
    const priority = this.tracker.getPriority();
    
    console.log('\n🎯 Priority Claims (Top 10)\n');
    console.log('═══════════════════════════════════════════════════════════');
    
    if (priority.length === 0) {
      console.log('No pending claims found.\n');
      return;
    }

    priority.forEach((s, i) => {
      console.log(`\n${i + 1}. ${s.title}`);
      console.log(`   Priority Score: ${s.priority}`);
      console.log(`   Amount: ${s.estimatedAmount || 'Unknown'}`);
      console.log(`   Deadline: ${s.deadline || 'Not specified'}`);
      console.log(`   Source: ${s.source}`);
      console.log(`   ID: ${s.id}`);
      console.log(`   URL: ${s.url}`);
    });
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`\nTo auto-fill a claim, run: node index.js fill <id>\n`);
  }

  /**
   * Run full automation cycle
   */
  async run() {
    await this.init();
    
    // Scan for new settlements
    const newSettlements = await this.scanSettlements();
    
    // Show stats
    await this.showStats();
    
    // Show priority claims
    if (newSettlements.length > 0) {
      await this.showPriority();
    }
    
    console.log('✅ Automation cycle complete!\n');
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI
async function main() {
  const automation = new SettlementClaimsAutomation();
  const command = process.argv[2];
  const arg = process.argv[3];

  try {
    switch (command) {
      case 'scan':
        await automation.init();
        await automation.scanSettlements();
        await automation.showStats();
        break;
        
      case 'fill':
        if (!arg) {
          console.error('❌ Usage: node index.js fill <settlement-id>');
          process.exit(1);
        }
        await automation.init();
        await automation.fillClaim(arg);
        break;
        
      case 'stats':
        await automation.init();
        await automation.showStats();
        break;
        
      case 'priority':
        await automation.init();
        await automation.showPriority();
        break;
        
      case 'run':
        await automation.run();
        break;
        
      default:
        console.log(`
Settlement Claims Automation Tool

Usage:
  node index.js scan              Scan for new settlements
  node index.js fill <id>         Auto-fill claim form
  node index.js stats             Show statistics
  node index.js priority          Show priority claims
  node index.js run               Run full automation cycle

Examples:
  node index.js scan
  node index.js fill https-topclassactions-com-lawsuit-settle
  node index.js stats
        `);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = SettlementClaimsAutomation;
