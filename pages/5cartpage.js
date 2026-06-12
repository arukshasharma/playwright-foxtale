const { BasePage } = require('./1basepage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);

    this.cartIcon       = page.getByRole('button').filter({ hasText: /^[0-9]+$/ }).first();
    this.cartItems      = page.locator('[class*="cart-item"], [class*="cart__item"]');
    this.cartTotal      = page.locator('[class*="total"], [class*="cart-total"]').first();
    this.checkoutBtn    = page.getByRole('button', { name: /checkout/i }).first();
    this.emptyCartMsg   = page.locator('[class*="empty"], [class*="cart-empty"]').first();
  }

  async openCart() {
    await this.cartIcon.click();
    await this.page.waitForTimeout(2000);
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async isCheckoutVisible() {
    return await this.checkoutBtn.isVisible();
  }
}

module.exports = { CartPage };