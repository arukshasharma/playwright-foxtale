const { BasePage } = require('./1basepage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);

    // Cart page locators
    this.checkoutButton = page.getByRole('button', { name: /checkout/i }).first();
    this.cartItems      = page.locator('[class*="cart-item"], [class*="cart__item"], [class*="line-item"]');

    // Checkout page locators
    this.emailField     = page.getByRole('textbox', { name: /email/i }).first();
    this.firstNameField = page.getByRole('textbox', { name: /first name/i }).first();
    this.lastNameField  = page.getByRole('textbox', { name: /last name/i }).first();
    this.addressField   = page.getByRole('textbox', { name: /address/i }).first();
    this.cityField      = page.getByRole('textbox', { name: /city/i }).first();
    this.pincodeField   = page.getByRole('textbox', { name: /pincode|zip|postal/i }).first();
    this.phoneField     = page.getByRole('textbox', { name: /phone/i }).first();
  }

  // ✅ navigate directly to cart page — bypasses flaky cart drawer
  async goToCart() {
    await this.navigate('/cart');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
    console.log('✅ Cart page URL:', this.page.url());
  }

  async clickCheckout() {
    await this.checkoutButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.checkoutButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
    console.log('✅ Checkout URL:', this.page.url());
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async isOnCheckoutPage() {
    const url = this.page.url();
    return url.includes('checkout') || url.includes('checkouts');
  }

  async isCartEmpty() {
    const url = this.page.url();
    const emptyMsg = page.locator('text=/empty|no items/i').first();
    return await emptyMsg.isVisible().catch(() => false);
  }
}

module.exports = { CheckoutPage };