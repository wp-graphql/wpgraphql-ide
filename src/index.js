/* global WPGRAPHQL_IDE_DATA */
import { createRoot } from '@wordpress/element';
import { createHooks } from '@wordpress/hooks';
import { register } from '@wordpress/data';
import { App } from './App';
import { store } from './store'

/**
 * Get the ID of the HTML element where the React app will be placed.
 *
 * @constant {string} rootElementId - The ID of the HTML element.
 *
 * Localized in wpgraphql-ide.php
 */
const { rootElementId } = WPGRAPHQL_IDE_DATA;

const rootElement = document.getElementById( rootElementId );

if ( rootElement ) {
	const root = createRoot( rootElement );
	root.render( <App /> );
}

register( store );

// Initialize hook system.
App.hooks = createHooks();

// Expose app as a global variable to utilize in gutenberg.
window.WPGraphQLIDE = App;
