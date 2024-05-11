import {parse} from "graphql";

/**
 * The initial state of the app.
 * @type {object}
 */
const initialState = {
	isDrawerOpen: false,
	shouldRenderStandalone: false,
	isInitialStateLoaded: false,
	registeredPlugins: {},
	query: null,
	isAuthenticated: true,
};

/**
 * Set the query in the state as long as it is a valid GraphQL query and not the same as the current query.
 *
 * @param {object} state The current state of the store.
 * @param {object} action The action to be performed.
 *
 * @return {object}
 */
const setQuery = ( state, action ) => {
	let editedQuery = action.query;
	const query = state.query;

	let update = false;

	if ( editedQuery === query ) {
		return { ...state };
	}

	if ( null === editedQuery || '' === editedQuery ) {
		update = true;
	} else {
		try {
			parse( editedQuery );
			update = true;
		} catch ( error ) {
			return { ...state };
		}
	}

	if ( ! update ) {
		return { ...state };
	}

	return {
		...state,
		query: action.query,
	};
};

/**
 * The reducer for the app store.
 * @param {object} state The current state of the store.
 * @param {object} action The action to be performed.
 * @return {object}
 */
const reducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'SET_RENDER_STANDALONE':
			return {
				...state,
				shouldRenderStandalone: action.shouldRenderStandalone,
			};
		case 'SET_QUERY':
			return setQuery( state, action );
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

export default reducer;
