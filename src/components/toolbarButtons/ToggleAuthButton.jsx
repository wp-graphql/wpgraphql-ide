import React from 'react';
import clsx from 'clsx';
import { ToolbarButton } from '@wordpress/components';

import styles from '../../../styles/ToggleAuthButton.module.css';

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
			<div
				className={ styles.authAvatar }
				style={ { backgroundImage: `url(${ avatarUrl ?? '' })` } }
			>
				<span className={ styles.authBadge }></span>
			</div>
		</ToolbarButton>
	);
};
