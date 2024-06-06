<?php
/**
 * Plugin Name: Query Composer
 * Description: Registers a new Activity Bar Panel with the IDE
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueues the scripts and styles for the Query Composer panel.
 *
 * @return void
 */
function enqueue_query_composer_panel_assets(): void {
	$asset_file = include WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'build/query-composer-panel/query-composer-panel.asset.php';

	if ( empty( $asset_file['dependencies'] ) ) {
		return;
	}

	wp_enqueue_script(
		'query-composer-panel',
		WPGRAPHQL_IDE_PLUGIN_URL . 'build/query-composer-panel/query-composer-panel.js',
		array_merge( $asset_file['dependencies'], [ 'wpgraphql-ide' ] ),
		$asset_file['version'],
		true
	);

	wp_enqueue_style(
		'query-composer-panel',
		WPGRAPHQL_IDE_PLUGIN_URL . 'build/style-query-composer-panel.css',
		[],
		$asset_file['version']
	);
}
add_action( 'wpgraphqlide_enqueue_script', 'enqueue_query_composer_panel_assets' );
