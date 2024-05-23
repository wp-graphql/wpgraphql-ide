import { HelpIcon } from './HelpIcon';
import { HelpPanel } from './HelpPanel';

export const helpPanel = () => {
	return {
		title: 'Help',
		button: <HelpIcon />,
		content: <HelpPanel />
	}
}

