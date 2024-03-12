/* global WPGRAPHQL_IDE_DATA */
import React  from 'react';
import { render, createRoot } from '@wordpress/element';
import { GraphiQL } from 'graphiql';
import { useDispatch, useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

import { PrettifyButton } from './toolbarButtons/PrettifyButton';
import { CopyQueryButton } from './toolbarButtons/CopyQueryButton';
import { MergeFragmentsButton } from './toolbarButtons/MergeFragmentsButton';
import { ShareDocumentButton } from './toolbarButtons/ShareDocumentButton';
import { Tooltip, UnStyledButton, ReloadIcon } from '@graphiql/react';

import 'graphiql/graphiql.min.css';
import {useEffect} from "@wordpress/element";
import {createGraphiQLFetcher} from "@graphiql/toolkit";

const { graphqlEndpoint } = window.WPGRAPHQL_IDE_DATA;

// const fetcher = createGraphiQLFetcher({
// 	url: graphqlEndpoint,
// 	headers: {
// 		'Content-Type': 'application/json',
// 	},
// 	credentials: 'omit',
// })

const fetcher = async ( graphQLParams ) => {
	const { graphqlEndpoint } = window.WPGRAPHQL_IDE_DATA;

	const response = await fetch( graphqlEndpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify( graphQLParams ),
		credentials: 'omit', // or 'include' if your endpoint is on a different domain
	} );

	return response.json();
};

/**
 * Filter the Buttons to allow 3rd parties to add their own buttons to the GraphiQL Toolbar.
 */
const toolbarButtons = applyFilters( 'wpgraphqlide_toolbar_buttons', {
	copy: CopyQueryButton,
	prettify: PrettifyButton,
	merge: MergeFragmentsButton,
	custom: ShareDocumentButton,
} );

const RefetchButton = ({ isFetching, schema, setIsFetching, setSchema }) => {
	console.log( {
		refetchButton: {
			isFetching,
			schema
		}
	})
	return (
		<Tooltip.Provider>
			<Tooltip label="Re-fetch the GraphQL schema">
				<UnStyledButton
					type="button"
					disabled={false}
					onClick={() => {
						setIsFetching(true);
						setSchema(undefined);
						console.log( {
							schema,
							isFetching
						})
						setTimeout(() => {
							setIsFetching(false);
						}, 5000);
					}}
					aria-label="Re-fetch the GraphQL schema"
				>
					<ReloadIcon
						className={isFetching ? 'graphiql-spin' : ''}
						aria-hidden="true"
					/>
				</UnStyledButton>
			</Tooltip>
		</Tooltip.Provider>
	)
}

export function Editor() {
	const { query, shouldRenderStandalone, plugins, schema, isFetching } = useSelect(
		( select ) => {
			const wpgraphqlIde = select( 'wpgraphql-ide' );
			return {
				query: wpgraphqlIde.getQuery(),
				shouldRenderStandalone: wpgraphqlIde.shouldRenderStandalone(),
				plugins: wpgraphqlIde.getPluginsArray(),
				schema: wpgraphqlIde.getSchema(),
				isFetching: wpgraphqlIde.isFetching(),
			};
		}
	);

	const { setDrawerOpen, setQuery, setSchema, setIsFetching } = useDispatch( 'wpgraphql-ide' );

	// // Hacky solution to hide the refetch button and add our own back in that can refetch the schema
	// // using the redux store.
	// useEffect(() => {
	// 	console.log( {
	// 		schema,
	// 		isFetching
	// 	})
	// 	// Find the target element in the DOM
	// 	const element = document.querySelector('[aria-label="Re-fetch GraphQL schema"]');
	// 	if (element) {
	// 		const container = document.createElement('div'); // Create a container for the new element
	// 		const root = createRoot(container); // Create a root for the new element
	// 		// Append the container to the parent element
	// 		element.parentElement.prepend(container);
	// 		// Use ReactDOM to render the React component into the container
	// 		root.render(
	// 			<RefetchButton
	// 				isFetching={isFetching}
	// 				schema={schema}
	// 				setIsFetching={setIsFetching}
	// 				setSchema={setSchema}
	// 			/>,
	// 			container
	// 		);
	//
	// 		// Remove the original element
	// 		element.remove();
	//
	// 		// Cleanup function to unmount and remove the container
	// 		// return () => {
	// 		// 	unmountComponentAtNode(container);
	// 		// 	container.remove();
	// 		// };
	// 	}
	// }, [setSchema, schema, isFetching, setIsFetching]);

	useEffect(() => {
		// create a ref
		const ref = React.createRef();
		// find the target element in the DOM
		const element = document.querySelector('[aria-label="Re-fetch GraphQL schema"]');
		// if the element exists
		if (element) {
			// assign the ref to the element
			element.ref = ref;
			// listen to click events on the element
			element.addEventListener('click', () => {
				setSchema(undefined);
			});
		}
	}, [ schema, isFetching ]);

	return (
		<GraphiQL
			query={ query }
			fetcher={ (params) => {
				return fetcher( params );
			} }
			onEditQuery={ ( query ) => setQuery( query ) }
			plugins={ plugins.length > 0 ? plugins : null }
			schema={schema}
			onSchemaChange={(schema) => setSchema(schema)}
		>
			<GraphiQL.Toolbar>
				{ Object.entries( toolbarButtons ).map( ( [ key, Button ] ) => (
					<Button key={ key } />
				) ) }
			</GraphiQL.Toolbar>
			<GraphiQL.Logo>
				{ ! shouldRenderStandalone ? (
					<button
						className="button EditorDrawerCloseButton"
						onClick={ () => setDrawerOpen( false ) }
					>
						X
						<span className="screen-reader-text">close drawer</span>
					</button>
				) : (
					<span />
				) }
			</GraphiQL.Logo>
		</GraphiQL>
	);
}
