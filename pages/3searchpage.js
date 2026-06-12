const { BasePage } = require('./1basepage');

class SearchPage extends BasePage {
  constructor(page) {
    super(page);

    this.searchResults = page.locator('[class*="product"], [class*="item"], [class*="card"]');
    this.firstProduct  = page.locator('a[href*="/products/"]').first();
  }

  async getResultsCount() {
    await this.page.waitForTimeout(1000);
    return await this.searchResults.count();
  }

  async clickFirstProduct() {
    await this.firstProduct.waitFor({ state: 'visible', timeout: 15000 });
    await this.firstProduct.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { SearchPage };