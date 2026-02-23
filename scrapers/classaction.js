/**
 * ClassAction.org Settlement Scraper
 * Scrapes active settlement claims
 */

const axios = require('axios');
const cheerio = require('cheerio');

class ClassActionScraper {
  constructor() {
    this.baseUrl = 'https://www.classaction.org';
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
      const url = `${this.baseUrl}/settlements`;
      console.log(`[ClassAction] Fetching: ${url}`);
      
      const response = await axios.get(url, { headers: this.headers });
      const $ = cheerio.load(response.data);
      const settlements = [];

      // Parse settlement cards
      $('article.settlement-card, .settlement-item, .post').each((i, elem) => {
        const title = $(elem).find('h2, h3, .title').first().text().trim();
        const link = $(elem).find('a').first().attr('href');
        const description = $(elem).find('.description, .excerpt, p').first().text().trim();
        
        // Extract claim amount
        const amountMatch = $(elem).text().match(/\$[\d,]+(?:\.\d{2})?/);
        const estimatedAmount = amountMatch ? amountMatch[0] : null;

        // Extract deadline
        const deadlineText = $(elem).find('.deadline, .date').text();
        const deadlineMatch = deadlineText.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}|[A-Za-z]+\s+\d{1,2},?\s+\d{4})/);
        const deadline = deadlineMatch ? deadlineMatch[1] : null;

        if (title && link) {
          settlements.push({
            id: this.generateId(link),
            source: 'classaction',
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

      console.log(`[ClassAction] Found ${settlements.length} settlements`);
      return settlements;

    } catch (error) {
      console.error('[ClassAction] Scraping failed:', error.message);
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
        fullDescription: $('.content, .entry-content').first().text().trim(),
        claimFormUrl: $('a[href*="claim"], a:contains("File")').first().attr('href'),
        eligibility: $('.eligibility').text().trim(),
        payoutEstimate: $('.settlement-details').text().match(/\$[\d,]+/)?.[0]
      };
    } catch (error) {
      console.error('[ClassAction] Detail scraping failed:', error.message);
      return {};
    }
  }
}

module.exports = ClassActionScraper;
