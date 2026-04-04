const { BasePage } = require('./basepage');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);

    // ✅ all selectors from actual page snapshot
    this.productTitle = page.locator('h1').first();
    this.productPrice = page.locator('p').filter({ hasText: /^₹\s?\d+/ }).first();
    this.addToCartBtn = page.getByRole('button', { name: /add to cart/i }).first();
    this.productImage = page.locator('img[alt*="Image 1"]').first();
    this.variantBtns  = page.getByRole('button', { name: /^\d+(ml|g|mg)$/i });
  }

  async navigateToProduct(productSlug) {
    await this.navigate(`/products/${productSlug}`);
  }

  async getProductTitle() {
    await this.productTitle.waitFor({ state: 'visible' });
    return await this.productTitle.textContent();
  }

  async getProductPrice() {
    await this.productPrice.waitFor({ state: 'visible' });
    return await this.productPrice.textContent();
  }

  async clickAddToCart() {
    await this.addToCartBtn.waitFor({ state: 'visible' });
    await this.addToCartBtn.click();
    await this.page.waitForTimeout(2000);
  }

  async selectFirstVariant() {
    const count = await this.variantBtns.count();
    if (count > 0) {
      await this.variantBtns.first().click();
      await this.page.waitForTimeout(1000);
      console.log('✅ Variant selected');
    } else {
      console.log('ℹ️ No variants found, skipping');
    }
  }
}

module.exports = { ProductPage };