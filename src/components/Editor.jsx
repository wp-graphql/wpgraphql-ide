/* global WPGRAPHQL_IDE_DATA */
import React from 'react';
import { GraphiQL } from 'graphiql';
import { useDispatch, useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

import { PrettifyButton } from './toolbarButtons/PrettifyButton';
import { CopyQueryButton } from './toolbarButtons/CopyQueryButton';
import { MergeFragmentsButton } from './toolbarButtons/MergeFragmentsButton';
import { ShareDocumentButton } from './toolbarButtons/ShareDocumentButton';
import { explorerPlugin } from "@graphiql/plugin-explorer";
const explorer = explorerPlugin();

import 'graphiql/graphiql.min.css';

const fetcher = async ( graphQLParams ) => {
	const { graphqlEndpoint } = window.WPGRAPHQL_IDE_DATA;

	const response = await fetch( graphqlEndpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify( graphQLParams ),
		credentials: 'same-origin', // or 'include' if your endpoint is on a different domain
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

export function Editor() {
	const { query, shouldRenderStandalone, plugins } = useSelect(
		( select ) => {
			const wpgraphqlIde = select( 'wpgraphql-ide' );
			return {
				query: wpgraphqlIde.getQuery(),
				shouldRenderStandalone: wpgraphqlIde.shouldRenderStandalone(),
				plugins: wpgraphqlIde.getPluginsArray(),
			};
		}
	);

	const { setDrawerOpen, setQuery } = useDispatch( 'wpgraphql-ide' );

	let activePlugins = plugins.length > 0 ? plugins : [];

	// Push the explorer plugin to the activePlugins array
	activePlugins.push( explorer );

	return (
		<GraphiQL
			query={ query }
			fetcher={ fetcher }
			onEditQuery={ ( query ) => setQuery( query ) }
			plugins={ plugins.length > 0 ? plugins : null }
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
