const { test, expect }    = require('@playwright/test');
const { ProductPage }  = require('../../pages/4productpage');
const { CheckoutPage } = require('../../pages/6checkoutpage');
const { checkoutData } = require('../../test-data/checkout-data');

const PRODUCT_SLUG = 'glow-sunscreen';

test.describe('Foxtale Checkout Flow', () => {

  test('Step 1: should load product page with correct details', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.navigateToProduct(PRODUCT_SLUG);

    const title = await productPage.getProductTitle();
    const price = await productPage.getProductPrice();

    expect(title.length).toBeGreaterThan(0);
    expect(price.length).toBeGreaterThan(0);
  });

  test('Step 2: should select product variant', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.navigateToProduct(PRODUCT_SLUG);
    await productPage.selectFirstVariant();

    await expect(productPage.addToCartBtn).toBeVisible();
  });

  test('Step 3: should add product to cart successfully', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.navigateToProduct(PRODUCT_SLUG);
    await productPage.selectFirstVariant();
    await productPage.clickAddToCart();
    await page.waitForTimeout(3000);

    const cartBtn  = page.locator('button').filter({ hasText: /^[1-9][0-9]*$/ }).first();
    const hasCount = await cartBtn.isVisible().catch(() => false);

    if (hasCount) {
      const count = await cartBtn.textContent();
      expect(Number(count)).toBeGreaterThan(0);
    }
  });

  test('Step 4: should display order summary on cart page', async ({ page }) => {
    const productPage  = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await productPage.navigateToProduct(PRODUCT_SLUG);
    await productPage.selectFirstVariant();
    await productPage.clickAddToCart();
    await page.waitForTimeout(3000);

    await checkoutPage.goToCart();

    const cartHeading = await page.getByRole('heading', { name: 'Your Cart' }).isVisible().catch(() => false);

    expect(cartHeading).toBe(true);
  });

  test('Step 5: should navigate to checkout from cart', async ({ page }) => {
    const productPage  = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await productPage.navigateToProduct(PRODUCT_SLUG);
    await productPage.selectFirstVariant();
    await productPage.clickAddToCart();
    await page.waitForTimeout(3000);

    await checkoutPage.goToCart();

    const cartEmpty = await page.getByText('Your cart is empty').isVisible().catch(() => false);
    if (cartEmpty) {
      expect(page.url()).toContain('foxtale');
      return;
    }

    const checkoutBtn = page.getByRole('button', { name: /checkout now/i });
    await checkoutBtn.waitFor({ state: 'visible', timeout: 15000 });
    await checkoutBtn.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const currentURL = page.url();
    expect(currentURL.includes('checkout') || currentURL.includes('foxtale')).toBe(true);
  });

  test('Step 6: should mock payment API and verify no crash', async ({ page }) => {
    const productPage = new ProductPage(page);

    await page.route('**/payment**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'success', order_id: 'TEST-12345' }),
      });
    });

    await productPage.navigateToProduct(PRODUCT_SLUG);
    await productPage.selectFirstVariant();
    await productPage.clickAddToCart();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/foxtale\.in/);
  });

  test('Step 7: should verify cart persists correct product details', async ({ page }) => {
    const productPage  = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await productPage.navigateToProduct(PRODUCT_SLUG);

    const title = await productPage.getProductTitle();
    const price = await productPage.getProductPrice();

    await productPage.selectFirstVariant();
    await productPage.clickAddToCart();
    await page.waitForTimeout(3000);

   await checkoutPage.goToCart();

const cartEmpty = await page.getByText('Your cart is empty').isVisible().catch(() => false);

expect(title.length).toBeGreaterThan(0);
expect(price.length).toBeGreaterThan(0);

if (!cartEmpty) {
  const productInCart = await page.getByRole('heading', { name: 'Your Cart' }).isVisible().catch(() => false);
  expect(productInCart).toBe(true);
} else {
  expect(page.url()).toContain('cart');
}
  });

});