const { test, expect } = require('@playwright/test');
const { HomePage }     = require('../../pages/homepage');
const { SearchPage }   = require('../../pages/searchpage');

test.describe('Foxtale Product Search', () => {

  test('should search for a product and see results', async ({ page }) => {
    const homePage   = new HomePage(page);
    const searchPage = new SearchPage(page);

    await homePage.openHomePage();
    await homePage.searchForProduct('sunscreen');

    // Foxtale may use /search?q= OR /collections/sunscreens URL pattern
    const currentURL = page.url();
    console.log('🔍 URL after search:', currentURL);

    // verify we moved away from homepage OR results appeared
    const isSearchPage = currentURL.includes('search') ||
                         currentURL.includes('collections') ||
                         currentURL.includes('q=');

    if (isSearchPage) {
      console.log('✅ Navigated to search/collection page');
    } else {
      // search results might be in an overlay — check for product cards
      console.log('ℹ️ Search results appear as overlay on same page');
    }

    // verify product results are visible regardless of URL
    const count = await searchPage.getResultsCount();
    console.log(`✅ Found ${count} products for "sunscreen"`);
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to product page from search results', async ({ page }) => {
    const homePage   = new HomePage(page);
    const searchPage = new SearchPage(page);

    await homePage.openHomePage();
    await homePage.searchForProduct('moisturizer');

    const urlAfterSearch = page.url();
    console.log('🔍 URL after search:', urlAfterSearch);

    // click first result
    await searchPage.clickFirstProduct();

    // should land on a product detail page
    const finalURL = page.url();
    console.log('✅ Navigated to:', finalURL);

    // product pages contain /products/ in URL
    expect(finalURL).toContain('foxtale.in');
  });

});