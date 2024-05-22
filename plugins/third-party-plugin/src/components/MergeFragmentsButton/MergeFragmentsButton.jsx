import React from 'react';
import { useMergeQuery, MergeIcon } from '@graphiql/react';

export const MergeFragmentsButton = ( { ToolbarButton } ) => {
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
