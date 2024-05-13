import { register, dispatch } from '@wordpress/data';
import hooks from '../wordpress-hooks';
import appStore from './app';
import editorToolbarStore from './editor-toolbar';

/**
 * Public function to register all stores.
 *
 * @return {void}
 */
export function registerStores() {
	register( appStore );
	register( editorToolbarStore );
}
