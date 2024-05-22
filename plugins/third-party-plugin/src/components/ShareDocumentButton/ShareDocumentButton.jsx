/* global WPGRAPHQL_IDE_DATA */
import React from 'react';
import { Icon, external } from '@wordpress/icons';
import { VisuallyHidden } from '@wordpress/components';
import { useEditorContext } from '@graphiql/react';
import { useCopyToClipboard } from '../../../../../src/hooks/useCopyToClipboard';

/**
 * React component for a toolbar button that generates and copies a shareable document link.
 *
 * This component uses the GraphiQL editor context to access the current GraphQL query,
 * compresses and encodes the query parameters, and generates a shareable URL. It uses the
 * `useCopyToClipboard` hook to copy this URL to the clipboard and provide user feedback
 * via WordPress admin notices.
 *
 * @param {Object} props               Component properties.
 * @param          props.ToolbarButton
 * @return {React.Element} A ToolbarButton element for the share document functionality.
 */
export const ShareDocumentButton = ( { ToolbarButton } ) => {
	const { queryEditor } = useEditorContext();
	const [ copyToClipboard ] = useCopyToClipboard();
	const { dedicatedIdeBaseUrl } = window.WPGRAPHQL_IDE_DATA;

	/**
	 * Generates a shareable link for the current document in the editor and copies it to the clipboard.
	 */
	const generateShareLink = () => {
		const query = queryEditor?.getValue() ?? '';
		const hashedQueryParamObject = getHashedQueryParams( { query } );
		const fullUrl = `${ dedicatedIdeBaseUrl }&wpgraphql_ide=${ hashedQueryParamObject }`;
		copyToClipboard( fullUrl );

		// TODO: notify user that a shareable link is copied to clipboard
	};

	return (
		<ToolbarButton
			className="graphiql-un-styled graphiql-toolbar-button"
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
