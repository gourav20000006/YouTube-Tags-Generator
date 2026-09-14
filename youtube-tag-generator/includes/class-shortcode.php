<?php
/**
 * Shortcode Handler Class
 * Handles [youtube_tag_generator] rendering and conditional asset loading.
 *
 * @package YouTube_Tag_Generator
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class YTTG_Shortcode {

	/**
	 * Single instance
	 *
	 * @var YTTG_Shortcode
	 */
	private static $instance = null;

	/**
	 * Flag whether assets have been registered/enqueued
	 *
	 * @var bool
	 */
	private $assets_enqueued = false;

	/**
	 * Get instance
	 *
	 * @return YTTG_Shortcode
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
		add_shortcode( 'youtube_tag_generator', array( $this, 'render_shortcode' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_assets' ) );
	}

	/**
	 * Register frontend scripts and styles
	 */
	public function register_assets() {
		wp_register_style(
			'yttg-frontend-css',
			YTTG_PLUGIN_URL . 'assets/css/frontend.css',
			array(),
			YTTG_VERSION
		);

		wp_register_script(
			'yttg-frontend-js',
			YTTG_PLUGIN_URL . 'assets/js/frontend.js',
			array(),
			YTTG_VERSION,
			true
		);
	}

	/**
	 * Render the [youtube_tag_generator] shortcode
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string Rendered HTML.
	 */
	public function render_shortcode( $atts = array() ) {
		// Enqueue scripts and styles conditionally only when shortcode runs
		if ( ! $this->assets_enqueued ) {
			wp_enqueue_style( 'yttg-frontend-css' );
			wp_enqueue_script( 'yttg-frontend-js' );

			wp_localize_script(
				'yttg-frontend-js',
				'yttg_vars',
				array(
					'ajax_url'        => admin_url( 'admin-ajax.php' ),
					'nonce'           => wp_create_nonce( 'yttg_frontend_nonce' ),
					'i18n'            => array(
						'generating'     => __( 'Generating your 20 tags...', 'youtube-tag-generator' ),
						'researching'    => __( 'AI is researching the best SEO keywords...', 'youtube-tag-generator' ),
						'generate_btn'   => __( 'Generate 20 Tags', 'youtube-tag-generator' ),
						'regenerate_btn' => __( 'Regenerate 20 Tags', 'youtube-tag-generator' ),
						'copy_all'       => __( 'Copy All Tags', 'youtube-tag-generator' ),
						'copied'         => __( '✓ 20 Tags Copied to Clipboard!', 'youtube-tag-generator' ),
						'copy_failed'    => __( 'Failed to copy. Please manually copy from the box below.', 'youtube-tag-generator' ),
						'empty_input'    => __( 'Please enter a video title or description before generating tags.', 'youtube-tag-generator' ),
						'network_err'    => __( 'Network error. Please check your connection and try again.', 'youtube-tag-generator' ),
					),
				)
			);

			$this->assets_enqueued = true;
		}

		ob_start();
		?>
		<div class="yttg-wrapper" id="yttg-app-container">
			<div class="yttg-card">
				<!-- Header Section -->
				<div class="yttg-card-header">
					<div class="yttg-pill-badge">
						<span class="yttg-badge-dot"></span>
						<span><?php esc_html_e( 'YouTube SEO Engine', 'youtube-tag-generator' ); ?></span>
					</div>
					<h2 class="yttg-main-title"><?php esc_html_e( 'YouTube Video Tag Generator', 'youtube-tag-generator' ); ?></h2>
					<p class="yttg-subtitle"><?php esc_html_e( 'Enter your video details below to generate exactly 20 high-ranking, SEO-optimized YouTube tags.', 'youtube-tag-generator' ); ?></p>
				</div>

				<!-- Generator Input Form -->
				<form id="yttg-generator-form" class="yttg-form" novalidate>
					<!-- Video Title -->
					<div class="yttg-field-group">
						<label for="yttg_video_title" class="yttg-field-label">
							<?php esc_html_e( 'Video Title', 'youtube-tag-generator' ); ?>
							<span class="yttg-required-marker" aria-hidden="true">*</span>
						</label>
						<input
							type="text"
							id="yttg_video_title"
							name="video_title"
							class="yttg-input"
							placeholder="<?php esc_attr_e( 'e.g., 10 AI Tools That Will Blow Your Mind in 2026', 'youtube-tag-generator' ); ?>"
							required
							aria-required="true"
						/>
						<span class="yttg-field-hint"><?php esc_html_e( 'Your proposed or published YouTube video headline.', 'youtube-tag-generator' ); ?></span>
					</div>

					<!-- Video Description / Topic -->
					<div class="yttg-field-group">
						<label for="yttg_video_description" class="yttg-field-label">
							<?php esc_html_e( 'Video Description / Topic Overview', 'youtube-tag-generator' ); ?>
						</label>
						<textarea
							id="yttg_video_description"
							name="video_description"
							class="yttg-textarea"
							rows="3"
							placeholder="<?php esc_attr_e( 'Briefly describe what your video covers, key takeaways, software featured, or problems solved...', 'youtube-tag-generator' ); ?>"
						></textarea>
						<span class="yttg-field-hint"><?php esc_html_e( 'Provides context for specific long-tail keyword generation.', 'youtube-tag-generator' ); ?></span>
					</div>

					<!-- Two-column row for optional keyword & niche -->
					<div class="yttg-grid-2col">
						<!-- Main Keyword -->
						<div class="yttg-field-group">
							<label for="yttg_main_keyword" class="yttg-field-label">
								<?php esc_html_e( 'Main Focus Keyword', 'youtube-tag-generator' ); ?>
								<span class="yttg-optional-badge"><?php esc_html_e( 'Optional', 'youtube-tag-generator' ); ?></span>
							</label>
							<input
								type="text"
								id="yttg_main_keyword"
								name="main_keyword"
								class="yttg-input"
								placeholder="<?php esc_attr_e( 'e.g., best AI tools', 'youtube-tag-generator' ); ?>"
							/>
						</div>

						<!-- Niche / Category -->
						<div class="yttg-field-group">
							<label for="yttg_video_niche" class="yttg-field-label">
								<?php esc_html_e( 'Niche / Category', 'youtube-tag-generator' ); ?>
								<span class="yttg-optional-badge"><?php esc_html_e( 'Optional', 'youtube-tag-generator' ); ?></span>
							</label>
							<input
								type="text"
								id="yttg_video_niche"
								name="video_niche"
								class="yttg-input"
								placeholder="<?php esc_attr_e( 'e.g., Tech, Productivity, Gaming, Fitness', 'youtube-tag-generator' ); ?>"
							/>
						</div>
					</div>

					<!-- Action Controls -->
					<div class="yttg-action-bar">
						<button type="submit" id="yttg-submit-btn" class="yttg-primary-button">
							<span class="yttg-btn-spinner" aria-hidden="true"></span>
							<svg class="yttg-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
							</svg>
							<span class="yttg-btn-text"><?php esc_html_e( 'Generate 20 Tags', 'youtube-tag-generator' ); ?></span>
						</button>

						<button type="button" id="yttg-reset-btn" class="yttg-secondary-button" style="display:none;">
							<?php esc_html_e( 'Clear', 'youtube-tag-generator' ); ?>
						</button>
					</div>

					<!-- Loading Feedback Banner -->
					<div id="yttg-loading-box" class="yttg-loading-container" style="display:none;" aria-live="polite">
						<div class="yttg-pulse-spinner"></div>
						<p id="yttg-loading-text" class="yttg-loading-message">
							<?php esc_html_e( 'Analyzing video topic and generating 20 SEO tags...', 'youtube-tag-generator' ); ?>
						</p>
					</div>

					<!-- Error Message Box -->
					<div id="yttg-error-box" class="yttg-error-container" style="display:none;" role="alert">
						<svg class="yttg-error-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="12" cy="12" r="10"/>
							<line x1="12" y1="8" x2="12" y2="12"/>
							<line x1="12" y1="16" x2="12.01" y2="16"/>
						</svg>
						<span id="yttg-error-message" class="yttg-error-text"></span>
					</div>
				</form>

				<!-- Results Section (Hidden until generated) -->
				<div id="yttg-results-section" class="yttg-results" style="display:none;" aria-live="polite">
					<div class="yttg-results-divider"></div>

					<div class="yttg-results-header">
						<div class="yttg-results-title-wrap">
							<h3 class="yttg-results-title"><?php esc_html_e( 'Generated Tags', 'youtube-tag-generator' ); ?></h3>
							<span class="yttg-count-badge" id="yttg-tag-counter">20 / 20 Tags</span>
						</div>

						<div class="yttg-results-actions">
							<!-- Primary Copy All Button -->
							<button type="button" id="yttg-copy-all-btn" class="yttg-copy-button" aria-label="<?php esc_attr_e( 'Copy all 20 tags comma separated to clipboard', 'youtube-tag-generator' ); ?>">
								<svg class="yttg-copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
									<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
								</svg>
								<span id="yttg-copy-btn-text"><?php esc_html_e( 'Copy All Tags', 'youtube-tag-generator' ); ?></span>
							</button>
						</div>
					</div>

					<p class="yttg-copy-instruction">
						<?php esc_html_e( 'Tags are formatted for direct copy-pasting into YouTube Studio tags box:', 'youtube-tag-generator' ); ?>
					</p>

					<!-- Tags Chips Grid -->
					<div id="yttg-tags-chips-container" class="yttg-chips-grid">
						<!-- Injected via JavaScript -->
					</div>

					<!-- Direct Comma-Separated Output Box (Accessible & Quick Select) -->
					<div class="yttg-raw-box-wrap">
						<label for="yttg-comma-output" class="yttg-raw-label">
							<?php esc_html_e( 'Comma-Separated Output (Ready for YouTube Studio)', 'youtube-tag-generator' ); ?>
						</label>
						<textarea
							id="yttg-comma-output"
							class="yttg-raw-textarea"
							readonly
							rows="3"
							aria-label="<?php esc_attr_e( 'Comma separated tag list for YouTube', 'youtube-tag-generator' ); ?>"
						></textarea>
					</div>

					<!-- Bottom Quick-Tip -->
					<div class="yttg-footer-tip">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
						</svg>
						<span><?php esc_html_e( 'Paste these directly into YouTube Studio > Video Details > Show More > Tags.', 'youtube-tag-generator' ); ?></span>
					</div>
				</div>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
