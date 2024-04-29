import { createReduxStore } from '@wordpress/data';

const initialState = {
	buttons: []
};

const reducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'REGISTER_BUTTON':
			return {
				...state,
				buttons: state.buttons.push(action.name),
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