import { registerPlugin } from 'wpgraphql-ide';
import { addAction } from '@wordpress/hooks';
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

addAction( 'wpgraphqlide_rendered', 'wpgraphql-ide-query-composer',() => {
	console.log({
		wpgraphqlide_rendered: true
	})
	registerPlugin( 'queryComposer', explorerPlugin() );
});


