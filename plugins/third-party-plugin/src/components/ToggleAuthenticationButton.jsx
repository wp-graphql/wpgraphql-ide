import React from 'react';
import { useDispatch, useSelect } from '@wordpress/data';

const ToggleAuthenticationButton = () => {
	const isAuthenticated = useSelect( ( select ) =>
		select( 'whatever-store-maintains-auth-state' ).isAuthenticated()
	);
	const { toggleAuthentication } = useDispatch(
		'whatever-store-maintains-auth-state'
	);

	return (
		<button onClick={ toggleAuthentication }>
			{ isAuthenticated
				? 'Switch to execute as a public user'
				: 'Switch to execute as the logged-in user' }
		</button>
	);
};

export default ToggleAuthenticationButton;
