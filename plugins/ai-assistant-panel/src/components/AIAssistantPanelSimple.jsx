import React from 'react';

export const AIAssistantPanel = () => {
	return (
		<div className="wpgraphql-ide-ai-assistant-panel">
			<div className="graphiql-doc-explorer-title">GraphQL Genius</div>
			<div
				style={{
					backgroundColor: `hsla(var(--color-neutral), var(--alpha-background-light))`,
					borderRadius: `calc(var(--border-radius-12) + var(--px-8))`,
					padding: `var(--px-20)`,
					marginTop: `var(--px-20)`,
				}}
			>
				<div
					style={{
						color: `hsla(var(--color-neutral), 1)`,
						fontFamily: `var(--font-family)`,
						fontSize: `var(--font-size-h4)`,
					}}
				>
					Welcome to AI Assistant
				</div>
				<p>This is a test panel that exactly matches the Help panel structure.</p>
			</div>
		</div>
	);
};
