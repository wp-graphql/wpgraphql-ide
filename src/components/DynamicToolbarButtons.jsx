import React from 'react';
import { useSelect } from '@wordpress/data';
import { ToolbarButton } from '@graphiql/react';

export const DynamicToolbarButtons = () => {
	const buttons = useSelect( ( select ) =>
		select( 'wpgraphql-ide/editor-toolbar' ).buttons()
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
