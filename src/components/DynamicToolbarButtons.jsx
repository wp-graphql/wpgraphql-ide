import React from 'react';
import { useSelect } from '@wordpress/data';

export const DynamicToolbarButtons = ( {
	isAuthenticated,
	toggleAuthentication,
} ) => {
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
					<ButtonComponent
						key={ key }
						isAuthenticated={ isAuthenticated }
						toggleAuthentication={ toggleAuthentication }
					/>
				);
			} ) }
		</>
	);
};
