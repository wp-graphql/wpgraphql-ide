// Import WordPress dependencies for hooks, data handling, and component rendering.
import { createHooks } from '@wordpress/hooks';
import { register } from '@wordpress/data';
import { render, createRoot } from '@wordpress/element';
import * as GraphQL from "graphql/index.js";

// Import local store configuration and the main App component.
import { store } from './store';
import { App } from './App';

/**
 * Registers the store with WordPress data module to make it globally accessible.
 */
register(store);

/**
 * Creates a central event hook system for the WPGraphQL IDE, facilitating the extension
 * of functionality through external scripts and internal hooks.
 */
export const hooks = createHooks();

/**
 * Exposes a global IDE variable, making it accessible for extensions and external scripts.
 */
window.WPGraphQLIDE = {
    hooks,
    store,
    GraphQL
};

/**
 * Function to abstract the differences in rendering methods between different versions of React.
 * Uses `createRoot` if available, falling back to `render` if not, to accommodate different React versions.
 *
 * @param {HTMLElement} root - The DOM element where the React component will be mounted.
 * @param {ReactElement} component - The React component to render.
 */
function compatibleRender(root, component) {
    if (typeof createRoot !== 'undefined') {
        createRoot(root).render(component);
    } else {
        render(component, root);
    }
}

/**
 * Immediately attempt to render the React application to the designated mount point.
 * This assumes that the script is loaded with 'defer', ensuring the DOM is parsed beforehand.
 */
const appMountPoint = document.getElementById('wpgraphql-ide-root');
if (appMountPoint) {
    compatibleRender(appMountPoint, <App />);
} else {
    console.error(
        'WPGraphQL IDE mount point not found. Please ensure an element with ID "wpgraphql-ide-root" exists.'
    );
}
