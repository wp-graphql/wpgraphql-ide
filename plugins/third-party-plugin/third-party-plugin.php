<?php
/**
 * Plugin Name:       Third Party Plugin
 * License:           GPLv3 or later
 * Text Domain:       wpgraphql-ide
 * Version:           1.0.0-beta.2
 * Requires PHP:      7.4
 * Tested up to:      6.5
 */


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'THIRD_PARTY_PLUGIN_PLUGIN_DIR_PATH', plugin_dir_path( __FILE__ ) );
define( 'THIRD_PARTY_PLUGIN_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

add_action( 'wpgraphqlide_enqueue_script', function() {
    $asset_file = include THIRD_PARTY_PLUGIN_PLUGIN_DIR_PATH . 'build/index.asset.php';

	if ( empty( $asset_file['dependencies'] ) ) {
		return;
	}

    wp_enqueue_script(
        'third-party-plugin',
        plugins_url( 'build/index.js', __FILE__ ),
        array_merge( $asset_file['dependencies'], ['wpgraphql-ide-js'] ),
        $asset_file['version']
    );

	wp_enqueue_style(
		'third-party-plugin',
		plugins_url( 'build/style-index.css', __FILE__ ),
		[],
		$asset_file['version'],
	);

});

