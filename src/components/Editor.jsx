import React, { useState, useEffect, useCallback } from 'react';
import { GraphiQL } from 'graphiql';
import { useDispatch, useSelect } from '@wordpress/data';
import { parse, visit } from 'graphql';

import { PrettifyButton } from './toolbarButtons/PrettifyButton';
import { CopyQueryButton } from './toolbarButtons/CopyQueryButton';
import { MergeFragmentsButton } from './toolbarButtons/MergeFragmentsButton';
import { ShareDocumentButton } from './toolbarButtons/ShareDocumentButton';
import { ToggleAuthButton } from './toolbarButtons/ToggleAuthButton';

import 'graphiql/graphiql.min.css';

/**
 * Editor component encapsulating the GraphiQL IDE.
 * Manages authentication state and integrates custom toolbar buttons.
 */
export function Editor() {
	const query = useSelect( ( select ) =>
		select( 'wpgraphql-ide' ).getQuery()
	);
	const shouldRenderStandalone = useSelect( ( select ) =>
		select( 'wpgraphql-ide' ).shouldRenderStandalone()
	);
	const { setDrawerOpen } = useDispatch( 'wpgraphql-ide' );

	const [ isAuthenticated, setIsAuthenticated ] = useState( () => {
		const storedState = localStorage.getItem( 'graphiql:isAuthenticated' );
		return storedState !== null ? storedState === 'true' : true;
	} );

	const [ schema, setSchema ] = useState( undefined );

	useEffect( () => {
		// create a ref
		const ref = React.createRef();
		// find the target element in the DOM
		const element = document.querySelector(
			'[aria-label="Re-fetch GraphQL schema"]'
		);
		// if the element exists
		if ( element ) {
			// assign the ref to the element
			element.ref = ref;
			// listen to click events on the element
			element.addEventListener( 'click', () => {
				setSchema( undefined );
			} );
		}
	}, [ schema ] );

	useEffect( () => {
		localStorage.setItem(
			'graphiql:isAuthenticated',
			isAuthenticated.toString()
		);
	}, [ isAuthenticated ] );

	const fetcher = useCallback(
		async ( graphQLParams ) => {
			let isIntrospectionQuery = false;

			try {
				// Parse the GraphQL query to AST only once and in a try-catch to handle potential syntax errors gracefully
				const queryAST = parse( graphQLParams.query );

				// Visit each node in the AST efficiently to check for introspection fields
				visit( queryAST, {
					Field( node ) {
						if (
							node.name.value === '__schema' ||
							node.name.value === '__typename'
						) {
							isIntrospectionQuery = true;
							return visit.BREAK; // Early exit if introspection query is detected
						}
					},
				} );
			} catch ( error ) {
				console.error( 'Error parsing GraphQL query:', error );
			}

			const { graphqlEndpoint } = window.WPGRAPHQL_IDE_DATA;
			const headers = {
				'Content-Type': 'application/json',
			};

			const response = await fetch( graphqlEndpoint, {
				method: 'POST',
				headers,
				body: JSON.stringify( graphQLParams ),
				credentials: isIntrospectionQuery
					? 'include'
					: isAuthenticated
					? 'same-origin'
					: 'omit',
			} );

			return response.json();
		},
		[ isAuthenticated ]
	);

	const toggleAuthentication = () => setIsAuthenticated( ! isAuthenticated );

	return (
		<>
			<GraphiQL
				query={ query }
				fetcher={ fetcher }
				schema={ schema }
				onSchemaChange={ ( newSchema ) => {
					if ( schema !== newSchema ) {
						setSchema( newSchema );
					}
				} }
			>
				<GraphiQL.Toolbar>
					<ToggleAuthButton
						isAuthenticated={ isAuthenticated }
						toggleAuthentication={ toggleAuthentication }
					/>
					<PrettifyButton />
					<CopyQueryButton />
					<MergeFragmentsButton />
					<ShareDocumentButton />
				</GraphiQL.Toolbar>
				<GraphiQL.Logo>
					{ ! shouldRenderStandalone && (
						<button
							className="button EditorDrawerCloseButton"
							onClick={ () => setDrawerOpen( false ) }
						>
							X{ ' ' }
							<span className="screen-reader-text">
								close drawer
							</span>
						</button>
					) }
				</GraphiQL.Logo>
			</GraphiQL>
		</>
	);
}
