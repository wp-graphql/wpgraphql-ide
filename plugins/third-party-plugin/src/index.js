/* global WPGRAPHQL_IDE_DATA */
import MergeFragmentsButton from './components/MergeFragmentsButton';
import CopyQueryButton from './components/CopyQueryButton';
import {select, dispatch, useSelect, useDispatch} from "@wordpress/data";
import styles from "./components/ToggleAuthenticationButton/ToggleAuthenticationButton.module.css";
import clsx from "clsx";
import {PrettifyIcon} from "@graphiql/react";
import React from 'react';
import {useCopyToClipboard} from "../../../src/hooks/useCopyToClipboard";
import LZString from "lz-string";


window.addEventListener( 'WPGraphQLIDEReady', () => {

	const { registerEditorToolbarButton } = window.WPGraphQLIDE;

	/**
	 * Register the toggle authentication button.
	 *
	 * This button allows the user to switch between executing queries as the logged-in user
	 * or as a public user.
	 */
	registerEditorToolbarButton( 'toggle-auth', () => {
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
	} );

	registerEditorToolbarButton( 'prettify', () => {
		const query = useSelect( ( select ) => select( 'wpgraphql-ide/app' ).getQuery() );
		const { prettifyQuery } = useDispatch( 'wpgraphql-ide/app' );

		return {
			label: 'Prettify query (Shift-Ctrl-P)',
			children: (
				<PrettifyIcon
					className="graphiql-toolbar-icon"
					aria-hidden="true"
				/>
			),
			onClick: () => {
				prettifyQuery( query );
			}
		}
	} );


	registerEditorToolbarButton( 'share-document', () => {

		const [ copyToClipboard ] = useCopyToClipboard();
		const { dedicatedIdeBaseUrl } = window.WPGRAPHQL_IDE_DATA;
		const query = useSelect(
			( select ) => select( 'wpgraphql-ide/app' ).getQuery()
		);

		const generateShareLink = () => {

			const hashedQueryParamObject = getHashedQueryParams( { query } );
			const fullUrl = `${ dedicatedIdeBaseUrl }&wpgraphql_ide=${ hashedQueryParamObject }`;
			copyToClipboard( fullUrl );

			// TODO: notify user that a shareable link is copied to clipboard
		};

		return {
			label: 'Share current document',
			// component: ShareDocumentButton
			onClick: () => {
				generateShareLink();
			}
		}
	} );

	// registerEditorToolbarButton( 'merge-fragments-button', {
	// 	title: 'Merge fragments into query (Shift-Ctrl-M)',
	// 	component: MergeFragmentsButton
	// } );

	// registerEditorToolbarButton( 'merge-fragments-button', {
	// 	title: 'Copy query (Shift-Ctrl-C)',
	// 	component: CopyQueryButton
	// } );

} );

/**
 * Compresses and encodes a query parameter object for use in a shareable URL.
 *
 * @param {Object} obj The object containing query parameters to be compressed and encoded.
 * @return {string} A compressed and encoded string representing the query parameters.
 */
export function getHashedQueryParams( obj ) {
	if ( typeof obj !== 'object' || obj === null ) {
		console.error( 'Input must be a non-null object' );
		return '';
	}
	try {
		const queryParamString = JSON.stringify( obj );
		return LZString.compressToEncodedURIComponent( queryParamString );
	} catch ( error ) {
		console.error( 'Failed to compress query parameter object:', error );
		return '';
	}
}
