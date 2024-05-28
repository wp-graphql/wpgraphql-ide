/**
 * External dependencies
 */
import { explorerPlugin } from '@graphiql/plugin-explorer';
import { addAction } from '@wordpress/hooks';
import {QueryComposer} from "./components/QueryComposer";

addAction( 'wpgraphqlide_rendered', 'third-party', () => {
	if ( ! window.WPGraphQLIDE || ! window.WPGraphQLIDE.GraphQL ) {
		return;
	}
	console.log({
		message: 'Third Party Plugin Loaded',
		WPGraphQL: window.WPGraphQLIDE || null,
	})
	const { registerActivityBarPanel } = window.WPGraphQLIDE || {};

	if ( typeof registerActivityBarPanel === 'function' ) {

		registerActivityBarPanel( 'query-composer', () => {
			return {
				title: 'Query Composer',
				icon: () => <>Query Composer</>,
				content: () => (
					<section aria-label="Query Composer" className="graphiql-query-composer">
						<QueryComposer/>
					</section>
				)
			};
		}, 4 );

		// registerActivityBarPanel( 'explorer', explorerPlugin, 4 );
	} else {
		console.log( 'CANNOT Registering Mock Explorer Panel' );
	}
} );

console.log( {
	message: 'Third Party Plugin Loaded',
	WPGraphQL: window.WPGraphQLIDE || null,
})

// return;
//

// const mockExplorerPanel = () => {
// 	return {
// 		title: 'Mock Explorer',
// 		icon: 'icon',
// 		content: () => (
// 			<>
// 				<h2>Test</h2>
// 			</>
// 		),
// 	};
// };
//
// /**
//  * Ensure the code only runs once WPGraphQLIDEReady is fired and registerActivityBarPanel is defined.
//  */



