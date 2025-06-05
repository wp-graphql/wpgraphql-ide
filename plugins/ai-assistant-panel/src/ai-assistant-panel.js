import { AIAssistantIcon } from './components/AIAssistantIcon';
import { AIAssistantPanel } from './components/AIAssistantPanelChat';

window.addEventListener('WPGraphQLIDE_Window_Ready', (event) => {
	if (!window.WPGraphQLIDE) return;

	const { registerActivityBarPanel } = window.WPGraphQLIDE;

	if ( typeof registerActivityBarPanel === 'function') {
		registerActivityBarPanel( 'ai-assistant', {
			title: 'AI Assistant',
			icon: () => <AIAssistantIcon />,
			content: () => <AIAssistantPanel />,
		}, 2); // Priority 2 to appear before Help panel
	}
});
