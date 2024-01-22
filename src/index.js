import { createRoot } from '@wordpress/element';
import { createHooks } from '@wordpress/hooks';

import { App } from './App';

/**
 * Get the ID of the HTML element where the React app will be placed.
 *
 * @const {string} rootElementId - The ID of the HTML element.
 *
 * Localized in wpgraphql-ide.php
 */
const { rootElementId } = WPGRAPHQL_IDE_DATA;

const rootElement = document.getElementById(rootElementId);

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}

// Initialize hook system.
App.hooks = createHooks();

// Expose app as a global variable to utilize in gutenberg.
window.WPGraphQLIDE = App;
