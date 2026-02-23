/**
 * Automated Claim Form Filler using Playwright
 * Intelligently fills out settlement claim forms
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

class ClaimFiller {
  constructor(userProfile) {
    this.userProfile = userProfile;
    this.browser = null;
    this.page = null;
  }

  /**
   * Initialize browser
   */
  async init() {
    this.browser = await chromium.launch({ 
      headless: false, // Set to true for production
      slowMo: 100 // Slow down to appear more human
    });
    this.page = await this.browser.newPage();
    
    // Set realistic viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });
  }

  /**
   * Auto-fill claim form
   */
  async fillClaim(claimUrl, settlementData) {
    try {
      console.log(`[ClaimFiller] Navigating to: ${claimUrl}`);
      await this.page.goto(claimUrl, { waitUntil: 'networkidle' });
      
      // Wait for form to load
      await this.page.waitForTimeout(2000);

      // Take screenshot before
      const screenshotsDir = path.join(__dirname, '../screenshots');
      await fs.mkdir(screenshotsDir, { recursive: true });
      await this.page.screenshot({ 
        path: path.join(screenshotsDir, `${settlementData.id}-before.png`),
        fullPage: true 
      });

      // Common form field mappings
      const fieldMappings = {
        // Personal info
        'firstName': ['input[name*="first" i][name*="name" i]', '#firstName', '[placeholder*="First Name" i]'],
        'lastName': ['input[name*="last" i][name*="name" i]', '#lastName', '[placeholder*="Last Name" i]'],
        'email': ['input[type="email"]', 'input[name*="email" i]', '#email'],
        'phone': ['input[type="tel"]', 'input[name*="phone" i]', '#phone'],
        
        // Address
        'address': ['input[name*="address" i]:not([name*="2" i])','#address', '#street'],
        'address2': ['input[name*="address" i][name*="2" i]', '#address2'],
        'city': ['input[name*="city" i]', '#city'],
        'state': ['select[name*="state" i]', '#state'],
        'zip': ['input[name*="zip" i]', 'input[name*="postal" i]', '#zip'],
        
        // Claim-specific
        'purchaseDate': ['input[name*="purchase" i][name*="date" i]', 'input[type="date"]'],
        'proofOfPurchase': ['input[type="file"]']
      };

      let filledFields = 0;

      // Fill text inputs
      for (const [field, selectors] of Object.entries(fieldMappings)) {
        if (field === 'state' || field === 'proofOfPurchase') continue; // Handle separately
        
        for (const selector of selectors) {
          try {
            const element = await this.page.$(selector);
            if (element && this.userProfile[field]) {
              await element.fill(this.userProfile[field]);
              filledFields++;
              console.log(`[ClaimFiller] Filled ${field}`);
              await this.page.waitForTimeout(300 + Math.random() * 200); // Human-like delay
              break;
            }
          } catch (err) {
            // Try next selector
          }
        }
      }

      // Handle state dropdown
      if (this.userProfile.state) {
        for (const selector of fieldMappings.state) {
          try {
            await this.page.selectOption(selector, this.userProfile.state);
            filledFields++;
            console.log(`[ClaimFiller] Selected state`);
            break;
          } catch (err) {}
        }
      }

      // Handle checkboxes (eligibility confirmations)
      const checkboxes = await this.page.$$('input[type="checkbox"]');
      for (const checkbox of checkboxes) {
        const label = await checkbox.evaluate(el => {
          const id = el.id;
          const labelEl = document.querySelector(`label[for="${id}"]`);
          return labelEl ? labelEl.textContent : '';
        });
        
        // Auto-check eligibility and agreement boxes
        if (label.match(/eligible|agree|certify|confirm/i)) {
          await checkbox.check();
          filledFields++;
          console.log(`[ClaimFiller] Checked: ${label.substring(0, 50)}...`);
          await this.page.waitForTimeout(200);
        }
      }

      // Take screenshot after
      await this.page.screenshot({ 
        path: path.join(screenshotsDir, `${settlementData.id}-after.png`),
        fullPage: true 
      });

      console.log(`[ClaimFiller] Filled ${filledFields} fields`);

      return {
        success: true,
        filledFields,
        screenshotBefore: `${settlementData.id}-before.png`,
        screenshotAfter: `${settlementData.id}-after.png`,
        message: `Auto-filled ${filledFields} fields. Review screenshots before submitting.`
      };

    } catch (error) {
      console.error('[ClaimFiller] Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Submit claim (use with caution!)
   */
  async submitClaim() {
    // Find submit button
    const submitButton = await this.page.$('button[type="submit"], input[type="submit"], button:has-text("Submit")');
    
    if (submitButton) {
      console.log('[ClaimFiller] SUBMIT button found - Manual review recommended before submission');
      // await submitButton.click(); // Uncomment to auto-submit
      return { submitted: false, reason: 'Manual review required' };
    }
    
    return { submitted: false, reason: 'Submit button not found' };
  }

  /**
   * Close browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = ClaimFiller;
