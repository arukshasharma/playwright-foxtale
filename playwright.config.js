// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
timeout: process.env.CI ? 180000 : 120000,         // ✅ 2 min per test
  reporter: [
    ['html'],
    ['list']
  ],

  use: {
    baseURL: 'https://www.foxtale.in',
    browserName: 'chromium',
    headless: !!process.env.CI,  // headless in CI, headed locally
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: process.env.CI ? 60000 : 30000,
navigationTimeout: process.env.CI ? 120000 : 90000,    // ✅ 90 sec for page loads
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});