const { BasePage } = require('./1basepage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.navbar = page.locator('header');
    this.logo   = page.locator('header a').first();
  }

  async openHomePage() {
    await this.navigate('/');
    await this.page.waitForLoadState('domcontentloaded');
  }
  
  async searchForProduct(productName) {
  await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForTimeout(1000);
  await this.page.goto(`/search?q=${encodeURIComponent(productName)}`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });
  await this.page.waitForTimeout(2000);
}

  async clickLogo() {
    await this.logo.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { HomePage };