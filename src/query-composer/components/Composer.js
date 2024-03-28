import {useOperationsEditorState, useOptimisticState, useSchemaContext} from "@graphiql/react";
import {QueryBuilder} from "./QueryBuilder";

/**
 * This is the wrapping component around the GraphiQL Explorer / Query Builder
 *
 * This provides the wrapping markup and sets up the initial visible state
 *
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
const Wrapper = ({ children }) => {
	return (
		<div className="query-composer-wrap">
			<div className="query-composer-title-bar">
				<div className="query-composer-title">Query Composer</div>
			</div>
			<div className="query-composer-contents">
				{children}
			</div>
		</div>
	);
};

export const Composer = (props) => {

	const { schema } = useSchemaContext();
	const [operationsString, handleEditOperations] = useOptimisticState(
		useOperationsEditorState(),
	);

	if ( ! schema ) {
		return (
			<Wrapper>
				<div className="error-container">
					No Schema Available
				</div>
			</Wrapper>
		);
	}

	return (
		<Wrapper>
			<QueryBuilder
				query={operationsString}
				schema={schema}
			/>
		</Wrapper>
	)
}
