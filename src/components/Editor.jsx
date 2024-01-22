/* global WPGRAPHQL_IDE_DATA */
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

export function Editor() {
	return (
		<>
			<GraphiQL fetcher={ fetcher } />
		</>
	);
}
