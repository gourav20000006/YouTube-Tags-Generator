<?php
/**
 * OpenAI API Provider
 *
 * @package YouTube_Tag_Generator
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class YTTG_OpenAI_Provider extends YTTG_API_Provider {

	/**
	 * Default model
	 */
	const DEFAULT_MODEL = 'gpt-4o-mini';

	/**
	 * OpenAI API Endpoint
	 */
	const API_URL = 'https://api.openai.com/v1/chat/completions';

	/**
	 * Generate tags using OpenAI Chat Completions API
	 *
	 * @param array $video_data Video details.
	 * @return array|WP_Error
	 */
	public function generate_tags( $video_data ) {
		if ( empty( $this->api_key ) ) {
			return new WP_Error(
				'yttg_missing_key',
				__( 'OpenAI API key is not configured. Please enter your API key in WordPress Settings > YouTube Tag Generator.', 'youtube-tag-generator' )
			);
		}

		$prompts = $this->build_prompt( $video_data );
		$model   = ! empty( $this->model ) ? $this->model : self::DEFAULT_MODEL;

		$body = array(
			'model'       => $model,
			'max_tokens'  => 500,
			'temperature' => 0.7,
			'messages'    => array(
				array(
					'role'    => 'system',
					'content' => $prompts['system'],
				),
				array(
					'role'    => 'user',
					'content' => $prompts['user'],
				),
			),
		);

		$args = array(
			'headers' => array(
				'Authorization' => 'Bearer ' . $this->api_key,
				'Content-Type'  => 'application/json',
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
			$error_message = __( 'OpenAI API returned an error. Please try again later.', 'youtube-tag-generator' );

			if ( isset( $data['error']['message'] ) ) {
				$msg = $data['error']['message'];
				if ( 401 === $status_code ) {
					$error_message = __( 'Invalid OpenAI API Key. Please verify your key in Settings > YouTube Tag Generator.', 'youtube-tag-generator' );
				} elseif ( 429 === $status_code ) {
					$error_message = __( 'OpenAI rate limit or credit quota exceeded. Please check your OpenAI billing or usage limits.', 'youtube-tag-generator' );
				} else {
					$error_message = sprintf(
						/* translators: %s: provider message */
						__( 'OpenAI API error (%d): %s', 'youtube-tag-generator' ),
						$status_code,
						esc_html( $msg )
					);
				}
			}

			return new WP_Error( 'yttg_api_error_' . $status_code, $error_message );
		}

		if ( empty( $data['choices'][0]['message']['content'] ) ) {
			return new WP_Error(
				'yttg_empty_response',
				__( 'The AI returned an empty response. Please try again with more details in your video title and description.', 'youtube-tag-generator' )
			);
		}

		$raw_output = $data['choices'][0]['message']['content'];
		$tags       = YTTG_Tag_Processor::process( $raw_output, $video_data );

		return array(
			'tags' => $tags,
			'raw'  => $raw_output,
		);
	}
}
