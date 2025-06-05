import React, { useState, useRef, useEffect } from 'react';
import { useSelect } from '@wordpress/data';
import { Button, Spinner, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ReactMarkdown from 'react-markdown';

export const AIAssistantPanel = () => {
	const [messages, setMessages] = useState([
		{
			type: 'assistant',
			content: "👋 Hi! I'm your GraphQL assistant. I can help you write queries, understand your schema, and suggest optimizations.",
			timestamp: new Date(),
		}
	]);
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Get current query and schema from the store
	const { query, schema } = useSelect((select) => {
		const wpgraphqlIDEApp = select('wpgraphql-ide/app');
		return {
			query: wpgraphqlIDEApp.getQuery(),
			schema: wpgraphqlIDEApp.schema(),
		};
	});

	const sendMessage = async () => {
		if (!inputValue.trim() || isLoading) return;

		const userMessage = {
			type: 'user',
			content: inputValue,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue('');
		setIsLoading(true);

		try {
			const response = await fetch(
				`${window.WPGRAPHQL_AI_ASSISTANT_DATA.apiUrl}/chat`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': window.WPGRAPHQL_AI_ASSISTANT_DATA.nonce,
					},
					body: JSON.stringify({
						message: inputValue,
						context: {
							query: query || '',
							schema: schema ? JSON.stringify(schema).substring(0, 2000) : '',
						},
					}),
				}
			);

			if (!response.ok) {
				throw new Error('Failed to get response');
			}

			const data = await response.json();
			
			setMessages((prev) => [
				...prev,
				{
					type: 'assistant',
					content: data.response,
					timestamp: new Date(),
				},
			]);
		} catch (error) {
			console.error('Error sending message:', error);
			setMessages((prev) => [
				...prev,
				{
					type: 'assistant',
					content: '❌ Sorry, I encountered an error. Please make sure the Gemini API key is configured in the settings.',
					timestamp: new Date(),
					isError: true,
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		sendMessage();
	};

	return (
		<div className="wpgraphql-ide-ai-assistant-panel">
			<div className="graphiql-doc-explorer-title">GraphQL Genius 🧠</div>
			
			{/* Messages Container */}
			<div style={{ padding: `var(--px-20)` }}>
				{messages.map((message, index) => (
					<div
						key={index}
						style={{
							backgroundColor: `hsla(var(--color-neutral), var(--alpha-background-light))`,
							borderRadius: `calc(var(--border-radius-12) + var(--px-8))`,
							padding: `var(--px-20)`,
							marginTop: index === 0 ? `var(--px-20)` : `var(--px-12)`,
						}}
					>
						<div
							style={{
								color: `hsla(var(--color-neutral), 1)`,
								fontFamily: `var(--font-family)`,
								fontSize: `var(--font-size-body)`,
								fontWeight: message.type === 'user' ? 'bold' : 'normal',
								marginBottom: message.type === 'user' ? '0' : `var(--px-8)`,
							}}
						>
							{message.type === 'user' ? 'You:' : 'AI Assistant:'}
						</div>
						{message.type === 'assistant' ? (
							<ReactMarkdown
								components={{
									p: ({ children }) => <p style={{ margin: '0' }}>{children}</p>,
									code: ({ children }) => (
										<code style={{
											backgroundColor: 'rgba(0,0,0,0.2)',
											padding: '2px 4px',
											borderRadius: '3px',
											fontSize: '0.9em'
										}}>
											{children}
										</code>
									),
								}}
							>
								{message.content}
							</ReactMarkdown>
						) : (
							<p style={{ margin: '0' }}>{message.content}</p>
						)}
					</div>
				))}
				
				{isLoading && (
					<div
						style={{
							backgroundColor: `hsla(var(--color-neutral), var(--alpha-background-light))`,
							borderRadius: `calc(var(--border-radius-12) + var(--px-8))`,
							padding: `var(--px-20)`,
							marginTop: `var(--px-12)`,
						}}
					>
						<Spinner /> Thinking...
					</div>
				)}
			</div>

			{/* Input Area */}
			<div style={{ padding: `var(--px-20)`, marginTop: `var(--px-20)` }}>
				<form onSubmit={handleSubmit}>
					<TextareaControl
						value={inputValue}
						onChange={setInputValue}
						placeholder="Ask me about your GraphQL query..."
						rows={3}
						style={{ marginBottom: `var(--px-12)` }}
					/>
					<Button 
						variant="primary" 
						type="submit" 
						disabled={isLoading || !inputValue.trim()}
					>
						{isLoading ? 'Sending...' : 'Send'}
					</Button>
				</form>
			</div>
		</div>
	);
};
