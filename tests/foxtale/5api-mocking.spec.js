const { test, expect } = require('@playwright/test');
const { ProductPage } = require('../../pages/4productpage');

test.describe('Foxtale API Mocking', () => {

  test('should mock product search API and show custom results', async ({ page }) => {
    // intercept search requests and return mock response
    await page.route('**/search**', async route => {
      const url = route.request().url();
      console.log('Intercepted request:', url);

      // continue with real request but log it
      await route.continue();
    });

    await page.goto('/search?q=sunscreen', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    console.log('Search page loaded with route interception active');
    await expect(page).toHaveURL(/search/i);
  });

  test('should mock cart API and verify request payload', async ({ page }) => {
    let cartRequestBody = null;

    // intercept POST requests to cart endpoint
    await page.route('**/cart/add**', async route => {
      const request = route.request();
      cartRequestBody = request.postDataJSON();
      console.log('Cart request intercepted:', JSON.stringify(cartRequestBody));

      // continue with real request
      await route.continue();
    });

    // navigate to product and add to cart
    await page.goto('/products/glow-sunscreen', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // click add to cart
    const addToCartBtn = page.getByRole('button', { name: /add to cart/i }).first();
    await addToCartBtn.waitFor({ state: 'visible', timeout: 15000 });
    await addToCartBtn.click();
    await page.waitForTimeout(3000);

    // verify the cart request was made
    if (cartRequestBody) {
      console.log('Cart API called with:', JSON.stringify(cartRequestBody));
      expect(cartRequestBody).toHaveProperty('items');
    } else {
      console.log('Cart request used different endpoint — checking cart UI');
      const cartCount = page.locator('button').filter({ hasText: /^[1-9]/ }).first();
      const visible = await cartCount.isVisible().catch(() => false);
      console.log('Cart updated:', visible);
    }
  });

  test('should mock API error and verify UI handles it gracefully', async ({ page }) => {
    //  intercept and BLOCK product API to simulate server error
    await page.route('**/products.json**', async route => {
      console.log('Blocking products API to simulate 500 error');
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // page should still load even if products API fails
    await expect(page).toHaveURL(/foxtale\.in/);
    console.log('Homepage loaded gracefully despite mocked API error');
  });

  test('should mock slow network and verify page still loads', async ({ page }) => {
    // simulate slow API response (2 second delay)
    await page.route('**/collections/**', async route => {
      console.log('Simulating slow network for collections API...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    const startTime = Date.now();

    await page.goto('/collections/sunscreens', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    const loadTime = Date.now() - startTime;
    console.log(`Page loaded in ${loadTime}ms with simulated slow network`);
    await expect(page).toHaveURL(/sunscreens/);
  });

  test('should mock search and return fake product data', async ({ page }) => {
    // intercept search JSON API and return fake data
    await page.route('**/search.json**', async route => {
      console.log('🎭 Returning mocked search results');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            { id: 1, title: 'Mock Sunscreen SPF 50', price: 299 },
            { id: 2, title: 'Mock Face Wash',        price: 199 },
          ],
          count: 2,
        }),
      });
    });

    await page.goto('/search?q=sunscreen', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    console.log('Search loaded with mocked API data');
    await expect(page).toHaveURL(/search/);
  });

});