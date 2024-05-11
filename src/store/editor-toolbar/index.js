import {createReduxStore, dispatch} from '@wordpress/data';
import reducer from './reducer';
import actions from './actions';
import selectors from './selectors';
import hooks from "../../wordpress-hooks";

const store = createReduxStore( 'wpgraphql-ide/editor-toolbar', {
	reducer,
	selectors,
	actions,
} );

export default store;

/**
 * Public function to register a new editor toolbar button.
 *
 * @param {string} name The name of the button to register.
 * @param {object} config The configuration object for the button.
 *
 * @return {void}
 */
export function registerEditorToolbarButton( name, config ) {
	try {
		dispatch( 'wpgraphql-ide/editor-toolbar' ).registerButton(
			name,
			config
		);
		hooks.doAction( 'afterRegisterToolbarButton', name, config );
	} catch ( error ) {
		console.error( `Failed to register button: ${ name }`, error );
		hooks.doAction( 'registerToolbarButtonError', name, config, error );
	}
}
