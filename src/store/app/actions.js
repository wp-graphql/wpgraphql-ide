import {parse, print} from "graphql";

/**
 * The initial state of the app.
 *
 * @type {object}
 */
const actions = {
	setQuery: ( query ) => {
		return {
			type: 'SET_QUERY',
			query,
		};
	},
	prettifyQuery: ( query ) => {

		let editedQuery = query;
		try {
			editedQuery = print( parse( editedQuery ) );
		} catch ( error ) {
			console.warn( error );
		}

		return {
			type: 'SET_QUERY',
			query: editedQuery,
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

export default actions;
