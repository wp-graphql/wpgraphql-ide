<?php
/**
 * Plugin Name:       WPGraphiQL X
 * Description:       The next generation of WPGraphQL's GraphiQL editor.
 * Author:            Joseph Fusco
 * Author URI:        https://github.com/josephfusco
 * GitHub Plugin URI: https://github.com/josephfusco/wp-graphiql-x
 * License:           GPLv3 or later
 * Text Domain:       wp-graphiql-x
 * Version:           1.0.0
 *
 * @package WPGraphiQLX
 */

namespace WPGraphiQLX;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Registers a custom menu item in the WordPress Admin Bar.
 *
 * This function adds a custom menu item titled "GraphiQL X" to the WordPress Admin Bar.
 *
 * @global WP_Admin_Bar $wp_admin_bar The WordPress Admin Bar instance.
 */
function register_wpadminbar_menu() {
    global $wp_admin_bar;

    $args = array(
        'id'    => 'graphiql-x',
        'title' => '<span class="ab-icon" aria-hidden="true"></span>GraphiQL X',
        'href'  => esc_url( 'https://example.com/graphiql-x' ),
        'meta'  => array(
            'class'  => 'graphiql-x-menu-item',
        ),
    );

    $wp_admin_bar->add_node( $args );
}
add_action( 'admin_bar_menu', __NAMESPACE__ . '\\register_wpadminbar_menu', 999 );

/**
 * Enqueues custom CSS to set the "GraphiQL X" menu item icon in the WordPress Admin Bar.
 *
 * This function enqueues custom CSS to set the background image for the "GraphiQL X" menu item
 * in the WordPress Admin Bar using the provided SVG data as inline styles.
 */
function enqueue_graphiql_x_menu_icon_css() {
    $graphql_logo = '
        <svg xmlns="http://www.w3.org/2000/svg" fill="color(display-p3 .8824 0 .5961)" viewBox="0 0 100 100">
            <path fill-rule="evenodd" d="m50 6.903 37.323 21.549v43.096L50 93.097 12.677 71.548V28.451L50 6.903ZM16.865 30.87v31.656L44.28 15.041 16.864 30.87ZM50 13.51 18.398 68.246h63.205L50 13.509Zm27.415 58.924h-54.83L50 88.261l27.415-15.828Zm5.72-9.908L55.72 15.041 83.136 30.87v31.656Z" clip-rule="evenodd"/>
            <circle cx="50" cy="9.321" r="8.82"/>
            <circle cx="85.229" cy="29.66" r="8.82"/>
            <circle cx="85.229" cy="70.34" r="8.82"/>
            <circle cx="50" cy="90.679" r="8.82"/>
            <circle cx="14.766" cy="70.34" r="8.82"/>
            <circle cx="14.766" cy="29.66" r="8.82"/>
        </svg>';

    $custom_css = '
        #wp-admin-bar-graphiql-x .ab-icon::before {
            background-image: url("data:image/svg+xml;base64,' . base64_encode( $graphql_logo ) . '");
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
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_graphiql_x_menu_icon_css' );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_graphiql_x_menu_icon_css' );
