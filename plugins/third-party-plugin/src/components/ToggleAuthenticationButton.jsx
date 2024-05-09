import React from 'react';
import { useDispatch, useSelect } from '@wordpress/data';

const ToggleAuthenticationButton = () => {
	const isAuthenticated = useSelect( ( select ) =>
		select( 'wpgraphql-ide/app' ).isAuthenticated()
	);
	const { toggleAuthentication } = useDispatch(
		'wpgraphql-ide/app'
	);

	return (
		<button onClick={ () => { toggleAuthentication() } }>
			{ isAuthenticated
				? 'Switch to execute as a public user'
				: 'Switch to execute as the logged-in user' }
		</button>
	);
};

export default ToggleAuthenticationButton;
