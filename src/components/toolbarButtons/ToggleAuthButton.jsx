import React from 'react';
import clsx from 'clsx';
import { ToolbarButton } from '@graphiql/react';

import styles from '../../../styles/ToggleAuthButton.module.css';

/**
 * Component to toggle the authentication state within the GraphiQL IDE.
 *
 * @param {Object}   props                      Component props.
 * @param {boolean}  props.isAuthenticated      Indicates if the current state is authenticated.
 * @param {Function} props.toggleAuthentication Function to toggle the authentication state.
 */
export const ToggleAuthButton = ( {
	isAuthenticated,
	toggleAuthentication,
} ) => {
	const avatarUrl = window.WPGRAPHQL_IDE_DATA?.context?.avatarUrl;
	const title = isAuthenticated
		? 'Switch to execute as the logged-in user'
		: 'Switch to execute as a public user';

	return (
		<ToolbarButton
			className={ clsx( 'graphiql-un-styled', 'graphiql-toolbar-button', {
				[ styles.authAvatarPublic ]: ! isAuthenticated,
			} ) }
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
