=== YouTube Video Tag Generator ===
Contributors: gouravbose
Tags: youtube, tags, keywords, seo, youtube seo, ai, claude, openai, chatgpt, video tags
Requires at least: 5.8
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Generate exactly 20 high-ranking, SEO-optimized YouTube video tags using Anthropic Claude or OpenAI API. 100% server-side API security.

== Description ==

**YouTube Video Tag Generator** is a fast, modern, and beautifully designed WordPress plugin that allows creators to generate **exactly 20 high-converting YouTube tags and keywords** for any video using state-of-the-art AI (Anthropic Claude or OpenAI).

### Why Use YouTube Video Tag Generator?
* **Generate Exactly 20 Tags**: No more, no less. Hand-crafted internal AI prompts ensure you always receive 20 distinct, targeted keyword phrases.
* **1-Click Copy All Tags**: Copies all 20 tags in standard comma-separated format, ready to paste straight into YouTube Studio with zero reformatting.
* **Dual AI Provider Support**: Choose between Anthropic Claude (Claude 3.5 Haiku / Sonnet) and OpenAI (GPT-4o mini / GPT-4o) directly from your WordPress settings.
* **Enterprise Security**: Your API key is stored securely in WordPress options and processed strictly on your server. It is NEVER exposed to website visitors, JavaScript, browser source code, or URLs.
* **Instant Shortcode Deployment**: Place `[youtube_tag_generator]` on any WordPress page, post, or widget area.
* **Mobile & Tablet Optimized**: Designed with high-contrast, responsive SaaS aesthetics that look great on any screen size.
* **Built-in Rate Limiting**: Protects your API credit balance from spam and rapid clicking with intelligent IP-based cooldowns.
* **No Bulky Frameworks**: Zero dependencies on Elementor, Divi, jQuery, or bloated CSS frameworks.

== Installation ==

### Method 1: Upload via WordPress Admin (Recommended)
1. In your WordPress Dashboard, go to **Plugins > Add New**.
2. Click the **Upload Plugin** button at the top.
3. Choose the `youtube-tag-generator.zip` file and click **Install Now**.
4. Click **Activate Plugin**.

### Method 2: Manual FTP Upload
1. Unzip `youtube-tag-generator.zip`.
2. Upload the `youtube-tag-generator` folder to your server's `/wp-content/plugins/` directory.
3. Go to **Plugins > Installed Plugins** in your WordPress Dashboard and click **Activate**.

== Configuration ==

1. In your WordPress Dashboard, navigate to **Settings > YouTube Tag Generator**.
2. Select your preferred **AI Provider** (Anthropic Claude or OpenAI).
3. Paste your secret **API Key**:
   * For Anthropic Claude: Get your key from [console.anthropic.com](https://console.anthropic.com/)
   * For OpenAI: Get your key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
4. Select your preferred model (e.g. `claude-3-5-haiku-20241022` or `gpt-4o-mini`).
5. Click **Save Settings**.

== How to Display on Your Website ==

1. Go to **Pages > Add New**.
2. Title your page (e.g., "YouTube Tag Generator" or "SEO Tag Tool").
3. Add a **Shortcode Block** and type:
   `[youtube_tag_generator]`
4. Click **Publish**. Your interactive tool is now live for your visitors!

== Frequently Asked Questions ==

= Is my API key safe? =
Yes, 100%. The API key is stored only in the WordPress database on your server. All requests to Anthropic or OpenAI are made server-side via WordPress HTTP API (`wp_remote_post`). Frontend visitors only receive the final generated tags.

= How do I paste the generated tags into YouTube? =
Click the black "Copy All Tags" button in the generator. Open YouTube Studio, edit your video details, scroll down to "Show More", find the "Tags" box, right-click, and select "Paste" (or press Ctrl+V / Cmd+V). Because they are comma-separated, YouTube automatically splits them into 20 separate tags.

= What happens if I click "Generate 20 Tags" again? =
The plugin performs a regeneration: the previous 20 tags are completely cleared and replaced with a fresh, alternative set of 20 high-ranking tags for the same video topic.

= Does this plugin work with page builders? =
Yes! It works in Gutenberg, Classic Editor, Elementor, Divi, Beaver Builder, Bricks, or any page builder that supports shortcodes.

= What PHP version is required? =
PHP 7.4 or higher (fully tested on PHP 8.0, 8.1, 8.2, and 8.3).

== Troubleshooting ==

= Error: "API key has not been configured" =
Go to WordPress Dashboard > Settings > YouTube Tag Generator and verify that you have entered and saved your Anthropic or OpenAI API key.

= Error: "Invalid API key" =
Make sure you copied your full key without accidental spaces at the beginning or end. Verify that your API account has an active credit balance or payment method.

= Error: "Please wait a few seconds before requesting another set of tags" =
The plugin includes a 6-second cooldown to prevent accidental rapid clicks from consuming your API balance. Wait a moment and try again.

== Changelog ==

= 1.0.0 =
* Initial public release.
* Support for Anthropic Claude (Claude 3.5 Haiku, Sonnet) and OpenAI (GPT-4o mini, GPT-4o).
* Exact 20 tag generation with smart normalization and fallback handling.
* Comma-separated 1-click clipboard copy.
* Full mobile responsiveness and accessible ARIA markup.
