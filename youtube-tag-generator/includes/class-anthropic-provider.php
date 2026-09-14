<?php
/**
 * Anthropic Claude API Provider
 *
 * @package YouTube_Tag_Generator
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class YTTG_Anthropic_Provider extends YTTG_API_Provider {

	/**
	 * Default model
	 */
	const DEFAULT_MODEL = 'claude-3-5-haiku-20241022';

	/**
	 * Anthropic API Endpoint
	 */
	const API_URL = 'https://api.anthropic.com/v1/messages';

	/**
	 * Anthropic API Version Header
	 */
	const API_VERSION = '2023-06-01';

	/**
	 * Generate tags using Anthropic Claude Messages API
	 *
	 * @param array $video_data Video details.
	 * @return array|WP_Error
	 */
	public function generate_tags( $video_data ) {
		if ( empty( $this->api_key ) ) {
			return new WP_Error(
				'yttg_missing_key',
				__( 'Anthropic API key is not configured. Please enter your API key in WordPress Settings > YouTube Tag Generator.', 'youtube-tag-generator' )
			);
		}

		$prompts = $this->build_prompt( $video_data );
		$model   = ! empty( $this->model ) ? $this->model : self::DEFAULT_MODEL;

		$body = array(
			'model'       => $model,
			'max_tokens'  => 500,
			'temperature' => 0.7,
			'system'      => $prompts['system'],
			'messages'    => array(
				array(
					'role'    => 'user',
					'content' => $prompts['user'],
				),
			),
		);

		$args = array(
			'headers' => array(
				'x-api-key'         => $this->api_key,
				'anthropic-version' => self::API_VERSION,
				'content-type'      => 'application/json',
			),
			'body'        => wp_json_encode( $body ),
			'timeout'     => 30,
			'data_format' => 'body',
		);

		$response = wp_remote_post( self::API_URL, $args );

		if ( is_wp_error( $response ) ) {
			return new WP_Error(
				'yttg_http_error',
				sprintf(
					/* translators: %s: error message */
					__( 'Network connection error: %s. Please try again.', 'youtube-tag-generator' ),
					$response->get_error_message()
				)
			);
		}

		$status_code = wp_remote_retrieve_response_code( $response );
		$raw_body    = wp_remote_retrieve_body( $response );
		$data        = json_decode( $raw_body, true );

		if ( $status_code !== 200 ) {
			$error_message = __( 'Anthropic API returned an error. Please try again later.', 'youtube-tag-generator' );

			if ( isset( $data['error']['message'] ) ) {
				$msg = $data['error']['message'];
				if ( 401 === $status_code ) {
					$error_message = __( 'Invalid Anthropic API Key. Please verify your key in Settings > YouTube Tag Generator.', 'youtube-tag-generator' );
				} elseif ( 429 === $status_code ) {
					$error_message = __( 'Anthropic rate limit or quota exceeded. Please check your Anthropic balance or wait a moment.', 'youtube-tag-generator' );
				} else {
					$error_message = sprintf(
						/* translators: %s: provider message */
						__( 'Anthropic API error (%d): %s', 'youtube-tag-generator' ),
						$status_code,
						esc_html( $msg )
					);
				}
			}

			return new WP_Error( 'yttg_api_error_' . $status_code, $error_message );
		}

		if ( empty( $data['content'][0]['text'] ) ) {
			return new WP_Error(
				'yttg_empty_response',
				__( 'The AI returned an empty response. Please try again with more details in your video title and description.', 'youtube-tag-generator' )
			);
		}

		$raw_output = $data['content'][0]['text'];
		$tags       = YTTG_Tag_Processor::process( $raw_output, $video_data );

		return array(
			'tags' => $tags,
			'raw'  => $raw_output,
		);
	}
}
