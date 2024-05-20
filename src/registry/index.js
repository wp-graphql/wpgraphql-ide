import { copyQueryButton } from './editor-toolbar-buttons/copy-query-button';
import { mergeFragmentsButton } from './editor-toolbar-buttons/merge-fragments-button';
import { shareButton } from './editor-toolbar-buttons/share-button';
import { prettifyButton } from './editor-toolbar-buttons/prettify-button';
import { toggleAuthButton } from './editor-toolbar-buttons/toggle-auth-button';
import { registerDocumentEditorToolbarButton } from '../access-functions';

export const init = () => {
	registerDocumentEditorToolbarButton( 'toggle-auth', toggleAuthButton, 1 );
	registerDocumentEditorToolbarButton( 'prettify', prettifyButton );
	registerDocumentEditorToolbarButton( 'share', shareButton );
	registerDocumentEditorToolbarButton(
		'merge-fragments',
		mergeFragmentsButton
	);
	registerDocumentEditorToolbarButton( 'copy-query', copyQueryButton );
	// registerDocumentEditorToolbarButton( 'invalid-button', () => {
	// 	return {
	// 		title: 'MyButton',
	// 		notOnClick: () => {
	// 			console.log( 'I meant to type onClick!' );
	// 		},
	// 		child: <h2>I meant to type children</h2>,
	// 	};
	// } );
};
