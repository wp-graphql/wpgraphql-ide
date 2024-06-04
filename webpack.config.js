const defaults = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { createHash } = require('crypto');
const packageJson = require('./package.json');

function sluggify(filename) {
	return filename
		.replace(/[^a-zA-Z0-9-]/g, ' ') // Remove all non-letter and non-dash characters
		.replace(/\s+/g, '-')       // Replace spaces with dashes
		.toLowerCase();
}

module.exports = {
	...defaults,
	entry: {
		graphql: path.resolve( process.cwd(), 'src', 'graphql.js' ),
		"wpgraphql-ide": path.resolve( process.cwd(), 'src', 'index.js' ),
		"wpgraphql-ide-render": path.resolve( process.cwd(), 'src', 'render.js' ),
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		graphql: 'graphql',
	},
	plugins: [
		...defaults.plugins,
		new WebpackManifestPlugin({
			fileName: 'manifest.json',
			publicPath: 'build/',
			generate: (seed, files) => {
				const manifest = {};
				manifest.name = packageJson.name;
				manifest.version = packageJson.version;
				manifest.assets = files.reduce((acc, file) => {
					const hash = createHash('md5').update(file.path).digest('hex').substr(0, 8);
					acc[ sluggify( file.name ) ] = {
						path: file.path,
						hash,
						size: file.size,
						chunkName: file.chunk ? file.chunk.name : null,
						originalFileName: path.basename(file.name),
					};
					return acc;
				}, seed);
				return manifest;
			},
		}),
	],
};
