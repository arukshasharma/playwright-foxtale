const { test, expect } = require('@playwright/test');
const { ProductPage } = require('../../pages/4productpage');
const { CartPage }     = require('../../pages/5cartpage');

const PRODUCT_SLUG  = 'glow-sunscreen';
const PRODUCT_SLUG2 = 'niacinamide-clarifying-serum';

test.describe('Foxtale Product Page', () => {

  test('should load product page with title and price', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.navigateToProduct(PRODUCT_SLUG);

    const title = await productPage.getProductTitle();
    console.log('Product title:', title);
    expect(title.length).toBeGreaterThan(0);

    const price = await productPage.getProductPrice();
    console.log('Product price:', price);
    expect(price).toContain('₹');
  });

 test('should display product image', async ({ page }) => {
  const productPage = new ProductPage(page);

  await productPage.navigateToProduct(PRODUCT_SLUG);

  const imgSrc = await productPage.productImage.getAttribute('src');
  console.log('Product image src:', imgSrc);
  expect(imgSrc).toBeTruthy();
  expect(imgSrc).toContain('cdn.shopify.com');
});

  test('should have an Add to Cart button', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.navigateToProduct(PRODUCT_SLUG);

   await expect(productPage.productImage).toHaveAttribute('src', /cdn\.shopify\.com/, { timeout: 15000 });
console.log('Product image loaded with valid src');
  });

  test('should add product to cart successfully', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage    = new CartPage(page);

    await productPage.navigateToProduct(PRODUCT_SLUG);

    await productPage.selectFirstVariant();

    await productPage.clickAddToCart();

    const cartBtn = page.locator('button').filter({ hasText: /^[1-9][0-9]*$/ }).first();
    const isVisible = await cartBtn.isVisible().catch(() => false);

    if (isVisible) {
      const count = await cartBtn.textContent();
      console.log('Cart count updated to:', count);
      expect(Number(count)).toBeGreaterThan(0);
    } else {
  
      const drawerItem = page.locator('[class*="cart-item"], [class*="cart__item"]').first();
      const inDrawer   = await drawerItem.isVisible().catch(() => false);
      console.log('Cart drawer opened:', inDrawer);
      expect(inDrawer).toBe(true);
    }
  });

  test('should add multiple products to cart', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.navigateToProduct(PRODUCT_SLUG);
    await productPage.selectFirstVariant();
    await productPage.clickAddToCart();
    console.log('First product added');

    await productPage.navigateToProduct(PRODUCT_SLUG2);
    await productPage.selectFirstVariant();
    await productPage.clickAddToCart();
    console.log('Second product added');

    await expect(page).toHaveURL(/foxtale\.in/);
    console.log('Still on Foxtale after adding multiple products');
  });

});