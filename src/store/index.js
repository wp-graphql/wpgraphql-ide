import { createReduxStore } from '@wordpress/data';

const initialState = {
	isDrawerOpen: false,
	shouldRenderStandalone: false,
	isInitialStateLoaded: false,
};

const reducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'SET_RENDER_STANDALONE':
			return {
				...state,
				shouldRenderStandalone: action.shouldRenderStandalone,
			};
		case 'SET_QUERY':
			return {
				...state,
				query: action.query,
			};
		case 'SET_DRAWER_OPEN':
			return {
				...state,
				isDrawerOpen: action.isDrawerOpen,
			};
		case 'SET_INITIAL_STATE_LOADED':
			return {
				...state,
				isInitialStateLoaded: true,
			};
	}
	return state;
};
const actions = {
	setQuery: ( query ) => {
		return {
			type: 'SET_QUERY',
			query,
		};
	},
	setDrawerOpen: ( isDrawerOpen ) => {
		return {
			type: 'SET_DRAWER_OPEN',
			isDrawerOpen,
		};
	},
	setShouldRenderStandalone: ( shouldRenderStandalone ) => {
		return {
			type: 'SET_RENDER_STANDALONE',
			shouldRenderStandalone,
		};
	},
	setInitialStateLoaded: () => {
		return {
			type: 'SET_INITIAL_STATE_LOADED',
		};
	},
};

const selectors = {
	getQuery: ( state ) => {
		return state.query;
	},
	isDrawerOpen: ( state ) => {
		return state.isDrawerOpen;
	},
	shouldRenderStandalone: ( state ) => {
		return state.shouldRenderStandalone;
	},
	isInitialStateLoaded: ( state ) => {
		return state.isInitialStateLoaded;
	},
};

export const store = createReduxStore( 'wpgraphql-ide', {
	reducer,
	selectors,
	actions,
} );
