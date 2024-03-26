import React, { useCallback } from 'react';
import { GraphiQL } from 'graphiql';
import { useDispatch, useSelect } from '@wordpress/data';

import { actions } from '../store/index';
import PrettifyButton from './toolbarButtons/PrettifyButton';
import CopyQueryButton from './toolbarButtons/CopyQueryButton';
import MergeFragmentsButton from './toolbarButtons/MergeFragmentsButton';
import ShareDocumentButton from './toolbarButtons/ShareDocumentButton';
import ToggleAuthButton from './toolbarButtons/ToggleAuthButton';

import 'graphiql/graphiql.min.css';

export function Editor() {
    const dispatch = useDispatch();
    const query = useSelect(select => select('wpgraphql-ide').getQuery());
    const shouldRenderStandalone = useSelect(select => select('wpgraphql-ide').shouldRenderStandalone());
    const isAuthenticated = useSelect(select => select('wpgraphql-ide').isAuthenticated());

    const fetcher = useCallback(async (graphQLParams) => {
        const { graphqlEndpoint } = window.WPGRAPHQL_IDE_DATA;
        const headers = { 'Content-Type': 'application/json' };

        const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(graphQLParams),
            credentials: isAuthenticated ? 'same-origin' : 'omit',
        });

        return response.json();
    }, [isAuthenticated]);

	// Correctly handle toggling authentication
	const handleToggleAuthentication = () => {
		dispatch(actions.toggleAuthentication());
	};
	
	return (
		<>
			<GraphiQL query={ query } fetcher={ fetcher }>
				<GraphiQL.Toolbar>
					<ToggleAuthButton
						isAuthenticated={ isAuthenticated }
						toggleAuthentication={ handleToggleAuthentication }
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
