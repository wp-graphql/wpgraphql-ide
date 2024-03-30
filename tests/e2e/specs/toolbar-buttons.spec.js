import {loginToWordPressAdmin, openDrawer, typeQuery, visitAdminFacingPage} from "../utils";
import {expect, test } from "@wordpress/e2e-test-utils-playwright";

export const selectors = {
	graphiqlContainer: '.graphiql-container',
	graphiqlResponse: '.graphiql-response',
	editorDrawerButton: '.EditorDrawerButton',
	editorDrawerCloseButton: '.EditorDrawerCloseButton',
	executeQueryButton: '.graphiql-execute-button',
	queryInput: '[aria-label="Query Editor"] .CodeMirror',
	variablesInput: '[aria-label="Variables"] .CodeMirror',
};

// Login to WordPress before each test
test.beforeEach( async ( { page } ) => {
	await loginToWordPressAdmin( page );
} );

async function openGraphiQL({ page }) {
	await expect( page.locator( '.graphiql-container' ) ).toBeHidden();
	await openDrawer( page );
}

test.describe( 'Toolbar Buttons', () => {

	test( 'Clicking the Execute button executes a query', async ( { page } ) => {
		await openGraphiQL( { page } );
		await typeQuery( page, 'query { posts { nodes { title } } }' );
		const response = await page.locator( selectors.graphiqlResponse );
		await expect( response ).not.toContainText( 'posts' );
		await page.click( '.graphiql-execute-button' );
		await expect( response ).toContainText( 'posts' );
		await expect( response ).toContainText( 'nodes' );
	});

	test( 'Clicking the auth button toggles the auth state and allows queries to be executed public or authenticated', async ( { page } ) => {
		await openGraphiQL( { page } );

		// auth button is in an authenticated state by default
		await expect( page.locator( '.graphiql-auth-button' ) ).not.toHaveClass( /is-public/ );
		await expect( page.locator( '.graphiql-auth-button' ) ).toHaveClass( /is-authenticated/ );

		// type a query that asks for the viewer (which requires auth)
		await typeQuery( page, 'query { viewer { name } }' );
		const response = await page.locator( selectors.graphiqlResponse );

		// Assert that the response does not contain the viewer field or admin username
		await expect( response ).not.toContainText( 'viewer' );
		await expect( response ).not.toContainText( 'admin' );

		// Execute the query and assert that the response contains the viewer field and admin username
		await page.click( '.graphiql-execute-button' );
		await expect( response ).toContainText( 'viewer' );
		await expect( response ).toContainText( 'admin' );

		// Toggle the auth state to public
		await page.click( '.graphiql-auth-button' );

		// Assert that the auth button is now in a public state
		await expect( page.locator( '.graphiql-auth-button' ) ).not.toHaveClass( /is-authenticated/ );
		await expect( page.locator( '.graphiql-auth-button' ) ).toHaveClass( /is-public/ );

		// Execute the viewer query again
		await page.click( '.graphiql-execute-button' );

		// The viewer field should exist in the response, but the admin username should not because a public request gets null for the viewer query
		await expect( response ).toContainText( 'viewer' );
		await expect( response ).not.toContainText( 'admin' );

	});



} );
