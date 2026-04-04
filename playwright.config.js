const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  workers: 1,
  timeout: process.env.CI ? 600000 : 120000,        // 10 min in CI
  reporter: [['html'], ['list']],

  use: {
    baseURL: 'https://www.foxtale.in',
    headless: !!process.env.CI,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout:     process.env.CI ? 120000 : 30000,  // 2 min in CI
    navigationTimeout: process.env.CI ? 240000 : 90000,  // 4 min in CI
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});