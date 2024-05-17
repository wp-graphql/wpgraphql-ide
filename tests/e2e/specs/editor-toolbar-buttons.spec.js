import { describe, test, beforeEach } from '@playwright/test';
import {
	getCodeMirrorValue,
	loginToWordPressAdmin,
	openDrawer,
	setCodeMirrorValue,
	typeQuery
} from "../utils";
import { expect } from '@playwright/test';

export const selectors = {
	graphiqlContainer: '.graphiql-container',
	graphiqlResponse: '.graphiql-response',
	editorDrawerButton: '.EditorDrawerButton',
	editorDrawerCloseButton: '.EditorDrawerCloseButton',
	executeQueryButton: '.graphiql-execute-button',
	queryInput: '[aria-label="Query Editor"] .CodeMirror',
	variablesInput: '[aria-label="Variables"] .CodeMirror',
	prettifyButton: '.graphiql-prettify-button',
	authButton: '.graphiql-toggle-auth-button',
};

// Login to WordPress before each test
beforeEach(async ({ page, context }) => {
	await loginToWordPressAdmin(page);
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
});

async function openGraphiQL(page) {
	await expect(page.locator(selectors.graphiqlContainer)).toBeHidden();
	await openDrawer(page);
}

describe('Toolbar Buttons', () => {

	beforeEach(async ({ page }) => {
		await openGraphiQL(page);
	});

	test('Clicking the Execute button executes a query', async ({ page }) => {
		await typeQuery(page, 'query { posts { nodes { title } } }');
		const response = page.locator(selectors.graphiqlResponse);
		await expect(response).not.toContainText('posts');
		await page.click(selectors.executeQueryButton);
		await expect(response).toContainText('posts');
		await expect(response).toContainText('nodes');
	});

	describe('Auth button', () => {

		beforeEach(async ({ page }) => {
			await typeQuery(page, 'query { viewer { name } }');
		});

		test('Default state is authenticated', async ({ page }) => {
			// const authButton = page.locator(selectors.authButton);

			// select the 2nd button in the .graphiql-toolbar
			const authButton = await page.locator( `.graphiql-toolbar button:nth-child(2)` )
			await expect(authButton).not.toHaveClass(/is-public/);
			await expect(authButton).toHaveClass(/is-authenticated/);
		});

		test('Private data is returned when authenticated', async ({ page }) => {
			const response = page.locator(selectors.graphiqlResponse);
			await expect(response).not.toContainText('viewer');
			await expect(response).not.toContainText('admin');
			await page.click(selectors.executeQueryButton);
			await expect(response).toContainText('viewer');
			await expect(response).toContainText('admin');
		});

		test('Auth button is not grayscale when authenticated', async ({ page }) => {
			// const authButton = page.locator(selectors.authButton);
			const authButton = await page.locator( `.graphiql-toolbar button:nth-child(2)` );
			const filterValue = await authButton.evaluate(node => window.getComputedStyle(node).filter);
			expect(filterValue).not.toBe('grayscale(1)');
		});

		describe('Toggling auth state to public', () => {

			beforeEach(async ({ page }) => {
				// const authButton = page.locator(selectors.authButton);
				const authButton = await page.locator( `.graphiql-toolbar button:nth-child(2)` );
				await authButton.click();
			});

			test('Auth button is in public state', async ({ page }) => {
				// const authButton = page.locator(selectors.authButton);
				const authButton = await page.locator( `.graphiql-toolbar button:nth-child(2)` );
				await expect(authButton).not.toHaveClass(/is-authenticated/);
				await expect(authButton).toHaveClass(/is-public/);
			});

			test('Private data is not returned when public', async ({ page }) => {
				const response = page.locator(selectors.graphiqlResponse);
				await page.click(selectors.executeQueryButton);
				await expect(response).toContainText('viewer');
				await expect(response).not.toContainText('admin');
			});

			test('Auth button is grayscale when public', async ({ page }) => {
				// const authButton = page.locator(selectors.authButton);
				const authButton = await page.locator( `.graphiql-toolbar button:nth-child(2)` );
				const filterValue = await authButton.evaluate(node => window.getComputedStyle(node).filter);
				expect(filterValue).toBe('grayscale(1)');
			});
		});
	});

	describe('Prettify button', () => {

		beforeEach(async ({ page }) => {
			await typeQuery(page, 'query{viewer{name}   }'); // poorly formatted query
		});

		test('Misformatted query is prettified when button is clicked', async ({ page }) => {
			// const prettifyButton = page.locator(selectors.prettifyButton);
			const prettifyButton = await page.locator( `.graphiql-toolbar button:nth-child(3)` );
			const queryEditorLocator = page.locator(selectors.queryInput);

			// Get the value from the CodeMirror instance
			const codeMirrorValue = await getCodeMirrorValue(queryEditorLocator);

			// Ensure the query is initially poorly formatted
			await expect(codeMirrorValue).toBe('query{viewer{name}   }');

			// Make sure the prettify button is visible and interactable
			await expect(prettifyButton).toBeVisible();
			await expect(prettifyButton).toBeEnabled();

			// Click the prettify button
			await prettifyButton.click();

			const codeMirrorValleAfterClick = await getCodeMirrorValue( queryEditorLocator );

			await expect(codeMirrorValleAfterClick).toBe(`{
  viewer {
    name
  }
}`
			);

		});
	});

	describe('Copy button', () => {

		beforeEach(async ({ page }) => {
			await typeQuery(page, '{ posts { nodes { id } } }' ); // poorly formatted query
		});

		test( 'Clicking the copy button copies the query to the clipboard', async ({ page }) => {

			// clear the clipboard
			await page.evaluate( () => navigator.clipboard.writeText('') );

			// assert the clipboard is empty
			const clipboardTextBefore = await page.evaluate( () => navigator.clipboard.readText() );
			expect( clipboardTextBefore ).toBe( '' );

			// Click the copy button
			const copyButton = await page.locator( `.graphiql-toolbar button:nth-child(4)` );

			await copyButton.click();
			const clipboardText = await page.evaluate( () => navigator.clipboard.readText() );

			expect( clipboardText ).not.toBe( '' );
		});


	});

	describe('Merge Fragments button', () => {

		beforeEach(async ({ page }) => {
			const queryEditorLocator = page.locator(selectors.queryInput);

			await typeQuery(page, `query { ...TestFragment } fragment TestFragment on RootQuery { viewer { name } }`);// query with fragment
		});

		test( 'Clicking the merge fragments button merges the fragment into the query', async ({ page }) => {

			// Click the merge button
			const mergeButton = await page.locator( `.graphiql-toolbar button:nth-child(5)` );
			await mergeButton.click();

			// wait for the merge to complete
			await page.waitForTimeout( 1000 );

			// Get the value from the CodeMirror instance
			const queryEditorLocator = page.locator(selectors.queryInput);
			const mergedValue = await getCodeMirrorValue(queryEditorLocator);

			// Verify that the query is now formatted properly (with newlines and indentation...this is the playwright way of checking for the line breaks 🤷‍♂️)
			await expect(mergedValue).toBe(`{
  viewer {
    name
  }
}`
			);
		});


	})

	describe('Share button', () => {

		beforeEach(async ({ page }) => {
			await typeQuery(page, '{ posts { nodes { id } } }' ); // poorly formatted query
		});

		test( 'Clicking the share button copies the query to the clipboard', async ({ page }) => {

			// clear the clipboard
			await page.evaluate( () => navigator.clipboard.writeText('') );

			// assert the clipboard is empty
			const clipboardTextBefore = await page.evaluate( () => navigator.clipboard.readText() );
			expect( clipboardTextBefore ).toBe( '' );

			// Click the copy button
			const copyButton = await page.locator( `.graphiql-toolbar button:nth-child(4)` );

			await copyButton.click();
			const clipboardText = await page.evaluate( () => navigator.clipboard.readText() );

			expect( clipboardText ).not.toBe( '' );
		});


	});

});
