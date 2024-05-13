import React from 'react';
import { useSelect } from '@wordpress/data';
import { ToolbarButton } from '@graphiql/react';

export const EditorToolbar = () => {
	const buttons = useSelect( ( select ) =>
		select( 'wpgraphql-ide/document-editor' ).buttons()
	);

	return (
		<>
			{ Object.entries( buttons ).map( ( [ key, config ] ) => {
				const props = config();

				// If a component is provided, use it, otherwise use the default ToolbarButton
				const Component = props.component || ToolbarButton;
				return <Component key={ key } { ...props } />;
			} ) }
		</>
	);
};
