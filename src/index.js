/* global WPGRAPHQL_IDE_DATA */
import { createHooks } from '@wordpress/hooks';
import { register, dispatch } from '@wordpress/data';
import { store } from './store';
import { Icon, plugins } from "@wordpress/icons";

register( store );

const registerPlugin = (name, config) => {
	dispatch( store ).registerPlugin(name, config)
}

// example of registering a plugin from the "core" codebase
// see /plugins/help for an example of registering a plugin from
// a 3rd party plugin
registerPlugin( 'extensions', {
	title: 'Extensions',
	icon: () => <Icon icon={plugins} />,
	content: () => <><h2>Extensions, yo!!</h2></>
})

export const hooks = createHooks();

// Expose app as a global variable to utilize in gutenberg.
window.WPGraphQLIDE = {
	registerPlugin,
	hooks,
	store
};
