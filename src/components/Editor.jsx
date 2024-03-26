import React, { useState, useEffect, useCallback } from 'react';
import { GraphiQL } from 'graphiql';
import { useDispatch, useSelect } from '@wordpress/data';
import { ToolbarGroup } from '@wordpress/components';

import { PrettifyButton } from './toolbarButtons/PrettifyButton';
import { CopyQueryButton } from './toolbarButtons/CopyQueryButton';
import { MergeFragmentsButton } from './toolbarButtons/MergeFragmentsButton';
import { ShareDocumentButton } from './toolbarButtons/ShareDocumentButton';
import { ToggleAuthButton } from './toolbarButtons/ToggleAuthButton';

import 'graphiql/graphiql.min.css';

/**
 * Editor component encapsulating the GraphiQL IDE.
 * Manages authentication state and integrates custom toolbar buttons.
 */
export function Editor() {
	const query = useSelect( ( select ) =>
		select( 'wpgraphql-ide' ).getQuery()
	);
	const shouldRenderStandalone = useSelect( ( select ) =>
		select( 'wpgraphql-ide' ).shouldRenderStandalone()
	);
	const { setDrawerOpen } = useDispatch( 'wpgraphql-ide' );

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedState = localStorage.getItem('graphiql:isAuthenticated');
        return storedState !== null ? storedState === 'true' : true;
    });

    useEffect(() => {
        localStorage.setItem('graphiql:isAuthenticated', isAuthenticated.toString());
    }, [isAuthenticated]);

	const fetcher = useCallback(async ( graphQLParams ) => {
		const { graphqlEndpoint } = window.WPGRAPHQL_IDE_DATA;
		const headers = {
			'Content-Type': 'application/json',
		};

		const response = await fetch( graphqlEndpoint, {
			method: 'POST',
			headers,
			body: JSON.stringify( graphQLParams ),
			credentials: isAuthenticated ? 'same-origin' : 'omit',
		} );

		return response.json();
	}, [isAuthenticated]);

	const toggleAuthentication = () => setIsAuthenticated( ! isAuthenticated );

	return (
		<>
			<GraphiQL query={ query } fetcher={ fetcher }>
				<GraphiQL.Toolbar>
					<ToolbarGroup>
						<ToggleAuthButton
							isAuthenticated={ isAuthenticated }
							toggleAuthentication={ toggleAuthentication }
						/>
						<PrettifyButton />
						<CopyQueryButton />
						<MergeFragmentsButton />
						<ShareDocumentButton />
					</ToolbarGroup>
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
