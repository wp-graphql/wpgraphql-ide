/**
 *  Copyright (c) 2020 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, {
	Fragment,
	useCallback,
	useState,
} from 'react';

import {
	Button,
	ButtonGroup,
	ChevronDownIcon,
	ChevronUpIcon,
	Dialog,
	ExecuteButton,
	GraphiQLProvider,
	HeaderEditor,
	PlusIcon,
	QueryEditor,
	ResponseEditor,
	Spinner,
	Tab,
	Tabs,
	Tooltip,
	UnStyledButton,
	useCopyQuery,
	useDragResize,
	useEditorContext,
	useExecutionContext,
	useMergeQuery,
	usePluginContext,
	usePrettifyEditors,
	useSchemaContext,
	useStorageContext,
	useTheme,
	VariableEditor,
} from '@graphiql/react';
import {ActivityBar} from "../../activity-bar/components/ActivityBar";
import {EditorToolbar} from "../../document-editor/components/EditorToolbar";
import {ShortKeysDialog} from "../../activity-bar/components/ShortKeysDialog";

/**
 * The top-level React component for GraphiQL, intended to encompass the entire
 * browser viewport.
 *
 * @see https://github.com/graphql/graphiql#usage
 */

export function GraphiQL({
	 dangerouslyAssumeSchemaIsValid,
	 defaultQuery,
	 defaultTabs,
	 externalFragments,
	 fetcher,
	 getDefaultFieldNames,
	 headers,
	 inputValueDeprecation,
	 introspectionQueryName,
	 maxHistoryLength,
	 onEditOperationName,
	 onSchemaChange,
	 onTabChange,
	 onTogglePluginVisibility,
	 operationName,
	 plugins,
	 query,
	 response,
	 schema,
	 schemaDescription,
	 shouldPersistHeaders,
	 storage,
	 validationRules,
	 variables,
	 visiblePlugin,
	 defaultHeaders,
	 ...props
 }) {
	// Ensure props are correct
	if (typeof fetcher !== 'function') {
		throw new TypeError(
			'The `GraphiQL` component requires a `fetcher` function to be passed as prop.',
		);
	}

	return (
		<GraphiQLProvider
			getDefaultFieldNames={getDefaultFieldNames}
			dangerouslyAssumeSchemaIsValid={dangerouslyAssumeSchemaIsValid}
			defaultQuery={defaultQuery}
			defaultHeaders={defaultHeaders}
			defaultTabs={defaultTabs}
			externalFragments={externalFragments}
			fetcher={fetcher}
			headers={headers}
			inputValueDeprecation={inputValueDeprecation}
			introspectionQueryName={introspectionQueryName}
			maxHistoryLength={maxHistoryLength}
			onEditOperationName={onEditOperationName}
			onSchemaChange={onSchemaChange}
			onTabChange={onTabChange}
			onTogglePluginVisibility={onTogglePluginVisibility}
			plugins={plugins}
			visiblePlugin={visiblePlugin}
			operationName={operationName}
			query={query}
			response={response}
			schema={schema}
			schemaDescription={schemaDescription}
			shouldPersistHeaders={shouldPersistHeaders}
			storage={storage}
			validationRules={validationRules}
			variables={variables}
		>
			<GraphiQLInterface
				showPersistHeadersSettings={shouldPersistHeaders !== false}
				disableTabs={props.disableTabs ?? false}
				{...props}
			/>
		</GraphiQLProvider>
	);
}

// Export main windows/panes to be used separately if desired.
GraphiQL.Logo = GraphiQLLogo;


export function GraphiQLInterface(props) {
	const isHeadersEditorEnabled = props.isHeadersEditorEnabled ?? true;
	const editorContext = useEditorContext({ nonNull: true });
	const executionContext = useExecutionContext({ nonNull: true });
	const schemaContext = useSchemaContext({ nonNull: true });
	const storageContext = useStorageContext();
	const pluginContext = usePluginContext();

	const copy = useCopyQuery({ onCopyQuery: props.onCopyQuery });
	const merge = useMergeQuery();
	const prettify = usePrettifyEditors();

	const { theme, setTheme } = useTheme();

	const PluginContent = pluginContext?.visiblePlugin?.content;

	const pluginResize = useDragResize({
		defaultSizeRelation: 1 / 3,
		direction: 'horizontal',
		initiallyHidden: pluginContext?.visiblePlugin ? undefined : 'first',
		onHiddenElementChange(resizableElement) {
			if (resizableElement === 'first') {
				pluginContext?.setVisiblePlugin(null);
			}
		},
		sizeThresholdSecond: 200,
		storageKey: 'docExplorerFlex',
	});
	const editorResize = useDragResize({
		direction: 'horizontal',
		storageKey: 'editorFlex',
	});
	const editorToolsResize = useDragResize({
		defaultSizeRelation: 3,
		direction: 'vertical',
		initiallyHidden: (() => {
			if (
				props.defaultEditorToolsVisibility === 'variables' ||
				props.defaultEditorToolsVisibility === 'headers'
			) {
				return;
			}

			if (typeof props.defaultEditorToolsVisibility === 'boolean') {
				return props.defaultEditorToolsVisibility ? undefined : 'second';
			}

			return editorContext.initialVariables || editorContext.initialHeaders
				? undefined
				: 'second';
		})(),
		sizeThresholdSecond: 60,
		storageKey: 'secondaryEditorFlex',
	});

	const [activeSecondaryEditor, setActiveSecondaryEditor] = useState(() => {
		if (
			props.defaultEditorToolsVisibility === 'variables' ||
			props.defaultEditorToolsVisibility === 'headers'
		) {
			return props.defaultEditorToolsVisibility;
		}
		return !editorContext.initialVariables &&
		editorContext.initialHeaders &&
		isHeadersEditorEnabled
			? 'headers'
			: 'variables';
	});
	const [showDialog, setShowDialog] = useState(null);
	const [clearStorageStatus, setClearStorageStatus] = useState(null);

	const children = React.Children.toArray(props.children);

	const logo = children.find(child =>
		isChildComponentType(child, GraphiQL.Logo),
	) || <GraphiQL.Logo />;

	const onClickReference = useCallback(() => {
		if (pluginResize.hiddenElement === 'first') {
			pluginResize.setHiddenElement(null);
		}
	}, [pluginResize]);

	const handleClearData = useCallback(() => {
		try {
			storageContext?.clear();
			setClearStorageStatus('success');
		} catch {
			setClearStorageStatus('error');
		}
	}, [storageContext]);

	const handlePersistHeaders =
		useCallback(
			event => {
				editorContext.setShouldPersistHeaders(
					event.currentTarget.dataset.value === 'true',
				);
			},
			[editorContext],
		);

	const handleChangeTheme = useCallback(
		event => {
			const selectedTheme = event.currentTarget.dataset.theme || undefined;
			setTheme(selectedTheme || null);
		},
		[setTheme],
	);

	const handleAddTab = editorContext.addTab;
	const handleRefetchSchema = schemaContext.introspect;
	const handleReorder = editorContext.moveTab;

	const handleShowDialog = useCallback(
		event => {
			setShowDialog(
				event.currentTarget.dataset.value,
			);
		},
		[],
	);

	const handlePluginClick = useCallback(
		e => {
			const context = pluginContext;
			const pluginIndex = Number(e.currentTarget.dataset.index);
			const plugin = context.plugins.find((_, index) => pluginIndex === index);
			const isVisible = plugin === context.visiblePlugin;
			if (isVisible) {
				context.setVisiblePlugin(null);
				pluginResize.setHiddenElement('first');
			} else {
				context.setVisiblePlugin(plugin);
				pluginResize.setHiddenElement(null);
			}
		},
		[pluginContext, pluginResize],
	);

	const handleToolsTabClick = useCallback(
		event => {
			if (editorToolsResize.hiddenElement === 'second') {
				editorToolsResize.setHiddenElement(null);
			}
			setActiveSecondaryEditor(
				event.currentTarget.dataset.name
		);
		},
		[editorToolsResize],
	);

	const toggleEditorTools =
		useCallback(() => {
			editorToolsResize.setHiddenElement(
				editorToolsResize.hiddenElement === 'second' ? null : 'second',
			);
		}, [editorToolsResize]);

	const handleOpenShortKeysDialog = useCallback((isOpen) => {
		if (!isOpen) {
			setShowDialog(null);
		}
	}, []);

	const handleOpenSettingsDialog = useCallback((isOpen) => {
		if (!isOpen) {
			setShowDialog(null);
			setClearStorageStatus(null);
		}
	}, []);

	const addTab = (
		<Tooltip label="Add tab">
			<UnStyledButton
				type="button"
				className="graphiql-tab-add"
				onClick={handleAddTab}
				aria-label="Add tab"
			>
				<PlusIcon aria-hidden="true" />
			</UnStyledButton>
		</Tooltip>
	);

	return (
		<Tooltip.Provider>
			<div data-testid="graphiql-container" className="graphiql-container">
				<ActivityBar
					handlePluginClick={handlePluginClick}
					handleRefetchSchema={handleRefetchSchema}
					handleShowDialog={handleShowDialog}
					pluginContext={pluginContext}
					schemaContext={schemaContext}
				/>
				<div className="graphiql-main">
					<div
						ref={pluginResize.firstRef}
						style={{
							// Make sure the container shrinks when containing long
							// non-breaking texts
							minWidth: '200px',
						}}
					>
						<div className="graphiql-plugin">
							{PluginContent ? <PluginContent /> : null}
						</div>
					</div>
					{pluginContext?.visiblePlugin && (
						<div
							className="graphiql-horizontal-drag-bar"
							ref={pluginResize.dragBarRef}
						/>
					)}
					<div ref={pluginResize.secondRef} className="graphiql-sessions">
						<div className="graphiql-session-header">
							{props.disableTabs ? null : (
								<Tabs
									values={editorContext.tabs}
									onReorder={handleReorder}
									aria-label="Select active operation"
								>
									{editorContext.tabs.length > 1 && (
										<>
											{editorContext.tabs.map((tab, index) => (
												<Tab
													key={tab.id}
													value={tab}
													isActive={index === editorContext.activeTabIndex}
												>
													<Tab.Button
														aria-controls="graphiql-session"
														id={`graphiql-session-tab-${index}`}
														onClick={() => {
															executionContext.stop();
															editorContext.changeTab(index);
														}}
													>
														{tab.title}
													</Tab.Button>
													<Tab.Close
														onClick={() => {
															if (editorContext.activeTabIndex === index) {
																executionContext.stop();
															}
															editorContext.closeTab(index);
														}}
													/>
												</Tab>
											))}
											{addTab}
										</>
									)}
								</Tabs>
							)}
							<div className="graphiql-session-header-right">
								{editorContext.tabs.length === 1 && addTab}
								{logo}
							</div>
						</div>
						<div
							role="tabpanel"
							id="graphiql-session"
							className="graphiql-session"
							aria-labelledby={`graphiql-session-tab-${editorContext.activeTabIndex}`}
						>
							<div ref={editorResize.firstRef}>
								<div
									className={`graphiql-editors${
										editorContext.tabs.length === 1 ? ' full-height' : ''
									}`}
								>
									<div ref={editorToolsResize.firstRef}>
										<section
											className="graphiql-query-editor"
											aria-label="Query Editor"
										>
											<QueryEditor
												editorTheme={props.editorTheme}
												keyMap={props.keyMap}
												onClickReference={onClickReference}
												onCopyQuery={props.onCopyQuery}
												onEdit={props.onEditQuery}
												readOnly={props.readOnly}
											/>
											<div
												className="graphiql-toolbar"
												role="toolbar"
												aria-label="Editor Commands"
											>
												<ExecuteButton />
												<EditorToolbar />
											</div>
										</section>
									</div>

									<div ref={editorToolsResize.dragBarRef}>
										<div className="graphiql-editor-tools">
											<UnStyledButton
												type="button"
												className={
													activeSecondaryEditor === 'variables' &&
													editorToolsResize.hiddenElement !== 'second'
														? 'active'
														: ''
												}
												onClick={handleToolsTabClick}
												data-name="variables"
											>
												Variables
											</UnStyledButton>
											{isHeadersEditorEnabled && (
												<UnStyledButton
													type="button"
													className={
														activeSecondaryEditor === 'headers' &&
														editorToolsResize.hiddenElement !== 'second'
															? 'active'
															: ''
													}
													onClick={handleToolsTabClick}
													data-name="headers"
												>
													Headers
												</UnStyledButton>
											)}

											<Tooltip
												label={
													editorToolsResize.hiddenElement === 'second'
														? 'Show editor tools'
														: 'Hide editor tools'
												}
											>
												<UnStyledButton
													type="button"
													onClick={toggleEditorTools}
													aria-label={
														editorToolsResize.hiddenElement === 'second'
															? 'Show editor tools'
															: 'Hide editor tools'
													}
													className="graphiql-toggle-editor-tools"
												>
													{editorToolsResize.hiddenElement === 'second' ? (
														<ChevronUpIcon
															className="graphiql-chevron-icon"
															aria-hidden="true"
														/>
													) : (
														<ChevronDownIcon
															className="graphiql-chevron-icon"
															aria-hidden="true"
														/>
													)}
												</UnStyledButton>
											</Tooltip>
										</div>
									</div>

									<div ref={editorToolsResize.secondRef}>
										<section
											className="graphiql-editor-tool"
											aria-label={
												activeSecondaryEditor === 'variables'
													? 'Variables'
													: 'Headers'
											}
										>
											<VariableEditor
												editorTheme={props.editorTheme}
												isHidden={activeSecondaryEditor !== 'variables'}
												keyMap={props.keyMap}
												onEdit={props.onEditVariables}
												onClickReference={onClickReference}
												readOnly={props.readOnly}
											/>
											{isHeadersEditorEnabled && (
												<HeaderEditor
													editorTheme={props.editorTheme}
													isHidden={activeSecondaryEditor !== 'headers'}
													keyMap={props.keyMap}
													onEdit={props.onEditHeaders}
													readOnly={props.readOnly}
												/>
											)}
										</section>
									</div>
								</div>
							</div>

							<div
								className="graphiql-horizontal-drag-bar"
								ref={editorResize.dragBarRef}
							/>

							<div ref={editorResize.secondRef}>
								<div className="graphiql-response">
									{executionContext.isFetching ? <Spinner /> : null}
									<ResponseEditor
										editorTheme={props.editorTheme}
										responseTooltip={props.responseTooltip}
										keyMap={props.keyMap}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<ShortKeysDialog
					keyMap={props.keyMap}
					handleOpenShortKeysDialog={handleOpenSettingsDialog}
					showDialog={showDialog}
				/>
				<Dialog
					open={showDialog === 'settings'}
					onOpenChange={handleOpenSettingsDialog}
				>
					<div className="graphiql-dialog-header">
						<Dialog.Title className="graphiql-dialog-title">
							Settings
						</Dialog.Title>
						<Dialog.Close />
					</div>
					{props.showPersistHeadersSettings ? (
						<div className="graphiql-dialog-section">
							<div>
								<div className="graphiql-dialog-section-title">
									Persist headers
								</div>
								<div className="graphiql-dialog-section-caption">
									Save headers upon reloading.{' '}
									<span className="graphiql-warning-text">
                    Only enable if you trust this device.
                  </span>
								</div>
							</div>
							<ButtonGroup>
								<Button
									type="button"
									id="enable-persist-headers"
									className={editorContext.shouldPersistHeaders ? 'active' : ''}
									data-value="true"
									onClick={handlePersistHeaders}
								>
									On
								</Button>
								<Button
									type="button"
									id="disable-persist-headers"
									className={editorContext.shouldPersistHeaders ? '' : 'active'}
									onClick={handlePersistHeaders}
								>
									Off
								</Button>
							</ButtonGroup>
						</div>
					) : null}
					<div className="graphiql-dialog-section">
						<div>
							<div className="graphiql-dialog-section-title">Theme</div>
							<div className="graphiql-dialog-section-caption">
								Adjust how the interface looks like.
							</div>
						</div>
						<ButtonGroup>
							<Button
								type="button"
								className={theme === null ? 'active' : ''}
								onClick={handleChangeTheme}
							>
								System
							</Button>
							<Button
								type="button"
								className={theme === 'light' ? 'active' : ''}
								data-theme="light"
								onClick={handleChangeTheme}
							>
								Light
							</Button>
							<Button
								type="button"
								className={theme === 'dark' ? 'active' : ''}
								data-theme="dark"
								onClick={handleChangeTheme}
							>
								Dark
							</Button>
						</ButtonGroup>
					</div>
					{storageContext ? (
						<div className="graphiql-dialog-section">
							<div>
								<div className="graphiql-dialog-section-title">
									Clear storage
								</div>
								<div className="graphiql-dialog-section-caption">
									Remove all locally stored data and start fresh.
								</div>
							</div>
							<Button
								type="button"
								state={clearStorageStatus || undefined}
								disabled={clearStorageStatus === 'success'}
								onClick={handleClearData}
							>
								{{
									success: 'Cleared data',
									error: 'Failed',
								}[clearStorageStatus] || 'Clear data'}
							</Button>
						</div>
					) : null}
				</Dialog>
			</div>
		</Tooltip.Provider>
	);
}

// Configure the UI by providing this Component as a child of GraphiQL.
function GraphiQLLogo(props) {
	return (
		<div className="graphiql-logo">
			{props.children || (
				<a
					className="graphiql-logo-link"
					href="https://github.com/graphql/graphiql"
					target="_blank"
					rel="noreferrer"
				>
					Graph
					<em>i</em>
					QL
				</a>
			)}
		</div>
	);
}

GraphiQLLogo.displayName = 'GraphiQLLogo';

// Determines if the React child is of the same type of the provided React component
function isChildComponentType(
	child,
	component,
) {
	if (
		child?.type?.displayName &&
		child.type.displayName === component.displayName
	) {
		return true;
	}

	return child.type === component;
}
