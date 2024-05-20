import React from 'react';
import {
	PrettifyIcon,
} from '@graphiql/react';
import { useDispatch, useSelect } from '@wordpress/data';


export const PrettifyButton = ({ ToolbarButton }) => {
	// const prettify = usePrettifyEditors();

	const { GraphQL } = window.WPGraphQLIDE;
	const { print, parse } = GraphQL;

	const query = useSelect( ( select ) => select( 'wpgraphql-ide/app' ).getQuery() );
	const { prettifyQuery } = useDispatch( 'wpgraphql-ide/app' );

	return (
		<ToolbarButton
			onClick={ () => prettifyQuery( query ) }
			label="Prettify query (Shift-Ctrl-P)"
		>
			<PrettifyIcon
				className="graphiql-toolbar-icon"
				aria-hidden="true"
			/>
		</ToolbarButton>
	);
};
