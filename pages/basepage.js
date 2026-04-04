class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle() {
    return await this.page.title();
  }

  async getURL() {
    return this.page.url();
  }
}

module.exports = { BasePage };