/* global WPGRAPHQL_IDE_DATA */
import React from 'react';
import { GraphiQL } from 'graphiql';

import 'graphiql/graphiql.min.css';
import {useDispatch, useSelect} from "@wordpress/data";

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

export function Editor() {

	const query = useSelect( (select) => {
		return select( 'wpgraphql-ide' ).getQuery();
	});

	const shouldRenderStandalone = useSelect( (select) => {
		return select( 'wpgraphql-ide' ).shouldRenderStandalone();
	});

	console.log( {
		query,
		shouldRenderStandalone
	})

	const { setDrawerOpen } = useDispatch( 'wpgraphql-ide' );

	return (
		<GraphiQL
			query={query}
			fetcher={ fetcher }>
			<GraphiQL.Logo>
				{ ! shouldRenderStandalone ? <button
					className="button EditorDrawerCloseButton"
					onClick={ () => setDrawerOpen( false ) }
				>
					X<span className="screen-reader-text">close drawer</span>
				</button> : <span /> }
			</GraphiQL.Logo>
		</GraphiQL>
	);
}
