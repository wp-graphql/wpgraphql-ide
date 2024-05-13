import { register, createReduxStore } from '@wordpress/data';

import selectors from './store/app-store-selectors';
import reducer from './store/app-store-reducer';
import actions from './store/app-store-actions';

/**
 * The store for the app.
 */
const store = createReduxStore( 'wpgraphql-ide/app', {
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
