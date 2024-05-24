import { HelpIcon } from './HelpIcon';
import { HelpPanel } from './HelpPanel';

export const helpPanel = () => {
	return {
		title: 'unique-title', // TODO: possibly handle title generation for user
		label: 'Help!',
		icon: () => (<HelpIcon />),
		content: () => <HelpPanel />
	}
}

