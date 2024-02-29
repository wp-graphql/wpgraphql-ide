<?php
/**
 * Plugin Name: GraphiQL Help Screen
 * Plugin Author: WPGraphQL
 * Description: Example of how third parties can register plugins that extend the WPGraphQL IDE
 */

namespace WPGraphQLIDE\Plugins\Help;

add_action( 'wpgraphqlide_enqueue_script', __NAMESPACE__ . '\\enqueue_plugin' );

function enqueue_plugin() {

	$asset_file = include WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'build/help.asset.php';

	wp_enqueue_script(
		'wpgraphql-ide-help-plugin',
		WPGRAPHQL_IDE_PLUGIN_URL . 'build/help.js',
		array_merge( $asset_file['dependencies']),
		$asset_file['version'],
		true
	);

}
