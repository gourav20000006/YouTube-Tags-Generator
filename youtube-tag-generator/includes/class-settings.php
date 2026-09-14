<?php
/**
 * Admin Settings Class
 * Manages plugin configuration in WordPress Dashboard.
 *
 * @package YouTube_Tag_Generator
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class YTTG_Settings {

	/**
	 * Single instance
	 *
	 * @var YTTG_Settings
	 */
	private static $instance = null;

	/**
	 * Settings page hook suffix
	 *
	 * @var string
	 */
	private $hook_suffix = '';

	/**
	 * Get instance
	 *
	 * @return YTTG_Settings
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
		add_action( 'admin_menu', array( $this, 'register_menu_page' ) );
		add_action( 'admin_init', array( $this, 'handle_save_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
	}

	/**
	 * Register settings menu page in WordPress Dashboard
	 */
	public function register_menu_page() {
		$this->hook_suffix = add_options_page(
			__( 'YouTube Tag Generator Settings', 'youtube-tag-generator' ),
			__( 'YouTube Tag Generator', 'youtube-tag-generator' ),
			'manage_options',
			'youtube-tag-generator',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Enqueue admin scripts & styles on our plugin page only
	 *
	 * @param string $hook Current admin page hook.
	 */
	public function enqueue_admin_assets( $hook ) {
		if ( $hook !== $this->hook_suffix ) {
			return;
		}

		wp_enqueue_style(
			'yttg-admin-css',
			YTTG_PLUGIN_URL . 'admin/css/admin.css',
			array(),
			YTTG_VERSION
		);

		wp_enqueue_script(
			'yttg-admin-js',
			YTTG_PLUGIN_URL . 'admin/js/admin.js',
			array(),
			YTTG_VERSION,
			true
		);
	}

	/**
	 * Handle form submission securely
	 */
	public function handle_save_settings() {
		if ( ! isset( $_POST['yttg_save_settings_nonce'] ) ) {
			return;
		}

		if ( ! check_admin_referer( 'yttg_save_settings_action', 'yttg_save_settings_nonce' ) ) {
			wp_die( esc_html__( 'Security check failed. Please refresh the page and try again.', 'youtube-tag-generator' ) );
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have sufficient permissions to access this page.', 'youtube-tag-generator' ) );
		}

		$current_settings = get_option( 'yttg_settings', array() );
		$provider         = isset( $_POST['yttg_provider'] ) ? sanitize_key( $_POST['yttg_provider'] ) : 'anthropic';
		if ( ! in_array( $provider, array( 'anthropic', 'openai' ), true ) ) {
			$provider = 'anthropic';
		}

		// Anthropic Key: Keep existing if input was blank or masked
		$new_anthropic_key = isset( $_POST['yttg_anthropic_key'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['yttg_anthropic_key'] ) ) ) : '';
		if ( empty( $new_anthropic_key ) || strpos( $new_anthropic_key, '••••' ) !== false ) {
			$anthropic_key = ! empty( $current_settings['anthropic_api_key'] ) ? $current_settings['anthropic_api_key'] : ( ! empty( $current_settings['api_key'] ) ? $current_settings['api_key'] : '' );
		} else {
			$anthropic_key = $new_anthropic_key;
		}

		// OpenAI Key: Keep existing if input was blank or masked
		$new_openai_key = isset( $_POST['yttg_openai_key'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['yttg_openai_key'] ) ) ) : '';
		if ( empty( $new_openai_key ) || strpos( $new_openai_key, '••••' ) !== false ) {
			$openai_key = ! empty( $current_settings['openai_api_key'] ) ? $current_settings['openai_api_key'] : '';
		} else {
			$openai_key = $new_openai_key;
		}

		// Models
		$anthropic_model = isset( $_POST['yttg_anthropic_model'] ) ? sanitize_text_field( wp_unslash( $_POST['yttg_anthropic_model'] ) ) : 'claude-3-5-haiku-20241022';
		$openai_model    = isset( $_POST['yttg_openai_model'] ) ? sanitize_text_field( wp_unslash( $_POST['yttg_openai_model'] ) ) : 'gpt-4o-mini';

		$updated_settings = array(
			'provider'          => $provider,
			'anthropic_api_key' => $anthropic_key,
			'api_key'           => $anthropic_key, // Backward compatibility
			'openai_api_key'    => $openai_key,
			'model'             => $anthropic_model,
			'openai_model'      => $openai_model,
		);

		update_option( 'yttg_settings', $updated_settings );

		// Redirect with success notice
		wp_safe_redirect(
			add_query_arg(
				array(
					'page'    => 'youtube-tag-generator',
					'updated' => 'true',
				),
				admin_url( 'options-general.php' )
			)
		);
		exit;
	}

	/**
	 * Mask API key for safe UI display (e.g. ••••••••••••ABCD)
	 *
	 * @param string $key Raw API key.
	 * @return string Masked key or empty string.
	 */
	public static function mask_key( $key ) {
		$len = strlen( $key );
		if ( $len <= 4 ) {
			return $key ? '••••' : '';
		}
		$last_four = substr( $key, -4 );
		return str_repeat( '•', max( 8, min( 24, $len - 4 ) ) ) . $last_four;
	}

	/**
	 * Render settings page HTML
	 */
	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$settings        = get_option( 'yttg_settings', array() );
		$provider        = ! empty( $settings['provider'] ) ? $settings['provider'] : 'anthropic';
		$anthropic_key   = ! empty( $settings['anthropic_api_key'] ) ? $settings['anthropic_api_key'] : ( ! empty( $settings['api_key'] ) ? $settings['api_key'] : '' );
		$openai_key      = ! empty( $settings['openai_api_key'] ) ? $settings['openai_api_key'] : '';
		$anthropic_model = ! empty( $settings['model'] ) ? $settings['model'] : 'claude-3-5-haiku-20241022';
		$openai_model    = ! empty( $settings['openai_model'] ) ? $settings['openai_model'] : 'gpt-4o-mini';

		$is_updated      = isset( $_GET['updated'] ) && 'true' === $_GET['updated'];
		?>
		<div class="wrap yttg-admin-wrap">
			<div class="yttg-admin-header">
				<div class="yttg-admin-header-text">
					<h1><?php esc_html_e( 'YouTube Video Tag Generator', 'youtube-tag-generator' ); ?></h1>
					<p class="yttg-version-badge">
						<?php printf( esc_html__( 'Version %s', 'youtube-tag-generator' ), esc_html( YTTG_VERSION ) ); ?>
					</p>
				</div>
				<span class="yttg-header-tag"><?php esc_html_e( 'AI-Powered SEO Tool', 'youtube-tag-generator' ); ?></span>
			</div>

			<?php if ( $is_updated ) : ?>
				<div class="notice notice-success is-dismissible yttg-notice">
					<p><strong><?php esc_html_e( 'Settings saved successfully!', 'youtube-tag-generator' ); ?></strong> <?php esc_html_e( 'Your configuration is active.', 'youtube-tag-generator' ); ?></p>
				</div>
			<?php endif; ?>

			<div class="yttg-security-banner">
				<div class="yttg-security-icon">&#128274;</div>
				<div class="yttg-security-content">
					<strong><?php esc_html_e( 'Enterprise Security Guarantee', 'youtube-tag-generator' ); ?></strong>
					<p><?php esc_html_e( 'Your API key is stored securely on your WordPress server and processed exclusively server-side. It is NEVER sent to website visitors, included in JavaScript, printed in page HTML, or logged.', 'youtube-tag-generator' ); ?></p>
				</div>
			</div>

			<div class="yttg-grid-layout">
				<!-- Settings Form Column -->
				<div class="yttg-form-column">
					<form method="post" action="" class="yttg-card">
						<?php wp_nonce_field( 'yttg_save_settings_action', 'yttg_save_settings_nonce' ); ?>

						<h2 class="yttg-card-title"><?php esc_html_e( 'AI Provider & Credentials', 'youtube-tag-generator' ); ?></h2>
						<p class="yttg-card-subtitle"><?php esc_html_e( 'Select which AI service generates your 20 YouTube tags and enter your secure API key.', 'youtube-tag-generator' ); ?></p>

						<!-- Provider Choice -->
						<div class="yttg-form-group">
							<label class="yttg-label"><?php esc_html_e( 'AI Provider', 'youtube-tag-generator' ); ?></label>
							<div class="yttg-provider-radios">
								<label class="yttg-radio-card <?php echo ( 'anthropic' === $provider ) ? 'is-selected' : ''; ?>">
									<input type="radio" name="yttg_provider" value="anthropic" <?php checked( $provider, 'anthropic' ); ?> />
									<div class="yttg-radio-info">
										<span class="yttg-radio-title"><?php esc_html_e( 'Anthropic Claude', 'youtube-tag-generator' ); ?></span>
										<span class="yttg-radio-desc"><?php esc_html_e( 'Fast, highly accurate tags using Claude 3.5 Haiku / Sonnet.', 'youtube-tag-generator' ); ?></span>
									</div>
								</label>

								<label class="yttg-radio-card <?php echo ( 'openai' === $provider ) ? 'is-selected' : ''; ?>">
									<input type="radio" name="yttg_provider" value="openai" <?php checked( $provider, 'openai' ); ?> />
									<div class="yttg-radio-info">
										<span class="yttg-radio-title"><?php esc_html_e( 'OpenAI', 'youtube-tag-generator' ); ?></span>
										<span class="yttg-radio-desc"><?php esc_html_e( 'Industry-standard tags using GPT-4o mini or GPT-4o.', 'youtube-tag-generator' ); ?></span>
									</div>
								</label>
							</div>
						</div>

						<!-- Anthropic Section -->
						<div class="yttg-provider-section" id="yttg-section-anthropic" style="<?php echo ( 'anthropic' === $provider ) ? 'display:block;' : 'display:none;'; ?>">
							<div class="yttg-form-group">
								<label for="yttg_anthropic_key" class="yttg-label">
									<?php esc_html_e( 'Anthropic API Key', 'youtube-tag-generator' ); ?>
									<?php if ( ! empty( $anthropic_key ) ) : ?>
										<span class="yttg-key-status yttg-status-active">&#10003; <?php esc_html_e( 'Configured', 'youtube-tag-generator' ); ?></span>
									<?php else : ?>
										<span class="yttg-key-status yttg-status-missing">&#9888; <?php esc_html_e( 'Key Required', 'youtube-tag-generator' ); ?></span>
									<?php endif; ?>
								</label>
								<input
									type="password"
									id="yttg_anthropic_key"
									name="yttg_anthropic_key"
									class="regular-text yttg-input"
									placeholder="<?php echo ! empty( $anthropic_key ) ? esc_attr( self::mask_key( $anthropic_key ) ) : 'sk-ant-api03-...'; ?>"
									value="<?php echo ! empty( $anthropic_key ) ? esc_attr( self::mask_key( $anthropic_key ) ) : ''; ?>"
									autocomplete="off"
								/>
								<p class="description">
									<?php esc_html_e( 'Get your key from console.anthropic.com. Leave unchanged to keep current key.', 'youtube-tag-generator' ); ?>
								</p>
							</div>

							<div class="yttg-form-group">
								<label for="yttg_anthropic_model" class="yttg-label"><?php esc_html_e( 'Claude Model', 'youtube-tag-generator' ); ?></label>
								<select id="yttg_anthropic_model" name="yttg_anthropic_model" class="yttg-select">
									<option value="claude-3-5-haiku-20241022" <?php selected( $anthropic_model, 'claude-3-5-haiku-20241022' ); ?>>
										claude-3-5-haiku-20241022 (Fastest, High Accuracy, Lowest Cost - Recommended)
									</option>
									<option value="claude-3-5-sonnet-20241022" <?php selected( $anthropic_model, 'claude-3-5-sonnet-20241022' ); ?>>
										claude-3-5-sonnet-20241022 (Maximum Nuance & Deep Niche Keyword Strategy)
									</option>
									<option value="claude-3-haiku-20240307" <?php selected( $anthropic_model, 'claude-3-haiku-20240307' ); ?>>
										claude-3-haiku-20240307 (Legacy Haiku)
									</option>
								</select>
							</div>
						</div>

						<!-- OpenAI Section -->
						<div class="yttg-provider-section" id="yttg-section-openai" style="<?php echo ( 'openai' === $provider ) ? 'display:block;' : 'display:none;'; ?>">
							<div class="yttg-form-group">
								<label for="yttg_openai_key" class="yttg-label">
									<?php esc_html_e( 'OpenAI API Key', 'youtube-tag-generator' ); ?>
									<?php if ( ! empty( $openai_key ) ) : ?>
										<span class="yttg-key-status yttg-status-active">&#10003; <?php esc_html_e( 'Configured', 'youtube-tag-generator' ); ?></span>
									<?php else : ?>
										<span class="yttg-key-status yttg-status-missing">&#9888; <?php esc_html_e( 'Key Required', 'youtube-tag-generator' ); ?></span>
									<?php endif; ?>
								</label>
								<input
									type="password"
									id="yttg_openai_key"
									name="yttg_openai_key"
									class="regular-text yttg-input"
									placeholder="<?php echo ! empty( $openai_key ) ? esc_attr( self::mask_key( $openai_key ) ) : 'sk-proj-...'; ?>"
									value="<?php echo ! empty( $openai_key ) ? esc_attr( self::mask_key( $openai_key ) ) : ''; ?>"
									autocomplete="off"
								/>
								<p class="description">
									<?php esc_html_e( 'Get your key from platform.openai.com/api-keys. Leave unchanged to keep current key.', 'youtube-tag-generator' ); ?>
								</p>
							</div>

							<div class="yttg-form-group">
								<label for="yttg_openai_model" class="yttg-label"><?php esc_html_e( 'OpenAI Model', 'youtube-tag-generator' ); ?></label>
								<select id="yttg_openai_model" name="yttg_openai_model" class="yttg-select">
									<option value="gpt-4o-mini" <?php selected( $openai_model, 'gpt-4o-mini' ); ?>>
										gpt-4o-mini (Super fast, economical, optimized for SEO lists - Recommended)
									</option>
									<option value="gpt-4o" <?php selected( $openai_model, 'gpt-4o' ); ?>>
										gpt-4o (Flagship omni model)
									</option>
									<option value="gpt-3.5-turbo" <?php selected( $openai_model, 'gpt-3.5-turbo' ); ?>>
										gpt-3.5-turbo (Legacy model)
									</option>
								</select>
							</div>
						</div>

						<div class="yttg-form-actions">
							<button type="submit" class="button button-primary yttg-save-btn">
								<?php esc_html_e( 'Save Settings', 'youtube-tag-generator' ); ?>
							</button>
						</div>
					</form>
				</div>

				<!-- Setup & Quick Start Sidebar -->
				<div class="yttg-guide-column">
					<div class="yttg-card yttg-guide-card">
						<h3 class="yttg-guide-title"><?php esc_html_e( 'How to Display on Your Website', 'youtube-tag-generator' ); ?></h3>

						<ol class="yttg-step-list">
							<li>
								<strong><?php esc_html_e( 'Step 1: Save Your API Key', 'youtube-tag-generator' ); ?></strong>
								<p><?php esc_html_e( 'Select Anthropic or OpenAI, paste your API key on the left, and click Save Settings.', 'youtube-tag-generator' ); ?></p>
							</li>
							<li>
								<strong><?php esc_html_e( 'Step 2: Create a WordPress Page', 'youtube-tag-generator' ); ?></strong>
								<p><?php esc_html_e( 'Go to Pages > Add New in your WordPress menu (e.g. title it "YouTube Tag Generator").', 'youtube-tag-generator' ); ?></p>
							</li>
							<li>
								<strong><?php esc_html_e( 'Step 3: Add the Shortcode', 'youtube-tag-generator' ); ?></strong>
								<p><?php esc_html_e( 'Paste this shortcode anywhere in your page content:', 'youtube-tag-generator' ); ?></p>
								<div class="yttg-code-box">
									<code>[youtube_tag_generator]</code>
									<button type="button" class="button button-small yttg-copy-shortcode-btn" onclick="navigator.clipboard.writeText('[youtube_tag_generator]'); this.innerText='Copied!'; setTimeout(() => this.innerText='Copy', 2000);">
										<?php esc_html_e( 'Copy', 'youtube-tag-generator' ); ?>
									</button>
								</div>
							</li>
							<li>
								<strong><?php esc_html_e( 'Step 4: Publish & Enjoy!', 'youtube-tag-generator' ); ?></strong>
								<p><?php esc_html_e( 'Publish the page. The modern generator tool will instantly appear with live 20-tag generation and 1-click comma-separated copy!', 'youtube-tag-generator' ); ?></p>
							</li>
						</ol>

						<div class="yttg-info-box">
							<strong><?php esc_html_e( 'Rate Limiting Active', 'youtube-tag-generator' ); ?></strong>
							<p><?php esc_html_e( 'To protect your API budget, built-in protection limits visitors to 1 request every 6 seconds and max 30 requests/hour per visitor IP.', 'youtube-tag-generator' ); ?></p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<?php
	}
}
