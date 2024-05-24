/**
 * @file
 * Initializes the WPGraphQL IDE by setting up the necessary WordPress hooks,
 * registering the global store, and exposing the GraphQL functionality through a global IDE object.
 */

// External dependencies
import { createRoot } from '@wordpress/element';
import * as GraphQL from 'graphql/index.js';
import * as accessFunctions from './access-functions';

// Local imports including the hook configuration and the main App component.
import hooks from './wordpress-hooks';
import AppWrapper from './components/AppWrapper';

import { registerStores } from './stores';
import { initializeRegistry } from './registry';

/**
 * Initializes the application's regions by registering stores.
 */
const init = () => {
	registerStores();
	initializeRegistry();
	hooks.doAction( 'wpgraphql-ide.init' );
};

init();

/**
 * Exposes a global `WPGraphQLIDE` variable that includes hooks, store, and GraphQL references,
 * making them accessible for extensions and external scripts.
 */
window.WPGraphQLIDE = {
	hooks,
	GraphQL,
	...accessFunctions,
};

/**
 * Get our root element id from the localized script.
 */
const { rootElementId } = window.WPGRAPHQL_IDE_DATA;

/**
 * Attempts to render the React application to a specified mount point in the DOM.
 * Logs an error to the console if the mount point is missing.
 */
const appMountPoint = document.getElementById( rootElementId );
if ( appMountPoint ) {
	createRoot( appMountPoint ).render( <AppWrapper /> );
	window.dispatchEvent( new Event( 'WPGraphQLIDEReady' ) );
} else {
	console.error(
		`WPGraphQL IDE mount point not found. Please ensure an element with ID "${rootElementId}" exists.`
	);
}
