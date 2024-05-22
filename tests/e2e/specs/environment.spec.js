import { test, expect } from '@playwright/test';
import { loginToWordPressAdmin, visitPluginsPage } from '../utils';

test.beforeEach( async ( { page } ) => {
	await loginToWordPressAdmin( page );
} );

test( 'expect the enqueued wpgraphql-ide script to have the defer attribute', async ( {
	page,
} ) => {
	await visitPluginsPage( page );

	// Retrieve the script tags and check for the defer attribute
	const hasDeferAttribute = await page.evaluate( () => {
		const scripts = Array.from( document.querySelectorAll( 'script' ) );
		const targetScript = scripts.find( ( script ) =>
			script.src.includes( 'wpgraphql-ide' )
		);
		return targetScript?.hasAttribute( 'defer' );
	} );

	// Assert that the defer attribute is present
	expect( hasDeferAttribute ).toBe( true );
} );
