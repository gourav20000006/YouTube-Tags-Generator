<?php
/**
 * Abstract AI Provider Base Class
 *
 * @package YouTube_Tag_Generator
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

abstract class YTTG_API_Provider {

	/**
	 * API Key
	 *
	 * @var string
	 */
	protected $api_key;

	/**
	 * Model Name
	 *
	 * @var string
	 */
	protected $model;

	/**
	 * Constructor
	 *
	 * @param string $api_key API Key.
	 * @param string $model   Model Name.
	 */
	public function __construct( $api_key, $model = '' ) {
		$this->api_key = trim( $api_key );
		$this->model   = trim( $model );
	}

	/**
	 * Generate 20 tags from video details.
	 *
	 * @param array $video_data Array containing title, description, keyword, niche, and optional regeneration flag.
	 * @return array|WP_Error Array with 'tags' and 'raw', or WP_Error on failure.
	 */
	abstract public function generate_tags( $video_data );

	/**
	 * Construct the optimized YouTube SEO prompt.
	 *
	 * @param array $video_data Video details.
	 * @return array Array with 'system' and 'user' prompt strings.
	 */
	protected function build_prompt( $video_data ) {
		$title       = ! empty( $video_data['title'] ) ? sanitize_text_field( $video_data['title'] ) : '';
		$description = ! empty( $video_data['description'] ) ? sanitize_textarea_field( $video_data['description'] ) : '';
		$keyword     = ! empty( $video_data['keyword'] ) ? sanitize_text_field( $video_data['keyword'] ) : '';
		$niche       = ! empty( $video_data['niche'] ) ? sanitize_text_field( $video_data['niche'] ) : '';
		$is_regen    = ! empty( $video_data['regenerate'] ) && true === $video_data['regenerate'];

		$system = "You are an elite YouTube SEO strategist and metadata optimization expert.
Your job is to analyze the user's video details and generate EXACTLY 20 highly-converting, search-optimized YouTube video tags.

RULES:
1. Return EXACTLY 20 unique tags.
2. Return ONLY the tags as a clean comma-separated list on a single line, or as a JSON array of 20 strings.
3. Absolutely NO introductory text, NO conversational filler, NO explanations, NO markdown headers, and NO numbered lists.
4. Each tag must be a natural keyword phrase (between 2 and 6 words or high-volume short-tail keyword).
5. Combine a balanced mixture of:
   - Primary high-intent search queries
   - Long-tail specific questions and search phrases
   - Topic synonyms and variation keywords
   - Category/niche related terms
6. Do NOT invent misleading, clickbait, or irrelevant tags.
7. Do NOT duplicate tags or use repetitive filler.
8. Output format requirement: comma-separated list of exactly 20 tags.";

		$user = "Generate 20 YouTube tags for this video:\n\n";
		$user .= "Video Title: " . ( $title ? $title : "Not specified" ) . "\n";
		$user .= "Description/Topic: " . ( $description ? $description : "Not specified" ) . "\n";
		if ( ! empty( $keyword ) ) {
			$user .= "Primary Focus Keyword: " . $keyword . "\n";
		}
		if ( ! empty( $niche ) ) {
			$user .= "Niche / Category: " . $niche . "\n";
		}

		if ( $is_regen ) {
			$user .= "\nNote: This is a REGENERATION request. Provide a completely fresh, alternative set of 20 high-ranking tags exploring different angles, long-tail variations, and audience search queries. Still strictly 20 tags.";
		}

		return array(
			'system' => $system,
			'user'   => $user,
		);
	}
}
