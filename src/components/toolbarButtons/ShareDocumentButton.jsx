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
		const query = queryEditor?.getValue() ?? '';
		const hashedQueryParamObject = getHashedQueryParamObject({ query });
		const fullUrl = `${ dedicatedIdeBaseUrl }&wpgraphql_ide=${ hashedQueryParamObject }`;

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

/**
 * Converts a given object to a compressed, encoded URI component string using LZString compression.
 * This is useful for generating shorter query parameters from complex objects.
 * 
 * @param {Object} obj - The object to be converted into a compressed query parameter.
 * @returns {string} The compressed and encoded URI component string.
 * @throws {TypeError} If the input is not an object or cannot be serialized.
 */
export function getHashedQueryParams(obj) {
    if (typeof obj !== 'object' || obj === null) {
        console.error('Input must be a non-null object');
		return null;
    }

    try {
        const queryParamString = JSON.stringify(obj);
        const compressedQueryParamShareObject = LZString.compressToEncodedURIComponent(queryParamString);
        return compressedQueryParamShareObject;
    } catch (error) {
        console.error('Failed to compress query parameter object:', error);
    }
}
