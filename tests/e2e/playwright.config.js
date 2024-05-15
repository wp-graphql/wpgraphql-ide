/**
 * External dependencies
 */
import path from 'node:path';
import { defineConfig } from '@playwright/test';

/**
 * WordPress dependencies
 */
const baseConfig = require( '@wordpress/scripts/config/playwright.config' );

process.env.WP_ARTIFACTS_PATH ??= path.join( process.cwd(), 'artifacts' );
process.env.STORAGE_STATE_PATH ??= path.join(
	process.env.WP_ARTIFACTS_PATH,
	'storage-states/admin.json'
);

const config = defineConfig( {
	...baseConfig,
	globalSetup: require.resolve( './config/global-setup.js' ),
	webServer: {
		...baseConfig.webServer,
        command: `
            npm run wp-env -- start && 
            curl -X POST -F 'username=admin' -F 'password=password' \
            -F 'permalink_structure=/index.php/%year%/%monthnum%/%day%/%postname%/' \
            http://localhost:8888/wp-admin/options-permalink.php
        `,
	},
} );

export default config;
