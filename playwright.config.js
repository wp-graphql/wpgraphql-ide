const config = {
  use: {
    baseURL: 'http://localhost:8888/',
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  testDir: 'tests/e2e',
  timeout: 30000,
};

module.exports = config;
