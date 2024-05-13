import { register, createReduxStore } from '@wordpress/data';

import selectors from './store/document-editor-store-actions';
import reducer from './store/document-editor-store-reducer';
import actions from './store/document-editor-store-actions';

/**
 * The store for the app.
 */
const store = createReduxStore( 'wpgraphql-ide/document-editor', {
	reducer,
	selectors,
	actions,
} );

/**
 * Initialize app region.
 */
export function init() {
	register( store );
}
