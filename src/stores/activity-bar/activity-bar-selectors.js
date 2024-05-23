/**
 * Selectors for the activity bar.
 *
 * @type {Object}
 */
const selectors = {
	panels: ( state ) => {
		const panels = Object.entries( state.panels ).map(
			( [ name, panel ] ) => ( {
				name,
				...panel,
			} )
		);

		return panels.sort( ( a, b ) => a.priority - b.priority );
	},
	utilities: ( state ) => {
		const utilities = Object.entries( state.utilities ).map(
			( [ name, utility ] ) => ( {
				name,
				...utility,
			} )
		);

		return utilities.sort( ( a, b ) => a.priority - b.priority );
	},
};

export default selectors;
