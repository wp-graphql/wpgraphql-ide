const { test, expect } = require('@playwright/test');

const selectors = {
  loginUsername: '#user_login',
  loginPassword: '#user_pass',
  submitButton: '#wp-submit',
  graphiqlContainer: '.graphiql-container',
  graphiqlResponse: '.graphiql-response',
  graphiqlDocExplorer: '.graphiql-doc-explorer',
  editorDrawerButton: '.EditorDrawerButton',
  editorDrawerCloseButton: '.EditorDrawerCloseButton',
  executeQueryButton: '.graphiql-execute-button',
  queryInput: '.graphiql-editor',
};

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8888/wp-admin');
  await page.fill(selectors.loginUsername, 'admin');
  await page.fill(selectors.loginPassword, 'password');
  await page.click(selectors.submitButton);
});

test('should open and close the WPGraphQL IDE drawer', async ({ page }) => {
  await page.click(selectors.editorDrawerButton);
  await expect(page.locator(selectors.graphiqlContainer)).toBeVisible();
  await page.click(selectors.editorDrawerCloseButton);
  await expect(page.locator(selectors.graphiqlContainer)).not.toBeVisible();
});

test('should execute a GraphQL query successfully', async ({ page }) => {
  await page.click(selectors.editorDrawerButton);
  await expect(page.locator(selectors.graphiqlContainer)).toBeVisible();
  await typeQuery(page, '{posts{nodes{databaseId}}}');
  await clickExecuteQueryButton(page);
  const expectedResponseText = `
    "data": {
      "posts": {
        "nodes": [
          {
            "databaseId": 1
          }
        ]
      }
    }`;
  await expect(page.locator(selectors.graphiqlResponse)).toContainText(expectedResponseText);
});

export async function clickExecuteQueryButton(page) {
  await page.click('.graphiql-execute-button');
  // Wait for the spinner to disappear, indicating the query has finished executing
  await page.waitForSelector('.graphiql-spinner', { state: 'hidden' });
}

export async function typeQuery(page, query) {
  const querySelector = '[aria-label="Query Editor"] .CodeMirror';
  await page.click(querySelector);
  await clearCodeMirror(page, querySelector);
  await page.keyboard.type(query);
}

export async function typeVariables(page, variables) {
  const variablesString = JSON.stringify(variables, null, 2);
  const variablesSelector = '[aria-label="Variables"] .CodeMirror';
  await page.click('[data-name="variables"]');
  await clearCodeMirror(page, variablesSelector);
  await page.keyboard.type(variablesString);
}

async function clearCodeMirror(page, selector) {
  await page.click(selector);
  const selectAllCommand = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';
  await page.keyboard.press(selectAllCommand);
  await page.keyboard.press('Backspace');
}