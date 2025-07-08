import { GraphiQL } from './GraphiQL';
import { useDispatch, useSelect, dispatch } from '@wordpress/data';
import { parse, visit } from 'graphql';
import 'graphiql/graphiql.min.css';
import React, { useEffect, useCallback } from 'react';

export function App() {
	const { query, shouldRenderStandalone, isAuthenticated, schema } =
		useSelect( ( select ) => {
			const wpgraphqlIDEApp = select( 'wpgraphql-ide/app' );
			return {
				query: wpgraphqlIDEApp.getQuery(),
				shouldRenderStandalone:
					wpgraphqlIDEApp.shouldRenderStandalone(),
				isAuthenticated: wpgraphqlIDEApp.isAuthenticated(),
				schema: wpgraphqlIDEApp.schema(),
			};
		} );

	const { setQuery, setDrawerOpen, setSchema } =
		useDispatch( 'wpgraphql-ide/app' );

	// Listen for insert code events from the AI Assistant
	useEffect( () => {
		const handleInsertCode = ( event ) => {
			if ( event.detail && event.detail.code ) {
				const { code, type } = event.detail;
				
				if ( type === 'query' ) {
					setQuery( code );
				}
				// Note: GraphiQL in this setup doesn't expose setVariables
				// Variables would need to be handled differently
			}
		};

		window.addEventListener( 'wpgraphql-ide:insert-code', handleInsertCode );
		
		return () => {
			window.removeEventListener( 'wpgraphql-ide:insert-code', handleInsertCode );
		};
	}, [ setQuery ] );

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
							node.name.value === '__type'
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

			const credentials = isIntrospectionQuery
				? 'include'
				: isAuthenticated
					? 'include'
					: 'omit';

			console.log({credentials});
			const response = await fetch( graphqlEndpoint, {
				method: 'POST',
				headers,
				body: JSON.stringify( graphQLParams ),
				credentials,
			} );

			return response.json();
		},
		[ isAuthenticated ]
	);

	const activityPanels = useSelect( ( select ) => {
		const activityPanels = select(
			'wpgraphql-ide/activity-bar'
		).activityPanels();
		console.log( {
			activityPanels,
		} );
		return activityPanels;
	} );

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
				plugins={ activityPanels }
			>
				<GraphiQL.Logo>
					{ ! shouldRenderStandalone && (
						<button
							className="button AppDrawerCloseButton"
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
