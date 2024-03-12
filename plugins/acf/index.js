import {useDispatch, useSelect} from '@wordpress/data';
import { registerPlugin, GraphQL } from 'wpgraphql-ide';
const { GraphQLObjectType, GraphQLString, GraphQLSchema, isInterfaceType, GraphQLScalarType } = GraphQL;

/**
 * Checks if a given type implements the Connection interface.
 * @param {GraphQLType} type - The GraphQL type to check.
 * @param {GraphQLSchema} schema - The GraphQL schema.
 * @returns {boolean} True if the type implements Connection, false otherwise.
 */
function isConnectionType(type, schema ) {
	// Assuming "Connection" is an interface in your schema, adjust as necessary
	if (!isInterfaceType(type)) return false;
	// This part is tricky without direct API support; it assumes we can check interfaces directly
	// Let's simulate the interface check
	const connectionInterface = schema.getType( 'Connection' );

	return type.getInterfaces && type.getInterfaces().includes(connectionInterface);
}

/**
 * Generates a GraphQL fragment for a given object type with all non-deprecated fields.
 * Uses the interface implementation to determine if a field is a connection.
 * @param {String} typeName - The name of the GraphQL object type.
 * @param {GraphQLSchema} schema - The GraphQL schema.
 * @returns {DocumentNode} The GraphQL fragment.
 */
function generateFragmentForType(typeName, schema) {
	const type = schema.getType(typeName);

	if (!type) {
		throw new Error(`Type ${typeName} not found in schema.`);
	}

	const fields = Object.entries(type.getFields()).filter(
		([, field]) => !field.isDeprecated && field.type
	);

	const fragmentParts = fields.map(([fieldName, field]) => {
		const fieldType = schema.getType(field.type.name);
		console.log( {
			field,
			fieldKind: field.type.kind,
		})
		if ( field.type instanceof GraphQLScalarType ) {
			return fieldName;
		} else if (fieldType && isConnectionType(fieldType, schema)) {
			return `${fieldName} { nodes { id, __typename } }`;
		} else {
			return `${fieldName} { __typename }`;
		}
	});

	const fragmentBody = fragmentParts.join('\n  ');
	const fragment = `
    fragment ${typeName}Fragment on ${typeName} {
      ${fragmentBody}
    }
  `;

	return fragment;
}

registerPlugin( 'acf', {
	title: 'ACF',
	icon: () => (
		<h3 style={ {
			color: `hsla(var(--color-neutral), 1)`,
			fontFamily: `var(--font-family)`,
			fontSize: `var(--font-size-h5)`,
		} } >ACF</h3>
	),
	content: () => {
		const schema = useSelect( ( select ) => {
			return select( 'wpgraphql-ide' ).getSchema();
		} );

		const { setQuery } = useDispatch( 'wpgraphql-ide' );

		return (
			<div>
				<h2 style={ {
					color: `hsla(var(--color-neutral), 1)`,
					fontFamily: `var(--font-family)`,
					fontSize: `var(--font-size-h2)`,
				} }>ACF</h2>

				{schema?._implementationsMap?.AcfFieldGroup?.objects && Object.values(schema?._implementationsMap?.AcfFieldGroup?.objects).map((fieldGroupType, i) => {
					return (
						<div key={i} onClick={() => {
							const fragment = generateFragmentForType(fieldGroupType, schema);
							console.log( { fragment });
							setQuery(fragment)
						}}>
							<div
								className="wpgraphql-ide-acf-field-group-type"
								style={ {
									color: `hsla(var(--color-neutral), 1)`,
									fontFamily: `var(--font-family)`,
									fontSize: `var(--font-size-h4)`,
								} }
							>{fieldGroupType.name}</div>
							{/*<pre>{JSON.stringify(fieldGroupType, null, 2)}</pre>*/}
						</div>
					);
				})}


				{/*<pre>{ JSON.stringify( schema?._implementationsMap?.AcfFieldGroup?.objects, null, 2 ) }</pre>*/}
			</div>
		);
	}
});
