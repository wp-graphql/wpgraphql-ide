/* global WPGRAPHQL_IDE_DATA */
import React from 'react';
import { GraphiQL } from 'graphiql';
import { useDispatch, useSelect } from '@wordpress/data';

import { PrettifyButton } from './toolbarButtons/PrettifyButton';
import { CopyQueryButton } from './toolbarButtons/CopyQueryButton';
import { MergeFragmentsButton } from './toolbarButtons/MergeFragmentsButton';
import { ShareDocumentButton } from './toolbarButtons/ShareDocumentButton';

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
const toolbarButtons = {
	copy: CopyQueryButton,
	prettify: PrettifyButton,
	merge: MergeFragmentsButton,
	share: ShareDocumentButton,
};

export function Editor() {
	const query = useSelect( ( select ) => {
		return select( 'wpgraphql-ide' ).getQuery();
	} );

	const shouldRenderStandalone = useSelect( ( select ) => {
		return select( 'wpgraphql-ide' ).shouldRenderStandalone();
	} );

	const { setDrawerOpen } = useDispatch( 'wpgraphql-ide' );

	return (
		<>
			<GraphiQL query={ query } fetcher={ fetcher }>
				<GraphiQL.Toolbar>
					{ Object.entries( toolbarButtons ).map(
						( [ key, Button ] ) => (
							<Button key={ key } />
						)
					) }
				</GraphiQL.Toolbar>
				<GraphiQL.Logo>
					{ ! shouldRenderStandalone ? (
						<button
							className="button EditorDrawerCloseButton"
							onClick={ () => setDrawerOpen( false ) }
						>
							X
							<span className="screen-reader-text">
								close drawer
							</span>
						</button>
					) : (
						<span />
					) }
				</GraphiQL.Logo>
			</GraphiQL>
		</>
	);
}
