/**
 * External dependencies
 *
 * This file includes code originally written by Automattic and contributors of the
 * WordPress/gutenberg plugin, and is released under the terms of the GNU General Public License
 * version 2.0 (GPLv2).
 *
 * @see https://github.com/WordPress/gutenberg
 */
const fs = require( 'fs' );
const path = require( 'path' );

/**
 * Absolute path to packages directory.
 *
 * @type {string}
 */
const PACKAGES_DIR = path.resolve( __dirname, '../../packages' );

/**
 * Returns true if the given base file name for a file within the packages
 * directory is itself a directory.
 *
 * @param {string} file Packages directory file.
 *
 * @return {boolean} Whether file is a directory.
 */
function isDirectory( file ) {
	return fs.lstatSync( path.resolve( PACKAGES_DIR, file ) ).isDirectory();
}

/**
 * Returns true if the given packages has "module" field.
 *
 * @param {string} file Packages directory file.
 *
 * @return {boolean} Whether file is a directory.
 */
function hasModuleField( file ) {
	let pkg;
	try {
		pkg = require( path.resolve( PACKAGES_DIR, file, 'package.json' ) );
	} catch {
		// If, for whatever reason, the package's `package.json` cannot be read,
		// consider it as an invalid candidate. In most cases, this can happen
		// when lingering directories are left in the working path when changing
		// to an older branch where a package did not yet exist.
		return false;
	}

	return !! pkg.module;
}

/**
 * Filter predicate, returning true if the given base file name is to be
 * included in the build.
 *
 * @param {string} pkg File base name to test.
 *
 * @return {boolean} Whether to include file in build.
 */
function filterPackages( pkg ) {
	return [ isDirectory, hasModuleField ].every( ( check ) => check( pkg ) );
}

/**
 * Returns the absolute path of all WordPress packages
 *
 * @return {Array} Package paths
 */
function getPackages() {
	return fs
		.readdirSync( PACKAGES_DIR )
		.filter( filterPackages )
		.map( ( file ) => path.resolve( PACKAGES_DIR, file ) );
}

module.exports = getPackages;

