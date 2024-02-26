import {
  loginToWordPressAdmin,
  typeQuery,
  typeVariables,
  clearCodeMirror
} from '../utils.js';

const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

const selectors = {
  graphiqlContainer: '.graphiql-container',
  graphiqlResponse: '.graphiql-response',
  editorDrawerButton: '.EditorDrawerButton',
  editorDrawerCloseButton: '.EditorDrawerCloseButton',
  executeQueryButton: '.graphiql-execute-button',
  queryInput: '[aria-label="Query Editor"] .CodeMirror',
  variablesInput: '[aria-label="Variables"] .CodeMirror',
};

test.beforeEach(async ({ page }) => {
  await loginToWordPressAdmin(page);
});

test('should open and close successfully', async ({ page }) => {
  await page.click(selectors.editorDrawerButton);
  await expect(page.locator(selectors.graphiqlContainer)).toBeVisible();
  await page.click(selectors.editorDrawerCloseButton);
  await expect(page.locator(selectors.graphiqlContainer)).not.toBeVisible();
});

test('should execute a GraphQL query successfully', async ({ page }) => {
  await page.click(selectors.editorDrawerButton);
  await expect(page.locator(selectors.graphiqlContainer)).toBeVisible();

  // Type and execute a GraphQL query
  const query = '{posts{nodes{databaseId}}}';
  await typeQuery(page, query);
  await page.click(selectors.executeQueryButton);
  await page.waitForSelector('.graphiql-spinner', { state: 'hidden' }); // Wait for query execution

  // Check for expected response
  const expectedResponseText = `"data": {"posts": {"nodes": [{"databaseId": 1}]}}`;
  await expect(page.locator(selectors.graphiqlResponse)).toContainText(expectedResponseText);
});
