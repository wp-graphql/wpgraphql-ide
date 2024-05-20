import React from 'react';
import clsx from 'clsx';
import { useDispatch, useSelect } from '@wordpress/data';

import styles from './ToggleAuthenticationButton.module.css';

/**
 * Component to toggle the authentication state within the GraphiQL IDE.
 *
 * @param {Object}   props                      Component props.
 * @param {boolean}  props.isAuthenticated      Indicates if the current state is authenticated.
 * @param {Function} props.toggleAuthentication Function to toggle the authentication state.
 */
export const ToggleAuthenticationButton = ( { ToolbarButton } ) => {
	const isAuthenticated = useSelect( ( select ) =>select( 'wpgraphql-ide/app' ).isAuthenticated());
	const { toggleAuthentication } = useDispatch( 'wpgraphql-ide/app' );
	const avatarUrl = window.WPGRAPHQL_IDE_DATA?.context?.avatarUrl;
	const title = isAuthenticated
		? 'Switch to execute as a public user'
		: 'Switch to execute as the logged-in user';

	return (
		<ToolbarButton
			className={ clsx(
				'graphiql-un-styled',
				'graphiql-toolbar-button graphiql-auth-button',
				{
					[ styles.authAvatarPublic ]: ! isAuthenticated,
					'is-authenticated': isAuthenticated,
					'is-public': ! isAuthenticated,
				}
			) }
			onClick={ toggleAuthentication }
			label={ title }
		>
			<span
				className={ styles.authAvatar }
				style={ { backgroundImage: `url(${ avatarUrl ?? '' })` } }
			>
				<span className={ styles.authBadge }></span>
			</span>
		</ToolbarButton>
	);
};
