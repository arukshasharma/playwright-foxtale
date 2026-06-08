const { BasePage } = require('./basepage');

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

  // ✅ navigate directly to search URL — bypasses flaky button click
  async searchForProduct(productName) {
    await this.page.goto(`/search?q=${encodeURIComponent(productName)}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await this.page.waitForTimeout(2000);
    console.log('✅ Navigated to search URL:', this.page.url());
  }

  async clickLogo() {
    await this.logo.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { HomePage };