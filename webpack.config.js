/**
 * This file includes code originally written by Automattic and contributors of the
 * WordPress/gutenberg plugin, and is released under the terms of the GNU General Public License
 * version 2.0 (GPLv2).
 *
 * @see https://github.com/WordPress/gutenberg
 */
// const defaults = require( '@wordpress/scripts/config/webpack.config' );
// const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
// const MomentTimezoneDataPlugin = require( 'moment-timezone-data-webpack-plugin' );
// const path = require( 'path' );
// const { join } = path;
//
// const {
// 	camelCaseDash,
// } = require( '@wordpress/dependency-extraction-webpack-plugin/lib/util' );
// const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
//
// const WPGRAPHQL_IDE_NAMESPACE = '@wpgraphql-ide/';
//
// /**
//  * Get all dependencies from the package.json
//  */
// const { dependencies } = require( './package.json' );
//
// const stylesTransform = ( content ) => {
// 	return postcss( [
// 		require( 'cssnano' )( {
// 			preset: [
// 				'default',
// 				{
// 					discardComments: {
// 						removeAll: true,
// 					},
// 					normalizeWhitespace: mode === 'production',
// 				},
// 			],
// 		} ),
// 	] )
// 		.process( content, {
// 			from: 'src/app.css',
// 			to: 'dest/app.css',
// 		} )
// 		.then( ( result ) => result.css );
// };
//
// /**
//  * Determine which packages are part of the WPGraphQL IDE namespace
//  */
// const wpgraphqlIdePackages = Object.keys( dependencies )
// 	.filter(
// 		( dependency ) => dependency.startsWith( WPGRAPHQL_IDE_NAMESPACE )
// 	).map(
// 		( dependency ) => dependency.replace( WPGRAPHQL_IDE_NAMESPACE, '' )
// 	);
//
// console.log( {
// 	dependencies,
// 	wpgraphqlIdePackages,
// })
//
// const exportDefaultPackages = [];
//
// const getEntries = () => {
// 	return Object.fromEntries(
// 		wpgraphqlIdePackages.map( ( packageName ) => [
// 			packageName,
// 			{
// 				import: `./packages/${ packageName }`,
// 				library: {
// 					name: [ 'wpgraphql-ide', camelCaseDash( packageName ) ],
// 					type: 'window',
// 					export: exportDefaultPackages.includes( packageName ) ? 'default' : undefined,
// 				}
// 			}
// 		])
// 	);
// }
//
// console.log( {
// 	entries: getEntries(),
// })
//
// const vendors = {
// 	react: [
// 		'react/umd/react.development.js',
// 		'react/umd/react.production.min.js',
// 	],
// 	'react-dom': [
// 		'react-dom/umd/react-dom.development.js',
// 		'react-dom/umd/react-dom.production.min.js',
// 	],
// 	'inert-polyfill': [
// 		'wicg-inert/dist/inert.js',
// 		'wicg-inert/dist/inert.min.js',
// 	],
// };
//
// const vendorsCopyConfig = Object.entries( vendors ).flatMap(
// 	( [ key, [ devFilename, prodFilename ] ] ) => {
// 		return [
// 			{
// 				from: `node_modules/${ devFilename }`,
// 				to: `build/vendors/${ key }.js`,
// 			},
// 			{
// 				from: `node_modules/${ prodFilename }`,
// 				to: `build/vendors/${ key }.min.js`,
// 			},
// 		];
// 	}
// );
//
// module.exports = {
// 	entry: getEntries(),
// 	output: {
// 		devtoolNamespace: 'wpgraphql-ide',
// 		filename: './build/[name]/index.min.js',
// 		path: join( __dirname, '..', '..' ),
// 		devtoolModuleFilenameTemplate: (info) => {
// 			if (info.resourcePath.includes( '/@wpgraphql-ide/' )) {
// 				const resourcePath =
// 					info.resourcePath.split( '/@wpgraphql-ide/' )[ 1 ];
// 				return `../../packages/${ resourcePath }`;
// 			}
// 			return `webpack://${ info.namespace }/${ info.resourcePath }`;
// 		}
// 	},
// 	performance: {
// 		hints: false,
// 	},
// 	plugins: [
// 		new DependencyExtractionWebpackPlugin( { injectPolyfill: true } ),
// 		new CopyWebpackPlugin( {
// 			patterns: wpgraphqlIdePackages
// 				.map( ( packageName ) => ( {
// 					from: '*.css',
// 					context: `./packages/${ packageName }/build-style`,
// 					to: `./build/${ packageName }`,
// 					transform: stylesTransform,
// 					noErrorOnMissing: true,
// 				} ) )
// 				// .concat( bundledPackagesPhpConfig )
// 				.concat( vendorsCopyConfig ),
// 		} ),
// 		new MomentTimezoneDataPlugin( {
// 			startYear: 2000,
// 			endYear: 2040,
// 		} ),
// 	].filter( Boolean ),
// };

/**
 * Internal dependencies
 */
const blocksConfig = require( './tools/webpack/blocks' );
const developmentConfigs = require( './tools/webpack/development' );
const packagesConfig = require( './tools/webpack/packages' );

module.exports = [
	// ...blocksConfig,
	packagesConfig,
	...developmentConfigs,
];
