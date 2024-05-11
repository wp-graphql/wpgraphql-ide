import { createReduxStore } from '@wordpress/data';
import selectors from './selectors';
import reducer from './reducer';
import actions from './actions';

/**
 * The store for the app.
 */
const store = createReduxStore( 'wpgraphql-ide/app', {
	reducer,
	selectors,
	actions,
} );

export default store;
