// @ts-check
const { test, expect } = require('@playwright/test');

// Set up environment variables or a config file for sensitive info
const wpAdminUrl = 'http://localhost:8888/wp-admin';
const wpHomeUrl = 'http://localhost:8888';
const adminUsername = 'admin';
const adminPassword = 'password';

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
  await openDrawer(page);
  await expect(page.locator('.graphiql-container')).toBeVisible();
});

test('drawer opens on a public page', async ({ page }) => {
  await visitPublicFacingPageAsLoggedInUser(page);
  await openDrawer(page);
  await expect(page.locator('.graphiql-container')).toBeVisible();
});

test('drawer closes when close button is clicked', async ({ page }) => {
  await visitAdminFacingPage(page);
  await openDrawer(page);
  await expect(page.locator('.graphiql-container')).toBeVisible();
  await clickDrawerCloseButton(page);
  await expect(page.locator('.graphiql-container')).toBeHidden();
});

test('loads with the documentation explorer closed', async ({ page }) => {
  await visitAdminFacingPage(page);
  await openDrawer(page);
  await expect(page.locator('.graphiql-container')).toBeVisible();
  await expect(page.locator('.graphiql-doc-explorer')).toBeHidden();
});

test('documentation explorer can be toggled open and closed', async ({ page }) => {
  await visitAdminFacingPage(page);
  await openDrawer(page);
  await expect(page.locator('.graphiql-container')).toBeVisible();
  await page.click('[aria-label="Show Documentation Explorer"]');
  await expect(page.locator('.graphiql-doc-explorer')).toBeVisible();
  await page.click('[aria-label="Hide Documentation Explorer"]');
  await expect(page.locator('.graphiql-doc-explorer')).toBeHidden();
});

test('executes query', async ({ page }) => {
  await visitAdminFacingPage(page);
  await openDrawer(page);
  await typeQuery(page, `{posts{nodes{id}}}`);
  await typeVariables(page, { first: 10 });
  await executeQuery(page);
  await page.waitForTimeout(1000);
  const responseContent = await page.textContent('.graphiql-response'); // Adjust the selector as needed
  expect(responseContent).toContain('posts');
  expect(responseContent).toContain('nodes');
});

// Helper methods

export async function clickDrawerButton(page) {
  await page.click('.EditorDrawerButton');
}

export async function clickDrawerCloseButton(page) {
  await page.click('.EditorDrawerCloseButton');
}

export async function visitAdminFacingPage(page) {
  await page.goto(wpAdminUrl);
}

export async function visitPublicFacingPageAsLoggedInUser(page) {
  await page.goto(wpHomeUrl);
}

export async function visitPluginsPage(page) {
  await page.goto(`${wpAdminUrl}/plugins.php`);
}

async function setQuery(page, query) {
  await page.evaluate((query) => {
      localStorage.setItem('graphiql:query', query);
  }, query);
}

async function setVariables(page, variables) {
  const variablesString = JSON.stringify(variables);
  await page.evaluate((variablesString) => {
      localStorage.setItem('graphiql:variables', variablesString);
  }, variablesString);
}

export async function executeQuery(page) {
  await page.click('.graphiql-execute-button');
}

async function typeQuery(page, query) {
  const querySelector = '[aria-label="Query Editor"] .graphiql-editor .cm-s-graphiql';
  await selectAndClearTextUsingKeyboard(page, querySelector);
  await page.type(querySelector, query);
}

async function typeVariables(page, variables) {
  await page.click('[data-name="variables"]');
  const variablesString = JSON.stringify(variables);
  const variablesSelector = '[aria-label="Variables"] .graphiql-editor .cm-s-graphiql';
  await selectAndClearTextUsingKeyboard(page, variablesSelector);
  await page.type(variablesSelector, variablesString);
}

async function selectAndClearTextUsingKeyboard(page, selector) {
  await page.click(selector); // Focus the element

  // Determine the operating system to use the correct "Select All" shortcut
  const selectAllCommand = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';
  await page.keyboard.press(selectAllCommand); // Select all text using OS-specific shortcut
  await page.keyboard.press('Backspace'); // Clear selected text
}

export async function openDrawer(page) {
  const isDrawerVisible = await page.locator('.graphiql-container').isVisible();
  if (!isDrawerVisible) {
    await clickDrawerButton(page);
    await page.waitForSelector('.graphiql-container', { state: 'visible' });
  }
}

export async function closeDrawer(page) {
  const isDrawerVisible = await page.locator('.graphiql-container').isVisible();

  if (isDrawerVisible) {
    const overlay = await page.locator('[vaul-overlay]');
    if (overlay) {
      await overlay.click();
    }
    await expect(page.locator('.graphiql-container')).toBeHidden();
    await clickDrawerCloseButton(page);
    await page.waitForSelector('.graphiql-container', { state: 'hidden' });
  }
}