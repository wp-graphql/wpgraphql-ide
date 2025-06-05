<?php
/**
 * Plugin Name: AI Assistant Panel
 * Description: AI-powered GraphQL query assistant using Gemini
 */

namespace WPGraphQLIDE\AIAssistantPanel;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WPGRAPHQL_IDE_AI_ASSISTANT_PANEL_DIR_PATH', plugin_dir_path( __FILE__ ) );
define( 'WPGRAPHQL_IDE_AI_ASSISTANT_PANEL_URL', plugin_dir_url( __FILE__ ) );

/**
 * Enqueues the scripts and styles for the AI Assistant panel.
 *
 * @return void
 */
function enqueue_assets(): void {
	$asset_file = null;
	$asset_path = WPGRAPHQL_IDE_AI_ASSISTANT_PANEL_DIR_PATH . 'build/ai-assistant-panel.asset.php';

	if ( file_exists( $asset_path ) ) {
		$asset_file = include $asset_path;
	}

	if ( empty( $asset_file['dependencies'] ) ) {
		return;
	}

	wp_enqueue_script(
		'ai-assistant-panel',
		WPGRAPHQL_IDE_AI_ASSISTANT_PANEL_URL . 'build/ai-assistant-panel.js',
		array_merge( $asset_file['dependencies'], [ 'wpgraphql-ide' ] ),
		$asset_file['version'],
		true
	);

	// Localize data for the AI Assistant
	wp_localize_script(
		'ai-assistant-panel',
		'WPGRAPHQL_AI_ASSISTANT_DATA',
		[
			'nonce' => wp_create_nonce( 'wp_rest' ),
			'apiUrl' => rest_url( 'wpgraphql-ide/v1/ai-assistant' ),
		]
	);
}
add_action( 'wpgraphql_ide_enqueue_script', __NAMESPACE__ . '\enqueue_assets' );

/**
 * Register REST API routes for the AI Assistant
 */
function register_rest_routes(): void {
	register_rest_route( 'wpgraphql-ide/v1', '/ai-assistant/chat', [
		'methods' => 'POST',
		'callback' => __NAMESPACE__ . '\handle_chat_request',
		'permission_callback' => function() {
			return current_user_can( 'manage_graphql_ide' );
		},
		'args' => [
			'message' => [
				'required' => true,
				'type' => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			],
			'context' => [
				'type' => 'object',
				'properties' => [
					'query' => [
						'type' => 'string',
					],
					'variables' => [
						'type' => 'string',
					],
					'schema' => [
						'type' => 'string',
					],
				],
			],
		],
	] );
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_rest_routes' );

/**
 * Handle chat requests to the AI assistant
 *
 * @param \WP_REST_Request $request The REST request object
 * @return \WP_REST_Response|\WP_Error
 */
function handle_chat_request( \WP_REST_Request $request ) {
	$message = $request->get_param( 'message' );
	$context = $request->get_param( 'context' );
	
	// Try multiple methods to get the API key
	$api_key = '';
	
	// Method 1: Check the graphql_ide_ai_settings option (where AI settings are registered)
	$ai_settings = get_option( 'graphql_ide_ai_settings', [] );
	if ( isset( $ai_settings['graphql_ide_gemini_api_key'] ) ) {
		$api_key = $ai_settings['graphql_ide_gemini_api_key'];
	}
	
	// Method 2: Check the graphql_ide_settings option (main IDE settings)
	if ( empty( $api_key ) ) {
		$graphql_ide_settings = get_option( 'graphql_ide_settings', [] );
		if ( isset( $graphql_ide_settings['graphql_ide_gemini_api_key'] ) ) {
			$api_key = $graphql_ide_settings['graphql_ide_gemini_api_key'];
		}
	}
	
	// Method 3: Direct option (fallback)
	if ( empty( $api_key ) ) {
		$api_key = get_option( 'graphql_ide_gemini_api_key' );
	}
	
	// Method 4: Check the WPGraphQL settings option
	if ( empty( $api_key ) ) {
		$wpgraphql_settings = get_option( 'wpgraphql_settings', [] );
		$api_key = $wpgraphql_settings['graphql_ide_gemini_api_key'] ?? '';
	}
	
	if ( empty( $api_key ) ) {
		return new \WP_Error( 
			'no_api_key', 
			__( 'Gemini API key not configured. Please add it in the GraphQL settings.', 'wpgraphql-ide' ),
			[ 'status' => 400 ]
		);
	}

	// Prepare the prompt with context
	$prompt = prepare_ai_prompt( $message, $context );
	
	// Call Gemini API
	$response = call_gemini_api( $prompt, $api_key );
	
	if ( is_wp_error( $response ) ) {
		return $response;
	}
	
	$response_code = wp_remote_retrieve_response_code( $response );
	$body = wp_remote_retrieve_body( $response );
	$data = json_decode( $body, true );
	
	// Check for API errors
	if ( $response_code !== 200 ) {
		$error_message = isset( $data['error']['message'] ) ? $data['error']['message'] : 'Unknown API error';
		return new \WP_Error( 'api_error', sprintf( __( 'Gemini API Error: %s', 'wpgraphql-ide' ), $error_message ) );
	}
	
	if ( empty( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
		// Log the full response for debugging
		error_log( 'Gemini API Response: ' . print_r( $data, true ) );
		return new \WP_Error( 'api_error', __( 'Failed to get response from AI - no content returned', 'wpgraphql-ide' ) );
	}
	
	return rest_ensure_response( [
		'response' => $data['candidates'][0]['content']['parts'][0]['text'],
		'timestamp' => current_time( 'timestamp' ),
	] );
}

/**
 * Prepare the AI prompt with GraphQL context
 *
 * @param string $message User's message
 * @param array $context Query context
 * @return string
 */
function prepare_ai_prompt( string $message, array $context ): string {
	$prompt = "You are a helpful GraphQL assistant for WordPress developers using WPGraphQL. ";
	$prompt .= "You should provide clear, concise advice about GraphQL queries, schema design, and best practices.\n\n";
	
	if ( ! empty( $context['query'] ) ) {
		$prompt .= "Current Query:\n```graphql\n" . $context['query'] . "\n```\n\n";
	}
	
	if ( ! empty( $context['variables'] ) ) {
		$prompt .= "Query Variables:\n```json\n" . $context['variables'] . "\n```\n\n";
	}
	
	if ( ! empty( $context['schema'] ) ) {
		$prompt .= "Available Schema (truncated):\n" . substr( $context['schema'], 0, 1000 ) . "...\n\n";
	}
	
	$prompt .= "User Question: " . $message;
	
	return $prompt;
}

/**
 * Call the Gemini API
 *
 * @param string $prompt The prompt to send
 * @param string $api_key The API key
 * @return string|\WP_Error
 */
function call_gemini_api( string $prompt, string $api_key ) {
	$url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=' . $api_key;
	
	$response = wp_remote_post( $url, [
		'headers' => [
			'Content-Type' => 'application/json',
		],
		'body' => wp_json_encode( [
			'contents' => [
				[
					'parts' => [
						[
							'text' => $prompt,
						],
					],
				],
			],
			'generationConfig' => [
				'temperature' => 0.7,
				'maxOutputTokens' => 1000,
			],
		] ),
		'timeout' => 30,
	] );
	
	if ( is_wp_error( $response ) ) {
		return $response;
	}
	
	return $response;
}

/**
 * Register plugin settings
 */
function register_settings() {
	// Add settings section
	if ( function_exists( 'register_graphql_settings_section' ) ) {
		register_graphql_settings_section(
			'graphql_ide_ai_settings',
			[
				'title' => __( 'AI Assistant', 'wpgraphql-ide' ),
				'desc'  => __( 'Configure the AI-powered GraphQL assistant.', 'wpgraphql-ide' ),
			]
		);
	}

	// Add settings fields
	if ( function_exists( 'register_graphql_settings_field' ) ) {
		register_graphql_settings_field(
			'graphql_ide_ai_settings',
			[
				'name'  => 'graphql_ide_gemini_api_key',
				'label' => __( 'Gemini API Key', 'wpgraphql-ide' ),
				'desc'  => __( 'Enter your Google Gemini API key to enable AI assistance.', 'wpgraphql-ide' ),
				'type'  => 'password',
			]
		);

		register_graphql_settings_field(
			'graphql_ide_ai_settings',
			[
				'name'    => 'graphql_ide_ai_enabled',
				'label'   => __( 'Enable AI Assistant', 'wpgraphql-ide' ),
				'desc'    => __( 'Enable the AI assistant in the GraphQL IDE.', 'wpgraphql-ide' ),
				'type'    => 'checkbox',
				'default' => 'on',
			]
		);
	}
}
add_action( 'graphql_register_settings', __NAMESPACE__ . '\register_settings' );
