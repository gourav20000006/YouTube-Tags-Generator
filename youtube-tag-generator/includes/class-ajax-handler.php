<?php
/**
 * AJAX Request Handler
 * Handles secure frontend generation requests with rate limiting and nonces.
 *
 * @package YouTube_Tag_Generator
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class YTTG_Ajax_Handler {

	/**
	 * Single instance
	 *
	 * @var YTTG_Ajax_Handler
	 */
	private static $instance = null;

	/**
	 * Get instance
	 *
	 * @return YTTG_Ajax_Handler
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 */
	private function __construct() {
		add_action( 'wp_ajax_yttg_generate_tags', array( $this, 'handle_generate_tags' ) );
		add_action( 'wp_ajax_nopriv_yttg_generate_tags', array( $this, 'handle_generate_tags' ) );
	}

	/**
	 * Handle AJAX generation request
	 */
	public function handle_generate_tags() {
		// 1. Verify nonce
		check_ajax_referer( 'yttg_frontend_nonce', 'nonce' );

		// 2. Client IP Rate Limiting (Abuse Protection)
		$rate_error = $this->check_rate_limit();
		if ( is_wp_error( $rate_error ) ) {
			wp_send_json_error(
				array(
					'message' => $rate_error->get_error_message(),
				),
				429
			);
		}

		// 3. Sanitize inputs
		$title       = isset( $_POST['title'] ) ? sanitize_text_field( wp_unslash( $_POST['title'] ) ) : '';
		$description = isset( $_POST['description'] ) ? sanitize_textarea_field( wp_unslash( $_POST['description'] ) ) : '';
		$keyword     = isset( $_POST['keyword'] ) ? sanitize_text_field( wp_unslash( $_POST['keyword'] ) ) : '';
		$niche       = isset( $_POST['niche'] ) ? sanitize_text_field( wp_unslash( $_POST['niche'] ) ) : '';
		$regenerate  = ! empty( $_POST['regenerate'] ) && 'true' === sanitize_text_field( wp_unslash( $_POST['regenerate'] ) );

		// 4. Validate essential input
		if ( empty( $title ) && empty( $description ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Please enter a video title or description to generate tags.', 'youtube-tag-generator' ),
				),
				400
			);
		}

		// 5. Load settings
		$settings = get_option( 'yttg_settings', array() );
		$provider = ! empty( $settings['provider'] ) ? sanitize_key( $settings['provider'] ) : 'anthropic';

		// Get provider-specific key and model
		$api_key = '';
		$model   = '';

		if ( 'openai' === $provider ) {
			$api_key = ! empty( $settings['openai_api_key'] ) ? trim( $settings['openai_api_key'] ) : '';
			$model   = ! empty( $settings['openai_model'] ) ? trim( $settings['openai_model'] ) : YTTG_OpenAI_Provider::DEFAULT_MODEL;
			$ai_client = new YTTG_OpenAI_Provider( $api_key, $model );
		} else {
			$provider = 'anthropic';
			$api_key  = ! empty( $settings['anthropic_api_key'] ) ? trim( $settings['anthropic_api_key'] ) : ( ! empty( $settings['api_key'] ) ? trim( $settings['api_key'] ) : '' );
			$model    = ! empty( $settings['model'] ) ? trim( $settings['model'] ) : YTTG_Anthropic_Provider::DEFAULT_MODEL;
			$ai_client = new YTTG_Anthropic_Provider( $api_key, $model );
		}

		// Verify API key is present
		if ( empty( $api_key ) ) {
			$admin_msg = current_user_can( 'manage_options' )
				? __( 'API key has not been configured. Go to WordPress Settings > YouTube Tag Generator to configure your key.', 'youtube-tag-generator' )
				: __( 'The tag generator is currently being configured by the site administrator. Please check back shortly.', 'youtube-tag-generator' );

			wp_send_json_error(
				array(
					'message' => $admin_msg,
				),
				500
			);
		}

		// 6. Execute AI generation
		$video_data = array(
			'title'       => $title,
			'description' => $description,
			'keyword'     => $keyword,
			'niche'       => $niche,
			'regenerate'  => $regenerate,
		);

		$result = $ai_client->generate_tags( $video_data );

		if ( is_wp_error( $result ) ) {
			wp_send_json_error(
				array(
					'message' => $result->get_error_message(),
				),
				500
			);
		}

		// 7. Format success response with exactly 20 tags
		$tags      = $result['tags'];
		$comma_str = YTTG_Tag_Processor::to_comma_separated( $tags );

		// Record successful request for rate limiting
		$this->record_request();

		wp_send_json_success(
			array(
				'tags'            => $tags,
				'comma_separated' => $comma_str,
				'count'           => count( $tags ),
				'is_regenerated'  => $regenerate,
			)
		);
	}

	/**
	 * Client IP address detection
	 *
	 * @return string
	 */
	private function get_client_ip() {
		$ip = '127.0.0.1';
		if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
			$ip = sanitize_text_field( wp_unslash( $_SERVER['HTTP_CLIENT_IP'] ) );
		} elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
			$forwarded = sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_FORWARDED_FOR'] ) );
			$ips       = explode( ',', $forwarded );
			$ip        = trim( $ips[0] );
		} elseif ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
			$ip = sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) );
		}
		return filter_var( $ip, FILTER_VALIDATE_IP ) ? $ip : '127.0.0.1';
	}

	/**
	 * Check rate limit for the client IP
	 *
	 * @return true|WP_Error
	 */
	private function check_rate_limit() {
		$ip_hash       = md5( 'yttg_' . $this->get_client_ip() );
		$cooldown_key  = 'yttg_cd_' . $ip_hash;
		$hourly_key    = 'yttg_hr_' . $ip_hash;

		// 1. Rapid click cooldown (default 6 seconds)
		if ( false !== get_transient( $cooldown_key ) ) {
			return new WP_Error(
				'yttg_cooldown',
				__( 'Please wait a few seconds before requesting another set of tags.', 'youtube-tag-generator' )
			);
		}

		// 2. Hourly quota limit (default max 30 generations per hour per IP)
		$hourly_count = (int) get_transient( $hourly_key );
		if ( $hourly_count >= 30 ) {
			return new WP_Error(
				'yttg_rate_limit',
				__( 'You have reached the maximum number of generations for this hour. Please try again later.', 'youtube-tag-generator' )
			);
		}

		return true;
	}

	/**
	 * Record request in transients for rate limiting
	 */
	private function record_request() {
		$ip_hash      = md5( 'yttg_' . $this->get_client_ip() );
		$cooldown_key = 'yttg_cd_' . $ip_hash;
		$hourly_key   = 'yttg_hr_' . $ip_hash;

		// Set 6-second rapid click cooldown
		set_transient( $cooldown_key, 1, 6 );

		// Increment hourly counter (expires in 1 hour)
		$count = (int) get_transient( $hourly_key );
		if ( false === $count || 0 === $count ) {
			set_transient( $hourly_key, 1, HOUR_IN_SECONDS );
		} else {
			set_transient( $hourly_key, $count + 1, HOUR_IN_SECONDS );
		}
	}
}
