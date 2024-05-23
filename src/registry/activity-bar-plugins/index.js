import {registerActivityBarPluginButton} from "../../access-functions";
import {helpButton} from "./help";
import {toggleAuthButton} from "../editor-toolbar-buttons/toggle-auth-button";

export const registerActivityBarPlugins = () => {
	registerActivityBarPluginButton( 'help', helpButton, 1 );
	registerActivityBarPluginButton( 'toggle-auth', toggleAuthButton, 2 );
}
