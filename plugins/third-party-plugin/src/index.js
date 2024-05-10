import ToggleAuthenticationButton from './components/ToggleAuthenticationButton';
import PrettifyButton from './components/PrettifyButton';
import ShareDocumentButton from './components/ShareDocumentButton';
import MergeFragmentsButton from './components/MergeFragmentsButton';
import CopyQueryButton from './components/CopyQueryButton';

window.addEventListener( 'WPGraphQLIDEReady', () => {

	const { registerEditorToolbarButton } = window.WPGraphQLIDE;

	registerEditorToolbarButton( 'toggle-auth-button', {
		title: 'Toggle Authentication',
		component: ToggleAuthenticationButton,
	} );

	registerEditorToolbarButton( 'prettify-button', {
		title: 'Prettify query (Shift-Ctrl-P)',
		component: PrettifyButton
	} );

	// registerEditorToolbarButton( 'share-document-button', {
	// 	title: 'Prettify query (Shift-Ctrl-P)',
	// 	component: ShareDocumentButton
	// } );

	// registerEditorToolbarButton( 'merge-fragments-button', {
	// 	title: 'Merge fragments into query (Shift-Ctrl-M)',
	// 	component: MergeFragmentsButton
	// } );

	// registerEditorToolbarButton( 'merge-fragments-button', {
	// 	title: 'Copy query (Shift-Ctrl-C)',
	// 	component: CopyQueryButton
	// } );

} );
