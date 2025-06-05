import React, { useState, useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import './AIAssistantPanelChat.css';

const MessageCard = ({ message, onInsertCode }) => {
	const isUser = message.role === 'user';
	
	// Extract code blocks from the message
	const renderContent = (content) => {
		const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
		const parts = [];
		let lastIndex = 0;
		let match;

		while ((match = codeBlockRegex.exec(content)) !== null) {
			// Add text before code block
			if (match.index > lastIndex) {
				parts.push({
					type: 'text',
					content: content.slice(lastIndex, match.index)
				});
			}

			// Add code block
			parts.push({
				type: 'code',
				language: match[1] || 'graphql',
				content: match[2].trim()
			});

			lastIndex = match.index + match[0].length;
		}

		// Add remaining text
		if (lastIndex < content.length) {
			parts.push({
				type: 'text',
				content: content.slice(lastIndex)
			});
		}

		return parts.map((part, index) => {
			if (part.type === 'code') {
				return (
					<div key={index} className="wpgraphql-ide-ai-code-block">
						<div className="wpgraphql-ide-ai-code-header">
							<span className="wpgraphql-ide-ai-code-language">{part.language}</span>
							<button
								className="wpgraphql-ide-ai-code-insert"
								onClick={() => onInsertCode(part.content)}
								title={__('Insert into editor', 'wpgraphql-ide')}
							>
								{__('Insert', 'wpgraphql-ide')}
							</button>
						</div>
						<pre>
							<code>{part.content}</code>
						</pre>
					</div>
				);
			}
			return <div key={index} dangerouslySetInnerHTML={{ __html: part.content.replace(/\n/g, '<br />') }} />;
		});
	};
	
	return (
		<div
			className={`wpgraphql-ide-ai-message-card ${isUser ? 'user' : 'assistant'}`}
			style={{
				backgroundColor: isUser 
					? `hsla(var(--color-primary), 0.1)`
					: `hsla(var(--color-neutral), var(--alpha-background-light))`,
				borderRadius: `var(--border-radius-8)`,
				padding: `var(--px-12)`,
				marginTop: `var(--px-12)`,
			}}
		>
			<div
				className="wpgraphql-ide-ai-message-role"
				style={{
					color: isUser 
						? `hsla(var(--color-primary), 1)`
						: `hsla(var(--color-neutral), 1)`,
					fontFamily: `var(--font-family)`,
					fontSize: `12px`,
					fontWeight: '600',
					marginBottom: `var(--px-4)`,
				}}
			>
				{isUser ? __('You', 'wpgraphql-ide') : __('GraphQL Assistant', 'wpgraphql-ide')}
			</div>
			<div 
				className="wpgraphql-ide-ai-message-content"
				style={{
					fontSize: `13px`,
					lineHeight: '1.5',
				}}
			>
				{isUser ? message.content[0]?.text || '' : renderContent(message.content[0]?.text || '')}
			</div>
		</div>
	);
};

const AIAssistantPanel = () => {
	const [conversations, setConversations] = useState([{
		id: 'default',
		title: __('New Conversation', 'wpgraphql-ide'),
		messages: []
	}]);
	const [activeConversationId, setActiveConversationId] = useState('default');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const [showConversationMenu, setShowConversationMenu] = useState(false);
	const messagesEndRef = useRef(null);
	const textareaRef = useRef(null);

	// Get active conversation
	const activeConversation = conversations.find(c => c.id === activeConversationId);
	const messages = activeConversation?.messages || [];

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Load saved conversations from localStorage
	useEffect(() => {
		const saved = localStorage.getItem('wpgraphql-ide-ai-conversations');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				// Filter out any invalid conversations
				const validConversations = parsed.filter(conv => 
					conv && conv.id && Array.isArray(conv.messages)
				);
				if (validConversations.length > 0) {
					setConversations(validConversations);
					// Set the first conversation as active if current active ID doesn't exist
					const currentExists = validConversations.some(c => c.id === activeConversationId);
					if (!currentExists) {
						setActiveConversationId(validConversations[0].id);
					}
				}
			} catch (e) {
				console.error('Failed to load conversations:', e);
			}
		}
	}, []);

	// Save conversations to localStorage
	useEffect(() => {
		localStorage.setItem('wpgraphql-ide-ai-conversations', JSON.stringify(conversations));
	}, [conversations]);

	const insertCodeIntoEditor = (code) => {
		// Check if we're dealing with variables
		const isVariables = code.trim().startsWith('{') && code.trim().endsWith('}');
		
		// Try to use the GraphiQL context to set values
		if (window.GraphiQL) {
			try {
				// For GraphiQL v2 API
				const editor = document.querySelector('.graphiql-container');
				if (editor?.__graphiql) {
					if (isVariables) {
						editor.__graphiql.setVariables(code);
					} else {
						editor.__graphiql.setQuery(code);
					}
					return;
				}
			} catch (e) {
				console.error('Failed to use GraphiQL API:', e);
			}
		}
		
		// Dispatch custom event that the main IDE can listen to
		const event = new CustomEvent('wpgraphql-ide:insert-code', {
			detail: { 
				code,
				type: isVariables ? 'variables' : 'query' 
			},
			bubbles: true
		});
		window.dispatchEvent(event);
		
		// Also try to update via wp.data if available
		if (window.wp?.data?.dispatch) {
			try {
				const dispatch = window.wp.data.dispatch('wpgraphql-ide/app');
				if (isVariables) {
					dispatch.setVariables(code);
				} else {
					dispatch.setQuery(code);
				}
			} catch (e) {
				console.error('Failed to use wp.data:', e);
			}
		}
		
		// Fallback: Try to find and update CodeMirror directly
		const querySelector = isVariables 
			? '.graphiql-editor.graphiql-variables-editor' 
			: '.graphiql-editor.graphiql-query-editor';
		
		// Try CodeMirror 6
		const cm6Editor = document.querySelector(`${querySelector} .cm-editor`);
		if (cm6Editor?.cmView?.view) {
			const view = cm6Editor.cmView.view;
			view.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: code
				}
			});
			return;
		}
		
		// Try CodeMirror 5
		const cm5Editor = document.querySelector(`${querySelector} .CodeMirror`);
		if (cm5Editor?.CodeMirror) {
			cm5Editor.CodeMirror.setValue(code);
			return;
		}
		
		// Final fallback: try to find any textarea
		const textarea = document.querySelector(`${querySelector} textarea`);
		if (textarea) {
			textarea.value = code;
			textarea.dispatchEvent(new Event('input', { bubbles: true }));
			textarea.dispatchEvent(new Event('change', { bubbles: true }));
		}
	};

	const updateConversation = (conversationId, newMessages) => {
		setConversations(prev => prev.map(conv => 
			conv.id === conversationId 
				? { ...conv, messages: newMessages }
				: conv
		));
	};

	const createNewConversation = () => {
		const newConversation = {
			id: Date.now().toString(),
			title: __('New Conversation', 'wpgraphql-ide'),
			messages: []
		};
		setConversations(prev => [...prev, newConversation]);
		setActiveConversationId(newConversation.id);
		setShowConversationMenu(false);
	};

	const deleteConversation = (conversationId) => {
		if (conversations.length === 1) {
			// Reset the only conversation instead of deleting
			updateConversation(conversationId, []);
			return;
		}
		
		setConversations(prev => prev.filter(c => c.id !== conversationId));
		if (conversationId === activeConversationId) {
			setActiveConversationId(conversations[0].id);
		}
	};

	const sendMessage = async (text) => {
		if (!text.trim() || isLoading) return;

		// Check if message is GraphQL-related
		const graphqlKeywords = ['query', 'mutation', 'subscription', 'fragment', 'schema', 'type', 'field', 'resolver', 'graphql', 'wpgraphql'];
		const isGraphQLRelated = graphqlKeywords.some(keyword => 
			text.toLowerCase().includes(keyword)
		);

		if (!isGraphQLRelated) {
			// Gently guide user to ask GraphQL-related questions
			const guidanceMessage = {
				id: Date.now().toString(),
				role: 'assistant',
				content: [{
					type: 'text',
					text: __('I\'m specialized in helping with GraphQL and WPGraphQL. I can help you with:\n\n• Writing GraphQL queries, mutations, and subscriptions\n• Understanding your WordPress GraphQL schema\n• Optimizing query performance\n• Debugging GraphQL errors\n• WPGraphQL plugin development\n\nPlease ask me something about GraphQL!', 'wpgraphql-ide')
				}],
			};
			
			updateConversation(activeConversationId, [...messages, {
				id: Date.now().toString(),
				role: 'user',
				content: [{ type: 'text', text }],
			}, guidanceMessage]);
			return;
		}

		const userMessage = {
			id: Date.now().toString(),
			role: 'user',
			content: [{ type: 'text', text }],
		};

		updateConversation(activeConversationId, [...messages, userMessage]);
		setIsLoading(true);
		setError(null);
		setInputValue('');

		try {
			// Get current IDE context
			const contextEvent = new CustomEvent('wpgraphql-ide:get-context');
			window.dispatchEvent(contextEvent);
			
			await new Promise(resolve => setTimeout(resolve, 100));
			
			const ideContext = window.WPGraphQLIDE?.context || {};
			
			// Get schema from GraphiQL if available
			const graphiqlEditor = document.querySelector('.graphiql-container');
			let schemaSDL = '';
			if (graphiqlEditor && window.GraphiQL) {
				try {
					const schema = window.GraphiQL.getSchema();
					if (schema) {
						const { printSchema } = await import('graphql');
						schemaSDL = printSchema(schema);
					}
				} catch (e) {
					console.error('Failed to get schema:', e);
				}
			}
			
			const response = await apiFetch({
				path: window.WPGRAPHQL_AI_ASSISTANT_DATA?.apiUrl + '/chat',
				method: 'POST',
				data: {
					message: text,
					context: {
						query: ideContext.query || '',
						variables: ideContext.variables || '',
						schema: schemaSDL || ideContext.schema || '',
						conversationHistory: messages.slice(-5) // Send last 5 messages for context
					}
				}
			});

			if (response && response.response) {
				const assistantMessage = {
					id: (Date.now() + 1).toString(),
					role: 'assistant',
					content: [{ type: 'text', text: response.response }],
				};
				updateConversation(activeConversationId, [...messages, userMessage, assistantMessage]);
			} else {
				throw new Error(response?.message || __('Failed to get AI response', 'wpgraphql-ide'));
			}
		} catch (err) {
			setError(err.message);
			console.error('AI Assistant error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		sendMessage(inputValue);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	// Auto-resize textarea
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = textarea.scrollHeight + 'px';
		}
	}, [inputValue]);

	return (
		<div className="wpgraphql-ide-ai-assistant-panel">
			<div className="graphiql-doc-explorer-title">
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<span>{__('GraphQL Assistant', 'wpgraphql-ide')}</span>
					<div className="wpgraphql-ide-ai-conversation-controls">
						<button
							className="wpgraphql-ide-ai-control-button"
							onClick={() => setShowConversationMenu(!showConversationMenu)}
							title={__('Conversation History', 'wpgraphql-ide')}
						>
							<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
								<path d="M3 2h8a1 1 0 011 1v4a1 1 0 01-1 1H7l-2 2v-2H3a1 1 0 01-1-1V3a1 1 0 011-1z"/>
							</svg>
							<span>{conversations.filter(c => c.messages.length > 0).length || 1}</span>
						</button>
						{showConversationMenu && (
							<div className="wpgraphql-ide-ai-conversation-menu">
								<button
									className="wpgraphql-ide-ai-menu-item wpgraphql-ide-ai-new-conversation"
									onClick={() => {
										createNewConversation();
										setShowConversationMenu(false);
									}}
								>
									<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
										<path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2"/>
									</svg>
									<span>{__('New Conversation', 'wpgraphql-ide')}</span>
								</button>
								{conversations.filter(conv => conv.messages.length > 0).length > 0 && (
									<div className="wpgraphql-ide-ai-menu-divider" />
								)}
								{conversations
									.filter(conv => conv.messages.length > 0)
									.map(conv => (
									<div
										key={conv.id}
										className={`wpgraphql-ide-ai-menu-item ${conv.id === activeConversationId ? 'active' : ''}`}
										onClick={() => {
											setActiveConversationId(conv.id);
											setShowConversationMenu(false);
										}}
									>
										<span className="wpgraphql-ide-ai-menu-item-title">
											{conv.messages[0].content[0]?.text.slice(0, 30) + '...'}
										</span>
										{conversations.filter(c => c.messages.length > 0).length > 1 && (
											<button
												className="wpgraphql-ide-ai-menu-item-delete"
												onClick={(e) => {
													e.stopPropagation();
													deleteConversation(conv.id);
												}}
												title={__('Delete', 'wpgraphql-ide')}
											>
												×
											</button>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
			
			<div className="wpgraphql-ide-ai-message-container">
				{error && (
					<div className="wpgraphql-ide-ai-error">
						{error}
					</div>
				)}
				
				{messages.length === 0 ? (
					<div className="wpgraphql-ide-ai-empty-state">
						<div className="wpgraphql-ide-ai-welcome">
							<h3>{__('Welcome to GraphQL Assistant!', 'wpgraphql-ide')}</h3>
							<p>{__('I can help you with:', 'wpgraphql-ide')}</p>
							<ul>
								<li>{__('Writing GraphQL queries, mutations & subscriptions', 'wpgraphql-ide')}</li>
								<li>{__('Understanding your WordPress schema', 'wpgraphql-ide')}</li>
								<li>{__('Debugging errors and optimizing performance', 'wpgraphql-ide')}</li>
								<li>{__('WPGraphQL best practices', 'wpgraphql-ide')}</li>
							</ul>
						</div>
						<div className="wpgraphql-ide-ai-suggestions">
							<p>{__('Try asking:', 'wpgraphql-ide')}</p>
							<button
								className="wpgraphql-ide-ai-suggestion"
								onClick={() => sendMessage('How do I query posts with their featured images?')}
							>
								{__('How do I query posts with their featured images?', 'wpgraphql-ide')}
							</button>
							<button
								className="wpgraphql-ide-ai-suggestion"
								onClick={() => sendMessage('What fields are available on the User type?')}
							>
								{__('What fields are available on the User type?', 'wpgraphql-ide')}
							</button>
							<button
								className="wpgraphql-ide-ai-suggestion"
								onClick={() => sendMessage('Show me how to create a mutation')}
							>
								{__('Show me how to create a mutation', 'wpgraphql-ide')}
							</button>
						</div>
					</div>
				) : (
					<>
						{messages.map(message => (
							<MessageCard 
								key={message.id} 
								message={message}
								onInsertCode={insertCodeIntoEditor}
							/>
						))}
						{isLoading && (
							<div className="wpgraphql-ide-ai-typing-indicator">
								<span className="typing-dot"></span>
								<span className="typing-dot"></span>
								<span className="typing-dot"></span>
							</div>
						)}
						<div ref={messagesEndRef} />
					</>
				)}
			</div>
			
			<div className="wpgraphql-ide-ai-composer">
				<form onSubmit={handleSubmit}>
					<textarea
						ref={textareaRef}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={__('Ask about GraphQL...', 'wpgraphql-ide')}
						disabled={isLoading}
						rows="1"
						className="wpgraphql-ide-ai-input"
					/>
					<button
						type="submit"
						disabled={isLoading || !inputValue.trim()}
						className="wpgraphql-ide-ai-send-button"
					>
						{isLoading ? (
							<svg className="wpgraphql-ide-ai-spinner" width="16" height="16" viewBox="0 0 16 16">
								<circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="32">
									<animate attributeName="stroke-dashoffset" dur="1s" repeatCount="indefinite" from="32" to="0" />
								</circle>
							</svg>
						) : (
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
								<path d="M2 8L14 2L10 8L14 14L2 8Z"/>
							</svg>
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default AIAssistantPanel;
