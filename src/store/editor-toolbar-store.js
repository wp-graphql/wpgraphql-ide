import { createReduxStore } from '@wordpress/data';

const initialState = {
	buttons: {}
};

const reducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'REGISTER_BUTTON':

            // Validate buttons
            if (action.name in state.buttons) {
                console.warn({
                    message: `The "${action.name}" button already exists. Name must be unique.`,
                    existingButton: state.buttons[action.name],
                    duplicateButton: action.config
                });

                return state;
            }

			return {
				...state,
				buttons: {
                    ...state.buttons,
                    [action.name]: action.config
                },
			};
	}
	return state;
};

const actions = {
	registerButton: ( name, config ) => {
		return {
			type: 'REGISTER_BUTTON',
            name,
            config,
		};
	}
};

const selectors = {
	buttons: ( state ) => {
		return state.buttons;
	}
};

const store = createReduxStore( 'wpgraphql-ide/editor-toolbar', {
	reducer,
	selectors,
	actions,
} );

export default store;