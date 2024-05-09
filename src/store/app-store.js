import { createReduxStore } from '@wordpress/data';

const initialState = {
	isDrawerOpen: false,
	shouldRenderStandalone: false,
	isInitialStateLoaded: false,
	registeredPlugins: {},
	query: null,
	isAuthenticated: true,
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
		case 'REGISTER_PLUGIN':
			return {
				...state,
				registeredPlugins: {
					...state.registeredPlugins,
					[ action.name ]: action.config,
				},
			};
		case 'TOGGLE_AUTHENTICATION':
			return {
				...state,
				isAuthenticated: ! state.isAuthenticated,
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
	registerPlugin: ( name, config ) => {
		return {
			type: 'REGISTER_PLUGIN',
			name,
			config,
		};
	},
	toggleAuthentication: () => {
		return {
			type: 'TOGGLE_AUTHENTICATION',
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
	getPluginsArray: ( state ) => {
		const registeredPlugins = state.registeredPlugins;
		const pluginsArray = [];
		Object.entries( registeredPlugins ).map( ( [ key, config ] ) => {
			const plugin = () => {
				return config;
			};
			pluginsArray.push( plugin() );
		} );
		return pluginsArray;
	},
	isAuthenticated: ( state ) => {
		return state.isAuthenticated;
	},
};

const store = createReduxStore( 'wpgraphql-ide/app', {
	reducer,
	selectors,
	actions,
} );

export default store;
