<?php
/**
 * Plugin Name: WPGraphQL IDE Query Composer
 * Plugin Author: WPGraphQL
 * Description: An interactive point-and-click interface for composing GraphQL queries
 */

namespace WPGraphQLIDE\Plugins\QueryComposer;

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

	$asset_file = include WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'build/queryComposer.asset.php';

	wp_enqueue_script(
		'wpgraphql-ide-query-composer-plugin',
		WPGRAPHQL_IDE_PLUGIN_URL . 'build/queryComposer.js',
		array_merge( $asset_file['dependencies'], [ 'wpgraphql-ide' ] ),
		$asset_file['version'],
		true
	);
}
