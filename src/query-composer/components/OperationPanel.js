import {GraphQLObjectType} from "graphql";
import {RootView} from "./RootView";

export const OperationPanel = ({ index, operationName, operationType, relevantOperations, schema, operation, queryFields, mutationFields, subscriptionFields, getDefaultFieldNames, getDefaultScalarArgValue }) => {

	const fragmentType =
		operation.kind === "FragmentDefinition" &&
		operation.typeCondition.kind === "NamedType" &&
		schema.getType(operation.typeCondition.name.value);

	const fragmentFields = fragmentType instanceof GraphQLObjectType ? fragmentType.getFields() : {};

	const fields =
		operationType === "query"
			? queryFields
			: operationType === "mutation"
				? mutationFields
				: operationType === "subscription"
					? subscriptionFields
					: operation.kind === "FragmentDefinition"
						? fragmentFields
						: null;

	const fragmentTypeName =
		operation.kind === "FragmentDefinition"
			? operation.typeCondition.name.value
			: null;

	const availableFragments = relevantOperations.reduce((acc, operation) => {
		if (operation.kind === "FragmentDefinition") {
			const fragmentTypeName = operation.typeCondition.name.value;
			const existingFragmentsForType = acc[fragmentTypeName] || [];
			const newFragmentsForType = [
				...existingFragmentsForType,
				operation,
			].sort((a, b) => a.name.value.localeCompare(b.name.value));
			return {
				...acc,
				[fragmentTypeName]: newFragmentsForType,
			};
		}

		return acc;
	}, {});

	return (
		<RootView
			key={index}
			index={index}
			isLast={index === relevantOperations.length - 1}
			fields={fields}
			operationName={operationName}
			operationType={operationType}
			fragmentTypeName={fragmentTypeName}
			definition={operation}
			schema={schema}
			getDefaultFieldNames={getDefaultFieldNames}
			getDefaultScalarArgValue={getDefaultScalarArgValue}
			availableFragments={availableFragments}
		/>
	);

}
