<?php
/**
 * Plugin Name:       YouTube Video Tag Generator
 * Plugin URI:        https://example.com/youtube-tag-generator
 * Description:       Generate exactly 20 highly-relevant, SEO-optimized YouTube video tags using Anthropic Claude or OpenAI API. Fully responsive frontend shortcode and secure server-side API communication.
 * Version:           1.0.0
 * Author:            AI Studio & Expert WP Dev
 * Author URI:        https://example.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       youtube-tag-generator
 * Domain Path:       /languages
 * Requires at least: 5.8
 * Requires PHP:      7.4
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants.
define( 'YTTG_VERSION', '1.0.0' );
define( 'YTTG_PLUGIN_FILE', __FILE__ );
define( 'YTTG_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'YTTG_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'YTTG_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Main YouTube Tag Generator Class
 */
final class YouTube_Tag_Generator {

	/**
	 * Single instance of the class
	 *
	 * @var YouTube_Tag_Generator
	 */
	private static $instance = null;

	/**
	 * Returns the main instance of the plugin.
	 *
	 * @return YouTube_Tag_Generator
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
		$this->includes();
		$this->init_hooks();
	}

	/**
	 * Include required files
	 */
	private function includes() {
		require_once YTTG_PLUGIN_DIR . 'includes/class-tag-processor.php';
		require_once YTTG_PLUGIN_DIR . 'includes/class-api-provider.php';
		require_once YTTG_PLUGIN_DIR . 'includes/class-anthropic-provider.php';
		require_once YTTG_PLUGIN_DIR . 'includes/class-openai-provider.php';
		require_once YTTG_PLUGIN_DIR . 'includes/class-ajax-handler.php';
		require_once YTTG_PLUGIN_DIR . 'includes/class-shortcode.php';

		if ( is_admin() ) {
			require_once YTTG_PLUGIN_DIR . 'includes/class-settings.php';
		}
	}

	/**
	 * Hook into actions and filters
	 */
	private function init_hooks() {
		// Initialize shortcode
		YTTG_Shortcode::get_instance();

		// Initialize AJAX handler
		YTTG_Ajax_Handler::get_instance();

		// Initialize admin settings if in WP Admin
		if ( is_admin() ) {
			YTTG_Settings::get_instance();
			add_filter( 'plugin_action_links_' . YTTG_PLUGIN_BASENAME, array( $this, 'add_action_links' ) );
		}

		// Load text domain
		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
	}

	/**
	 * Add settings link to plugins list page
	 *
	 * @param array $links Array of action links.
	 * @return array
	 */
	public function add_action_links( $links ) {
		$settings_link = sprintf(
			'<a href="%s">%s</a>',
			esc_url( admin_url( 'options-general.php?page=youtube-tag-generator' ) ),
			esc_html__( 'Settings', 'youtube-tag-generator' )
		);
		array_unshift( $links, $settings_link );
		return $links;
	}

	/**
	 * Load plugin localization files
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'youtube-tag-generator',
			false,
			dirname( YTTG_PLUGIN_BASENAME ) . '/languages/'
		);
	}
}

/**
 * Activation hook callback
 */
function yttg_activate_plugin() {
	// Set default options if not already set
	$default_options = array(
		'provider'         => 'anthropic',
		'api_key'          => '',
		'openai_api_key'   => '',
		'anthropic_api_key'=> '',
		'model'            => 'claude-3-5-haiku-20241022',
		'openai_model'     => 'gpt-4o-mini',
		'rate_limit_secs'  => 10,
		'max_per_hour'     => 30,
	);

	$existing = get_option( 'yttg_settings', array() );
	if ( empty( $existing ) || ! is_array( $existing ) ) {
		update_option( 'yttg_settings', $default_options );
	}
}
register_activation_hook( __FILE__, 'yttg_activate_plugin' );

/**
 * Deactivation hook callback
 */
function yttg_deactivate_plugin() {
	// Transient cleanups or flush rules if needed
}
register_deactivation_hook( __FILE__, 'yttg_deactivate_plugin' );

/**
 * Initialize the plugin
 */
function yttg_init() {
	return YouTube_Tag_Generator::get_instance();
}
add_action( 'plugins_loaded', 'yttg_init' );
