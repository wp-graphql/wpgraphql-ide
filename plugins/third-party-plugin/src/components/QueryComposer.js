import { useSelect } from '@wordpress/data';
import Explorer from './Explorer'

export const QueryComposer = () => {

	const schema = useSelect( ( select ) =>
		select( 'wpgraphql-ide/app' ).schema()
	);

	const query = useSelect( ( select ) =>
		select( 'wpgraphql-ide/app' ).getQuery()
	);

	return (
		<>
			Query Composer...
			<Explorer
				schema={ schema }
				query={ query }
			/>
		</>
	);
}
