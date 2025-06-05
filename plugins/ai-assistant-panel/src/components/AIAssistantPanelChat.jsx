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
				setConversations(parsed);
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
		// Dispatch event to insert code into the active editor
		const event = new CustomEvent('wpgraphql-ide:insert-code', {
			detail: { code }
		});
		window.dispatchEvent(event);
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
			textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
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
							title={__('Conversation history', 'wpgraphql-ide')}
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
								<path d="M3 2h10a1 1 0 011 1v7a1 1 0 01-1 1H8l-3 3v-3H3a1 1 0 01-1-1V3a1 1 0 011-1z"/>
							</svg>
							<span style={{ fontSize: '12px', marginLeft: '4px' }}>
								{conversations.length}
							</span>
						</button>
						{showConversationMenu && (
							<div className="wpgraphql-ide-ai-conversation-menu">
								<button
									className="wpgraphql-ide-ai-menu-item"
									onClick={createNewConversation}
								>
									<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
										<path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2"/>
									</svg>
									{__('New Conversation', 'wpgraphql-ide')}
								</button>
								<div className="wpgraphql-ide-ai-menu-divider" />
								{conversations.map(conv => (
									<div
										key={conv.id}
										className={`wpgraphql-ide-ai-menu-item ${conv.id === activeConversationId ? 'active' : ''}`}
										onClick={() => {
											setActiveConversationId(conv.id);
											setShowConversationMenu(false);
										}}
									>
										<span className="wpgraphql-ide-ai-menu-item-title">
											{conv.messages.length > 0 
												? conv.messages[0].content[0]?.text.slice(0, 30) + '...'
												: conv.title
											}
										</span>
										<button
											className="wpgraphql-ide-ai-menu-item-delete"
											onClick={(e) => {
												e.stopPropagation();
												deleteConversation(conv.id);
											}}
										>
											×
										</button>
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
