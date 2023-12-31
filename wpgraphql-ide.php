<?php
/**
 * Plugin Name:       WPGraphQL IDE
 * Description:       A next-gen query editor for WPGraphQL.
 * Author:            Joseph Fusco
 * Author URI:        https://github.com/josephfusco
 * GitHub Plugin URI: https://github.com/josephfusco/wpgraphql-ide
 * License:           GPLv3 or later
 * Text Domain:       wpgraphql-ide
 * Version:           1.0.0-beta.13
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
 * Registers a custom menu item in the WordPress Admin Bar.
 *
 * This function adds the mount point for the plugin's React app.
 *
 * @global WP_Admin_Bar $wp_admin_bar The WordPress Admin Bar instance.
 *
 * @return void
 */
function register_wpadminbar_menu(): void {
    if ( user_lacks_capability() ) {
        return;
    }

    global $wp_admin_bar;

    $args = [
        'id'    => 'wpgraphql-ide',
        'title' => '<div id="' . WPGRAPHQL_IDE_ROOT_ELEMENT_ID . '"></div>',
        'href'  => '#',
    ];

    $wp_admin_bar->add_node( $args );
}
add_action( 'admin_bar_menu', __NAMESPACE__ . '\\register_wpadminbar_menu', 999 );

/**
 * Enqueues custom CSS to set the "GraphQL IDE" menu item icon in the WordPress Admin Bar.
 *
 * @return void
 */
function enqueue_graphql_ide_menu_icon_css(): void {
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
 *
 * @return void
 */
function enqueue_react_app_with_styles(): void {
    if ( user_lacks_capability() ) {
        return;
    }

    $app_dependencies = [
        'wp-element',
        'wp-components',
        'wp-api-fetch',
        'wp-i18n',
    ];

    $version = plugin_version();

    wp_enqueue_script(
        'wpgraphql-ide-app',
        plugins_url( 'build/index.js', __FILE__ ),
        $app_dependencies,
        $version,
        true
    );

    wp_localize_script(
        'wpgraphql-ide-app',
        'WPGRAPHQL_IDE_DATA',
        [
            'nonce'           => wp_create_nonce( 'wp_rest' ),
            'graphqlEndpoint' => trailingslashit( site_url() ) . 'index.php?' . \WPGraphQL\Router::$route,
            'rootElementId'   => WPGRAPHQL_IDE_ROOT_ELEMENT_ID,
        ]
    );

    wp_enqueue_style( 'wpgraphql-ide-app', plugins_url( 'build/index.css', __FILE__ ), [], $version );
    // Avoid running custom styles through a build process for an improved developer experience.
    wp_enqueue_style( 'wpgraphql-ide', plugins_url( 'styles/wpgraphql-ide.css', __FILE__ ), [], $version );
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_react_app_with_styles' );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_react_app_with_styles' );

/**
 * Retrieves the version of the current plugin.
 *
 * @return string The version number of the plugin. Returns an empty string if the version is not found.
 */
function plugin_version(): string {
    if ( ! function_exists( 'get_plugin_data' ) ) {
        require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
    }

    $plugin_data = get_plugin_data( __FILE__ );
    $version     = $plugin_data['Version'];

    return $version;
}
