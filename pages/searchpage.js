const { BasePage } = require('./basepage');

class SearchPage extends BasePage {
  constructor(page) {
    super(page);

    // locators
    this.searchResults   = page.locator('[class*="product"], [class*="item"], [class*="card"]');
    this.noResultsMsg    = page.locator('[class*="no-result"], [class*="empty"]');
    this.firstProduct    = page.locator('[class*="product"], [class*="item"], [class*="card"]').first();
    this.productTitle    = page.locator('[class*="product-title"], [class*="product-name"], h2, h3').first();
  }

  async getResultsCount() {
    return await this.searchResults.count();
  }

  async clickFirstProduct() {
    await this.firstProduct.waitFor({ state: 'visible' });
    await this.firstProduct.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { SearchPage };