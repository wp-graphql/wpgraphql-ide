import { ToolbarButton, Tooltip, UnStyledButton } from '@graphiql/react';
import React from 'react';
import { useSelect } from '@wordpress/data';
import clsx from 'clsx';

export const ActivityBarPlugins = ( { pluginContext, handlePluginClick } ) => {
	const pluginButtons = useSelect( ( select ) =>
		select( 'wpgraphql-ide/activity-bar' ).pluginButtons()
	);

	console.log( {
		pluginButtons,
		plugins: pluginContext?.plugins,
	} );

	return pluginButtons ? (
		<div className="graphiql-sidebar-section graphiql-activity-bar-plugins">
			{ Object.entries( pluginButtons ).map( ( [ key, button ] ) => {
				const props = button.config();
				const buttonName = pluginButtons[ key ].name ?? key;

				if ( ! isValidButton( props, buttonName ) ) {
					return null;
				}

				const baseClassName = `graphiql-${ buttonName }-button`;

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

const isValidButton = ( config, name ) => {
	let hasError = false;
	if ( undefined === config.label ) {
		console.warn( `Button "${ name }" needs a "label" defined`, {
			config,
		} );
		hasError = true;
	}
	if ( undefined === config.children ) {
		console.warn( `Button "${ name }" needs "children" defined`, {
			config,
		} );
		hasError = true;
	}
	if ( undefined === config.onClick ) {
		console.warn( `Button "${ name }" needs "onClick" defined`, {
			config,
		} );
		hasError = true;
	}

	if ( hasError ) {
		return false;
	}

	return true;
};
