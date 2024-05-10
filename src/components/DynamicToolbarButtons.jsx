import React from 'react';
import { useSelect } from '@wordpress/data';
import { ToolbarButton } from '@graphiql/react';

export const DynamicToolbarButtons = () => {
	const buttons = useSelect( ( select ) =>
		select( 'wpgraphql-ide/editor-toolbar' ).buttons()
	);

	return (
		<>
			{ Object.entries( buttons ).map( ( [ key, ButtonComponent ] ) => {
				if (
					typeof ButtonComponent !== 'function' &&
					typeof ButtonComponent !== 'object'
				) {
					console.error( `Invalid component for key: ${ key }` );
					return null;
				}

				return (
					<>
						<ButtonComponent.component
							key={ key }
							ToolbarButton={ ToolbarButton }
						/>
					</>
				);
			} ) }
		</>
	);
};
