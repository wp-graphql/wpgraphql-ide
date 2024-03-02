<?php
/**
 * Plugin Name: GraphiQL Help Screen
 * Plugin Author: WPGraphQL
 * Description: Example of how third parties can register plugins that extend the WPGraphQL IDE
 *
 * @package WPGraphQLIDE
 */

namespace WPGraphQLIDE\Plugins\Help;

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

	$asset_file = include WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'build/help.asset.php';

	wp_enqueue_script(
		'wpgraphql-ide-help-plugin',
		WPGRAPHQL_IDE_PLUGIN_URL . 'build/help.js',
		array_merge( $asset_file['dependencies'], [ 'wpgraphql-ide' ] ),
		$asset_file['version'],
		true
	);
}
