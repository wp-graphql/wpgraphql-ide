import { useSelect } from '@wordpress/data';
import { Suspense, lazy } from '@wordpress/element';

export const QueryComposer = () => {

	const schema = useSelect( ( select ) =>
		select( 'wpgraphql-ide/app' ).schema()
	);

	const query = useSelect( ( select ) =>
		select( 'wpgraphql-ide/app' ).getQuery()
	);

	const Explorer = lazy(() => import('./Explorer'));

	console.log( {
		queryComposer: {
			WPGraphQLIDE: window.WPGraphQLIDE
		}
	})

	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<Explorer
					schema={ schema }
					query={ query }
				/>
			</Suspense>
			{/*<pre>{JSON.stringify( window.WPGraphQLIDE, null, 2 )}</pre>*/}
		</>
	);
}
