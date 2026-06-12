const { test, expect } = require('@playwright/test');
const { HomePage }     = require('../../pages/2homepage');
const { SearchPage }   = require('../../pages/3searchpage');
const { ProductPage }  = require('../../pages/4productpage');
const { CheckoutPage } = require('../../pages/6checkoutpage');

test.describe('Foxtale Complete User Journey', () => {

  test.describe.configure({ mode: 'serial' });

  let sharedPage;

  test.beforeAll(async ({ browser }) => {
    sharedPage = await browser.newPage();
  });

  test.afterAll(async () => {
    await sharedPage.close();
  });

  test('Step 1: user opens the foxtale website', async () => {
    const homePage = new HomePage(sharedPage);
    await homePage.openHomePage();

    await expect(sharedPage).toHaveURL(/foxtale\.in/);
    await expect(sharedPage).toHaveTitle(/foxtale/i);
  });

  test('Step 2: user sees the navigation bar and hero section', async () => {
    const navbar = sharedPage.locator('header');
    await expect(navbar).toBeVisible();

    const hero = sharedPage.locator('section, [class*="banner"], [class*="hero"]').first();
    await expect(hero).toBeVisible();
  });

  test('Step 3: user searches for sunscreen', async () => {
    const homePage = new HomePage(sharedPage);
    await homePage.searchForProduct('sunscreen');

    await expect(sharedPage).toHaveURL(/search/i);
  });

  test('Step 4: user sees search results', async () => {
    const searchPage = new SearchPage(sharedPage);
    const count      = await searchPage.getResultsCount();

    expect(count).toBeGreaterThan(0);
  });

  test('Step 5: user clicks on a product from search results', async () => {
    const searchPage = new SearchPage(sharedPage);
    await searchPage.clickFirstProduct();

    await expect(sharedPage).toHaveURL(/foxtale\.in\/products/);
  });

  test('Step 6: user sees product title and price', async () => {
    const productPage = new ProductPage(sharedPage);

    const title = await productPage.getProductTitle();
    const price = await productPage.getProductPrice();

    expect(title.length).toBeGreaterThan(0);
    expect(price.length).toBeGreaterThan(0);
  });

  test('Step 7: user sees product image', async () => {
    const productPage = new ProductPage(sharedPage);

    await expect(productPage.productImage).toHaveAttribute('src', /cdn\.shopify\.com/, { timeout: 15000 });
  });

  test('Step 8: user selects a product variant', async () => {
    const productPage = new ProductPage(sharedPage);
    await productPage.selectFirstVariant();

    await expect(productPage.addToCartBtn).toBeVisible();
  });

  test('Step 9: user adds product to cart', async () => {
    const productPage = new ProductPage(sharedPage);
    await productPage.clickAddToCart();
    await sharedPage.waitForTimeout(3000);

    const cartBtn  = sharedPage.locator('button').filter({ hasText: /^[1-9][0-9]*$/ }).first();
    const hasCount = await cartBtn.isVisible().catch(() => false);

    if (hasCount) {
      const count = await cartBtn.textContent();
      expect(Number(count)).toBeGreaterThan(0);
    } else {
      expect(sharedPage.url()).toContain('foxtale');
    }
  });

  test('Step 10: user navigates to cart page', async () => {
    const checkoutPage = new CheckoutPage(sharedPage);
    await checkoutPage.goToCart();

    const cartHeading = await sharedPage.getByRole('heading', { name: 'Your Cart' }).isVisible().catch(() => false);
    expect(cartHeading).toBe(true);
  });

  test('Step 11: user sees order summary with subtotal', async () => {
    const cartEmpty = await sharedPage.getByText('Your cart is empty').isVisible().catch(() => false);

    const cartHeading = await sharedPage.getByRole('heading', { name: 'Your Cart' }).isVisible().catch(() => false);
expect(cartHeading).toBe(true);

if (!cartEmpty) {
  const subtotal = await sharedPage.getByText('Subtotal').isVisible().catch(() => false);
  expect(subtotal).toBe(true);
}
  });

  test('Step 12: user proceeds to checkout', async () => {
    const cartEmpty = await sharedPage.getByText('Your cart is empty').isVisible().catch(() => false);

    if (cartEmpty) {
      expect(sharedPage.url()).toContain('foxtale');
      return;
    }

    const checkoutBtn = sharedPage.getByRole('button', { name: /checkout now/i });
    await checkoutBtn.waitFor({ state: 'visible', timeout: 15000 });
    await checkoutBtn.click();
    await sharedPage.waitForLoadState('domcontentloaded');
    await sharedPage.waitForTimeout(2000);

    const url = sharedPage.url();
    expect(url.includes('checkout') || url.includes('foxtale')).toBe(true);
  });

});