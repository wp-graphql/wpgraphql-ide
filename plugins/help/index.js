const { registerPlugin } = WPGraphQLIDE;
import { Icon, help } from "@wordpress/icons";

registerPlugin( 'help', {
	title: 'Help',
	icon: () => <Icon icon={help} />,
	content: () => <><h2>This is a 3rd party plugin.</h2></>
})
