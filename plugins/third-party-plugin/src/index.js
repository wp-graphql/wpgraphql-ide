import ToggleAuthenticationButton from './components/ToggleAuthenticationButton';

window.addEventListener( 'WPGraphQLIDEReady', () => {

	const { registerEditorToolbarButton } = window.WPGraphQLIDE;

	registerEditorToolbarButton( 'toggle-auth-button', {
		title: 'Toggle Authentication',
		component: ToggleAuthenticationButton,
	} );
} );
