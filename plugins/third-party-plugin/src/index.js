import React from 'react';
import { register } from '@wordpress/data';

import { store } from './store';
import ToggleAuthenticationButton from './components/ToggleAuthenticationButton';

window.addEventListener( 'WPGraphQLIDEReady', () => {
	register( store );

	const { registerEditorToolbarButton } = window.WPGraphQLIDE;

	registerEditorToolbarButton( 'toggle-auth-button', {
		title: 'Toggle Authentication',
		component: ToggleAuthenticationButton,
	} );
} );
