<?php
/**
 * Plugin Name: Help Panel
 * Description: Registers a new Activity Bar Panel with the IDE.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueues the scripts for the Help Panel.
 */
function enqueue_help_panel_assets(): void {
	$asset_file = include WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'build/help-panel/help-panel.asset.php';

	if ( empty( $asset_file['dependencies'] ) ) {
		return;
	}

	wp_enqueue_script(
		'help-panel',
		WPGRAPHQL_IDE_PLUGIN_URL . 'build/help-panel/help-panel.js',
		array_merge( $asset_file['dependencies'], [ 'wpgraphql-ide' ] ),
		$asset_file['version'],
		true
	);
}
add_action( 'wpgraphqlide_enqueue_script', 'enqueue_help_panel_assets' );
