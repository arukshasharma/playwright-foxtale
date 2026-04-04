const { BasePage } = require('./basepage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);

    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.searchInput  = page.getByRole('textbox', { name: 'Search' });
    this.navbar       = page.locator('header');
    this.logo         = page.locator('header a').first();
  }

  async openHomePage() {
    await this.navigate('/');
  }

  async clickSearchIcon() {
    await this.searchButton.click();
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async searchForProduct(productName) {
    await this.clickSearchIcon();
    await this.searchInput.fill(productName);
    // wait a moment for suggestions to load
    await this.page.waitForTimeout(2000);
    await this.page.keyboard.press('Enter');
    // wait for either URL change OR results to appear
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  async clickLogo() {
    await this.logo.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { HomePage };