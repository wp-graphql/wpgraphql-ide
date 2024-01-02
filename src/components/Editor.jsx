import { GraphiQL } from 'graphiql';
import 'graphiql/graphiql.min.css';
import { Logo } from './Logo';

const fetcher = async (graphQLParams) => {
    const { graphqlEndpoint } = WPGRAPHQL_IDE_DATA;

    const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphQLParams),
        credentials: 'same-origin' // or 'include' if your endpoint is on a different domain
    });

    return response.json();
};

export function Editor() {
    return (
        <GraphiQL fetcher={fetcher}>
            <GraphiQL.Logo>
                <a className="wpgraphql-logo-link" href="https://www.wpgraphql.com" target="_blank" rel="noreferrer">
                    <Logo height="40" width="40" />
                </a>
            </GraphiQL.Logo>
        </GraphiQL>
    )
}
