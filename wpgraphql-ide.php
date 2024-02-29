<?php
/**
 * Plugin Name:       WPGraphQL IDE
 * Description:       A next-gen query editor for WPGraphQL.
 * Author:            Joseph Fusco
 * Author URI:        https://github.com/josephfusco
 * GitHub Plugin URI: https://github.com/josephfusco/wpgraphql-ide
 * License:           GPLv3 or later
 * Text Domain:       wpgraphql-ide
 * Version:           1.0.1
 * Requires PHP:      7.4
 * Tested up to:      6.4.3
 *
 * @package WPGraphQLIDE
 */

namespace WPGraphQLIDE;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WPGRAPHQL_IDE_ROOT_ELEMENT_ID', 'wpgraphql-ide-root' );

/**
 * Generates the SVG logo for GraphQL.
 *
 * @return string The SVG logo markup.
 */
function graphql_logo_svg(): string {
	return <<<XML
    <svg xmlns="http://www.w3.org/2000/svg" fill="color(display-p3 .8824 0 .5961)" viewBox="0 0 100 100">
        <path fill-rule="evenodd" d="m50 6.903 37.323 21.549v43.096L50 93.097 12.677 71.548V28.451L50 6.903ZM16.865 30.87v31.656L44.28 15.041 16.864 30.87ZM50 13.51 18.398 68.246h63.205L50 13.509Zm27.415 58.924h-54.83L50 88.261l27.415-15.828Zm5.72-9.908L55.72 15.041 83.136 30.87v31.656Z" clip-rule="evenodd"/>
        <circle cx="50" cy="9.321" r="8.82"/>
        <circle cx="85.229" cy="29.66" r="8.82"/>
        <circle cx="85.229" cy="70.34" r="8.82"/>
        <circle cx="50" cy="90.679" r="8.82"/>
        <circle cx="14.766" cy="70.34" r="8.82"/>
        <circle cx="14.766" cy="29.66" r="8.82"/>
    </svg>
    XML;
}

/**
 * Checks if the current user lacks the capability required to load scripts and styles for the GraphQL IDE.
 *
 * @return bool Whether the user lacks the required capability.
 */
function user_lacks_capability(): bool {
	$capability_required = apply_filters( 'wpgraphqlide_capability_required', 'manage_options' );

	return ! current_user_can( $capability_required );
}

/**
 * Checks if the current page is intended for the dedicated WPGraphQL IDE (non-drawer).
 *
 * @return bool True if the current page is a dedicated WPGraphQL IDE page, false otherwise.
 */
function is_dedicated_ide_page(): bool {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return false;
	}

	$screen = get_current_screen();
	if ( ! $screen ) {
		return false;
	}

	$dedicated_ide_screens = [
		'toplevel_page_graphiql-ide', // old - GraphiQL IDE
		'graphql_page_graphql-ide',   // new - GraphQL IDE
	];

	return in_array( $screen->id, $dedicated_ide_screens, true );
}

/**
 * Registers a custom menu item in the WordPress Admin Bar.
 *
 * This function adds the mount point for the plugin's React app.
 *
 * @global WP_Admin_Bar $wp_admin_bar The WordPress Admin Bar instance.
 */
function register_wpadminbar_menu(): void {
	if ( is_dedicated_ide_page() ) {
		return;
	}

	if ( user_lacks_capability() ) {
		return;
	}

	global $wp_admin_bar;

	$args = [
		'id'    => 'wpgraphql-ide',
		'title' => '<div id="' . esc_attr( WPGRAPHQL_IDE_ROOT_ELEMENT_ID ) . '"></div>',
		'href'  => '#',
	];

	$wp_admin_bar->add_node( $args );
}
add_action( 'admin_bar_menu', __NAMESPACE__ . '\\register_wpadminbar_menu', 999 );

/**
 * Registers a submenu page for the dedicated GraphQL IDE.
 *
 * This function checks if the current user has the necessary capabilities
 * to access the GraphQL IDE. If the user has the required capabilities,
 * it adds a submenu page under a specified parent menu. The submenu page
 * is intended to provide access to a dedicated GraphQL IDE within the WordPress
 * admin area.
 *
 * @see add_submenu_page() For more information on adding submenu pages.
 * @link https://developer.wordpress.org/reference/functions/add_submenu_page/
 */
function register_dedicated_ide_menu(): void {
	if ( user_lacks_capability() ) {
		return;
	}

	add_submenu_page(
		'graphiql-ide',
		__( 'GraphQL IDE', 'wp-graphql' ),
		__( 'GraphQL IDE', 'wp-graphql' ),
		'manage_options',
		'graphql-ide',
		__NAMESPACE__ . '\\render_dedicated_ide_page'
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\\register_dedicated_ide_menu' );

/**
 * Renders the container for the dedicated IDE page for the React app to be mounted to.
 */
function render_dedicated_ide_page(): void {
	echo '<div id="' . esc_attr( WPGRAPHQL_IDE_ROOT_ELEMENT_ID ) . '"></div>';
}

/**
 * Enqueues custom CSS to set the "GraphQL IDE" menu item icon in the WordPress Admin Bar.
 */
function enqueue_graphql_ide_menu_icon_css(): void {
	if ( is_dedicated_ide_page() ) {
		return;
	}

	if ( user_lacks_capability() ) {
		return;
	}

	$custom_css = '
        #wp-admin-bar-wpgraphql-ide .ab-icon::before {
            background-image: url("data:image/svg+xml;base64,' . base64_encode( graphql_logo_svg() ) . '");
            background-size: 100%;
            border-radius: 12px;
            box-sizing: border-box;
            content: "";
            display: inline-block;
            height: 24px;
            width: 24px;
        }
    ';

	wp_add_inline_style( 'admin-bar', $custom_css );
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_graphql_ide_menu_icon_css' );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_graphql_ide_menu_icon_css' );

/**
 * Enqueues the React application script and associated styles.
 */
function enqueue_react_app_with_styles(): void {
	if ( ! class_exists( '\WPGraphQL\Router' ) ) {
		return;
	}

	if ( user_lacks_capability() ) {
		return;
	}

	// Don't enqueue new styles/scripts on the legacy IDE page
	if ( function_exists( 'get_current_screen' ) ) {
		$screen = get_current_screen();
		if ( 'toplevel_page_graphiql-ide' === $screen->id ) {
			return;
		}
	}

	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	wp_enqueue_script(
		'wpgraphql-ide-app',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	$app_context = get_app_context();

	wp_localize_script(
		'wpgraphql-ide-app',
		'WPGRAPHQL_IDE_DATA',
		[
			'nonce'               => wp_create_nonce( 'wp_rest' ),
			'graphqlEndpoint'     => trailingslashit( site_url() ) . 'index.php?' . \WPGraphQL\Router::$route,
			'rootElementId'       => WPGRAPHQL_IDE_ROOT_ELEMENT_ID,
			'context'             => $app_context,
			'isDedicatedIdePage'  => is_dedicated_ide_page(),
			'dedicatedIdeBaseUrl' => get_dedicated_ide_base_url(),
		]
	);

	wp_enqueue_style( 'wpgraphql-ide-app', plugins_url( 'build/index.css', __FILE__ ), [], $asset_file['version'] );
	// Avoid running custom styles through a build process for an improved developer experience.
	wp_enqueue_style( 'wpgraphql-ide', plugins_url( 'styles/wpgraphql-ide.css', __FILE__ ), [], $asset_file['version'] );

	// Extensions looking to extend GraphiQL can hook in here,
	// after the window object is established, but before the App renders
	do_action( 'wpgraphqlide_enqueue_script', $app_context );
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_react_app_with_styles' );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_react_app_with_styles' );

/**
 * Retrieves the base URL for the dedicated WPGraphQL IDE page.
 *
 * @return string The URL for the dedicated IDE page within the WordPress admin.
 */
function get_dedicated_ide_base_url(): string {
	return menu_page_url( 'graphql-ide', false );
}

/**
 * Retrieves the specific header of this plugin.
 *
 * @param string $key The plugin data key.
 * @return string|null The version number of the plugin. Returns an empty string if the version is not found.
 */
function get_plugin_header( string $key = '' ): ?string {
	if ( ! function_exists( 'get_plugin_data' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}

	if ( empty( $key ) ) {
		return null;
	}

	$plugin_data = get_plugin_data( __FILE__ );

	return $plugin_data[ $key ] ?? null;
}

/**
 * Retrieves app context.
 *
 * @return array<mixed> The possibly filtered app context array.
 */
function get_app_context(): array {
	return apply_filters(
		'wpgraphqlide_context',
		[
			'pluginVersion'     => get_plugin_header( 'Version' ),
			'pluginName'        => get_plugin_header( 'Name' ),
			'externalFragments' => apply_filters( 'wpgraphqlide_external_fragments', [] ),
		]
	);
}
