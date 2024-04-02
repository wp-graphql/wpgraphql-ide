/**
 * External dependencies
 */
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const MomentTimezoneDataPlugin = require( 'moment-timezone-data-webpack-plugin' );
const { join } = require( 'path' );

/**
 * WordPress dependencies
 */
const {
	camelCaseDash,
} = require( '@wordpress/dependency-extraction-webpack-plugin/lib/util' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );

/**
 * Internal dependencies
 */
const { dependencies } = require( '../../package' );
const { baseConfig, plugins, stylesTransform } = require( './shared' );

const WPGRAPHQL_IDE_NAMESPACE = '@wpgraphql-ide/';

// Experimental or other packages that should be private are bundled when used.
// That way, we can iterate on these package without making them part of the public API.
// See: https://github.com/WordPress/gutenberg/pull/19809
//
// !!
// This list must be kept in sync with the matching list in packages/dependency-extraction-webpack-plugin/lib/util.js
// !!
const BUNDLED_PACKAGES = [];

const wpgraphqlIdePackages = Object.keys( dependencies )
	.filter(
		( packageName ) =>
			! BUNDLED_PACKAGES.includes( packageName ) &&
			packageName.startsWith( WPGRAPHQL_IDE_NAMESPACE ) &&
			! packageName.startsWith( WPGRAPHQL_IDE_NAMESPACE + 'react-native' ) &&
			! packageName.startsWith( WPGRAPHQL_IDE_NAMESPACE + 'interactivity' )
	)
	.map( ( packageName ) => packageName.replace( WPGRAPHQL_IDE_NAMESPACE, '' ) );

const exportDefaultPackages = [
	'api-fetch',
	'deprecated',
	'dom-ready',
	'redux-routine',
	'token-list',
	'server-side-render',
	'shortcode',
	'warning',
];

const vendors = {
	react: [
		'react/umd/react.development.js',
		'react/umd/react.production.min.js',
	],
	'react-dom': [
		'react-dom/umd/react-dom.development.js',
		'react-dom/umd/react-dom.production.min.js',
	],
	'inert-polyfill': [
		'wicg-inert/dist/inert.js',
		'wicg-inert/dist/inert.min.js',
	],
};
const vendorsCopyConfig = Object.entries( vendors ).flatMap(
	( [ key, [ devFilename, prodFilename ] ] ) => {
		return [
			{
				from: `node_modules/${ devFilename }`,
				to: `build/vendors/${ key }.js`,
			},
			{
				from: `node_modules/${ prodFilename }`,
				to: `build/vendors/${ key }.min.js`,
			},
		];
	}
);
module.exports = {
	...baseConfig,
	name: 'packages',
	entry: Object.fromEntries(
		wpgraphqlIdePackages.map( ( packageName ) => [
			packageName,
			{
				import: `./packages/${ packageName }`,
				library: {
					name: [ 'wpgraphqlIde', camelCaseDash( packageName ) ],
					type: 'window',
					export: exportDefaultPackages.includes( packageName )
						? 'default'
						: undefined,
				},
			},
		] )
	),
	output: {
		devtoolNamespace: 'wpgraphqlIde',
		filename: './build/[name]/index.min.js',
		path: join( __dirname, '..', '..' ),
		devtoolModuleFilenameTemplate: ( info ) => {
			if ( info.resourcePath.includes( '/@wpgraphql-ide/' ) ) {
				const resourcePath =
					info.resourcePath.split( '/@wpgraphql-ide/' )[ 1 ];
				return `../../packages/${ resourcePath }`;
			}
			return `webpack://${ info.namespace }/${ info.resourcePath }`;
		},
	},
	performance: {
		hints: false, // disable warnings about package sizes
	},
	plugins: [
		...plugins,
		new DependencyExtractionWebpackPlugin( { injectPolyfill: true } ),
		new CopyWebpackPlugin( {
			patterns: wpgraphqlIdePackages
				.map( ( packageName ) => ( {
					from: '*.css',
					context: `./packages/${ packageName }/build-style`,
					to: `./build/${ packageName }`,
					transform: stylesTransform,
					noErrorOnMissing: true,
				} ) )
				.concat( vendorsCopyConfig ),
		} ),
		new MomentTimezoneDataPlugin( {
			startYear: 2000,
			endYear: 2040,
		} ),
	].filter( Boolean ),
};
