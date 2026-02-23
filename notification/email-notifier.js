/**
 * Email Notification System for New Settlements
 */

const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

class EmailNotifier {
  constructor(config) {
    this.config = config || {};
    this.transporter = null;
    
    // Gmail default (update with your credentials)
    this.emailConfig = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || this.config.emailUser,
        pass: process.env.EMAIL_PASS || this.config.emailPass
      }
    };
  }

  /**
   * Initialize email transporter
   */
  async init() {
    // Skip if credentials not provided
    if (!this.emailConfig.auth.user || !this.emailConfig.auth.pass) {
      console.log('[EmailNotifier] Email not configured - notifications disabled');
      console.log('[EmailNotifier] Set EMAIL_USER and EMAIL_PASS env vars to enable');
      return false;
    }

    try {
      this.transporter = nodemailer.createTransport(this.emailConfig);
      await this.transporter.verify();
      console.log('[EmailNotifier] Email system ready');
      return true;
    } catch (error) {
      console.error('[EmailNotifier] Setup failed:', error.message);
      return false;
    }
  }

  /**
   * Send notification about new settlements
   */
  async notifyNewSettlements(settlements, recipientEmail) {
    if (!this.transporter) {
      console.log('[EmailNotifier] Email not configured - skipping notification');
      return false;
    }

    if (settlements.length === 0) {
      console.log('[EmailNotifier] No new settlements to notify');
      return false;
    }

    try {
      const html = this.generateEmailHTML(settlements);
      
      const mailOptions = {
        from: this.emailConfig.auth.user,
        to: recipientEmail,
        subject: `💰 ${settlements.length} New Settlement Claim${settlements.length > 1 ? 's' : ''} Available`,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EmailNotifier] Sent notification to ${recipientEmail}`);
      return true;

    } catch (error) {
      console.error('[EmailNotifier] Send failed:', error.message);
      return false;
    }
  }

  /**
   * Generate HTML email
   */
  generateEmailHTML(settlements) {
    const settlementCards = settlements.map(s => `
      <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${s.title}</h3>
        <p style="margin: 5px 0;"><strong>Source:</strong> ${s.source}</p>
        ${s.estimatedAmount ? `<p style="margin: 5px 0;"><strong>Est. Amount:</strong> <span style="color: #27ae60; font-weight: bold;">${s.estimatedAmount}</span></p>` : ''}
        ${s.deadline ? `<p style="margin: 5px 0;"><strong>Deadline:</strong> <span style="color: #e74c3c;">${s.deadline}</span></p>` : ''}
        <p style="margin: 10px 0 5px 0;">${s.description.substring(0, 200)}...</p>
        <a href="${s.url}" style="display: inline-block; background: #3498db; color: white; padding: 8px 16px; text-decoration: none; border-radius: 3px; margin-top: 10px;">View Settlement →</a>
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Settlement Claims</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2c3e50;">💰 New Settlement Claims Detected</h1>
        <p>Found <strong>${settlements.length}</strong> new settlement claim${settlements.length > 1 ? 's' : ''} you may be eligible for:</p>
        
        ${settlementCards}
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #7f8c8d; font-size: 12px;">
          This is an automated notification from your Settlement Claims Monitor.<br>
          Review each settlement for eligibility requirements before filing.
        </p>
      </body>
      </html>
    `;
  }

  /**
   * Send daily summary
   */
  async sendDailySummary(stats, recipientEmail) {
    if (!this.transporter) return false;

    const html = `
      <h2>📊 Daily Settlement Claims Summary</h2>
      <ul>
        <li><strong>New settlements found:</strong> ${stats.newSettlements}</li>
        <li><strong>Claims filed:</strong> ${stats.claimsFiled}</li>
        <li><strong>Total tracked:</strong> ${stats.totalTracked}</li>
        <li><strong>Estimated value:</strong> $${stats.estimatedValue}</li>
      </ul>
      <p>Check your dashboard for details.</p>
    `;

    try {
      await this.transporter.sendMail({
        from: this.emailConfig.auth.user,
        to: recipientEmail,
        subject: '📊 Settlement Claims Daily Summary',
        html
      });
      console.log('[EmailNotifier] Daily summary sent');
      return true;
    } catch (error) {
      console.error('[EmailNotifier] Summary send failed:', error.message);
      return false;
    }
  }
}

module.exports = EmailNotifier;
