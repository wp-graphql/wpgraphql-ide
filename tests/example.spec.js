// @ts-check
const { test, expect } = require('@playwright/test');

// Set up environment variables or a config file for sensitive info
const wpAdminUrl = 'http://localhost:8888/wp-admin';
const wpHomeUrl = 'http://localhost:8888';
const adminUsername = 'admin';
const adminPassword = 'password';

test.beforeEach(async ({ page }) => {
  // Navigate to WordPress admin and log in
  await page.goto(`${wpAdminUrl}`);
  await page.fill('input[name="log"]', adminUsername);
  await page.fill('input[name="pwd"]', adminPassword);
  await page.click('input[type="submit"]');

  // Ensure plugin is activated (adjust as necessary for your plugin)
  await page.goto(`${wpAdminUrl}/plugins.php`);
  // This selector might need adjustment based on your actual plugin name
  const activateWPGraphQL = await page.$(`id=activate-wp-graphql`);
  if (activateWPGraphQL) {
    await activateWPGraphQL.click();
  }

  const activateWPGraphQLIDE = await page.$(`id=activate-wpgraphql-ide`);
  if (activateWPGraphQLIDE) {
    await activateWPGraphQLIDE.click();
  }
});

test('GraphiQL drawer opens on admin page', async ({ page }) => {
  await page.goto(wpAdminUrl);

  await expect(page.locator('.graphiql-container')).toBeHidden();
  await page.click('.EditorDrawerButton');
  await expect(page.locator('.graphiql-container')).toBeVisible();
});

test('GraphiQL drawer works on a public page', async ({ page }) => {
  await page.goto(wpHomeUrl);

  // Similar to the above, but ensure it works on the front end as well
  await expect(page.locator('.graphiql-container')).toBeHidden();
  await page.click('.EditorDrawerButton');
  await expect(page.locator('.graphiql-container')).toBeVisible();
});
