import {defaultGetDefaultFieldNames, defaultGetDefaultScalarArgValue, memoizeParseQuery, DEFAULT_DOCUMENT} from "../utils/utils";
import { useRef } from '@wordpress/element';
import {Panel, PanelBody, PanelRow} from '@wordpress/components';
import {OperationPanel} from "./OperationPanel";

export const QueryBuilder = (props) => {

	const { schema, query } = props;
	const queryType = schema.getQueryType();
	const mutationType = schema.getMutationType();
	const subscriptionType = schema.getSubscriptionType();

	let container = useRef(null);

	if ( ! queryType && ! mutationType && ! subscriptionType ) {
		return (
			<div className="error-container">
				No Query Type Found
			</div>
		);
	}

	const queryFields = queryType ? queryType.getFields() : {};
	const mutationFields = mutationType ? mutationType.getFields() : {};
	const subscriptionFields = subscriptionType ? subscriptionType.getFields() : {};

	const getDefaultFieldNames =
		props.getDefaultFieldNames || defaultGetDefaultFieldNames;

	const getDefaultScalarArgValue =
		props.getDefaultScalarArgValue || defaultGetDefaultScalarArgValue;

	const parsedQuery = memoizeParseQuery(query);
	const definitions = parsedQuery.definitions;

	const _relevantOperations = definitions
		.map((definition) => {
			if (definition.kind === "FragmentDefinition") {
				return definition;
			} else if (definition.kind === "OperationDefinition") {
				return definition;
			} else {
				return null;
			}
		})
		.filter(Boolean);

	const relevantOperations =
		// If we don't have any relevant definitions from the parsed document,
		// then at least show an expanded Query selection
		_relevantOperations.length === 0
			? DEFAULT_DOCUMENT.definitions
			: _relevantOperations;

	return (
		<Panel className="query-composer-operations-panel" header="Operations" ref={(node) => { container = node }}>
			{relevantOperations.map((operation, index) => {
				const operationType =
					operation.kind === "FragmentDefinition"
						? "fragment"
						: (operation && operation.operation) || "query";
				const operationName = operation.name && operation.name.value || `Untitled ${operationType}`;

				return (
					<PanelBody key={index} className="query-composer-operation" title={operationName}>
						<PanelRow>
							<OperationPanel
								schema={schema}
								operation={operation}
								queryFields={queryFields}
								mutationFields={mutationFields}
								subscriptionFields={subscriptionFields}
								getDefaultFieldNames={getDefaultFieldNames}
								getDefaultScalarArgValue={getDefaultScalarArgValue}
								key={index}
								relevantOperations={relevantOperations}
								operationName={operationName}
								operationType={operationType}
							/>
						</PanelRow>
					</PanelBody>
				)
			})}

			{/*<PanelBody title="Parsed Query...">*/}
			{/*	<PanelRow>*/}
			{/*		{JSON.stringify(parsedQuery, null, 2)}*/}
			{/*	</PanelRow>*/}
			{/*</PanelBody>*/}
		</Panel>
	)
}
