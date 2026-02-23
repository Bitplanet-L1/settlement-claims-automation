/**
 * TopClassActions.com Settlement Scraper
 * Scrapes new class action settlements and claim deadlines
 */

const axios = require('axios');
const cheerio = require('cheerio');

class TopClassActionsScraper {
  constructor() {
    this.baseUrl = 'https://topclassactions.com';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    };
  }

  /**
   * Scrape recent settlements
   * @returns {Array} Array of settlement objects
   */
  async scrapeSettlements() {
    try {
      const url = `${this.baseUrl}/lawsuit-settlements/open-lawsuit-settlements/`;
      console.log(`[TopClassActions] Fetching: ${url}`);
      
      const response = await axios.get(url, { headers: this.headers });
      const $ = cheerio.load(response.data);
      const settlements = [];

      // Parse settlement listings
      $('.settlement-list-item, article.settlement').each((i, elem) => {
        const title = $(elem).find('h2, h3, .settlement-title').first().text().trim();
        const link = $(elem).find('a').first().attr('href');
        const description = $(elem).find('.settlement-description, .excerpt, p').first().text().trim();
        
        // Extract claim amount if available
        const amountMatch = description.match(/\$[\d,]+(?:\.\d{2})?/);
        const estimatedAmount = amountMatch ? amountMatch[0] : null;

        // Extract deadline
        const deadlineText = $(elem).text();
        const deadlineMatch = deadlineText.match(/(?:deadline|claim by|file by)[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i);
        const deadline = deadlineMatch ? deadlineMatch[1] : null;

        if (title && link) {
          settlements.push({
            id: this.generateId(link),
            source: 'topclassactions',
            title,
            url: link.startsWith('http') ? link : `${this.baseUrl}${link}`,
            description,
            estimatedAmount,
            deadline,
            discoveredAt: new Date().toISOString(),
            status: 'new'
          });
        }
      });

      console.log(`[TopClassActions] Found ${settlements.length} settlements`);
      return settlements;

    } catch (error) {
      console.error('[TopClassActions] Scraping failed:', error.message);
      return [];
    }
  }

  /**
   * Generate unique ID from URL
   */
  generateId(url) {
    return url.replace(/[^a-z0-9]/gi, '-').toLowerCase().substring(0, 50);
  }

  /**
   * Scrape detailed settlement info
   */
  async scrapeDetails(settlementUrl) {
    try {
      const response = await axios.get(settlementUrl, { headers: this.headers });
      const $ = cheerio.load(response.data);

      return {
        fullDescription: $('.settlement-details, .entry-content').first().text().trim(),
        claimFormUrl: $('a[href*="claim"], a:contains("file a claim")').first().attr('href'),
        eligibility: $('.eligibility, .who-qualifies').text().trim(),
        payoutEstimate: $('.payout, .settlement-amount').text().trim()
      };
    } catch (error) {
      console.error('[TopClassActions] Detail scraping failed:', error.message);
      return {};
    }
  }
}

module.exports = TopClassActionsScraper;
