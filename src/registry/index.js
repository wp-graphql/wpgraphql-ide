import { registerEditorToolbarButtons } from './editor-toolbar-buttons';
import { registerActivityBarPlugins } from './activity-bar-plugins';

export const initializeRegistry = () => {
	registerEditorToolbarButtons();
	registerActivityBarPlugins();
};
