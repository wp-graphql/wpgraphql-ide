import {loginToWordPressAdmin, openDrawer, visitAdminFacingPage} from "../utils";
import {expect, test } from "@wordpress/e2e-test-utils-playwright";

// Login to WordPress before each test
test.beforeEach( async ( { page } ) => {
	await loginToWordPressAdmin( page );
} );

test.describe( 'GraphiQL Query Composer', () => {

	test( 'Clicking the Query Composer button opens and closes the Query Composer', async ( { page } ) => {
		await visitAdminFacingPage( page );
		await expect( page.locator( '.graphiql-container' ) ).toBeHidden();
		await openDrawer( page );
		await expect( page.locator( '.graphiql-container' ) ).toBeVisible();

		// query composer should be hidden by default
		await expect( page.locator( '.graphiql-query-composer' ) ).toBeHidden();

		// open query composer and check if it is visible
		await page.click( '[aria-label="Show Query Composer"]' );
		await expect( page.locator( '.graphiql-query-composer' ) ).toBeVisible();

		// close query composer and check if it is hidden
		await page.click( '[aria-label="Hide Query Composer"]' );
		await expect( page.locator( '.graphiql-query-composer' ) ).toBeHidden();

	});

});
