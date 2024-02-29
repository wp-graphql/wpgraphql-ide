import React from 'react';
import {
	ToolbarButton,
	PrettifyIcon,
	usePrettifyEditors,
} from '@graphiql/react';

export const PrettifyButton = ( { onClick } ) => {
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
