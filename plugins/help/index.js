// wpgraphql-ide is registered as an external in the webpack config as it's made available
// on the window object by the main wpgraphql-ide/index.js
import { registerPlugin } from "wpgraphql-ide";
import { Icon, help } from "@wordpress/icons";
import HelpPanel from "./HelpPanel";

registerPlugin( 'help', {
	title: 'Help',
	icon: () => <Icon icon={help} style={{ fill: 'hsla(var(--color-neutral), var(--alpha-tertiary))' }} />,
	content: () => <HelpPanel />
	}
)
