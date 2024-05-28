const defaults = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

const defaultExternals = {
	react: 'React',
	'react-dom': 'ReactDOM',
};

// Define a mapping of entries to their respective externals
const entryExternals = {
	index: {
		...defaultExternals,
	},
	// Define externals for other entries as needed
};

module.exports = {
	...defaults,
	entry: {
		index: path.resolve(process.cwd(), 'src', 'index.js'),
	},
	externals: ({ context, request }, callback) => {
		// Determine the current entry from context or other means
		const currentEntry = determineCurrentEntry(context);
		// Apply the externals based on the current entry
		if (entryExternals[currentEntry] && entryExternals[currentEntry][request]) {
			return callback(null, entryExternals[currentEntry][request]);
		}
		// Fallback to default behavior if no externals are defined for the current entry
		callback();
	},
};

function determineCurrentEntry(context) {
	// Implement logic to determine the current entry based on context
	// This might involve checking the context path to infer which entry is being processed
	// Placeholder implementation:
	return 'index'; // Replace with actual logic to determine the entry
}
