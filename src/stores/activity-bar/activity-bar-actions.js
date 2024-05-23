/**
 * The initial state of the app.
 *
 * @type {Object}
 */
const actions = {
	registerPluginButton: ( name, config, priority ) => ( {
		type: 'REGISTER_PLUGIN_BUTTON',
		name,
		config,
		priority,
	} ),
	registerUtilityButton: ( name, config, priority ) => ( {
		type: 'REGISTER_UTILITY_BUTTON',
		name,
		config,
		priority,
	} ),
};

export default actions;
