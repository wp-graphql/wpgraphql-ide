import { createReduxStore } from '@wordpress/data';

const initialState = {
	isAuthenticated: true,
};

const reducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'TOGGLE_AUTHENTICATION':
			return {
				...state,
				isAuthenticated: ! state.isAuthenticated,
			};
	}
	return state;
};

const actions = {
	toggleAuthentication: () => {
		return {
			type: 'TOGGLE_AUTHENTICATION',
		};
	},
};

const selectors = {
	isAuthenticated: ( state ) => {
		return state.isAuthenticated;
	},
};

export const store = createReduxStore( 'third-party-plugin', {
	reducer,
	selectors,
	actions,
} );
