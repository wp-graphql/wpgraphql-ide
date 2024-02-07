// @ts-check
const { test, expect } = require('@playwright/test');

// Set up environment variables or a config file for sensitive info
const wpAdminUrl = 'http://localhost:8888/wp-admin';
const wpHomeUrl = 'http://localhost:8888';
const adminUsername = 'admin';
const adminPassword = 'password';

/**
 * Navigates to the WordPress admin page and logs in using predefined credentials.
 *
 * @param {import('playwright').Page} page - The Playwright page object.
 */
test.beforeEach(async ({ page }) => {
  await visitAdminFacingPage(page);
  await page.fill('input[name="log"]', adminUsername);
  await page.fill('input[name="pwd"]', adminPassword);
  await page.click('input[type="submit"]');

  await visitPluginsPage(page);
  const activateWPGraphQL = await page.$(`id=activate-wp-graphql`);
  if (activateWPGraphQL) {
    await activateWPGraphQL.click();
  }

  const activateWPGraphQLIDE = await page.$(`id=activate-wpgraphql-ide`);
  if (activateWPGraphQLIDE) {
    await activateWPGraphQLIDE.click();
  }
});

test('drawer opens on an admin page', async ({ page }) => {
  await visitAdminFacingPage(page);
  await expect(page.locator('.graphiql-container')).toBeHidden();
  await toggleDrawer(page);
  await expect(page.locator('.graphiql-container')).toBeVisible();
});

test('drawer opens on a public page', async ({ page }) => {
  await visitPublicFacingPage(page);
  await expect(page.locator('.graphiql-container')).toBeHidden();
  await toggleDrawer(page);
  await expect(page.locator('.graphiql-container')).toBeVisible();
});

test('loads with the documentation explorer closed', async ({ page }) => {
  await visitAdminFacingPage(page);
  await expect(page.locator('.graphiql-container')).toBeHidden();
  await toggleDrawer(page);
  await expect(page.locator('.graphiql-container')).toBeVisible();
  await expect(page.locator('.graphiql-doc-explorer')).toBeHidden();
});

test('documentation explorer can be toggled open and closed', async ({ page }) => {
  await visitAdminFacingPage(page);
  await expect(page.locator('.graphiql-container')).toBeHidden();
  await toggleDrawer(page);
  await expect(page.locator('.graphiql-container')).toBeVisible();
  await page.click('[aria-label="Show Documentation Explorer"]');
  await expect(page.locator('.graphiql-doc-explorer')).toBeVisible();
  await page.click('[aria-label="Hide Documentation Explorer"]');
  await expect(page.locator('.graphiql-doc-explorer')).toBeHidden();
});

test('executes query', async ({ page }) => {
  await visitAdminFacingPage(page);
  await toggleDrawer(page);
  await typeQuery(page, `{posts{nodes{id}}}`);
  await typeVariables(page, { first: 10 });
  await executeQuery(page);
  await page.waitForTimeout(1000);
  const responseContent = await page.textContent('.graphiql-response'); // Adjust the selector as needed
  expect(responseContent).toContain('posts');
  expect(responseContent).toContain('nodes');
});

// Helper methods

/**
 * Toggles the drawer on the page.
 * 
 * @param {import('playwright').Page} page - The Playwright page object.
 */
export async function toggleDrawer(page) {
  await page.click('.EditorDrawerButton');
}

/**
 * Navigates to the admin-facing page.
 * 
 * @param {import('playwright').Page} page - The Playwright page object.
 */
export async function visitAdminFacingPage(page) {
  await page.goto(wpAdminUrl);
}

/**
 * Navigates to the public-facing page.
 * 
 * @param {import('playwright').Page} page - The Playwright page object.
 */
export async function visitPublicFacingPage(page) {
  await page.goto(wpHomeUrl);
}

/**
 * Navigates to the plugins page in the admin dashboard.
 * 
 * @param {import('playwright').Page} page - The Playwright page object.
 */
export async function visitPluginsPage(page) {
  await page.goto(`${wpAdminUrl}/plugins.php`);
}

/**
 * Sets the GraphQL query in the local storage of the page.
 * 
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {string} query - The GraphQL query string.
 */
async function setQuery(page, query) {
  await page.evaluate((query) => {
      localStorage.setItem('graphiql:query', query);
  }, query);
}

/**
 * Sets the GraphQL query variables in the local storage of the page.
 * 
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {Object} variables - The GraphQL query variables.
 */
async function setVariables(page, variables) {
  const variablesString = JSON.stringify(variables);
  await page.evaluate((variablesString) => {
      localStorage.setItem('graphiql:variables', variablesString);
  }, variablesString);
}

/**
 * Executes the GraphQL query.
 * 
 * @param {import('playwright').Page} page - The Playwright page object.
 */
export async function executeQuery(page) {
  await page.click('.graphiql-execute-button');
}

/**
 * Types a GraphQL query into the query editor.
 * 
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {string} query - The GraphQL query string to type.
 */
async function typeQuery(page, query) {
  const querySelector = '[aria-label="Query Editor"] .graphiql-editor .cm-s-graphiql';
  await selectAndClearTextUsingKeyboard(page, querySelector);
  await page.type(querySelector, query);
}

/**
 * Types GraphQL variables into the variables editor.
 * 
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {Object} variables - The GraphQL query variables to type.
 */
async function typeVariables(page, variables) {
  await page.click('[data-name="variables"]');
  const variablesString = JSON.stringify(variables);
  const variablesSelector = '[aria-label="Variables"] .graphiql-editor .cm-s-graphiql';
  await selectAndClearTextUsingKeyboard(page, variablesSelector);
  await page.type(variablesSelector, variablesString);
}

/**
 * Selects all text within an element specified by a selector and clears it using keyboard shortcuts,
 * adjusting for the operating system's specific shortcut for "Select All".
 * 
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {string} selector - The CSS selector for the element to interact with.
 */
async function selectAndClearTextUsingKeyboard(page, selector) {
  await page.click(selector); // Focus the element

  // Determine the operating system to use the correct "Select All" shortcut
  const selectAllCommand = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';
  await page.keyboard.press(selectAllCommand); // Select all text using OS-specific shortcut
  await page.keyboard.press('Backspace'); // Clear selected text
}