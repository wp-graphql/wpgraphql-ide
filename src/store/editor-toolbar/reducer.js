const initialState = {
	buttons: {},
};

const reducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'REGISTER_BUTTON':
			// Ensure button name is unique
			if ( action.name in state.buttons ) {
				console.warn( {
					message: `The "${ action.name }" button already exists. Name must be unique.`,
					existingButton: state.buttons[ action.name ],
					duplicateButton: action.component,
				} );
				return state;
			}

			return {
				...state,
				buttons: {
					...state.buttons,
					[ action.name ]: action.component,
				},
			};
		default:
			return state;
	}
};

export default reducer;
