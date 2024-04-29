import { register, dispatch } from '@wordpress/data';

import appStore from './app-store';
import editorToolbarStore from './editor-toolbar-store';

export function registerStores() {
    register( appStore );
    register( editorToolbarStore );
}

















// TEST FUNCTION
export function registerEditorToolbarButton( name, config ) {
	console.log({ name, config });
	dispatch( editorToolbarStore ).registerButton( name, config );
}