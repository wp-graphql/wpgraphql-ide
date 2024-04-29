// WordPress dependencies for hooks, data handling, and component rendering.
import { createHooks } from '@wordpress/hooks';
import { createRoot } from '@wordpress/element';
import { registerStores, registerEditorToolbarButton } from './store';
import * as GraphQL from "graphql/index.js";

// Local imports including the store configuration and the main App component.
import { App } from './App';

// Create a central event hook system for the WPGraphQL IDE.
export const hooks = createHooks();

// Register all application stores.
registerStores();

// Expose a global variable for the IDE, facilitating extension through external scripts.
window.WPGraphQLIDE = {
	hooks,
	GraphQL,
	registerEditorToolbarButton
};

/**
 * Initialize and render the application once the DOM is fully loaded.
 * This ensures that the application mounts when all page elements are available.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const appMountPoint = document.getElementById( 'wpgraphql-ide-root' );
	if ( appMountPoint ) {
		createRoot( appMountPoint ).render( <App /> );
	} else {
		console.error(
			'WPGraphQL IDE mount point not found. Please ensure an element with ID "wpgraphql-ide-root" exists.'
		);
	}
} );
