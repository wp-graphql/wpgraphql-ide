import {
	KeyboardShortcutIcon,
	ReloadIcon,
	SettingsIcon,
	Tooltip,
	UnStyledButton
} from "@graphiql/react";
import React from 'react';
import {ActivityBarUtilities} from "./ActivityBarUtilities";
import {ActivityBarPlugins} from "./ActivityBarPlugins";

export const ActivityBar = ({ pluginContext, handlePluginClick, schemaContext, handleRefetchSchema, handleShowDialog }) => {
	return (
		<div className="graphiql-sidebar graphiql-activity-bar">
			<ActivityBarPlugins pluginContext={pluginContext} handlePluginClick={handlePluginClick} />
			<ActivityBarUtilities
				handleShowDialog={handleShowDialog}
				handleRefetchSchema={handleRefetchSchema}
				schemaContext={schemaContext}
			/>
		</div>
	)
}
