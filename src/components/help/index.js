import { Icon, help } from '@wordpress/icons';
import HelpPanel from './HelpPanel';

export const helpPlugin = () => {
	return {
		title: 'Help',
		icon: () => (
			<Icon
				icon={help}
				style={{
					fill: 'hsla(var(--color-neutral), var(--alpha-tertiary))',
				}}
			/>
		),
		content: () => <HelpPanel/>,
	};
};
