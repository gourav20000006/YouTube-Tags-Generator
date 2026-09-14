<?php
/**
 * Uninstall YouTube Tag Generator
 * Fired when the plugin is deleted via WordPress Plugins screen.
 *
 * @package YouTube_Tag_Generator
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Delete options
delete_option( 'yttg_settings' );

// Clean transients
global $wpdb;
$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_yttg_%' OR option_name LIKE '_transient_timeout_yttg_%'" );
