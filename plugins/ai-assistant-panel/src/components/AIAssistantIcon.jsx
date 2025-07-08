import React from 'react';

export const AIAssistantIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className="ai-assistant-icon"
	>
		<path
			d="M12 2L2 7L12 12L22 7L12 2Z"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M2 17L12 22L22 17"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M2 12L12 17L22 12"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		{/* AI sparkle effect */}
		<circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.8" />
		<circle cx="8" cy="9" r="1" fill="currentColor" opacity="0.6" />
		<circle cx="16" cy="9" r="1" fill="currentColor" opacity="0.6" />
	</svg>
);
