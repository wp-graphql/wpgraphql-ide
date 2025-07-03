import React, { useState, useRef, useEffect } from 'react';
import { useSelect } from '@wordpress/data';
import { Button, Spinner, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ReactMarkdown from 'react-markdown';

export const AIAssistantPanel = () => {
	const [messages, setMessages] = useState([
		{
			type: 'assistant',
			content: "👋 Hi! I'm your GraphQL assistant. I can help you write queries, understand your schema, and suggest optimizations. How can I help you today?",
			timestamp: new Date(),
		}
	]);
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);

	// Get current query and schema from the store
	const { query, schema } = useSelect((select) => {
		const wpgraphqlIDEApp = select('wpgraphql-ide/app');
		
		return {
			query: wpgraphqlIDEApp.getQuery(),
			schema: wpgraphqlIDEApp.schema(),
		};
	});

	// Scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

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
			inputRef.current?.focus();
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		sendMessage();
	};

	return (
		<div style={{ padding: '16px', height: '100%' }}>
			<div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>GraphQL Genius 🧠</div>
			
			<div style={{ padding: '16px', overflowY: 'auto', height: 'calc(100% - 150px)' }}>
				{messages.map((message, index) => (
					<div
						key={index}
						style={{
							marginBottom: '12px',
							display: 'flex',
							justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
						}}
					>
						<div
							style={{
								maxWidth: '80%',
								padding: '8px 12px',
								borderRadius: '8px',
								backgroundColor: message.type === 'user' ? '#007cba' : '#252526',
								color: '#fff'
							}}
						>
							{message.type === 'assistant' ? (
								<ReactMarkdown>{message.content}</ReactMarkdown>
							) : (
								message.content
							)}
						</div>
					</div>
				))}
				{isLoading && (
					<div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'flex-start' }}>
						<div
							style={{
								maxWidth: '80%',
								padding: '8px 12px',
								borderRadius: '8px',
								backgroundColor: '#252526',
								color: '#fff'
							}}
						>
							<Spinner /> Thinking...
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			<div style={{ padding: '16px', borderTop: '1px solid #333' }}>
				<form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
					<TextareaControl
						value={inputValue}
						onChange={setInputValue}
						placeholder="Ask me about your GraphQL query..."
						style={{ flex: 1, marginBottom: 0 }}
						rows={2}
					/>
					<Button 
						variant="primary" 
						type="submit" 
						disabled={isLoading || !inputValue.trim()}
						style={{ alignSelf: 'flex-end' }}
					>
						{isLoading ? <Spinner /> : 'Send'}
					</Button>
				</form>
			</div>
		</div>
	);
};
