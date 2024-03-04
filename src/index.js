/* global WPGRAPHQL_IDE_DATA */
import { createHooks } from '@wordpress/hooks';
import { register, dispatch } from '@wordpress/data';
import { store } from './store';

/**
 * Register the store to wp.data for use throughout the plugin and extending plugins
 */
register( store );

/**
 * Registers a plugin to the WPGraphQL IDE
 *
 * @param string name The name of the plugin to register
 * @param object config The config array to define the plugin
 * @param name
 * @param config
 */
const registerPlugin = ( name, config ) => {
	dispatch( store ).registerPlugin( name, config );
};

export const hooks = createHooks();

// Expose WPGraphQLIDE as a global variable.
// This allows plugins to be enqueued as external JS
// and make use of functions provideded by the IDE.
window.WPGraphQLIDE = {
	registerPlugin,
	hooks,
	store,
};
