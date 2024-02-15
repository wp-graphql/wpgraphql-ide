/**
 * Utility functions for Playwright tests in WordPress Admin and GraphiQL IDE.
 * 
 * This file contains helper functions designed to simplify interactions with the WordPress
 * admin dashboard and the GraphiQL IDE within end-to-end tests using Playwright. Functions
 * include logging into the WordPress admin, typing queries and variables into CodeMirror editors,
 * and clearing CodeMirror editor content.
 * 
 * @fileoverview Utility functions for WordPress Admin and GraphiQL IDE interaction.
 * @module utils
 */

/**
 * @typedef {Object} Selectors
 * @property {string} loginUsername - The CSS selector for the username input field in the WordPress login form.
 * @property {string} loginPassword - The CSS selector for the password input field in the WordPress login form.
 * @property {string} submitButton - The CSS selector for the submit button in the WordPress login form.
 */

/** 
 * CSS selectors used for navigating the WordPress admin login page.
 * @type {Selectors}
 */
const selectors = {
  loginUsername: '#user_login',
  loginPassword: '#user_pass',
  submitButton: '#wp-submit',
};

/**
 * Log in to the WordPress admin dashboard.
 * @param {import('@playwright/test').Page} page The Playwright page object.
 */
export async function loginToWordPressAdmin(page) {
  await page.goto('http://localhost:8888/wp-admin');
  await page.fill(selectors.loginUsername, 'admin');
  await page.fill(selectors.loginPassword, 'password');
  await page.click(selectors.submitButton);
  await page.waitForSelector('#wpadminbar'); // Confirm login by waiting for the admin bar
}

/**
 * Types a GraphQL query into the CodeMirror editor.
 * @param {import('@playwright/test').Page} page The Playwright page object.
 * @param {string} query The GraphQL query to type.
 */
export async function typeQuery(page, query) {
  const querySelector = '[aria-label="Query Editor"] .CodeMirror';
  await page.click(querySelector);
  await clearCodeMirror(page, querySelector);
  await page.keyboard.type(query);
}

/**
 * Types GraphQL variables into the CodeMirror editor.
 * @param {import('@playwright/test').Page} page The Playwright page object.
 * @param {Object} variables The GraphQL variables to type.
 */
export async function typeVariables(page, variables) {
  const variablesString = JSON.stringify(variables, null, 2);
  const variablesSelector = '[aria-label="Variables"] .CodeMirror';
  await page.click('[data-name="variables"]');
  await clearCodeMirror(page, variablesSelector);
  await page.keyboard.type(variablesString);
}

/**
 * Clears the content of a CodeMirror editor.
 * @param {import('@playwright/test').Page} page The Playwright page object.
 * @param {string} selector The CSS selector for the CodeMirror editor.
 */
export async function clearCodeMirror(page, selector) {
  await page.click(selector);
  // Use the appropriate select all command based on the OS
  const selectAllCommand = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';
  await page.keyboard.press(selectAllCommand); // Select all text
  await page.keyboard.press('Backspace'); // Clear the selection
}
