/* global WPGRAPHQL_IDE_DATA */
import React from 'react';
import { GraphiQL } from 'graphiql';
import { useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { Icon, external } from '@wordpress/icons';
import { VisuallyHidden } from '@wordpress/components';
import {
	ToolbarButton,
	PrettifyIcon,
	usePrettifyEditors,
	useCopyQuery,
	useMergeQuery,
	MergeIcon,
	CopyIcon,
	useEditorContext,
} from '@graphiql/react';
import LZString from 'lz-string';

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

const PrettifyButton = ( { onClick } ) => {
	const prettify = usePrettifyEditors();
	return (
		<ToolbarButton
			onClick={ prettify }
			label="Prettify query (Shift-Ctrl-P)"
		>
			<PrettifyIcon
				className="graphiql-toolbar-icon"
				aria-hidden="true"
			/>
		</ToolbarButton>
	);
};

const CopyQueryButton = ( { onCopyQuery } ) => {
	const copy = useCopyQuery( { onCopyQuery } );
	return (
		<ToolbarButton
			className="graphiql-un-styled graphiql-toolbar-button"
			onClick={ copy }
			label="Copy query (Shift-Ctrl-C)"
		>
			<CopyIcon className="graphiql-toolbar-icon" aria-hidden="true" />
		</ToolbarButton>
	);
};

const MergeFragmentsButton = () => {
	const merge = useMergeQuery();
	return (
		<ToolbarButton
			onClick={ merge }
			label="Merge fragments into query (Shift-Ctrl-M)"
		>
			<MergeIcon className="graphiql-toolbar-icon" aria-hidden="true" />
		</ToolbarButton>
	);
};

/**
 * This button would provide a sharable link to users that they can use to share the current
 * query and the user that visits the link would see the same query in the editor.
 *
 * The way I see this working is that the query would be hashed (similar to current WPGraphQL IDE) but instead of persisting the state in the URL as the query changes,
 * it would be hashed when the "share" button is clicked and then appended to the current URL or a generic admin URL that could then be shared.
 *
 * i.e. site.com/wp-admin/admin.php?page=wpgraphql-ide&query=HASHED_QUERY
 *
 * Then GraphiQL would open with the query un-hashed and already set as the current query in the editor.
 *
 * This button, or similar buttons to it could/should be able to be "filtered" into GraphiQL by 3rd parties.
 */
const ShareDocumentButton = () => {
	const { dedicatedIdeBaseUrl } = WPGRAPHQL_IDE_DATA;
	const { queryEditor } = useEditorContext();
	const [ shareUrl, setShareUrl ] = useState( '' );

	const generateShareLink = () => {
		const document = queryEditor?.getValue() ?? '';
		const compressedQuery =
			LZString.compressToEncodedURIComponent( document );
		const fullUrl = `${ dedicatedIdeBaseUrl }&query=${ compressedQuery }`;

		setShareUrl( fullUrl );
		alert( fullUrl ); // Alert with the fullUrl directly since useState is async.

		// Do whatever else we need to here.
	};

	return (
		<ToolbarButton
			onClick={ generateShareLink }
			label="Share current document"
		>
			<Icon
				icon={ external }
				style={ {
					fill: 'hsla(var(--color-neutral), var(--alpha-tertiary))',
				} }
			/>
			<VisuallyHidden>Share</VisuallyHidden>
		</ToolbarButton>
	);
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
	const query = useSelect( ( select ) => {
		return select( 'wpgraphql-ide' ).getQuery();
	} );

	const shouldRenderStandalone = useSelect( ( select ) => {
		return select( 'wpgraphql-ide' ).shouldRenderStandalone();
	} );

	console.log( {
		query,
		shouldRenderStandalone,
	} );

	const { setDrawerOpen } = useDispatch( 'wpgraphql-ide' );

	return (
		<GraphiQL query={ query } fetcher={ fetcher }>
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
