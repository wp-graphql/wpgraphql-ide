import { register } from '@wordpress/data';

import { store as appStore } from './app';
import { store as documentEditorStore } from './document-editor';

export function registerStores() {
	register( appStore );
	register( documentEditorStore );
}
