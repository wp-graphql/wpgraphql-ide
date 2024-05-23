import {help, Icon} from "@wordpress/icons";

export const helpButton = () => {
	return {
		label: 'Help',
		onClick: () => {
			console.log('Help button clicked');
		},
		children: (
			<Icon
				icon={ help }
				style={ {
					fill: 'hsla(var(--color-neutral), var(--alpha-tertiary))',
				} }
			/>
		)
	};
}
