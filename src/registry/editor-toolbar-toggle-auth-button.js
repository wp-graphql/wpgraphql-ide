import {dispatch, select} from "@wordpress/data";
import styles
	from "../../plugins/third-party-plugin/src/components/ToggleAuthenticationButton/ToggleAuthenticationButton.module.css";
import clsx from "clsx";

export const toggleAuthButton = () => {
	const isAuthenticated = select( 'wpgraphql-ide/app' ).isAuthenticated();
	const avatarUrl = window.WPGRAPHQL_IDE_DATA?.context?.avatarUrl;
	return {
		label: isAuthenticated
			? 'Switch to execute as a public user'
			: 'Switch to execute as the logged-in user',
		children: (
			<span
				className={ styles.authAvatar }
				style={ { backgroundImage: `url(${ avatarUrl ?? '' })` } }
			>
					<span className={styles.authBadge} />
				</span>
		),
		className: clsx(
			'graphiql-un-styled',
			'graphiql-toolbar-button graphiql-auth-button',
			{
				[ styles.authAvatarPublic ]: ! isAuthenticated,
				'is-authenticated': isAuthenticated,
				'is-public': ! isAuthenticated,
			}
		),
		onClick: () => {
			dispatch( 'wpgraphql-ide/app' ).toggleAuthentication();
		}
	};
};
