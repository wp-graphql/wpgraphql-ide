/**
 * @file
 * Initializes the WPGraphQL IDE by setting up the necessary WordPress hooks,
 * registering the global store, and exposing the GraphQL functionality through a global IDE object.
 */

// External dependencies
import { createRoot } from '@wordpress/element';
import { registerStores, registerEditorToolbarButton } from './store';
import * as GraphQL from 'graphql/index.js';

// Local imports including the hook configuration and the main App component.
import hooks from './wordpress-hooks';
import App from './App';

// Register all application stores.
registerStores();

/**
 * Exposes a global `WPGraphQLIDE` variable that includes hooks, store, and GraphQL references,
 * making them accessible for extensions and external scripts.
 */
window.WPGraphQLIDE = {
	hooks,
	GraphQL,
	registerEditorToolbarButton,
};

/**
 * Attempts to render the React application to a specified mount point in the DOM.
 * Logs an error to the console if the mount point is missing.
 */
const appMountPoint = document.getElementById( 'wpgraphql-ide-root' );
if ( appMountPoint ) {
	createRoot( appMountPoint ).render( <App /> );
	window.dispatchEvent( new Event( 'WPGraphQLIDEReady' ) );
} else {
	console.error(
		'WPGraphQL IDE mount point not found. Please ensure an element with ID "wpgraphql-ide-root" exists.'
	);
}
