import { registerPlugin } from 'wpgraphql-ide';
import {addAction, addFilter} from '@wordpress/hooks';
import { explorerPlugin } from "@graphiql/plugin-explorer";

import { Icon, pencil } from '@wordpress/icons';
import { QueryComposer } from './components/QueryComposer'

// const queryComposerFake = () => {
// 	return {
// 		title: 'Query Composer Fake',
// 		icon: () => (
// 			<Icon
// 				icon={ pencil }
// 				style={ {
// 					fill: 'hsla(var(--color-neutral), var(--alpha-tertiary))',
// 				} }
// 			/>
// 		),
// 		content: () => <QueryComposer />
// 	};
// }
//
// registerPlugin( 'queryComposerFake', queryComposerFake );

// addAction( 'wpgraphqlide_rendered', 'wpgraphql-ide-query-composer',() => {
// 	console.log({
// 		wpgraphqlide_rendered: true
// 	})
// 	registerPlugin( 'queryComposer', explorerPlugin() );
// });

const explorer = explorerPlugin();
registerPlugin( 'queryComposer', explorer );



// addFilter( 'wpgraphqlide_plugins', 'wpgraphql-ide-query-composer', (plugins) => {
// 	const explorer = explorerPlugin();
// 	console.log( { pluginsBefore: plugins })
// 	if ( ! plugins.includes( explorer ) ) {
// 		plugins.push(explorer)
// 		console.log({pluginsAfter: plugins})
// 	}
// 	return plugins;
// })


