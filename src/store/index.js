import { register, dispatch, select } from '@wordpress/data';

import hooks from '../wordpress-hooks';
import appStore from './app-store';
import editorToolbarStore from './editor-toolbar-store';

export function registerStores() {
	register( appStore );
	register( editorToolbarStore );
}

export function registerEditorToolbarButton( name, config ) {
	const existingButton = select(
		'wpgraphql-ide/editor-toolbar'
	).getButtonByName( name );
	if ( existingButton ) {
		console.warn( `Button with name ${ name } already exists.` );
		hooks.doAction(
			'registerToolbarButtonFailed',
			name,
			config,
			'Button name must be unique.'
		);
		return;
	}

	try {
		dispatch( 'wpgraphql-ide/editor-toolbar' ).registerButton(
			name,
			config
		);
		console.log( `Button registered: ${ name }` );
		hooks.doAction( 'afterRegisterToolbarButton', name, config );
	} catch ( error ) {
		console.error( `Failed to register button: ${ name }`, error );
		hooks.doAction( 'registerToolbarButtonError', name, config, error );
	}
}
