<?php
/**
 * Plugin Name: Help Panel
 * Description: Registers a new Activity Bar Panel with the IDE
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'HELP_PANEL_PLUGIN_DIR_PATH', plugin_dir_path( __FILE__ ) );

add_action( 'wpgraphqlide_enqueue_script', function() {
    $asset_file = include WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'build/help-panel/help-panel.asset.php';

	if ( empty( $asset_file['dependencies'] ) ) {
		return;
	}

    wp_enqueue_script(
        'help-panel',
	    WPGRAPHQL_IDE_PLUGIN_URL . 'build/help-panel/help-panel.js',
        array_merge( $asset_file['dependencies'], ['wpgraphql-ide'] ),
        $asset_file['version']
    );

});

