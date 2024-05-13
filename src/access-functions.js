import hooks from './wordpress-hooks';

/**
 * Public function to register a new editor toolbar button.
 *
 * @param {string} name   The name of the button to register.
 * @param {Object} config The configuration object for the button.
 *
 * @return {void}
 */
export function registerDocumentEditorToolbarButton( name, config ) {
	try {
		dispatch( 'wpgraphql-ide/document-editor' ).registerButton(
			name,
			config
		);
		hooks.doAction( 'afterRegisterToolbarButton', name, config );
	} catch ( error ) {
		console.error( `Failed to register button: ${ name }`, error );
		hooks.doAction( 'registerToolbarButtonError', name, config, error );
	}
}

export function helloJoe() {
	console.log( 'Hi Joe' );
}
