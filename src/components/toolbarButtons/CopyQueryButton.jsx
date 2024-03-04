import React from 'react';
import { ToolbarButton, useCopyQuery, CopyIcon } from '@graphiql/react';

export const CopyQueryButton = ( { onCopyQuery } ) => {
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
