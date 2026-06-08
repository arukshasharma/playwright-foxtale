const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,       // only 1 retry in CI
  workers: 1,
  timeout: process.env.CI ? 90000 : 120000,  // 90 sec per test in CI
  reporter: [ ['html'],
  ['list'],
  ['allure-playwright', {
    detail: true,
    outputFolder: 'allure-results',
    suiteTitle: true,
  }],
],

  use: {
    baseURL: 'https://www.foxtale.in',
    headless: !!process.env.CI,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout:     process.env.CI ? 60000 : 30000,
    navigationTimeout: process.env.CI ? 90000 : 90000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});