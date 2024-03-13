<?php
/**
 * Plugin Name: WPGraphQL for ACF Example
 * Description: Example of how the WPGraphQL for ACF extension could hook into the WPGraphQL IDE to add a new tab to the GraphiQL IDE.
 * Plugin Author: WPGraphQL
 * Author URI: https://www.wpgraphql.com
 */

namespace WPGraphQLIDE\Plugins\Acf;

/**
 * Hook into the GraphiQL enqueue lifecycle, ensuring scripts are only loaded if the GraphiQL IDE
 * is also loaded.
 */
add_action( 'wpgraphqlide_enqueue_script', __NAMESPACE__ . '\\enqueue_plugin' );

/**
 * Enqueue the plugin scripts and styles.
 *
 * @return void
 */
function enqueue_plugin() {

	$asset_file = include WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'build/acf.asset.php';

	wp_enqueue_script(
		'wpgraphql-ide-acf',
		WPGRAPHQL_IDE_PLUGIN_URL . 'build/acf.js',
		array_merge( $asset_file['dependencies'], [ 'wpgraphql-ide' ] ),
		$asset_file['version'],
		true
	);
}
