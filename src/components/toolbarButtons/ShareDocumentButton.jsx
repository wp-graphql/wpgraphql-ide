/* global WPGRAPHQL_IDE_DATA */
import React from 'react';
import { useState } from '@wordpress/element';
import { Icon, external } from '@wordpress/icons';
import { VisuallyHidden } from '@wordpress/components';
import { ToolbarButton, useEditorContext } from '@graphiql/react';
import LZString from 'lz-string';

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
export const ShareDocumentButton = () => {
	const { dedicatedIdeBaseUrl } = WPGRAPHQL_IDE_DATA;
	const { queryEditor } = useEditorContext();
	const [ shareUrl, setShareUrl ] = useState( '' );

	const generateShareLink = () => {
		const document = queryEditor?.getValue() ?? '';
		const compressedQuery =
			LZString.compressToEncodedURIComponent( document );

		const queryParamShareObject = {
			query: compressedQuery,
		};
		const compressedQueryParamShareObject =
			LZString.compressToEncodedURIComponent(
				JSON.stringify( queryParamShareObject )
			);

		const fullUrl = `${ dedicatedIdeBaseUrl }&wpgraphql_ide=${ compressedQueryParamShareObject }`;

		setShareUrl( fullUrl );
		copyToClipboard( fullUrl );
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

async function copyToClipboard( text ) {
	console.log( 'Copied: ', text );
}
