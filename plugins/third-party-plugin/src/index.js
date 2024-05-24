/**
 * External dependencies
 */
import { explorerPlugin } from '@graphiql/plugin-explorer';

/**
 * Ensure the code only runs once WPGraphQLIDEReady is fired and registerActivityBarPanel is defined.
 */
window.addEventListener( 'WPGraphQLIDEReady', () => {
    const { registerActivityBarPanel } = window.WPGraphQLIDE || {};

    if ( typeof registerActivityBarPanel === 'function' ) {
        registerActivityBarPanel( 'explorer', explorerPlugin, 4 );
    } else {
        console.error( 'registerActivityBarPanel is not defined.' );
    }
});
