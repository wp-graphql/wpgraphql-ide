import React, { useState, useEffect, useCallback } from 'react';
import { GraphiQL } from 'graphiql';
import { useDispatch, useSelect } from '@wordpress/data';
import { parse, visit } from 'graphql';
import { explorerPlugin } from '@graphiql/plugin-explorer';

import { helpPlugin } from './help';
import { DynamicToolbarButtons } from './DynamicToolbarButtons';

import 'graphiql/graphiql.min.css';

const explorer = explorerPlugin();
const help = helpPlugin();

import '../../styles/explorer.css';
import { ToolbarButton } from '@graphiql/react';

export function Editor() {
	const query = useSelect( ( select ) =>
		select( 'wpgraphql-ide/app' ).getQuery()
	);

	const { setQuery } = useDispatch( 'wpgraphql-ide/app' );

	const shouldRenderStandalone = useSelect( ( select ) =>
		select( 'wpgraphql-ide/app' ).shouldRenderStandalone()
	);
	const { setDrawerOpen, setSchema } = useDispatch( 'wpgraphql-ide/app' );

	// const [ isAuthenticated, setIsAuthenticated ] = useState( () => {
	// 	const storedState = localStorage.getItem( 'graphiql:isAuthenticated' );
	// 	return storedState !== null ? storedState === 'true' : true;
	// } );

	const isAuthenticated = useSelect( ( select ) =>
		select( 'wpgraphql-ide/app' ).isAuthenticated()
	);

	const schema = useSelect( ( select ) =>
		select( 'wpgraphql-ide/app' ).schema()
	);

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

	// const handleEditQuery = (editedQuery) => {
	// 	let update = false;

	// 	if (editedQuery === query) {
	// 	  return;
	// 	}

	// 	if (null === editedQuery || "" === editedQuery) {
	// 	  update = true;
	// 	} else {
	// 	  try {
	// 		parse(editedQuery);
	// 		update = true;
	// 	  } catch (error) {
	// 		return;
	// 	  }
	// 	}

	// 	// If the query is valid and should be updated
	// 	if (update) {
	// 	  // Update the state with the new query
	// 	  setQuery(editedQuery);
	// 	}
	// };

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

			const base64Credentials = btoa( `growth:growth` );

			const headers = {
				'Content-Type': 'application/json',
				Authorization: `Basic ${ base64Credentials }`,
			};

			console.log( {
				graphQLParams,
			} );

			const response = await fetch( graphqlEndpoint, {
				method: 'POST',
				headers,
				body: JSON.stringify( graphQLParams ),
				credentials: isIntrospectionQuery
					? 'include'
					: isAuthenticated
					? 'include'
					: 'omit',
			} );

			console.log( {
				response,
			} );

			return response.json();
		},
		[ isAuthenticated ]
	);

	const buttons = useSelect( ( select ) =>
		select( 'wpgraphql-ide/editor-toolbar' ).buttons()
	);

	return (
		<span id="wpgraphql-ide-app">
			<GraphiQL
				query={ query }
				fetcher={ fetcher }
				onEditQuery={ setQuery }
				schema={ schema }
				onSchemaChange={ ( newSchema ) => {
					if ( schema !== newSchema ) {
						setSchema( newSchema );
					}
				} }
				plugins={ [ explorer, help ] }
			>
				<GraphiQL.Toolbar>
					<DynamicToolbarButtons />
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
		</span>
	);
}
