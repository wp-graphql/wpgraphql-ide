/**
 * The initial state of the activity bar.
 * @type {Object}
 */
const initialState = {
	panels: {},
	utilities: {},
};

/**
 * The reducer for the app store.
 * @param {Object} state  The current state of the store.
 * @param {Object} action The action to be performed.
 * @return {Object}
 */
const reducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'REGISTER_UTILITY':
			// Ensure button name is unique
			if ( action.name in state.utilities ) {
				console.warn( {
					message: `The "${ action.name }" utility already exists. Name must be unique.`,
					existingUtility: state.utilities[ action.name ],
					duplicateUtility: action.config,
				} );
				return state;
			}

			const utility = {
				config: action.config,
				priority: action.priority || 10, // default priority to 10 if not provided
			};

			return {
				...state,
				utilities: {
					...state.utilities,
					[ action.name ]: utility,
				},
			};
		case 'REGISTER_PANEL':
			// Ensure panel name is unique
			if ( action.name in state.panels ) {
				console.warn( {
					message: `The "${ action.name }" panel already exists. Name must be unique.`,
					existingPanel: state.panels[ action.name ],
					duplicatePanel: action.config,
				} );
				return state;
			}

			const panel = {
				config: action.config,
				priority: action.priority || 10, // default priority to 10 if not provided
			};

			return {
				...state,
				panels: {
					...state.panels,
					[ action.name ]: panel,
				},
			};
		default:
			return state;
	}
};

export default reducer;
