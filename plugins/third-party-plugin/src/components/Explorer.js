import React from 'react';

import {
	getNamedType,
	GraphQLObjectType,
	isEnumType,
	isInputObjectType,
	isInterfaceType,
	isLeafType,
	isNonNullType,
	isObjectType,
	isRequiredInputField,
	isScalarType,
	isUnionType,
	isWrappingType,
	parse,
	print,
	parseType,
	visit,
} from 'graphql';

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const defaultColors = {
	keyword: '#B11A04',
	def: '#D2054E',
	property: '#1F61A0',
	qualifier: '#1C92A9',
	attribute: '#8B2BB9',
	number: '#2882F9',
	string: '#D64292',
	builtin: '#D47509',
	string2: '#0B7FC7',
	variable: '#397D13',
	atom: '#CA9800',
};

const defaultArrowOpen = (
	<svg width="12" height="9">
		<path fill="#666" d="M 0 2 L 9 2 L 4.5 7.5 z" />
	</svg>
);

const defaultArrowClosed = (
	<svg width="12" height="9">
		<path fill="#666" d="M 0 0 L 0 9 L 5.5 4.5 z" />
	</svg>
);

const defaultCheckboxChecked = (
	<svg
		style={{marginRight: '3px', marginLeft: '-3px'}}
		width="12"
		height="12"
		viewBox="0 0 18 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path
			d="M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 16H2V2H16V16ZM14.99 6L13.58 4.58L6.99 11.17L4.41 8.6L2.99 10.01L6.99 14L14.99 6Z"
			fill="#666"
		/>
	</svg>
);

const defaultCheckboxUnchecked = (
	<svg
		style={{marginRight: '3px', marginLeft: '-3px'}}
		width="12"
		height="12"
		viewBox="0 0 18 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path
			d="M16 2V16H2V2H16ZM16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0Z"
			fill="#CCC"
		/>
	</svg>
);

function Checkbox(props) {
	return props.checked
		? props.styleConfig.checkboxChecked
		: props.styleConfig.checkboxUnchecked;
}

export function defaultValue(
	argType,
) {
	if (isEnumType(argType)) {
		return {kind: 'EnumValue', value: argType.getValues()[0].name};
	} else {
		switch (argType.name) {
			case 'String':
				return {kind: 'StringValue', value: ''};
			case 'Float':
				return {kind: 'FloatValue', value: '1.5'};
			case 'Int':
				return {kind: 'IntValue', value: '10'};
			case 'Boolean':
				return {kind: 'BooleanValue', value: false};
			default:
				return {kind: 'StringValue', value: ''};
		}
	}
}

function defaultGetDefaultScalarArgValue(
	parentField,
	arg,
	argType,
) {
	return defaultValue(argType);
}

function defaultGetDefaultFieldNames(type) {
	const fields = type.getFields();

	if (fields['id']) {
		const res = ['id'];
		if (fields['email']) {
			res.push('email');
		} else if (fields['name']) {
			res.push('name');
		}
		return res;
	}

	if (fields['edges']) {
		return ['edges'];
	}

	if (fields['node']) {
		return ['node'];
	}

	if (fields['nodes']) {
		return ['nodes'];
	}

	const leafFieldNames = [];
	Object.keys(fields).forEach(fieldName => {
		if (isLeafType(fields[fieldName].type)) {
			leafFieldNames.push(fieldName);
		}
	});

	if (!leafFieldNames.length) {
		return ['__typename'];
	}
	return leafFieldNames.slice(0, 2);
}

function isRequiredArgument(arg) {
	return isNonNullType(arg.type) && arg.defaultValue === undefined;
}

function unwrapOutputType(outputType) {
	let unwrappedType = outputType;
	while (isWrappingType(unwrappedType)) {
		unwrappedType = unwrappedType.ofType;
	}
	return unwrappedType;
}

function unwrapInputType(inputType) {
	let unwrappedType = inputType;
	while (isWrappingType(unwrappedType)) {
		unwrappedType = unwrappedType.ofType;
	}
	return unwrappedType;
}

function coerceArgValue(argType, value) {
	if (typeof value !== 'string' && value.kind === 'VariableDefinition') {
		return value.variable;
	} else if (isScalarType(argType)) {
		try {
			switch (argType.name) {
				case 'String':
					return {
						kind: 'StringValue',
						value: String(argType.parseValue(value)),
					};
				case 'Float':
					return {
						kind: 'FloatValue',
						value: String(argType.parseValue(parseFloat(value))),
					};
				case 'Int':
					return {
						kind: 'IntValue',
						value: String(argType.parseValue(parseInt(value, 10))),
					};
				case 'Boolean':
					try {
						const parsed = JSON.parse(value);
						if (typeof parsed === 'boolean') {
							return {kind: 'BooleanValue', value: parsed};
						} else {
							return {kind: 'BooleanValue', value: false};
						}
					} catch (e) {
						return {
							kind: 'BooleanValue',
							value: false,
						};
					}
				default:
					return {
						kind: 'StringValue',
						value: String(argType.parseValue(value)),
					};
			}
		} catch (e) {
			console.error('error coercing arg value', e, value);
			return {kind: 'StringValue', value: value};
		}
	} else {
		try {
			const parsedValue = argType.parseValue(value);
			if (parsedValue) {
				return {kind: 'EnumValue', value: String(parsedValue)};
			} else {
				return {kind: 'EnumValue', value: argType.getValues()[0].name};
			}
		} catch (e) {
			return {kind: 'EnumValue', value: argType.getValues()[0].name};
		}
	}
}

class InputArgView extends React.PureComponent {
	_previousArgSelection;
	_getArgSelection = () => {
		return this.props.selection.fields.find(
			field => field.name.value === this.props.arg.name,
		);
	};

	_removeArg = () => {
		const {selection} = this.props;
		const argSelection = this._getArgSelection();
		this._previousArgSelection = argSelection;
		this.props.modifyFields(
			selection.fields.filter(field => field !== argSelection),
			true,
		);
	};

	_addArg = () => {
		const {
			selection,
			arg,
			getDefaultScalarArgValue,
			parentField,
			makeDefaultArg,
		} = this.props;
		const argType = unwrapInputType(arg.type);

		let argSelection = null;
		if (this._previousArgSelection) {
			argSelection = this._previousArgSelection;
		} else if (isInputObjectType(argType)) {
			const fields = argType.getFields();
			argSelection = {
				kind: 'ObjectField',
				name: {kind: 'Name', value: arg.name},
				value: {
					kind: 'ObjectValue',
					fields: defaultInputObjectFields(
						getDefaultScalarArgValue,
						makeDefaultArg,
						parentField,
						Object.keys(fields).map(k => fields[k]),
					),
				},
			};
		} else if (isLeafType(argType)) {
			argSelection = {
				kind: 'ObjectField',
				name: {kind: 'Name', value: arg.name},
				value: getDefaultScalarArgValue(parentField, arg, argType),
			};
		}

		if (!argSelection) {
			console.error('Unable to add arg for argType', argType);
		} else {
			return this.props.modifyFields(
				[...(selection.fields || []), argSelection],
				true,
			);
		}
	};

	_setArgValue = (event, options) => {
		let settingToNull = false;
		let settingToVariable = false;
		let settingToLiteralValue = false;
		try {
			if (event.kind === 'VariableDefinition') {
				settingToVariable = true;
			} else if (event === null || typeof event === 'undefined') {
				settingToNull = true;
			} else if (typeof event.kind === 'string') {
				settingToLiteralValue = true;
			}
		} catch (e) {}

		const {selection} = this.props;

		const argSelection = this._getArgSelection();

		if (!argSelection) {
			console.error('missing arg selection when setting arg value');
			return;
		}
		const argType = unwrapInputType(this.props.arg.type);

		const handleable =
			isLeafType(argType) ||
			settingToVariable ||
			settingToNull ||
			settingToLiteralValue;

		if (!handleable) {
			console.warn(
				'Unable to handle non leaf types in InputArgView.setArgValue',
				event,
			);
			return;
		}
		let targetValue;
		let value;

		if (event === null || typeof event === 'undefined') {
			value = null;
		} else if (
			!event.target &&
			!!event.kind &&
			event.kind === 'VariableDefinition'
		) {
			targetValue = event;
			value = targetValue.variable;
		} else if (typeof event.kind === 'string') {
			value = event;
		} else if (event.target && typeof event.target.value === 'string') {
			targetValue = event.target.value;
			value = coerceArgValue(argType, targetValue);
		}

		const newDoc = this.props.modifyFields(
			(selection.fields || []).map(field => {
				const isTarget = field === argSelection;
				const newField = isTarget
					? {
						...field,
						value: value,
					}
					: field;

				return newField;
			}),
			options,
		);

		return newDoc;
	};

	_modifyChildFields = fields => {
		return this.props.modifyFields(
			this.props.selection.fields.map(field =>
				field.name.value === this.props.arg.name
					? {
						...field,
						value: {
							kind: 'ObjectValue',
							fields: fields,
						},
					}
					: field,
			),
			true,
		);
	};

	render() {
		const {arg, parentField} = this.props;
		const argSelection = this._getArgSelection();

		return (
			<AbstractArgView
				argValue={argSelection ? argSelection.value : null}
				arg={arg}
				parentField={parentField}
				addArg={this._addArg}
				removeArg={this._removeArg}
				setArgFields={this._modifyChildFields}
				setArgValue={this._setArgValue}
				getDefaultScalarArgValue={this.props.getDefaultScalarArgValue}
				makeDefaultArg={this.props.makeDefaultArg}
				onRunOperation={this.props.onRunOperation}
				styleConfig={this.props.styleConfig}
				onCommit={this.props.onCommit}
				definition={this.props.definition}
			/>
		);
	}
}

class ArgView extends React.PureComponent {
	_previousArgSelection;
	_getArgSelection = () => {
		const {selection} = this.props;

		return (selection.arguments || []).find(
			arg => arg.name.value === this.props.arg.name,
		);
	};
	_removeArg = commit => {
		const {selection} = this.props;
		const argSelection = this._getArgSelection();
		this._previousArgSelection = argSelection;
		return this.props.modifyArguments(
			(selection.arguments || []).filter(arg => arg !== argSelection),
			commit,
		);
	};
	_addArg = commit => {
		const {
			selection,
			getDefaultScalarArgValue,
			makeDefaultArg,
			parentField,
			arg,
		} = this.props;
		const argType = unwrapInputType(arg.type);

		let argSelection = null;
		if (this._previousArgSelection) {
			argSelection = this._previousArgSelection;
		} else if (isInputObjectType(argType)) {
			const fields = argType.getFields();
			argSelection = {
				kind: 'Argument',
				name: {kind: 'Name', value: arg.name},
				value: {
					kind: 'ObjectValue',
					fields: defaultInputObjectFields(
						getDefaultScalarArgValue,
						makeDefaultArg,
						parentField,
						Object.keys(fields).map(k => fields[k]),
					),
				},
			};
		} else if (isLeafType(argType)) {
			argSelection = {
				kind: 'Argument',
				name: {kind: 'Name', value: arg.name},
				value: getDefaultScalarArgValue(parentField, arg, argType),
			};
		}

		if (!argSelection) {
			console.error('Unable to add arg for argType', argType);
			return null;
		} else {
			return this.props.modifyArguments(
				[...(selection.arguments || []), argSelection],
				commit,
			);
		}
	};
	_setArgValue = (event, options) => {
		let settingToNull = false;
		let settingToVariable = false;
		let settingToLiteralValue = false;
		try {
			if (event.kind === 'VariableDefinition') {
				settingToVariable = true;
			} else if (event === null || typeof event === 'undefined') {
				settingToNull = true;
			} else if (typeof event.kind === 'string') {
				settingToLiteralValue = true;
			}
		} catch (e) {}
		const {selection} = this.props;
		const argSelection = this._getArgSelection();
		if (!argSelection && !settingToVariable) {
			console.error('missing arg selection when setting arg value');
			return;
		}
		const argType = unwrapInputType(this.props.arg.type);

		const handleable =
			isLeafType(argType) ||
			settingToVariable ||
			settingToNull ||
			settingToLiteralValue;

		if (!handleable) {
			console.warn('Unable to handle non leaf types in ArgView._setArgValue');
			return;
		}

		let targetValue;
		let value;

		if (event === null || typeof event === 'undefined') {
			value = null;
		} else if (event.target && typeof event.target.value === 'string') {
			targetValue = event.target.value;
			value = coerceArgValue(argType, targetValue);
		} else if (!event.target && event.kind === 'VariableDefinition') {
			targetValue = event;
			value = targetValue.variable;
		} else if (typeof event.kind === 'string') {
			value = event;
		}

		return this.props.modifyArguments(
			(selection.arguments || []).map(a =>
				a === argSelection
					? {
						...a,
						value: value,
					}
					: a,
			),
			options,
		);
	};

	_setArgFields = (fields, commit) => {
		const {selection} = this.props;
		const argSelection = this._getArgSelection();
		if (!argSelection) {
			console.error('missing arg selection when setting arg value');
			return;
		}

		return this.props.modifyArguments(
			(selection.arguments || []).map(a =>
				a === argSelection
					? {
						...a,
						value: {
							kind: 'ObjectValue',
							fields,
						},
					}
					: a,
			),
			commit,
		);
	};

	render() {
		const {arg, parentField} = this.props;
		const argSelection = this._getArgSelection();

		return (
			<AbstractArgView
				argValue={argSelection ? argSelection.value : null}
				arg={arg}
				parentField={parentField}
				addArg={this._addArg}
				removeArg={this._removeArg}
				setArgFields={this._setArgFields}
				setArgValue={this._setArgValue}
				getDefaultScalarArgValue={this.props.getDefaultScalarArgValue}
				makeDefaultArg={this.props.makeDefaultArg}
				onRunOperation={this.props.onRunOperation}
				styleConfig={this.props.styleConfig}
				onCommit={this.props.onCommit}
				definition={this.props.definition}
			/>
		);
	}
}

function isRunShortcut(event) {
	return event.ctrlKey && event.key === 'Enter';
}

function canRunOperation(operationName) {
	return operationName !== 'FragmentDefinition';
}

class ScalarInput extends React.PureComponent {
	_ref;
	_handleChange = event => {
		this.props.setArgValue(event, true);
	};

	componentDidMount() {
		const input = this._ref;
		const activeElement = document.activeElement;
		if (
			input &&
			activeElement &&
			!(activeElement instanceof HTMLTextAreaElement)
		) {
			input.focus();
			input.setSelectionRange(0, input.value.length);
		}
	}

	render() {
		const {arg, argValue, styleConfig} = this.props;
		const argType = unwrapInputType(arg.type);
		const value = typeof argValue.value === 'string' ? argValue.value : '';
		const color =
			this.props.argValue.kind === 'StringValue'
				? styleConfig.colors.string
				: styleConfig.colors.number;
		return (
			<span style={{color}}>
        {argType.name === 'String' ? '"' : ''}
				<input
					style={{
						border: 'none',
						borderBottom: '1px solid #888',
						outline: 'none',
						width: `${Math.max(1, Math.min(15, value.length))}ch`,
						color,
					}}
					ref={ref => {
						this._ref = ref;
					}}
					type="text"
					onChange={this._handleChange}
					value={value}
				/>
				{argType.name === 'String' ? '"' : ''}
      </span>
		);
	}
}

class AbstractArgView extends React.PureComponent {
	state = {displayArgActions: false};
	render() {
		const {argValue, arg, styleConfig} = this.props;
		const argType = unwrapInputType(arg.type);

		let input = null;
		if (argValue) {
			if (argValue.kind === 'Variable') {
				input = (
					<span style={{color: styleConfig.colors.variable}}>
            ${argValue.name.value}
          </span>
				);
			} else if (isScalarType(argType)) {
				if (argType.name === 'Boolean') {
					input = (
						<select
							style={{
								color: styleConfig.colors.builtin,
							}}
							onChange={this.props.setArgValue}
							value={
								argValue.kind === 'BooleanValue' ? argValue.value : undefined
							}>
							<option key="true" value="true">
								true
							</option>
							<option key="false" value="false">
								false
							</option>
						</select>
					);
				} else {
					input = (
						<ScalarInput
							setArgValue={this.props.setArgValue}
							arg={arg}
							argValue={argValue}
							onRunOperation={this.props.onRunOperation}
							styleConfig={this.props.styleConfig}
						/>
					);
				}
			} else if (isEnumType(argType)) {
				if (argValue.kind === 'EnumValue') {
					input = (
						<select
							style={{
								backgroundColor: 'white',
								color: styleConfig.colors.string2,
							}}
							onChange={this.props.setArgValue}
							value={argValue.value}>
							{argType.getValues().map(value => (
								<option key={value.name} value={value.name}>
									{value.name}
								</option>
							))}
						</select>
					);
				} else {
					console.error(
						'arg mismatch between arg and selection',
						argType,
						argValue,
					);
				}
			} else if (isInputObjectType(argType)) {
				if (argValue.kind === 'ObjectValue') {
					const fields = argType.getFields();
					input = (
						<div style={{marginLeft: 16}}>
							{Object.keys(fields)
								.sort()
								.map(fieldName => (
									<InputArgView
										key={fieldName}
										arg={fields[fieldName]}
										parentField={this.props.parentField}
										selection={argValue}
										modifyFields={this.props.setArgFields}
										getDefaultScalarArgValue={
											this.props.getDefaultScalarArgValue
										}
										makeDefaultArg={this.props.makeDefaultArg}
										onRunOperation={this.props.onRunOperation}
										styleConfig={this.props.styleConfig}
										onCommit={this.props.onCommit}
										definition={this.props.definition}
									/>
								))}
						</div>
					);
				} else {
					console.error(
						'arg mismatch between arg and selection',
						argType,
						argValue,
					);
				}
			}
		}

		const variablize = () => {
			const baseVariableName = arg.name;
			const conflictingNameCount = (
				this.props.definition.variableDefinitions || []
			).filter(varDef =>
				varDef.variable.name.value.startsWith(baseVariableName),
			).length;

			let variableName;
			if (conflictingNameCount > 0) {
				variableName = `${baseVariableName}${conflictingNameCount}`;
			} else {
				variableName = baseVariableName;
			}
			const argPrintedType = arg.type.toString();
			const argType = parseType(argPrintedType);

			const base = {
				kind: 'VariableDefinition',
				variable: {
					kind: 'Variable',
					name: {
						kind: 'Name',
						value: variableName,
					},
				},
				type: argType,
				directives: [],
			};

			const variableDefinitionByName = name =>
				(this.props.definition.variableDefinitions || []).find(
					varDef => varDef.variable.name.value === name,
				);

			let variable;

			let subVariableUsageCountByName = {};

			if (typeof argValue !== 'undefined' && argValue !== null) {
				const cleanedDefaultValue = visit(argValue, {
					Variable(node) {
						const varName = node.name.value;
						const varDef = variableDefinitionByName(varName);

						subVariableUsageCountByName[varName] =
							subVariableUsageCountByName[varName] + 1 || 1;

						if (!varDef) {
							return;
						}

						return varDef.defaultValue;
					},
				});

				const isNonNullable = base.type.kind === 'NonNullType';

				const unwrappedBase = isNonNullable
					? {...base, type: base.type.type}
					: base;

				variable = {...unwrappedBase, defaultValue: cleanedDefaultValue};
			} else {
				variable = base;
			}

			const newlyUnusedVariables = Object.entries(subVariableUsageCountByName)
				.filter(([_, usageCount]) => usageCount < 2)
				.map(([varName, _]) => varName);

			if (variable) {
				const newDoc = this.props.setArgValue(variable, false);

				if (newDoc) {
					const targetOperation = newDoc.definitions.find(definition => {
						if (
							!!definition.operation &&
							!!definition.name &&
							!!definition.name.value &&
							!!this.props.definition.name &&
							!!this.props.definition.name.value
						) {
							return definition.name.value === this.props.definition.name.value;
						} else {
							return false;
						}
					});

					const newVariableDefinitions = [
						...(targetOperation.variableDefinitions || []),
						variable,
					].filter(
						varDef =>
							newlyUnusedVariables.indexOf(varDef.variable.name.value) === -1,
					);

					const newOperation = {
						...targetOperation,
						variableDefinitions: newVariableDefinitions,
					};

					const existingDefs = newDoc.definitions;

					const newDefinitions = existingDefs.map(existingOperation => {
						if (targetOperation === existingOperation) {
							return newOperation;
						} else {
							return existingOperation;
						}
					});

					const finalDoc = {
						...newDoc,
						definitions: newDefinitions,
					};

					this.props.onCommit(finalDoc);
				}
			}
		};

		const devariablize = () => {
			if (!argValue || !argValue.name || !argValue.name.value) {
				return;
			}

			const variableName = argValue.name.value;
			const variableDefinition = (
				this.props.definition.variableDefinitions || []
			).find(varDef => varDef.variable.name.value === variableName);

			if (!variableDefinition) {
				return;
			}

			const defaultValue = variableDefinition.defaultValue;

			const newDoc = this.props.setArgValue(defaultValue, {
				commit: false,
			});

			if (newDoc) {
				const targetOperation = newDoc.definitions.find(
					definition =>
						definition.name.value === this.props.definition.name.value,
				);

				if (!targetOperation) {
					return;
				}

				let variableUseCount = 0;

				visit(targetOperation, {
					Variable(node) {
						if (node.name.value === variableName) {
							variableUseCount = variableUseCount + 1;
						}
					},
				});

				let newVariableDefinitions = targetOperation.variableDefinitions || [];

				if (variableUseCount < 2) {
					newVariableDefinitions = newVariableDefinitions.filter(
						varDef => varDef.variable.name.value !== variableName,
					);
				}

				const newOperation = {
					...targetOperation,
					variableDefinitions: newVariableDefinitions,
				};

				const existingDefs = newDoc.definitions;

				const newDefinitions = existingDefs.map(existingOperation => {
					if (targetOperation === existingOperation) {
						return newOperation;
					} else {
						return existingOperation;
					}
				});

				const finalDoc = {
					...newDoc,
					definitions: newDefinitions,
				};

				this.props.onCommit(finalDoc);
			}
		};

		const isArgValueVariable = argValue && argValue.kind === 'Variable';

		const variablizeActionButton = !this.state.displayArgActions ? null : (
			<button
				type="submit"
				className="toolbar-button"
				title={
					isArgValueVariable
						? 'Remove the variable'
						: 'Extract the current value into a GraphQL variable'
				}
				onClick={event => {
					event.preventDefault();
					event.stopPropagation();

					if (isArgValueVariable) {
						devariablize();
					} else {
						variablize();
					}
				}}
				style={styleConfig.styles.actionButtonStyle}>
				<span style={{color: styleConfig.colors.variable}}>{'$'}</span>
			</button>
		);

		return (
			<div
				style={{
					cursor: 'pointer',
					minHeight: '16px',
					WebkitUserSelect: 'none',
					userSelect: 'none',
				}}
				data-arg-name={arg.name}
				data-arg-type={argType.name}
				className={`graphiql-explorer-${arg.name}`}>
        <span
			style={{cursor: 'pointer'}}
			onClick={event => {
				const shouldAdd = !argValue;
				if (shouldAdd) {
					this.props.addArg(true);
				} else {
					this.props.removeArg(true);
				}
				this.setState({displayArgActions: shouldAdd});
			}}>
          {isInputObjectType(argType) ? (
			  <span>
              {!!argValue
				  ? this.props.styleConfig.arrowOpen
				  : this.props.styleConfig.arrowClosed}
            </span>
		  ) : (
			  <Checkbox
				  checked={!!argValue}
				  styleConfig={this.props.styleConfig}
			  />
		  )}
			<span
				style={{color: styleConfig.colors.attribute}}
				title={arg.description}
				onMouseEnter={() => {
					if (argValue !== null && typeof argValue !== 'undefined') {
						this.setState({displayArgActions: true});
					}
				}}
				onMouseLeave={() => this.setState({displayArgActions: false})}>
            {arg.name}
				{isRequiredArgument(arg) ? '*' : ''}: {variablizeActionButton}{' '}
          </span>{' '}
        </span>
				{input || <span />}{' '}
			</div>
		);
	}
}

class AbstractView extends React.PureComponent {
	_previousSelection;
	_addFragment = () => {
		this.props.modifySelections([
			...this.props.selections,
			this._previousSelection || {
				kind: 'InlineFragment',
				typeCondition: {
					kind: 'NamedType',
					name: {kind: 'Name', value: this.props.implementingType.name},
				},
				selectionSet: {
					kind: 'SelectionSet',
					selections: this.props
						.getDefaultFieldNames(this.props.implementingType)
						.map(fieldName => ({
							kind: 'Field',
							name: {kind: 'Name', value: fieldName},
						})),
				},
			},
		]);
	};
	_removeFragment = () => {
		const thisSelection = this._getSelection();
		this._previousSelection = thisSelection;
		this.props.modifySelections(
			this.props.selections.filter(s => s !== thisSelection),
		);
	};
	_getSelection = () => {
		const selection = this.props.selections.find(
			selection =>
				selection.kind === 'InlineFragment' &&
				selection.typeCondition &&
				this.props.implementingType.name === selection.typeCondition.name.value,
		);
		if (!selection) {
			return null;
		}
		if (selection.kind === 'InlineFragment') {
			return selection;
		}
	};

	_modifyChildSelections = (selections, options) => {
		const thisSelection = this._getSelection();
		return this.props.modifySelections(
			this.props.selections.map(selection => {
				if (selection === thisSelection) {
					return {
						directives: selection.directives,
						kind: 'InlineFragment',
						typeCondition: {
							kind: 'NamedType',
							name: {kind: 'Name', value: this.props.implementingType.name},
						},
						selectionSet: {
							kind: 'SelectionSet',
							selections,
						},
					};
				}
				return selection;
			}),
			options,
		);
	};

	render() {
		const {
			implementingType,
			schema,
			getDefaultFieldNames,
			styleConfig,
		} = this.props;
		const selection = this._getSelection();
		const fields = implementingType.getFields();
		const childSelections = selection
			? selection.selectionSet
				? selection.selectionSet.selections
				: []
			: [];

		return (
			<div className={`graphiql-explorer-${implementingType.name}`}>
        <span
			style={{cursor: 'pointer'}}
			onClick={selection ? this._removeFragment : this._addFragment}>
          <Checkbox
			  checked={!!selection}
			  styleConfig={this.props.styleConfig}
		  />
          <span style={{color: styleConfig.colors.atom}}>
            {this.props.implementingType.name}
          </span>
        </span>
				{selection ? (
					<div style={{marginLeft: 16}}>
						{Object.keys(fields)
							.sort()
							.map(fieldName => (
								<FieldView
									key={fieldName}
									field={fields[fieldName]}
									selections={childSelections}
									modifySelections={this._modifyChildSelections}
									schema={schema}
									getDefaultFieldNames={getDefaultFieldNames}
									getDefaultScalarArgValue={this.props.getDefaultScalarArgValue}
									makeDefaultArg={this.props.makeDefaultArg}
									onRunOperation={this.props.onRunOperation}
									onCommit={this.props.onCommit}
									styleConfig={this.props.styleConfig}
									definition={this.props.definition}
									availableFragments={this.props.availableFragments}
								/>
							))}
					</div>
				) : null}
			</div>
		);
	}
}

class FragmentView extends React.PureComponent {
	_previousSelection;
	_addFragment = () => {
		this.props.modifySelections([
			...this.props.selections,
			this._previousSelection || {
				kind: 'FragmentSpread',
				name: this.props.fragment.name,
			},
		]);
	};
	_removeFragment = () => {
		const thisSelection = this._getSelection();
		this._previousSelection = thisSelection;
		this.props.modifySelections(
			this.props.selections.filter(s => {
				const isTargetSelection =
					s.kind === 'FragmentSpread' &&
					s.name.value === this.props.fragment.name.value;

				return !isTargetSelection;
			}),
		);
	};
	_getSelection = () => {
		const selection = this.props.selections.find(selection => {
			return (
				selection.kind === 'FragmentSpread' &&
				selection.name.value === this.props.fragment.name.value
			);
		});

		return selection;
	};

	render() {
		const {styleConfig} = this.props;
		const selection = this._getSelection();
		return (
			<div className={`graphiql-explorer-${this.props.fragment.name.value}`}>
        <span
			style={{cursor: 'pointer'}}
			onClick={selection ? this._removeFragment : this._addFragment}>
          <Checkbox
			  checked={!!selection}
			  styleConfig={this.props.styleConfig}
		  />
          <span
			  style={{color: styleConfig.colors.def}}
			  className={`graphiql-explorer-${this.props.fragment.name.value}`}>
            {this.props.fragment.name.value}
          </span>
        </span>
			</div>
		);
	}
}

class FieldView extends React.PureComponent {
	state = {displayFieldActions: false};

	_previousSelection;
	_addAllFieldsToSelections = rawSubfields => {
		const subFields = !!rawSubfields
			? Object.keys(rawSubfields).map(fieldName => {
				return {
					kind: 'Field',
					name: {kind: 'Name', value: fieldName},
					arguments: [],
				};
			})
			: [];

		const subSelectionSet = {
			kind: 'SelectionSet',
			selections: subFields,
		};

		const nextSelections = [
			...this.props.selections.filter(selection => {
				if (selection.kind === 'InlineFragment') {
					return true;
				} else {
					return selection.name.value !== this.props.field.name;
				}
			}),
			{
				kind: 'Field',
				name: {kind: 'Name', value: this.props.field.name},
				arguments: defaultArgs(
					this.props.getDefaultScalarArgValue,
					this.props.makeDefaultArg,
					this.props.field,
				),
				selectionSet: subSelectionSet,
			},
		];

		this.props.modifySelections(nextSelections);
	};

	_addFieldToSelections = rawSubfields => {
		const nextSelections = [
			...this.props.selections,
			this._previousSelection || {
				kind: 'Field',
				name: {kind: 'Name', value: this.props.field.name},
				arguments: defaultArgs(
					this.props.getDefaultScalarArgValue,
					this.props.makeDefaultArg,
					this.props.field,
				),
			},
		];

		this.props.modifySelections(nextSelections);
	};

	_handleUpdateSelections = event => {
		const selection = this._getSelection();
		if (selection && !event.altKey) {
			this._removeFieldFromSelections();
		} else {
			const fieldType = getNamedType(this.props.field.type);
			const rawSubfields = isObjectType(fieldType) && fieldType.getFields();

			const shouldSelectAllSubfields = !!rawSubfields && event.altKey;

			shouldSelectAllSubfields
				? this._addAllFieldsToSelections(rawSubfields)
				: this._addFieldToSelections(rawSubfields);
		}
	};

	_removeFieldFromSelections = () => {
		const previousSelection = this._getSelection();
		this._previousSelection = previousSelection;
		this.props.modifySelections(
			this.props.selections.filter(
				selection => selection !== previousSelection,
			),
		);
	};
	_getSelection = () => {
		const selection = this.props.selections.find(
			selection =>
				selection.kind === 'Field' &&
				this.props.field.name === selection.name.value,
		);
		if (!selection) {
			return null;
		}
		if (selection.kind === 'Field') {
			return selection;
		}
	};

	_setArguments = (argumentNodes, options) => {
		const selection = this._getSelection();
		if (!selection) {
			console.error('Missing selection when setting arguments', argumentNodes);
			return;
		}
		return this.props.modifySelections(
			this.props.selections.map(s =>
				s === selection
					? {
						alias: selection.alias,
						arguments: argumentNodes,
						directives: selection.directives,
						kind: 'Field',
						name: selection.name,
						selectionSet: selection.selectionSet,
					}
					: s,
			),
			options,
		);
	};

	_modifyChildSelections = (selections, options) => {
		return this.props.modifySelections(
			this.props.selections.map(selection => {
				if (
					selection.kind === 'Field' &&
					this.props.field.name === selection.name.value
				) {
					if (selection.kind !== 'Field') {
						throw new Error('invalid selection');
					}
					return {
						alias: selection.alias,
						arguments: selection.arguments,
						directives: selection.directives,
						kind: 'Field',
						name: selection.name,
						selectionSet: {
							kind: 'SelectionSet',
							selections,
						},
					};
				}
				return selection;
			}),
			options,
		);
	};

	render() {
		const {field, schema, getDefaultFieldNames, styleConfig} = this.props;
		const selection = this._getSelection();
		const type = unwrapOutputType(field.type);
		const args = field.args.sort((a, b) => a.name.localeCompare(b.name));
		let className = `graphiql-explorer-node graphiql-explorer-${field.name}`;

		if (field.isDeprecated) {
			className += ' graphiql-explorer-deprecated';
		}

		const applicableFragments =
			isObjectType(type) || isInterfaceType(type) || isUnionType(type)
				? this.props.availableFragments &&
				this.props.availableFragments[type.name]
				: null;

		const node = (
			<div className={className}>
        <span
			title={field.description}
			style={{
				cursor: 'pointer',
				display: 'inline-flex',
				alignItems: 'center',
				minHeight: '16px',
				WebkitUserSelect: 'none',
				userSelect: 'none',
			}}
			data-field-name={field.name}
			data-field-type={type.name}
			onClick={this._handleUpdateSelections}
			onMouseEnter={() => {
				const containsMeaningfulSubselection =
					isObjectType(type) &&
					selection &&
					selection.selectionSet &&
					selection.selectionSet.selections.filter(
						selection => selection.kind !== 'FragmentSpread',
					).length > 0;

				if (containsMeaningfulSubselection) {
					this.setState({displayFieldActions: true});
				}
			}}
			onMouseLeave={() => this.setState({displayFieldActions: false})}>
          {isObjectType(type) ? (
			  <span>
              {!!selection
				  ? this.props.styleConfig.arrowOpen
				  : this.props.styleConfig.arrowClosed}
            </span>
		  ) : null}
			{isObjectType(type) ? null : (
				<Checkbox
					checked={!!selection}
					styleConfig={this.props.styleConfig}
				/>
			)}
			<span
				style={{color: styleConfig.colors.property}}
				className="graphiql-explorer-field-view">
            {field.name}
          </span>
			{!this.state.displayFieldActions ? null : (
				<button
					type="submit"
					className="toolbar-button"
					title="Extract selections into a new reusable fragment"
					onClick={event => {
						event.preventDefault();
						event.stopPropagation();
						const typeName = type.name;
						let newFragmentName = `${typeName}Fragment`;

						const conflictingNameCount = (applicableFragments || []).filter(
							fragment => {
								return fragment.name.value.startsWith(newFragmentName);
							},
						).length;

						if (conflictingNameCount > 0) {
							newFragmentName = `${newFragmentName}${conflictingNameCount}`;
						}

						const childSelections = selection
							? selection.selectionSet
								? selection.selectionSet.selections
								: []
							: [];

						const nextSelections = [
							{
								kind: 'FragmentSpread',
								name: {
									kind: 'Name',
									value: newFragmentName,
								},
								directives: [],
							},
						];

						const newFragmentDefinition = {
							kind: 'FragmentDefinition',
							name: {
								kind: 'Name',
								value: newFragmentName,
							},
							typeCondition: {
								kind: 'NamedType',
								name: {
									kind: 'Name',
									value: type.name,
								},
							},
							directives: [],
							selectionSet: {
								kind: 'SelectionSet',
								selections: childSelections,
							},
						};

						const newDoc = this._modifyChildSelections(
							nextSelections,
							false,
						);

						if (newDoc) {
							const newDocWithFragment = {
								...newDoc,
								definitions: [...newDoc.definitions, newFragmentDefinition],
							};

							this.props.onCommit(newDocWithFragment);
						} else {
							console.warn('Unable to complete extractFragment operation');
						}
					}}
					style={{
						...styleConfig.styles.actionButtonStyle,
					}}>
					<span>{'…'}</span>
				</button>
			)}
        </span>
				{selection && args.length ? (
					<div
						style={{marginLeft: 16}}
						className="graphiql-explorer-graphql-arguments">
						{args.map(arg => (
							<ArgView
								key={arg.name}
								parentField={field}
								arg={arg}
								selection={selection}
								modifyArguments={this._setArguments}
								getDefaultScalarArgValue={this.props.getDefaultScalarArgValue}
								makeDefaultArg={this.props.makeDefaultArg}
								onRunOperation={this.props.onRunOperation}
								styleConfig={this.props.styleConfig}
								onCommit={this.props.onCommit}
								definition={this.props.definition}
							/>
						))}
					</div>
				) : null}
			</div>
		);

		if (
			selection &&
			(isObjectType(type) || isInterfaceType(type) || isUnionType(type))
		) {
			const fields = isUnionType(type) ? {} : type.getFields();
			const childSelections = selection
				? selection.selectionSet
					? selection.selectionSet.selections
					: []
				: [];
			return (
				<div className={`graphiql-explorer-${field.name}`}>
					{node}
					<div style={{marginLeft: 16}}>
						{!!applicableFragments
							? applicableFragments.map(fragment => {
								const type = schema.getType(
									fragment.typeCondition.name.value,
								);
								const fragmentName = fragment.name.value;
								return !type ? null : (
									<FragmentView
										key={fragmentName}
										fragment={fragment}
										selections={childSelections}
										modifySelections={this._modifyChildSelections}
										schema={schema}
										styleConfig={this.props.styleConfig}
										onCommit={this.props.onCommit}
									/>
								);
							})
							: null}
						{Object.keys(fields)
							.sort()
							.map(fieldName => (
								<FieldView
									key={fieldName}
									field={fields[fieldName]}
									selections={childSelections}
									modifySelections={this._modifyChildSelections}
									schema={schema}
									getDefaultFieldNames={getDefaultFieldNames}
									getDefaultScalarArgValue={this.props.getDefaultScalarArgValue}
									makeDefaultArg={this.props.makeDefaultArg}
									onRunOperation={this.props.onRunOperation}
									styleConfig={this.props.styleConfig}
									onCommit={this.props.onCommit}
									definition={this.props.definition}
									availableFragments={this.props.availableFragments}
								/>
							))}
						{isInterfaceType(type) || isUnionType(type)
							? schema
								.getPossibleTypes(type)
								.map(type => (
									<AbstractView
										key={type.name}
										implementingType={type}
										selections={childSelections}
										modifySelections={this._modifyChildSelections}
										schema={schema}
										getDefaultFieldNames={getDefaultFieldNames}
										getDefaultScalarArgValue={
											this.props.getDefaultScalarArgValue
										}
										makeDefaultArg={this.props.makeDefaultArg}
										onRunOperation={this.props.onRunOperation}
										styleConfig={this.props.styleConfig}
										onCommit={this.props.onCommit}
										definition={this.props.definition}
									/>
								))
							: null}
					</div>
				</div>
			);
		}
		return node;
	}
}

function parseQuery(text) {
	try {
		if (!text.trim()) {
			return null;
		}
		return parse(
			text,
			{noLocation: true},
		);
	} catch (e) {
		return new Error(e);
	}
}

const DEFAULT_OPERATION = {
	kind: 'OperationDefinition',
	operation: 'query',
	variableDefinitions: [],
	name: {kind: 'Name', value: 'MyQuery'},
	directives: [],
	selectionSet: {
		kind: 'SelectionSet',
		selections: [],
	},
};
const DEFAULT_DOCUMENT = {
	kind: 'Document',
	definitions: [DEFAULT_OPERATION],
};
let parseQueryMemoize = null;
function memoizeParseQuery(query) {
	if (parseQueryMemoize && parseQueryMemoize[0] === query) {
		return parseQueryMemoize[1];
	} else {
		const result = parseQuery(query);
		if (!result) {
			return DEFAULT_DOCUMENT;
		} else if (result instanceof Error) {
			if (parseQueryMemoize) {
				return parseQueryMemoize[1];
			} else {
				return DEFAULT_DOCUMENT;
			}
		} else {
			parseQueryMemoize = [query, result];
			return result;
		}
	}
}

const defaultStyles = {
	buttonStyle: {
		fontSize: '1.2em',
		padding: '0px',
		backgroundColor: 'white',
		border: 'none',
		margin: '5px 0px',
		height: '40px',
		width: '100%',
		display: 'block',
		maxWidth: 'none',
	},

	actionButtonStyle: {
		padding: '0px',
		backgroundColor: 'white',
		border: 'none',
		margin: '0px',
		maxWidth: 'none',
		height: '15px',
		width: '15px',
		display: 'inline-block',
		fontSize: 'smaller',
	},

	explorerActionsStyle: {
		margin: '4px -8px -8px',
		paddingLeft: '8px',
		bottom: '0px',
		width: '100%',
		textAlign: 'center',
		background: 'none',
		borderTop: 'none',
		borderBottom: 'none',
	},
};

class RootView extends React.PureComponent {
	state = {newOperationType: 'query', displayTitleActions: false};
	_previousOperationDef;

	_modifySelections = (selections, options) => {
		let operationDef = this.props.definition;

		if (
			operationDef.selectionSet.selections.length === 0 &&
			this._previousOperationDef
		) {
			operationDef = this._previousOperationDef;
		}

		let newOperationDef;

		if (operationDef.kind === 'FragmentDefinition') {
			newOperationDef = {
				...operationDef,
				selectionSet: {
					...operationDef.selectionSet,
					selections,
				},
			};
		} else if (operationDef.kind === 'OperationDefinition') {
			let cleanedSelections = selections.filter(selection => {
				return !(
					selection.kind === 'Field' && selection.name.value === '__typename'
				);
			});

			if (cleanedSelections.length === 0) {
				cleanedSelections = [
					{
						kind: 'Field',
						name: {
							kind: 'Name',
							value: '__typename ## Placeholder value',
						},
					},
				];
			}

			newOperationDef = {
				...operationDef,
				selectionSet: {
					...operationDef.selectionSet,
					selections: cleanedSelections,
				},
			};
		}

		return this.props.onEdit(newOperationDef, options);
	};

	_onOperationRename = event =>
		this.props.onOperationRename(event.target.value);

	_handlePotentialRun = event => {
		if (isRunShortcut(event) && canRunOperation(this.props.definition.kind)) {
			this.props.onRunOperation(this.props.name);
		}
	};

	_rootViewElId = () => {
		const {operationType, name} = this.props;
		const rootViewElId = `${operationType}-${name || 'unknown'}`;
		return rootViewElId;
	};

	componentDidMount() {
		const rootViewElId = this._rootViewElId();

		this.props.onMount(rootViewElId);
	}

	render() {
		const {
			operationType,
			definition,
			schema,
			getDefaultFieldNames,
			styleConfig,
		} = this.props;
		const rootViewElId = this._rootViewElId();

		const fields = this.props.fields || {};
		const operationDef = definition;
		const selections = operationDef.selectionSet.selections;

		const operationDisplayName =
			this.props.name || `${capitalize(operationType)} Name`;

		return (
			<div
				id={rootViewElId}
				tabIndex="0"
				onKeyDown={this._handlePotentialRun}
				style={{
					borderBottom: this.props.isLast ? 'none' : '1px solid #d6d6d6',
					marginBottom: '0em',
					paddingBottom: '1em',
				}}>
				<div
					style={{color: styleConfig.colors.keyword, paddingBottom: 4}}
					className="graphiql-operation-title-bar"
					onMouseEnter={() => this.setState({displayTitleActions: true})}
					onMouseLeave={() => this.setState({displayTitleActions: false})}>
					{operationType}{' '}
					<span style={{color: styleConfig.colors.def}}>
            <input
				style={{
					color: styleConfig.colors.def,
					border: 'none',
					borderBottom: '1px solid #888',
					outline: 'none',
					width: `${Math.max(4, operationDisplayName.length)}ch`,
				}}
				autoComplete="false"
				placeholder={`${capitalize(operationType)} Name`}
				value={this.props.name}
				onKeyDown={this._handlePotentialRun}
				onChange={this._onOperationRename}
			/>
          </span>
					{!!this.props.onTypeName ? (
						<span>
              <br />
							{`on ${this.props.onTypeName}`}
            </span>
					) : (
						''
					)}
					{!!this.state.displayTitleActions ? (
						<React.Fragment>
							<button
								type="submit"
								className="toolbar-button"
								onClick={() => this.props.onOperationDestroy()}
								style={{
									...styleConfig.styles.actionButtonStyle,
								}}>
								<span>{'\u2715'}</span>
							</button>
							<button
								type="submit"
								className="toolbar-button"
								onClick={() => this.props.onOperationClone()}
								style={{
									...styleConfig.styles.actionButtonStyle,
								}}>
								<span>{'⎘'}</span>
							</button>
						</React.Fragment>
					) : (
						''
					)}
				</div>

				{Object.keys(fields)
					.sort()
					.map(fieldName => (
						<FieldView
							key={fieldName}
							field={fields[fieldName]}
							selections={selections}
							modifySelections={this._modifySelections}
							schema={schema}
							getDefaultFieldNames={getDefaultFieldNames}
							getDefaultScalarArgValue={this.props.getDefaultScalarArgValue}
							makeDefaultArg={this.props.makeDefaultArg}
							onRunOperation={this.props.onRunOperation}
							styleConfig={this.props.styleConfig}
							onCommit={this.props.onCommit}
							definition={this.props.definition}
							availableFragments={this.props.availableFragments}
						/>
					))}
			</div>
		);
	}
}

function Attribution() {
	return (
		<div
			style={{
				fontFamily: 'sans-serif',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				margin: '1em',
				marginTop: 0,
				flexGrow: 1,
				justifyContent: 'flex-end',
			}}>
			<div
				style={{
					borderTop: '1px solid #d6d6d6',
					paddingTop: '1em',
					width: '100%',
					textAlign: 'center',
				}}>
				GraphiQL Explorer by <a href="https://www.onegraph.com">OneGraph</a>
			</div>
			<div>
				Contribute on{' '}
				<a href="https://github.com/OneGraph/graphiql-explorer">GitHub</a>
			</div>
		</div>
	);
}

class Explorer extends React.PureComponent {

	state = {
		newOperationType: 'query',
		operation: null,
		operationToScrollTo: null,
	};

	_ref;
	_resetScroll = () => {
		const container = this._ref;
		if (container) {
			container.scrollLeft = 0;
		}
	};
	componentDidMount() {
		this._resetScroll();
	}

	_onEdit = query => this.props.onEdit(query);

	_setAddOperationType = value => {
		this.setState({newOperationType: value});
	};

	_handleRootViewMount = rootViewElId => {
		if (
			!!this.state.operationToScrollTo &&
			this.state.operationToScrollTo === rootViewElId
		) {
			var selector = `.graphiql-explorer-root #${rootViewElId}`;

			var el = document.querySelector(selector);
			el && el.scrollIntoView();
		}
	};

	render() {
		const {schema, query, makeDefaultArg} = this.props;

		if (!schema) {
			return (
				<div style={{fontFamily: 'sans-serif'}} className="error-container">
					No Schema Available
				</div>
			);
		}
		const styleConfig = {
			colors: this.props.colors || defaultColors,
			checkboxChecked: this.props.checkboxChecked || defaultCheckboxChecked,
			checkboxUnchecked:
				this.props.checkboxUnchecked || defaultCheckboxUnchecked,
			arrowClosed: this.props.arrowClosed || defaultArrowClosed,
			arrowOpen: this.props.arrowOpen || defaultArrowOpen,
			styles: this.props.styles
				? {
					...defaultStyles,
					...this.props.styles,
				}
				: defaultStyles,
		};
		const queryType = schema.getQueryType();
		const mutationType = schema.getMutationType();
		const subscriptionType = schema.getSubscriptionType();
		if (!queryType && !mutationType && !subscriptionType) {
			return <div>Missing query type</div>;
		}
		const queryFields = queryType && queryType.getFields();
		const mutationFields = mutationType && mutationType.getFields();
		const subscriptionFields = subscriptionType && subscriptionType.getFields();

		const parsedQuery = memoizeParseQuery(query);
		const getDefaultFieldNames =
			this.props.getDefaultFieldNames || defaultGetDefaultFieldNames;
		const getDefaultScalarArgValue =
			this.props.getDefaultScalarArgValue || defaultGetDefaultScalarArgValue;

		const definitions = parsedQuery.definitions;

		const _relevantOperations = definitions
			.map(definition => {
				if (definition.kind === 'FragmentDefinition') {
					return definition;
				} else if (definition.kind === 'OperationDefinition') {
					return definition;
				} else {
					return null;
				}
			})
			.filter(Boolean);

		const relevantOperations =
			_relevantOperations.length === 0
				? DEFAULT_DOCUMENT.definitions
				: _relevantOperations;

		const renameOperation = (targetOperation, name) => {
			const newName =
				name == null || name === ''
					? null
					: {kind: 'Name', value: name, loc: undefined};
			const newOperation = {...targetOperation, name: newName};

			const existingDefs = parsedQuery.definitions;

			const newDefinitions = existingDefs.map(existingOperation => {
				if (targetOperation === existingOperation) {
					return newOperation;
				} else {
					return existingOperation;
				}
			});

			return {
				...parsedQuery,
				definitions: newDefinitions,
			};
		};

		const cloneOperation = targetOperation => {
			let kind;
			if (targetOperation.kind === 'FragmentDefinition') {
				kind = 'fragment';
			} else {
				kind = targetOperation.operation;
			}

			const newOperationName =
				((targetOperation.name && targetOperation.name.value) || '') + 'Copy';

			const newName = {
				kind: 'Name',
				value: newOperationName,
				loc: undefined,
			};

			const newOperation = {...targetOperation, name: newName};

			const existingDefs = parsedQuery.definitions;

			const newDefinitions = [...existingDefs, newOperation];

			this.setState({operationToScrollTo: `${kind}-${newOperationName}`});

			return {
				...parsedQuery,
				definitions: newDefinitions,
			};
		};

		const destroyOperation = targetOperation => {
			const existingDefs = parsedQuery.definitions;

			const newDefinitions = existingDefs.filter(existingOperation => {
				if (targetOperation === existingOperation) {
					return false;
				} else {
					return true;
				}
			});

			return {
				...parsedQuery,
				definitions: newDefinitions,
			};
		};

		const addOperation = kind => {
			const existingDefs = parsedQuery.definitions;

			const viewingDefaultOperation =
				parsedQuery.definitions.length === 1 &&
				parsedQuery.definitions[0] === DEFAULT_DOCUMENT.definitions[0];

			const MySiblingDefs = viewingDefaultOperation
				? []
				: existingDefs.filter(def => {
					if (def.kind === 'OperationDefinition') {
						return def.operation === kind;
					} else {
						return false;
					}
				});

			const newOperationName = `My${capitalize(kind)}${
				MySiblingDefs.length === 0 ? '' : MySiblingDefs.length + 1
			}`;

			const firstFieldName = '__typename # Placeholder value';

			const selectionSet = {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: {
							kind: 'Name',
							value: firstFieldName,
							loc: null,
						},
						arguments: [],
						directives: [],
						selectionSet: null,
						loc: null,
					},
				],
				loc: null,
			};

			const newDefinition = {
				kind: 'OperationDefinition',
				operation: kind,
				name: {kind: 'Name', value: newOperationName},
				variableDefinitions: [],
				directives: [],
				selectionSet: selectionSet,
				loc: null,
			};

			const newDefinitions =
				viewingDefaultOperation
					? [newDefinition]
					: [...parsedQuery.definitions, newDefinition];

			const newOperationDef = {
				...parsedQuery,
				definitions: newDefinitions,
			};

			this.setState({operationToScrollTo: `${kind}-${newOperationName}`});

			this.props.onEdit(print(newOperationDef));
		};

		const actionsOptions = [
			!!queryFields ? (
				<option
					key="query"
					className={'toolbar-button'}
					style={styleConfig.styles.buttonStyle}
					type="link"
					value="query">
					Query
				</option>
			) : null,
			!!mutationFields ? (
				<option
					key="mutation"
					className={'toolbar-button'}
					style={styleConfig.styles.buttonStyle}
					type="link"
					value="mutation">
					Mutation
				</option>
			) : null,
			!!subscriptionFields ? (
				<option
					key="subscription"
					className={'toolbar-button'}
					style={styleConfig.styles.buttonStyle}
					type="link"
					value="subscription">
					Subscription
				</option>
			) : null,
		].filter(Boolean);

		const actionsEl =
			actionsOptions.length === 0 || this.props.hideActions ? null : (
				<div
					style={{
						minHeight: '50px',
						maxHeight: '50px',
						overflow: 'none',
					}}>
					<form
						className="variable-editor-title graphiql-explorer-actions"
						style={{
							...styleConfig.styles.explorerActionsStyle,
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							borderTop: '1px solid rgb(214, 214, 214)',
						}}
						onSubmit={event => event.preventDefault()}>
            <span
				style={{
					display: 'inline-block',
					flexGrow: '0',
					textAlign: 'right',
				}}>
              Add new{' '}
            </span>
						<select
							onChange={event => this._setAddOperationType(event.target.value)}
							value={this.state.newOperationType}
							style={{flexGrow: '2'}}>
							{actionsOptions}
						</select>
						<button
							type="submit"
							className="toolbar-button"
							onClick={() =>
								this.state.newOperationType
									? addOperation(this.state.newOperationType)
									: null
							}
							style={{
								...styleConfig.styles.buttonStyle,
								height: '22px',
								width: '22px',
							}}>
							<span>+</span>
						</button>
					</form>
				</div>
			);

		const externalFragments =
			this.props.externalFragments &&
			this.props.externalFragments.reduce((acc, fragment) => {
				if (fragment.kind === 'FragmentDefinition') {
					const fragmentTypeName = fragment.typeCondition.name.value;
					const existingFragmentsForType = acc[fragmentTypeName] || [];
					const newFragmentsForType = [
						...existingFragmentsForType,
						fragment,
					].sort((a, b) => a.name.value.localeCompare(b.name.value));
					return {
						...acc,
						[fragmentTypeName]: newFragmentsForType,
					};
				}

				return acc;
			}, {});

		const documentFragments = relevantOperations.reduce(
			(acc, operation) => {
				if (operation.kind === 'FragmentDefinition') {
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
			},
			{},
		);

		const availableFragments = {...documentFragments, ...externalFragments};

		const attribution = this.props.showAttribution ? <Attribution /> : null;

		return (
			<div
				ref={ref => {
					this._ref = ref;
				}}
				style={{
					fontSize: 12,
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					margin: 0,
					padding: 8,
					fontFamily:
						'Consolas, Inconsolata, "Droid Sans Mono", Monaco, monospace',
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
				}}
				className="graphiql-explorer-root">
				<div
					style={{
						flexGrow: '1',
						overflow: 'scroll',
					}}>
					{relevantOperations.map((operation, index) => {
						const operationName =
							operation && operation.name && operation.name.value;

						const operationType =
							operation.kind === 'FragmentDefinition'
								? 'fragment'
								: (operation && operation.operation) || 'query';

						const onOperationRename = newName => {
							const newOperationDef = renameOperation(operation, newName);
							this.props.onEdit(print(newOperationDef));
						};

						const onOperationClone = () => {
							const newOperationDef = cloneOperation(operation);
							this.props.onEdit(print(newOperationDef));
						};

						const onOperationDestroy = () => {
							const newOperationDef = destroyOperation(operation);
							this.props.onEdit(print(newOperationDef));
						};

						const fragmentType =
							operation.kind === 'FragmentDefinition' &&
							operation.typeCondition.kind === 'NamedType' &&
							schema.getType(operation.typeCondition.name.value);

						const fragmentFields =
							fragmentType instanceof GraphQLObjectType
								? fragmentType.getFields()
								: null;

						const fields =
							operationType === 'query'
								? queryFields
								: operationType === 'mutation'
									? mutationFields
									: operationType === 'subscription'
										? subscriptionFields
										: operation.kind === 'FragmentDefinition'
											? fragmentFields
											: null;

						const fragmentTypeName =
							operation.kind === 'FragmentDefinition'
								? operation.typeCondition.name.value
								: null;

						const onCommit = parsedDocument => {
							const textualNewDocument = print(parsedDocument);

							this.props.onEdit(textualNewDocument);
						};

						return (
							<RootView
								key={index}
								isLast={index === relevantOperations.length - 1}
								fields={fields}
								operationType={operationType}
								name={operationName}
								definition={operation}
								onOperationRename={onOperationRename}
								onOperationDestroy={onOperationDestroy}
								onOperationClone={onOperationClone}
								onTypeName={fragmentTypeName}
								onMount={this._handleRootViewMount}
								onCommit={onCommit}
								onEdit={(newDefinition, options) => {
									let commit;
									if (
										typeof options === 'object' &&
										typeof options.commit !== 'undefined'
									) {
										commit = options.commit;
									} else {
										commit = true;
									}

									if (!!newDefinition) {
										const newQuery = {
											...parsedQuery,
											definitions: parsedQuery.definitions.map(
												existingDefinition =>
													existingDefinition === operation
														? newDefinition
														: existingDefinition,
											),
										};

										if (commit) {
											onCommit(newQuery);
											return newQuery;
										} else {
											return newQuery;
										}
									} else {
										return parsedQuery;
									}
								}}
								schema={schema}
								getDefaultFieldNames={getDefaultFieldNames}
								getDefaultScalarArgValue={getDefaultScalarArgValue}
								makeDefaultArg={makeDefaultArg}
								onRunOperation={() => {
									if (!!this.props.onRunOperation) {
										this.props.onRunOperation(operationName);
									}
								}}
								styleConfig={styleConfig}
								availableFragments={availableFragments}
							/>
						);
					})}
					{attribution}
				</div>

				{actionsEl}
			</div>
		);
	}
}

class ErrorBoundary extends React.Component {
	state = {hasError: false, error: null, errorInfo: null};

	componentDidCatch(error, errorInfo) {
		this.setState({hasError: true, error: error, errorInfo: errorInfo});
		console.error('Error in component', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{padding: 18, fontFamily: 'sans-serif'}}>
					<div>Something went wrong</div>
					<details style={{whiteSpace: 'pre-wrap'}}>
						{this.state.error ? this.state.error.toString() : null}
						<br />
						{this.state.errorInfo ? this.state.errorInfo.componentStack : null}
					</details>
				</div>
			);
		}
		return this.props.children;
	}
}

class ExplorerWrapper extends React.PureComponent {

	render() {
		return (
			<div
				className="docExplorerWrap"
				style={{
					height: '100%',
					width: this.props.width,
					minWidth: this.props.width,
					zIndex: 7,
					display: this.props.explorerIsOpen ? 'flex' : 'none',
					flexDirection: 'column',
					overflow: 'hidden',
				}}>
				<div className="doc-explorer-title-bar">
					<div className="doc-explorer-title">{this.props.title}</div>
					<div className="doc-explorer-rhs">
						<div
							className="docExplorerHide"
							onClick={this.props.onToggleExplorer}>
							{'\u2715'}
						</div>
					</div>
				</div>
				<div
					className="doc-explorer-contents"
					style={{
						padding: '0px',
						overflowY: 'unset',
					}}>
					<ErrorBoundary>
						<Explorer {...this.props} />
					</ErrorBoundary>
				</div>
			</div>
		);
	}
}

export default ExplorerWrapper;
