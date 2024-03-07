import { registerPlugin } from 'wpgraphql-ide';
import { explorerPlugin } from "@graphiql/plugin-explorer";
import { Icon, pencil } from '@wordpress/icons';
import { QueryComposer } from './components/QueryComposer'


registerPlugin( 'queryComposer', {
	title: 'Query Composer',
	icon: () => (
		<Icon
			icon={ pencil }
			style={ {
				fill: 'hsla(var(--color-neutral), var(--alpha-tertiary))',
			} }
		/>
	),
	content: () => <QueryComposer />
} );

