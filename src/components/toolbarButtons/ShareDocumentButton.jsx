/* global WPGRAPHQL_IDE_DATA */
import React from 'react';
import { Icon, external } from '@wordpress/icons';
import { VisuallyHidden, ToolbarButton } from '@wordpress/components';
import { useEditorContext } from '@graphiql/react';
import LZString from 'lz-string';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

/**
 * React component for a toolbar button that generates and copies a shareable document link.
 * 
 * This component uses the GraphiQL editor context to access the current GraphQL query,
 * compresses and encodes the query parameters, and generates a shareable URL. It uses the
 * `useCopyToClipboard` hook to copy this URL to the clipboard and provide user feedback
 * via WordPress admin notices.
 * 
 * @param {Object} props Component properties.
 * @returns {React.Element} A ToolbarButton element for the share document functionality.
 */
export const ShareDocumentButton = () => {
  const { queryEditor } = useEditorContext();
  const [copyToClipboard] = useCopyToClipboard();
  const { dedicatedIdeBaseUrl } = window.WPGRAPHQL_IDE_DATA; 

  /**
   * Generates a shareable link for the current document in the editor and copies it to the clipboard.
   */
  const generateShareLink = () => {
    const query = queryEditor?.getValue() ?? '';
    const hashedQueryParamObject = getHashedQueryParams({ query });
    const fullUrl = `${dedicatedIdeBaseUrl}&wpgraphql_ide=${hashedQueryParamObject}`;
    copyToClipboard(fullUrl);

    // TODO: notify user that a shareable link is copied to clipboard
  };

  return (
    <ToolbarButton
      className="graphiql-un-styled graphiql-toolbar-button"
      onClick={generateShareLink}
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
 * Compresses and encodes a query parameter object for use in a shareable URL.
 * 
 * @param {Object} obj The object containing query parameters to be compressed and encoded.
 * @returns {string} A compressed and encoded string representing the query parameters.
 */
function getHashedQueryParams(obj) {
  if (typeof obj !== 'object' || obj === null) {
    console.error('Input must be a non-null object');
    return '';
  }
  try {
    const queryParamString = JSON.stringify(obj);
    return LZString.compressToEncodedURIComponent(queryParamString);
  } catch (error) {
    console.error('Failed to compress query parameter object:', error);
    return '';
  }
}
