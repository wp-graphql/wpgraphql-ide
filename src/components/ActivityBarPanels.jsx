import { ToolbarButton, Tooltip, UnStyledButton } from '@graphiql/react';
import React from 'react';
import { useSelect } from '@wordpress/data';
import clsx from 'clsx';

export const ActivityBarPanels = ( { pluginContext, handlePluginClick } ) => {
	const panels = useSelect( ( select ) =>
		select( 'wpgraphql-ide/activity-bar' ).panels()
	);

	return panels ? (
		<div className="graphiql-sidebar-section graphiql-activity-bar-plugins">
			{ Object.entries( panels ).map( ( [ key, panel ] ) => {
				const props = panel.config();
				const panelName = panels[ key ].name ?? key;

				if ( ! isValidPanel( props, panelName ) ) {
					return null;
				}

				const baseClassName = `graphiql-${ panelName }-button`;

				// Merge the base className with any classNames provided in props.
				const mergedClassName = clsx( baseClassName, props?.className );

				// If a component is provided, use it, otherwise use the default ToolbarButton
				const Component = props.component || ToolbarButton;
				return (
					<Component
						{ ...props }
						className={ mergedClassName } // mergedClassName must be below { ...props } in order to render with the correct classNames
						key={ key }
					/>
				);
			} ) }
		</div>
	) : null;

	// return (
	// 	<div className="graphiql-sidebar-section graphiql-activity-bar-plugins">
	// 		{ pluginContext?.plugins.map( ( plugin, index ) => {
	// 			const isVisible = plugin === pluginContext.visiblePlugin;
	// 			const label = `${ isVisible ? 'Hide' : 'Show' } ${
	// 				plugin.title
	// 			}`;
	// 			const Icon = plugin.icon;
	// 			return (
	// 				<Tooltip key={ plugin.title } label={ label }>
	// 					<UnStyledButton
	// 						type="button"
	// 						className={ isVisible ? 'active' : '' }
	// 						onClick={ handlePluginClick }
	// 						data-index={ index }
	// 						aria-label={ label }
	// 					>
	// 						<Icon aria-hidden="true" />
	// 					</UnStyledButton>
	// 				</Tooltip>
	// 			);
	// 		} ) }
	// 	</div>
	// );
};

const isValidPanel = ( config, name ) => {
	let hasError = false;
	if ( undefined === config.label ) {
		console.warn( `Panel "${ name }" needs a "label" defined`, {
			config,
		} );
		hasError = true;
	}
	if ( undefined === config.button ) {
		console.warn( `Panel "${ name }" needs "button" defined`, {
			config,
		} );
		hasError = true;
	}
	if ( undefined === config.content ) {
		console.warn( `Panel "${ name }" needs "content" defined`, {
			config,
		} );
		hasError = true;
	}

	if ( hasError ) {
		return false;
	}

	return true;
};
