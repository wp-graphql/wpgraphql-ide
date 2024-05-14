import { copyQueryButton } from './editor-toolbar-copy-query-button'
import { mergeFragmentsButton } from './editor-toolbar-merge-fragments-button'
import { shareButton } from './editor-toolbar-share-button'
import { prettifyButton } from './editor-toolbar-prettify-button'
import { toggleAuthButton } from './editor-toolbar-toggle-auth-button'
import { registerDocumentEditorToolbarButton } from '../access-functions'

export const init = () => {
	registerDocumentEditorToolbarButton('toggle-auth', toggleAuthButton );
	registerDocumentEditorToolbarButton('prettify', prettifyButton );
	registerDocumentEditorToolbarButton( 'share', shareButton );
	registerDocumentEditorToolbarButton( 'merge-fragments', mergeFragmentsButton );
	registerDocumentEditorToolbarButton( 'copy-query', copyQueryButton );
}
