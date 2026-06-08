const { test, expect } = require('@playwright/test');
test.describe('Foxtale Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/',{waitUntil: 'domcontentloaded', timeout: 60000 });

    // wait for page to fully load
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load the homepage successfully', async ({ page }) => {
    // verify URL
    await expect(page).toHaveURL(/foxtale\.in/);

    // verify page title contains foxtale
    await expect(page).toHaveTitle(/foxtale/i);

    console.log('✅ Homepage loaded successfully');
  });

  test('should display the navigation bar', async ({ page }) => {
    // nav bar should be visible
    const navbar = page.locator('header');
    await expect(navbar).toBeVisible();

    console.log('✅ Navigation bar is visible');
  });

  test('should have a working logo that goes to homepage', async ({ page }) => {
    // click the logo
    const logo = page.locator('header a').first();
    await logo.click();

    // should stay on / redirect to homepage
    await expect(page).toHaveURL(/foxtale\.in/);

    console.log('✅ Logo click works');
  });

  test('should display hero section on homepage', async ({ page }) => {
    // hero/banner section should exist
    const hero = page.locator('section, .hero, [class*="banner"], [class*="hero"]').first();
    await expect(hero).toBeVisible();

    console.log('✅ Hero section is visible');
  });

});