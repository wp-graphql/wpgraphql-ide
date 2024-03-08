import { registerPlugin } from 'wpgraphql-ide';
import {addAction, addFilter} from '@wordpress/hooks';
import { explorerPlugin } from "@graphiql/plugin-explorer";

import { Icon, pencil } from '@wordpress/icons';
import { QueryComposer } from './components/QueryComposer'


// registerPlugin( 'queryComposer', {
// 	title: 'Query Composer',
// 	icon: () => (
// 		<Icon
// 			icon={ pencil }
// 			style={ {
// 				fill: 'hsla(var(--color-neutral), var(--alpha-tertiary))',
// 			} }
// 		/>
// 	),
// 	content: () => <QueryComposer />
// } );

// addAction( 'wpgraphqlide_rendered', 'wpgraphql-ide-query-composer',() => {
// 	console.log({
// 		wpgraphqlide_rendered: true
// 	})
// 	registerPlugin( 'queryComposer', explorerPlugin() );
// });



addFilter( 'wpgraphqlide_plugins', 'wpgraphql-ide-query-composer', (plugins) => {
	const explorer = explorerPlugin();
	console.log( { pluginsBefore: plugins })
	if ( ! plugins.includes( explorer ) ) {
		plugins.push(explorer)
		console.log({pluginsAfter: plugins})
	}
	return plugins;
})


