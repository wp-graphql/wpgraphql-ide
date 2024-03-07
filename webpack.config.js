const defaults = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaults,
	entry: {
		index: path.resolve( process.cwd(), 'src', 'index.js' ),
		app: path.resolve( process.cwd(), 'src', 'App.jsx' ),
		help: path.resolve( process.cwd(), 'plugins/help', 'index.js' ),
		queryComposer: path.resolve( process.cwd(), 'plugins/query-composer', 'index.js' ),
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		'wpgraphql-ide': 'WPGraphQLIDE',
	},
};
