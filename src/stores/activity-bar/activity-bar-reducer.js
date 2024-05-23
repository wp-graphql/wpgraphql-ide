/**
 * The initial state of the app.
 * @type {Object}
 */
const initialState = {
	utilityButtons: {},
	pluginButtons: {},
};

/**
 * The reducer for the app store.
 * @param {Object} state  The current state of the store.
 * @param {Object} action The action to be performed.
 * @return {Object}
 */
const reducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'REGISTER_UTILITY_BUTTON':
			// Ensure button name is unique
			if ( action.name in state.utilityButtons ) {
				console.warn( {
					message: `The "${ action.name }" button already exists. Name must be unique.`,
					existingButton: state.utilityButtons[ action.name ],
					duplicateButton: action.config,
				} );
				return state;
			}

			const utilityButton = {
				config: action.config,
				priority: action.priority || 10, // default priority to 10 if not provided
			};

			return {
				...state,
				utilityButtons: {
					...state.utilityButtons,
					[ action.name ]: utilityButton,
				},
			};
		case 'REGISTER_PLUGIN_BUTTON':
			// Ensure button name is unique
			if ( action.name in state.pluginButtons ) {
				console.warn( {
					message: `The "${ action.name }" button already exists. Name must be unique.`,
					existingButton: state.pluginButtons[ action.name ],
					duplicateButton: action.config,
				} );
				return state;
			}

			const pluginButton = {
				config: action.config,
				priority: action.priority || 10, // default priority to 10 if not provided
			};

			return {
				...state,
				pluginButtons: {
					...state.pluginButtons,
					[ action.name ]: pluginButton,
				},
			};
		default:
			return state;
	}
};

export default reducer;
