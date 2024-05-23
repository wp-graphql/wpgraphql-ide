/**
 * Selectors for the app state.
 * @type {Object}
 */
const selectors = {
	pluginButtons: ( state ) => {
		const buttons = Object.entries( state.pluginButtons ).map(
			( [ name, button ] ) => ( {
				name,
				...button,
			} )
		);

		return buttons.sort( ( a, b ) => a.priority - b.priority );
	},
	utilityButtons: ( state ) => {
		const buttons = Object.entries( state.utilityButtons ).map(
			( [ name, button ] ) => ( {
				name,
				...button,
			} )
		);

		return buttons.sort( ( a, b ) => a.priority - b.priority );
	},
};

export default selectors;
