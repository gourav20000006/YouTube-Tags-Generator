<?php
/**
 * Tag Processor Class
 * Cleans, sanitizes, deduplicates, and formats exactly 20 YouTube tags.
 *
 * @package YouTube_Tag_Generator
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class YTTG_Tag_Processor {

	/**
	 * Target tag count
	 */
	const TARGET_TAG_COUNT = 20;

	/**
	 * Process raw AI text output into exactly 20 clean tags.
	 *
	 * @param string $raw_text Raw string returned by AI API.
	 * @param array  $context_data Fallback video context data.
	 * @return array Array of exactly 20 unique tags.
	 */
	public static function process( $raw_text, $context_data = array() ) {
		if ( empty( $raw_text ) || ! is_string( $raw_text ) ) {
			return self::generate_fallback_tags( $context_data );
		}

		// 1. Remove markdown code blocks if the model wrapped output in ``` or ```json or ```text
		$clean_text = preg_replace( '/```[a-zA-Z]*\s*/', '', $raw_text );
		$clean_text = str_replace( '```', '', $clean_text );

		// 2. Check if AI returned a JSON array
		$parsed_json = json_decode( trim( $clean_text ), true );
		if ( is_array( $parsed_json ) ) {
			$raw_candidates = array();
			foreach ( $parsed_json as $item ) {
				if ( is_string( $item ) ) {
					$raw_candidates[] = $item;
				} elseif ( is_array( $item ) && isset( $item['tag'] ) ) {
					$raw_candidates[] = $item['tag'];
				}
			}
		} else {
			// Split by either newlines or commas
			// First replace newlines with commas if mixed
			$lines = preg_split( '/[\r\n]+/', $clean_text );
			$raw_candidates = array();

			foreach ( $lines as $line ) {
				$line = trim( $line );
				if ( empty( $line ) ) {
					continue;
				}

				// If line contains multiple comma-separated items
				if ( strpos( $line, ',' ) !== false ) {
					$comma_parts = explode( ',', $line );
					foreach ( $comma_parts as $part ) {
						$raw_candidates[] = $part;
					}
				} else {
					$raw_candidates[] = $line;
				}
			}
		}

		// 3. Clean and sanitize each candidate
		$cleaned_tags = array();
		$seen_lower   = array();

		foreach ( $raw_candidates as $candidate ) {
			$tag = self::clean_single_tag( $candidate );

			if ( empty( $tag ) ) {
				continue;
			}

			// Validate YouTube tag criteria: min 2 chars, max 100 chars
			$len = mb_strlen( $tag, 'UTF-8' );
			if ( $len < 2 || $len > 100 ) {
				continue;
			}

			$tag_lower = mb_strtolower( $tag, 'UTF-8' );

			// Prevent duplicate tags
			if ( in_array( $tag_lower, $seen_lower, true ) ) {
				continue;
			}

			$seen_lower[]   = $tag_lower;
			$cleaned_tags[] = $tag;

			if ( count( $cleaned_tags ) === self::TARGET_TAG_COUNT ) {
				break;
			}
		}

		// 4. Guarantee EXACTLY 20 tags
		if ( count( $cleaned_tags ) < self::TARGET_TAG_COUNT ) {
			$needed = self::TARGET_TAG_COUNT - count( $cleaned_tags );
			$fallbacks = self::generate_supplemental_tags( $cleaned_tags, $context_data, $needed );

			foreach ( $fallbacks as $fb_tag ) {
				$fb_lower = mb_strtolower( $fb_tag, 'UTF-8' );
				if ( ! in_array( $fb_lower, $seen_lower, true ) ) {
					$seen_lower[]   = $fb_lower;
					$cleaned_tags[] = $fb_tag;
				}
				if ( count( $cleaned_tags ) === self::TARGET_TAG_COUNT ) {
					break;
				}
			}
		}

		// Slice to exactly 20 tags in case of excess
		return array_slice( $cleaned_tags, 0, self::TARGET_TAG_COUNT );
	}

	/**
	 * Clean and normalize a single tag string.
	 *
	 * @param string $text Raw single tag candidate.
	 * @return string
	 */
	public static function clean_single_tag( $text ) {
		// Strip tags/HTML
		$text = wp_strip_all_tags( $text );

		// Remove leading list numbers: "1.", "1)", "01.", "1 - ", etc.
		$text = preg_replace( '/^\s*\d+[\.\)\-:\s]+\s*/', '', $text );

		// Remove leading bullets or dashes: "*", "-", "•", ">"
		$text = preg_replace( '/^\s*[\*\-•–—>#]+\s*/u', '', $text );

		// Remove surrounding quotes and brackets: '"tag"', "'tag'", "[tag]"
		$text = preg_replace( '/^[\s"\'“”`\[\(]+|[\s"\'“”`\]\)\.,;:]+$/u', '', $text );

		// Replace multiple spaces with a single space
		$text = preg_replace( '/\s+/', ' ', $text );

		// YouTube does not allow angle brackets or tabs
		$text = str_replace( array( '<', '>', "\t" ), '', $text );

		return trim( $text );
	}

	/**
	 * Format array of tags into comma-separated string for YouTube copy.
	 *
	 * @param array $tags Array of tags.
	 * @return string Comma-separated tags string.
	 */
	public static function to_comma_separated( $tags ) {
		if ( ! is_array( $tags ) ) {
			return '';
		}
		return implode( ', ', array_map( 'trim', $tags ) );
	}

	/**
	 * Generate supplemental tags if AI returned fewer than 20 tags
	 *
	 * @param array $current_tags Already approved tags.
	 * @param array $context Video context data.
	 * @param int   $count Number of supplemental tags needed.
	 * @return array
	 */
	private static function generate_supplemental_tags( $current_tags, $context, $count ) {
		$title    = ! empty( $context['title'] ) ? $context['title'] : '';
		$keyword  = ! empty( $context['keyword'] ) ? $context['keyword'] : '';
		$niche    = ! empty( $context['niche'] ) ? $context['niche'] : '';
		$desc     = ! empty( $context['description'] ) ? $context['description'] : '';

		$candidates = array();

		if ( ! empty( $title ) ) {
			$candidates[] = self::clean_single_tag( $title );
			$candidates[] = self::clean_single_tag( $title . ' tutorial' );
			$candidates[] = self::clean_single_tag( 'how to ' . $title );
			$candidates[] = self::clean_single_tag( $title . ' tips' );
			$candidates[] = self::clean_single_tag( $title . ' 2026' );
			$candidates[] = self::clean_single_tag( 'best ' . $title );
			$candidates[] = self::clean_single_tag( $title . ' guide' );
		}

		if ( ! empty( $keyword ) ) {
			$candidates[] = self::clean_single_tag( $keyword );
			$candidates[] = self::clean_single_tag( $keyword . ' guide' );
			$candidates[] = self::clean_single_tag( $keyword . ' for beginners' );
			$candidates[] = self::clean_single_tag( $keyword . ' walkthrough' );
			$candidates[] = self::clean_single_tag( $keyword . ' explained' );
			$candidates[] = self::clean_single_tag( 'best ' . $keyword );
			$candidates[] = self::clean_single_tag( $keyword . ' review' );
		}

		if ( ! empty( $niche ) ) {
			$candidates[] = self::clean_single_tag( $niche );
			$candidates[] = self::clean_single_tag( $niche . ' youtube' );
			$candidates[] = self::clean_single_tag( $niche . ' content' );
			$candidates[] = self::clean_single_tag( $niche . ' trends' );
		}

		// Add common high-ranking YouTube qualifiers
		$base_subject = ! empty( $keyword ) ? $keyword : ( ! empty( $title ) ? $title : 'youtube video' );
		$qualifiers   = array(
			'tutorial',
			'tips and tricks',
			'full guide',
			'step by step',
			'for beginners',
			'complete course',
			'explained',
			'strategy',
			'secrets',
			'youtube seo',
		);

		foreach ( $qualifiers as $q ) {
			$candidates[] = self::clean_single_tag( $base_subject . ' ' . $q );
		}

		$supplements = array();
		$existing_lower = array_map( function( $t ) {
			return mb_strtolower( $t, 'UTF-8' );
		}, $current_tags );

		foreach ( $candidates as $cand ) {
			if ( empty( $cand ) ) {
				continue;
			}
			$c_lower = mb_strtolower( $cand, 'UTF-8' );
			if ( ! in_array( $c_lower, $existing_lower, true ) && ! in_array( $c_lower, $supplements, true ) ) {
				$supplements[] = $cand;
			}
			if ( count( $supplements ) >= $count ) {
				break;
			}
		}

		return $supplements;
	}

	/**
	 * Complete emergency fallback tags in case API is totally unreachable or returns empty.
	 *
	 * @param array $context Video context data.
	 * @return array
	 */
	public static function generate_fallback_tags( $context ) {
		return self::generate_supplemental_tags( array(), $context, self::TARGET_TAG_COUNT );
	}
}
