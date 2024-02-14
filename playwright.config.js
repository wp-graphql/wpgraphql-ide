const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',                  // Directory for E2E tests
  fullyParallel: true,                     // Run tests in files in parallel
  forbidOnly: !!process.env.CI,            // Fail the CI build if test.only is left in code
  retries: process.env.CI ? 2 : 0,         // Number of retries on CI
  workers: process.env.CI ? 1 : undefined, // Opt out of parallel tests on CI
  reporter: 'html',                        // Use HTML reporter
  use: {
    trace: 'on-first-retry',               // Collect trace when retrying failed tests
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
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
