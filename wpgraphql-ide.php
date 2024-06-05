<?php
/**
 * Plugin Name:       WPGraphQL IDE
 * Description:       A next-gen query editor for WPGraphQL.
 * Author:            WPGraphQL, Joseph Fusco
 * Author URI:        https://github.com/josephfusco
 * GitHub Plugin URI: https://github.com/wp-graphql/wpgraphql-ide
 * License:           GPLv3 or later
 * Text Domain:       wpgraphql-ide
 * Version:           2.1.2
 * Requires PHP:      7.4
 * Tested up to:      6.5
 *
 * @package WPGraphQLIDE
 */

namespace WPGraphQLIDE;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WPGRAPHQL_IDE_VERSION', '2.0.0' );
define( 'WPGRAPHQL_IDE_ROOT_ELEMENT_ID', 'wpgraphql-ide-root' );
define( 'WPGRAPHQL_IDE_PLUGIN_DIR_PATH', plugin_dir_path( __FILE__ ) );
define( 'WPGRAPHQL_IDE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register core IDE plugins.
 */
require_once WPGRAPHQL_IDE_PLUGIN_DIR_PATH . '/plugins/query-composer-panel/query-composer-panel.php';
// require_once WPGRAPHQL_IDE_PLUGIN_DIR_PATH . '/plugins/help-panel/help-panel.php';

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
 * Determines if the current admin page is a dedicated WPGraphQL IDE page.
 *
 * This function checks whether the current admin page is exclusively for either the new GraphQL IDE
 * or the legacy GraphiQL IDE, distinguishing them from other admin pages where the IDE might be present
 * in a drawer. It is designed to help in tailoring the admin interface or enqueuing specific scripts
 * and styles on these dedicated IDE pages.
 *
 * @return bool True if the current page is a dedicated WPGraphQL IDE page, false otherwise.
 */
function current_screen_is_dedicated_ide_page(): bool {
	return is_ide_page() || is_legacy_ide_page();
}

/**
 * Checks if the current admin page is the new WPGraphQL IDE page.
 *
 * @return bool True if the current page is the new WPGraphQL IDE page, false otherwise.
 */
function is_ide_page(): bool {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return false;
	}

	$screen = get_current_screen();
	if ( ! $screen ) {
		return false;
	}

	return 'graphql_page_graphql-ide' === $screen->id;
}

/**
 * Checks if the current admin page is the legacy GraphiQL IDE page.
 *
 * @return bool True if the current page is the legacy GraphiQL IDE page, false otherwise.
 */
function is_legacy_ide_page(): bool {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return false;
	}

	$screen = get_current_screen();
	if ( ! $screen ) {
		return false;
	}

	return 'toplevel_page_graphiql-ide' === $screen->id;
}

/**
 * Registers the plugin's custom menu item in the WordPress Admin Bar.
 *
 * @global WP_Admin_Bar $wp_admin_bar The WordPress Admin Bar instance.
 */
function register_wpadminbar_menus(): void {
	if ( user_lacks_capability() ) {
		return;
	}

	global $wp_admin_bar;

	$app_context = get_app_context();

	// Retrieve the settings array
	$graphql_ide_settings = get_option( 'graphql_ide_settings', [] );

	// Get the specific link behavior value, default to 'drawer' if not set
	$link_behavior = isset( $graphql_ide_settings['graphql_ide_link_behavior'] ) ? $graphql_ide_settings['graphql_ide_link_behavior'] : 'drawer';

	if ( 'drawer' === $link_behavior && ! current_screen_is_dedicated_ide_page() ) {
		// Drawer Button
		$wp_admin_bar->add_node(
			[
				'id'    => 'wpgraphql-ide',
				'title' => '<div id="' . esc_attr( WPGRAPHQL_IDE_ROOT_ELEMENT_ID ) . '"><span class="ab-icon"></span>' . $app_context['drawerButtonLabel'] . '</div>',
				'href'  => '#',
			]
		);
	} elseif ( 'disabled' !== $link_behavior ) {
		// Link to the new dedicated IDE page.
		$wp_admin_bar->add_node(
			[
				'id'    => 'wpgraphql-ide',
				'title' => '<span class="ab-icon"></span>' . $app_context['drawerButtonLabel'],
				'href'  => admin_url( 'admin.php?page=graphql-ide' ),
			]
		);
	}
}
add_action( 'admin_bar_menu', __NAMESPACE__ . '\\register_wpadminbar_menus', 999 );

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

	// Remove the legacy submenu without affecting the ability to directly link to the legacy IDE (wp-admin/admin.php?page=graphiql-ide)
	$graphql_ide_settings = get_option( 'graphql_ide_settings', [] );
	$show_legacy_editor   = isset( $graphql_ide_settings['graphql_ide_show_legacy_editor'] ) ? $graphql_ide_settings['graphql_ide_show_legacy_editor'] : 'off';

	if ( 'off' === $show_legacy_editor ) {
		remove_submenu_page( 'graphiql-ide', 'graphiql-ide' );
	}

	add_submenu_page(
		'graphiql-ide',
		__( 'GraphQL IDE', 'wpgraphql-ide' ),
		__( 'GraphQL IDE', 'wpgraphql-ide' ),
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
	if ( user_lacks_capability() ) {
		return;
	}

	$custom_css = '
		#wp-admin-bar-wpgraphql-ide .ab-icon::before,
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
	if ( is_legacy_ide_page() ) {
		return;
	}

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

	$asset_file = include WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'build/index.asset.php';
	$render_asset_file = include WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'build/render.asset.php';
	$graphql_asset_file = include WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'build/graphql.asset.php';

	$app_context = get_app_context();

	wp_register_script(
		'graphql',
		plugins_url( 'build/graphql.js', __FILE__ ),
		$graphql_asset_file['dependencies'],
		$graphql_asset_file['version'],
		false
	);

	wp_enqueue_script(
		'wpgraphql-ide',
		plugins_url( 'build/index.js', __FILE__ ),
		array_merge( $asset_file['dependencies'], [ 'graphql' ] ),
		$asset_file['version'],
		false
	);

	$localized_data = [
		'nonce'               => wp_create_nonce( 'wp_rest' ),
		'graphqlEndpoint'     => trailingslashit( site_url() ) . 'index.php?' . \WPGraphQL\Router::$route,
		'rootElementId'       => WPGRAPHQL_IDE_ROOT_ELEMENT_ID,
		'context'             => $app_context,
		'isDedicatedIdePage'  => current_screen_is_dedicated_ide_page(),
		'dedicatedIdeBaseUrl' => get_dedicated_ide_base_url(),
	];

	wp_localize_script(
		'wpgraphql-ide',
		'WPGRAPHQL_IDE_DATA',
		$localized_data
	);

	// Extensions looking to extend GraphiQL can hook in here,
	// after the window object is established, but before the App renders
	do_action( 'wpgraphqlide_enqueue_script', $app_context );

	wp_enqueue_script(
		'wpgraphql-ide-render',
		plugins_url( 'build/render.js', __FILE__ ),
		array_merge( $asset_file['dependencies'], [ 'wpgraphql-ide', 'graphql' ] ),
		$render_asset_file['version'],
		false
	);

	wp_enqueue_style( 'wpgraphql-ide-app', plugins_url( 'build/index.css', __FILE__ ), [], $asset_file['version'] );
	wp_enqueue_style( 'wpgraphql-ide-render', plugins_url( 'build/render.css', __FILE__ ), [], $asset_file['version'] );

	// Avoid running custom styles through a build process for an improved developer experience.
	wp_enqueue_style( 'wpgraphql-ide', plugins_url( 'styles/wpgraphql-ide.css', __FILE__ ), [], $asset_file['version'] );
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
	$current_user = wp_get_current_user();

	// Get the avatar URL for the current user. Returns an empty string if no user is logged in.
	$avatar_url = $current_user->exists() ? get_avatar_url( $current_user->ID ) : '';

	return apply_filters(
		'wpgraphqlide_context',
		[
			'pluginVersion'     => get_plugin_header( 'Version' ),
			'pluginName'        => get_plugin_header( 'Name' ),
			'externalFragments' => apply_filters( 'wpgraphqlide_external_fragments', [] ),
			'avatarUrl'         => $avatar_url,
			'drawerButtonLabel' => __( 'GraphQL IDE', 'wpgraphql-ide' ),
		]
	);
}

/**
 * Add styles to hide generic admin notices on the graphiql-ide page
 * and play nice with notices added via register_graphql_admin_notice
 *
 * @param array $notices The array of notices to render
 */
add_action(
	'graphql_admin_notices_render_notices',
	static function ( array $notices ) {

		echo '
		<style>
			body.graphql_page_graphql-ide #wpbody .wpgraphql-admin-notice {
				display: block;
				position: absolute;
				top: 0;
				right: 0;
				z-index: 1;
				min-width: 40%;
			}
			body.graphql_page_graphql-ide #wpbody .graphiql-container {
				padding-top: ' . count( $notices ) * 45 . 'px;
			}
			body.graphql_page_graphql-ide #wpgraphql-ide-root {
				height: calc(100vh - var(--wp-admin--admin-bar--height) - ' . count( $notices ) * 45 . 'px);
			}
		</style>
	';
	},
	10,
	1
);

/**
 * Add styles to apply top margin to notices added via register_graphql_admin_notice
 *
 * @param string $notice_slug The slug of the notice
 * @param array $notice The notice data
 * @param bool $is_dismissable Whether the notice is dismissable
 * @param int $count The count of notices
 */
add_action(
	'graphql_admin_notices_render_notice',
	static function ( string $notice_slug, array $notice, bool $is_dismissable, int $count ) {

		echo '
	<style>
		body.graphql_page_graphql-ide #wpbody #wpgraphql-admin-notice-' . esc_attr( $notice_slug ) . ' {
			top: ' . esc_attr( ( $count * 45 ) . 'px' ) . '
		}
	</style>
	';
	},
	10,
	4
);

/**
 * Filter to allow graphql admin notices to be displayed on the dedicated IDE page.
 *
 * @param bool $is_plugin_scoped_page True if the current page is within scope of the plugin's pages.
 * @param string $current_page_id The ID of the current admin page.
 * @param array<string> $allowed_pages The list of allowed pages.
 */
add_filter(
	'graphql_admin_notices_is_allowed_admin_page',
	static function ( bool $is_plugin_scoped_page, string $current_page_id, array $allowed_pages ) {

		// If the current page is the dedicated IDE page, we want to allow notices to be displayed.
		if ( 'graphql_page_graphql-ide' === $current_page_id ) {
			return true;
		}

		return $is_plugin_scoped_page;
	},
	10,
	3
);

/**
 * Modifies the script tag for specific scripts to add the 'defer' attribute.
 *
 * This function checks if the script handle matches 'wpgraphql-ide' and, if so,
 * adds the 'defer' attribute to the script tag. This allows the script to be executed
 * after the HTML document is parsed but before the DOMContentLoaded event.
 *
 * @param string $tag    The HTML `<script>` tag of the enqueued script.
 * @param string $handle The script's registered handle in WordPress.
 *
 * @return string Modified script tag with 'defer' attribute included if handle matches; otherwise, unchanged.
 */
add_filter(
	'script_loader_tag',
	static function ( string $tag, string $handle ) {

		if ( 'wpgraphql-ide' === $handle ) {
			return str_replace( ' src', ' defer="defer" src', $tag );
		}

		return $tag;
	},
	10,
	2
);

/**
 * Update the existing GraphiQL link field configuration to say "Legacy".
 *
 * @param array<string, mixed> $field_config The field configuration array.
 * @param string               $field_name   The name of the field.
 * @param string               $section      The section the field belongs to.
 *
 * @return array<string, mixed> The modified field configuration array.
 */
function update_graphiql_link_field_config( array $field_config, string $field_name, string $section ): array {
	if ( 'show_graphiql_link_in_admin_bar' === $field_name && 'graphql_general_settings' === $section ) {
		$field_config['desc'] = sprintf(
			'%1$s<br><p class="description">%2$s</p>',
			__( 'Show the GraphiQL IDE link in the WordPress Admin Bar.', 'wpgraphql-ide' ),
			sprintf(
				/* translators: %s: Strong opening tag */
				__( '%1$sNote:%2$s This setting has been disabled by the new WPGraphQL IDE. Related settings are now available under the "IDE Settings" tab.', 'wpgraphql-ide' ),
				'<strong>',
				'</strong>'
			)
		);
		$field_config['disabled'] = true;
		$field_config['value']    = 'off';
	}
	return $field_config;
}
add_filter( 'graphql_setting_field_config', __NAMESPACE__ . '\\update_graphiql_link_field_config', 10, 3 );

/**
 * Ensure the `show_graphiql_link_in_admin_bar` setting is always unchecked.
 *
 * @param mixed                $value          The value of the field.
 * @param mixed                $default_value  The default value if there is no value set.
 * @param string               $option_name    The name of the option.
 * @param array<string, mixed> $section_fields The setting values within the section.
 * @param string               $section_name   The name of the section the setting belongs to.
 * @return mixed The modified value of the field.
 */
function ensure_graphiql_link_is_unchecked( $value, $default_value, $option_name, $section_fields, $section_name ) {
	if ( 'show_graphiql_link_in_admin_bar' === $option_name && 'graphql_general_settings' === $section_name ) {
		return 'off';
	}
	return $value;
}
add_filter( 'graphql_get_setting_section_field_value', __NAMESPACE__ . '\\ensure_graphiql_link_is_unchecked', 10, 5 );

/**
 * Register custom GraphQL settings.
 */
function register_ide_settings() {
	// Add a tab section to the graphql admin settings page
	register_graphql_settings_section(
		'graphql_ide_settings',
		[
			'title' => __( 'IDE Settings', 'wpgraphql-ide' ),
			'desc'  => __( 'Customize your WPGraphQL IDE experience sitewide. Individual users can override these settings in their user profile.', 'wpgraphql-ide' ),
		]
	);

	register_graphql_settings_field(
		'graphql_ide_settings',
		[
			'name'              => 'graphql_ide_link_behavior',
			'label'             => __( 'Admin Bar Link Behavior', 'wpgraphql-ide' ),
			'desc'              => __( 'How would you like to access the GraphQL IDE from the admin bar?', 'wpgraphql-ide' ),
			'type'              => 'radio',
			'options'           => [
				'drawer'         => __( 'Drawer (recommended) — open the IDE in a slide up drawer from any page', 'wpgraphql-ide' ),
				'dedicated_page' => sprintf(
					wp_kses_post(
						sprintf(
							/* translators: %s: URL to the GraphQL IDE page */
							__( 'Dedicated Page — direct link to <a href="%1$s">%1$s</a>', 'wpgraphql-ide' ),
							esc_url( admin_url( 'admin.php?page=graphql-ide' ) )
						)
					)
				),
				'disabled'       => __( 'Disabled — remove the IDE link from the admin bar', 'wpgraphql-ide' ),
			],
			'default'           => 'drawer',
			'sanitize_callback' => __NAMESPACE__ . '\\sanitize_custom_graphql_ide_link_behavior',
		]
	);

	register_graphql_settings_field(
		'graphql_ide_settings',
		[
			'name'  => 'graphql_ide_show_legacy_editor',
			'label' => __( 'Show Legacy Editor', 'wpgraphql-ide' ),
			'desc'  => __( 'Show the legacy editor', 'wpgraphql-ide' ),
			'type'  => 'checkbox',
		]
	);
}
add_action( 'graphql_register_settings', __NAMESPACE__ . '\\register_ide_settings' );

/**
 * Sanitize the input value for the custom GraphQL IDE link behavior setting.
 *
 * @param string $value The input value.
 *
 * @return string The sanitized value.
 */
function sanitize_custom_graphql_ide_link_behavior( $value ) {
	$valid_values = [ 'drawer', 'dedicated_page', 'disabled' ];

	if ( in_array( $value, $valid_values, true ) ) {
		return $value;
	}

	return 'drawer';
}

/**
 * Rename and reorder the submenu items under 'GraphQL'.
 */
add_action(
	'admin_menu',
	static function () {
		global $submenu;

		if ( isset( $submenu['graphiql-ide'] ) ) {
			$temp_submenu = $submenu['graphiql-ide'];
			foreach ( $temp_submenu as $key => $value ) {
				if ( 'GraphiQL IDE' === $value[0] ) {
					$temp_submenu[ $key ][0] = 'Legacy GraphQL IDE';
					$legacy_item             = $temp_submenu[ $key ];
					unset( $temp_submenu[ $key ] );
					$temp_submenu = array_values( $temp_submenu );
					array_splice( $temp_submenu, 1, 0, [ $legacy_item ] );
					break;
				}
			}
			// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			$submenu['graphiql-ide'] = $temp_submenu;
		}
	},
	999
);
