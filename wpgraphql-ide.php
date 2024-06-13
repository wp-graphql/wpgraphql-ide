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

define( 'WPGRAPHQL_IDE_VERSION', '2.1.2' );
define( 'WPGRAPHQL_IDE_ROOT_ELEMENT_ID', 'wpgraphql-ide-root' );
define( 'WPGRAPHQL_IDE_PLUGIN_DIR_PATH', plugin_dir_path( __FILE__ ) );
define( 'WPGRAPHQL_IDE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Initialize the WPGraphQL IDE plugin.
 *
 * Checks for necessary dependencies and initializes the plugin if they are met.
 */
function wpgraphql_ide_init() {
	$error_messages = [];

	// Check for dependencies and add error messages if necessary
	if ( ! class_exists( 'WPGraphQL' ) ) {
		$error_messages[] = __( 'WPGraphQL must be installed and active', 'wpgraphql-ide' );
	}

	// If there are any plugin load error messages, prevent the plugin from loading and show the messages
	if ( ! empty( $error_messages ) ) {
		add_action( 'admin_init', function() use ( $error_messages ) {
			show_admin_notice( $error_messages );
		});
		add_action( 'graphql_init', function() use ( $error_messages ) {
			show_graphql_debug_messages( $error_messages );
		});
		return;
	}

	// Register core IDE plugins.
	require_once WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'plugins/query-composer-panel/query-composer-panel.php';
	require_once WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'plugins/help-panel/help-panel.php';

	// Additional initialization logic
	add_custom_capabilities();
	add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_react_app_with_styles' );
	add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_react_app_with_styles' );
	add_action( 'admin_bar_menu', __NAMESPACE__ . '\\register_wpadminbar_menus', 999 );
	add_action( 'admin_menu', __NAMESPACE__ . '\\register_dedicated_ide_menu' );
	add_action( 'graphql_register_settings', __NAMESPACE__ . '\\register_ide_settings' );
	add_action( 'admin_menu', __NAMESPACE__ . '\\rename_reorder_submenu_items', 999 );
}

add_action( 'init', __NAMESPACE__ . '\\wpgraphql_ide_init' );

/**
 * Display admin notices if there are any error messages.
 *
 * @param array $error_messages Array of error messages to display.
 */
function show_admin_notice( $error_messages ) {
	if ( empty( $error_messages ) || ! current_user_can( 'manage_options' ) ) {
		return;
	}

	add_action(
		'admin_notices',
		static function () use ( $error_messages ) {
			?>
			<div class="error notice">
				<h3>
					<?php
					// translators: %s is the version of the plugin
					echo esc_html( sprintf( __( 'WPGraphQL IDE v%s cannot load', 'wpgraphql-ide' ), WPGRAPHQL_IDE_VERSION ) );
					?>
				</h3>
				<ol>
					<?php foreach ( $error_messages as $message ) : ?>
						<li><?php echo esc_html( $message ); ?></li>
					<?php endforeach; ?>
				</ol>
			</div>
			<?php
		}
	);
}

/**
 * Display GraphQL debug messages if there are any error messages.
 *
 * @param array $error_messages Array of error messages to display.
 */
function show_graphql_debug_messages( $error_messages ) {
	if ( empty( $error_messages ) ) {
		return;
	}

	$prefix = sprintf( 'WPGraphQL IDE v%s cannot load', WPGRAPHQL_IDE_VERSION );
	foreach ( $error_messages as $message ) {
		graphql_debug( $prefix . ' because ' . $message );
	}
}

/**
 * Adds custom capabilities to specified roles.
 */
function add_custom_capabilities() {
	$capabilities = [
		'manage_graphql_ide' => [ 'administrator' ],
	];
	$current_hash = md5( wp_json_encode( $capabilities ) );

	if ( get_option( 'wpgraphql_ide_capabilities' ) === $current_hash ) {
		return;
	}

	foreach ( $capabilities as $capability => $roles ) {
		foreach ( $roles as $role_name ) {
			$role = get_role( $role_name );
			if ( $role && ! $role->has_cap( $capability ) ) {
				$role->add_cap( $capability );
			}
		}
	}

	update_option( 'wpgraphql_ide_capabilities', $current_hash );
}

/**
 * Enqueues the React application script and associated styles.
 */
function enqueue_react_app_with_styles() {
	if ( ! user_has_graphql_ide_capability() || is_legacy_ide_page() ) {
		return;
	}

	if ( ! class_exists( '\WPGraphQL\Router' ) ) {
		return;
	}

	$asset_file         = include WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'build/wpgraphql-ide.asset.php';
	$render_asset_file  = include WPGRAPHQL_IDE_PLUGIN_DIR_PATH . 'build/wpgraphql-ide-render.asset.php';
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
		plugins_url( 'build/wpgraphql-ide.js', __FILE__ ),
		array_merge( $asset_file['dependencies'], [ 'graphql' ] ),
		$asset_file['version'],
		false
	);

	wp_localize_script(
		'wpgraphql-ide',
		'WPGRAPHQL_IDE_DATA',
		[
			'nonce'               => wp_create_nonce( 'wp_rest' ),
			'graphqlEndpoint'     => trailingslashit( site_url() ) . 'index.php?' . \WPGraphQL\Router::$route,
			'rootElementId'       => WPGRAPHQL_IDE_ROOT_ELEMENT_ID,
			'context'             => $app_context,
			'isDedicatedIdePage'  => current_screen_is_dedicated_ide_page(),
			'dedicatedIdeBaseUrl' => get_dedicated_ide_base_url(),
		]
	);

	do_action( 'wpgraphqlide_enqueue_script', $app_context );

	wp_enqueue_script(
		'wpgraphql-ide-render',
		plugins_url( 'build/wpgraphql-ide-render.js', __FILE__ ),
		array_merge( $asset_file['dependencies'], [ 'wpgraphql-ide', 'graphql' ] ),
		$render_asset_file['version'],
		false
	);

	wp_enqueue_style( 'wpgraphql-ide-app', plugins_url( 'build/wpgraphql-ide.css', __FILE__ ), [], $asset_file['version'] );
	wp_enqueue_style( 'wpgraphql-ide-render', plugins_url( 'build/wpgraphql-ide-render.css', __FILE__ ), [], $asset_file['version'] );
	wp_enqueue_style( 'wpgraphql-ide', plugins_url( 'styles/wpgraphql-ide.css', __FILE__ ), [], $asset_file['version'] );
}

/**
 * Registers the plugin's custom menu item in the WordPress Admin Bar.
 *
 * @global WP_Admin_Bar $wp_admin_bar The WordPress Admin Bar instance.
 */
function register_wpadminbar_menus() {
	if ( ! user_has_graphql_ide_capability() ) {
		return;
	}

	global $wp_admin_bar;

	$app_context = get_app_context();

	$graphql_ide_settings = get_option( 'graphql_ide_settings', [] );
	$link_behavior = isset( $graphql_ide_settings['graphql_ide_link_behavior'] ) ? $graphql_ide_settings['graphql_ide_link_behavior'] : 'drawer';

	if ( 'drawer' === $link_behavior && ! current_screen_is_dedicated_ide_page() ) {
		$wp_admin_bar->add_node(
			[
				'id'    => 'wpgraphql-ide',
				'title' => '<div id="' . esc_attr( WPGRAPHQL_IDE_ROOT_ELEMENT_ID ) . '"><span class="ab-icon"></span>' . $app_context['drawerButtonLabel'] . '</div>',
				'href'  => '#',
			]
		);
	} elseif ( 'disabled' !== $link_behavior ) {
		$wp_admin_bar->add_node(
			[
				'id'    => 'wpgraphql-ide',
				'title' => '<span class="ab-icon"></span>' . $app_context['drawerButtonLabel'],
				'href'  => admin_url( 'admin.php?page=graphql-ide' ),
			]
		);
	}
}

/**
 * Registers a submenu page for the dedicated GraphQL IDE.
 */
function register_dedicated_ide_menu() {
	if ( ! user_has_graphql_ide_capability() ) {
		return;
	}

	$graphql_ide_settings = get_option( 'graphql_ide_settings', [] );
	$show_legacy_editor   = isset( $graphql_ide_settings['graphql_ide_show_legacy_editor'] ) ? $graphql_ide_settings['graphql_ide_show_legacy_editor'] : 'off';

	if ( 'off' === $show_legacy_editor ) {
		remove_submenu_page( 'graphiql-ide', 'graphiql-ide' );
	}

	add_submenu_page(
		'graphiql-ide',
		__( 'GraphQL IDE', 'wpgraphql-ide' ),
		__( 'GraphQL IDE', 'wpgraphql-ide' ),
		'manage_graphql_ide',
		'graphql-ide',
		__NAMESPACE__ . '\\render_dedicated_ide_page'
	);
}

/**
 * Renders the container for the dedicated IDE page for the React app to be mounted to.
 */
function render_dedicated_ide_page() {
	echo '<div id="' . esc_attr( WPGRAPHQL_IDE_ROOT_ELEMENT_ID ) . '"></div>';
}

/**
 * Registers custom GraphQL settings.
 */
function register_ide_settings() {
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

/**
 * Sanitize the input value for the custom GraphQL IDE link behavior setting.
 *
 * @param string $value The input value.
 * @return string The sanitized value.
 */
function sanitize_custom_graphql_ide_link_behavior( $value ) {
	$valid_values = [ 'drawer', 'dedicated_page', 'disabled' ];

	return in_array( $value, $valid_values, true ) ? $value : 'drawer';
}

/**
 * Checks if the current user has the capability required to load scripts and styles for the GraphQL IDE.
 *
 * @return bool Whether the user has the required capability.
 */
function user_has_graphql_ide_capability() {
	$capability_required = apply_filters( 'wpgraphqlide_capability_required', 'manage_graphql_ide' );

	return current_user_can( $capability_required );
}

/**
 * Determines if the current admin page is a dedicated WPGraphQL IDE page.
 *
 * @return bool True if the current page is a dedicated WPGraphQL IDE page, false otherwise.
 */
function current_screen_is_dedicated_ide_page() {
	return is_ide_page() || is_legacy_ide_page();
}

/**
 * Checks if the current admin page is the new WPGraphQL IDE page.
 *
 * @return bool True if the current page is the new WPGraphQL IDE page, false otherwise.
 */
function is_ide_page() {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return false;
	}

	$screen = get_current_screen();
	return $screen && 'graphql_page_graphql-ide' === $screen->id;
}

/**
 * Checks if the current admin page is the legacy GraphiQL IDE page.
 *
 * @return bool True if the current page is the legacy GraphiQL IDE page, false otherwise.
 */
function is_legacy_ide_page() {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return false;
	}

	$screen = get_current_screen();
	return $screen && 'toplevel_page_graphiql-ide' === $screen->id;
}

/**
 * Retrieves the base URL for the dedicated WPGraphQL IDE page.
 *
 * @return string The URL for the dedicated IDE page within the WordPress admin.
 */
function get_dedicated_ide_base_url() {
	return menu_page_url( 'graphql-ide', false );
}

/**
 * Retrieves app context.
 *
 * @return array<string, mixed> The possibly filtered app context array.
 */
function get_app_context() {
	$current_user = wp_get_current_user();
	$avatar_url = $current_user->exists() ? get_avatar_url( $current_user->ID ) : '';

	return apply_filters(
		'wpgraphqlide_context',
		[
			'pluginVersion'     => WPGRAPHQL_IDE_VERSION,
			'pluginName'        => __( 'WPGraphQL IDE', 'wpgraphql-ide' ),
			'externalFragments' => apply_filters( 'wpgraphqlide_external_fragments', [] ),
			'avatarUrl'         => $avatar_url,
			'drawerButtonLabel' => __( 'GraphQL IDE', 'wpgraphql-ide' ),
		]
	);
}

/**
 * Renames and reorders the submenu items under 'GraphQL'.
 */
function rename_reorder_submenu_items() {
	global $submenu;

	if ( isset( $submenu['graphiql-ide'] ) ) {
		$temp_submenu = $submenu['graphiql-ide'];
		foreach ( $temp_submenu as $key => $value ) {
			if ( 'GraphiQL IDE' === $value[0] ) {
				$temp_submenu[ $key ][0] = 'Legacy GraphQL IDE';
				$legacy_item = $temp_submenu[ $key ];
				unset( $temp_submenu[ $key ] );
				$temp_submenu = array_values( $temp_submenu );
				array_splice( $temp_submenu, 1, 0, [ $legacy_item ] );
				break;
			}
		}
		$submenu['graphiql-ide'] = $temp_submenu;
	}
}

/**
 * Generates the SVG logo for GraphQL.
 *
 * @return string The SVG logo markup.
 */
function graphql_logo_svg() {
	return <<<XML
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="80" r="64" fill="url(#paint0_radial_30_2860)"/>
            <g filter="url(#filter0_d_30_2860)">
            <path d="M81.5239 72.2556C84.2608 72.2556 86.4795 70.0369 86.4795 67.3C86.4795 64.5632 84.2608 62.3445 81.5239 62.3445C78.787 62.3445 76.5684 64.5632 76.5684 67.3C76.5684 70.0369 78.787 72.2556 81.5239 72.2556Z" fill="white"/>
            <path d="M118.588 90.4878C116.007 90.05 113.769 92.0116 113.736 94.5018C113.711 96.5294 112.592 98.4291 110.696 99.1476C107.17 100.49 103.825 97.9046 103.825 94.5555V67.5931C103.825 56.1994 95.3755 46.3915 84.0521 45.1403C71.8903 43.794 61.3928 52.3011 59.5262 63.6741C59.5262 63.6823 59.5179 63.6906 59.5096 63.6906C49.4457 65.8875 42 74.8365 42 85.4703V103.665C42 105.933 43.8377 107.77 46.1049 107.77H55.3718C57.6348 107.77 59.3527 105.92 59.3445 103.657C59.3321 100.213 62.8505 97.5742 66.4805 99.1518C68.2314 99.9157 69.2638 101.716 69.2556 103.624C69.2473 105.912 71.1015 107.766 73.3852 107.766H82.4952C84.7624 107.766 86.6 105.928 86.6 103.661V85.4951C86.6 84.8302 86.472 84.1612 86.1623 83.5748C85.3777 82.0757 83.8538 81.2291 82.2515 81.3159C82.0162 81.3283 81.7725 81.3365 81.5289 81.3365C73.7982 81.3365 67.4964 75.0471 67.4881 67.3164C67.4881 67.3123 67.4881 67.304 67.4881 67.2999L67.55 66.4657C68.058 59.5362 73.4678 53.8455 80.3973 53.3004C88.6483 52.6479 95.5737 59.181 95.5737 67.2958V94.3407C95.5737 100.663 100.666 106.779 106.926 107.638C114.954 108.741 121.863 102.575 121.999 94.7867C122.036 92.7137 120.641 90.8305 118.596 90.4837L118.588 90.4878ZM78.3367 89.7238V99.0981C78.3367 99.3252 78.1508 99.511 77.9237 99.511H77.1432C76.9697 99.511 76.8169 99.3995 76.7591 99.2343C74.9421 94.1053 70.0402 90.4258 64.3 90.4258C58.5598 90.4258 53.658 94.1095 51.8409 99.2343C51.7831 99.3995 51.6303 99.511 51.4527 99.511H50.6722C50.4451 99.511 50.2593 99.3252 50.2593 99.0981V85.4703C50.2593 79.4823 54.0048 74.3409 59.3279 72.3298C59.5592 72.2431 59.8111 72.3835 59.8689 72.623C61.9874 81.2333 69.1276 87.8985 77.9898 89.315C78.188 89.348 78.3367 89.5173 78.3367 89.7197V89.7238Z" fill="white"/>
            </g>
            <defs>
            <filter id="filter0_d_30_2860" x="34" y="37" width="96" height="78.7703" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="4"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.141176 0 0 0 0 0.278431 0 0 0 0.1 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_30_2860"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_30_2860" result="shape"/>
            </filter>
            <radialGradient id="paint0_radial_30_2860" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16 16) rotate(45) scale(181.019)">
            <stop stop-color="#0ECAD4"/>
            <stop offset="1" stop-color="#7A45E5"/>
            </radialGradient>
            </defs>
        </svg>
XML;
}
