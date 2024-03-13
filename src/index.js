/* global WPGRAPHQL_IDE_DATA */
import { createHooks } from '@wordpress/hooks';
import { register, dispatch } from '@wordpress/data';
import { store } from './store';

// import * as GraphiQLReact from '@graphiql/react';

// console.log( {
// 	GraphiQL
// })

// import {
// 	EditorContext,
// 	EditorContextProvider,
// 	useEditorContext,
// } from '@graphiql/react/src/editor/index.ts';
//
// import {
// 	ExecutionContext,
// 	ExecutionContextProvider,
// 	useExecutionContext,
// } from '@graphiql/react/src/execution/index.ts';
//
// import {
// 	HistoryContext,
// 	HistoryContextProvider,
// 	useHistoryContext,
// } from '@graphiql/react/src/history/index.ts';
//
// import {
// 	PluginContext,
// 	PluginContextProvider,
// 	usePluginContext,
// } from '@graphiql/react/src/plugin/index.ts';
//
// import {
// 	SchemaContext,
// 	SchemaContextProvider,
// 	useSchemaContext,
// } from '@graphiql/react/src/schema/index.ts';
//
// import {
// 	StorageContext,
// 	StorageContextProvider,
// 	useStorageContext,
// } from '@graphiql/react/src/storage/index.ts';
//
// const GraphiQLReact = {
// 	EditorContext,
// 	EditorContextProvider,
// 	useEditorContext,
// 	ExecutionContext,
// 	ExecutionContextProvider,
// 	useExecutionContext,
// 	HistoryContext,
// 	HistoryContextProvider,
// 	useHistoryContext,
// 	PluginContext,
// 	PluginContextProvider,
// 	usePluginContext,
// 	SchemaContext,
// 	SchemaContextProvider,
// 	useSchemaContext,
// 	StorageContext,
// 	StorageContextProvider,
// 	useStorageContext,
// }

/**
 * Register the store to wp.data for use throughout the plugin and extending plugins
 */
register( store );

/**
 * Registers a plugin to the WPGraphQL IDE
 *
 * @param string name The name of the plugin to register
 * @param object config The config array to define the plugin
 * @param name
 * @param config
 */
const registerPlugin = ( name, config ) => {
	dispatch( store ).registerPlugin( name, config );
};

export const hooks = createHooks();

// Expose WPGraphQLIDE as a global variable.
// This allows plugins to be enqueued as external JS
// and make use of functions provided by the IDE.
window.WPGraphQLIDE = {
	registerPlugin,
	hooks,
	store
};
