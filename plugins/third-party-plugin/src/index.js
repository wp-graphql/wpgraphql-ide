/**
 * External dependencies
 */
import { explorerPlugin } from '@graphiql/plugin-explorer';
import { addAction } from '@wordpress/hooks';
import {QueryComposer} from "./components/QueryComposer";

console.log( 'Third Party Plugin loading...' );

window.addEventListener('WPGraphQLIDE_Window_Ready', function(event) {
	console.log( 'Third Party Plugin Loaded' );

	if ( ! window.WPGraphQLIDE.GraphQL ) {
		console.log( `GraphQL Library not loaded` );
		console.log( window?.WPGraphQLIDE );
		return;
	}

	const { registerActivityBarPanel } = window.WPGraphQLIDE || {};

	if ( typeof registerActivityBarPanel === 'function' ) {

		console.log( `Registering Mock Explorer Panel`);

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

	// Perform your desired actions here
});







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



