/**
 * Selectors for the app state.
 * @type {object}
 */
const selectors = {
	getQuery: ( state ) => {
		return state.query;
	},
	isDrawerOpen: ( state ) => {
		return state.isDrawerOpen;
	},
	shouldRenderStandalone: ( state ) => {
		return state.shouldRenderStandalone;
	},
	isInitialStateLoaded: ( state ) => {
		return state.isInitialStateLoaded;
	},
	getPluginsArray: ( state ) => {
		const registeredPlugins = state.registeredPlugins;
		const pluginsArray = [];
		Object.entries( registeredPlugins ).map( ( [ key, config ] ) => {
			const plugin = () => {
				return config;
			};
			pluginsArray.push( plugin() );
		} );
		return pluginsArray;
	},
	isAuthenticated: ( state ) => {
		return state.isAuthenticated;
	},
};

export default selectors;
