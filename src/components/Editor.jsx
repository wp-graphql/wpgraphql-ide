/* global WPGRAPHQL_IDE_DATA */
import React from 'react';
import { GraphiQL } from 'graphiql';

import 'graphiql/graphiql.min.css';

const fetcher = async ( graphQLParams ) => {
	const { graphqlEndpoint } = WPGRAPHQL_IDE_DATA;

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

export function Editor( { setDrawerOpen } ) {

	const params = new URLSearchParams(window.location.search);
	let defaultQuery = params.get('wpgql_query');

	return (
		<GraphiQL
			query={defaultQuery}
			fetcher={ fetcher }>
			<GraphiQL.Logo>
				<button
					className="button EditorDrawerCloseButton"
					onClick={ () => setDrawerOpen( false ) }
				>
					X<span className="screen-reader-text">close drawer</span>
				</button>
			</GraphiQL.Logo>
		</GraphiQL>
	);
}
