# YouTube Video Tag Generator (WordPress Plugin)

Generate **exactly 20 high-ranking, SEO-optimized YouTube video tags** using **Anthropic Claude** or **OpenAI** directly on your WordPress site.

## Key Features

- **Exact 20 Tags Guarantee**: No random numbers; hand-crafted AI prompts ensure exactly 20 unique tags every time.
- **1-Click Copy All**: Copies all 20 tags in standard comma-separated format for direct pasting into YouTube Studio.
- **Dual AI Provider**: Toggle between **Anthropic Claude** (Claude 3.5 Haiku / Sonnet) and **OpenAI** (GPT-4o mini / GPT-4o) in WP Admin.
- **100% Server-Side Security**: API keys are securely stored on your WordPress server. Never exposed to browsers, HTML, or JavaScript.
- **Modern Responsive UI**: Clean SaaS-style interface with zero dependencies on external builder plugins or jQuery.
- **Abuse Prevention**: Built-in 6-second rapid-click cooldown and IP-based rate limiting to protect your API budget.
- **Instant Shortcode**: Drop `[youtube_tag_generator]` into any page or post.

---

## Quick Installation (Non-Programmers)

1. Download **`youtube-tag-generator.zip`**.
2. Go to your **WordPress Dashboard** → **Plugins** → **Add New**.
3. Click **Upload Plugin** at the top.
4. Select `youtube-tag-generator.zip` and click **Install Now**.
5. Click **Activate Plugin**.

---

## Configuration

1. In WordPress Admin, go to **Settings** → **YouTube Tag Generator**.
2. Choose your **AI Provider** (Anthropic Claude or OpenAI).
3. Paste your secret **API Key**:
   - Anthropic: [console.anthropic.com](https://console.anthropic.com/)
   - OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
4. Select your preferred AI model (e.g. `claude-3-5-haiku-20241022` or `gpt-4o-mini`).
5. Click **Save Settings**.

---

## Displaying the Generator

1. Go to **Pages** → **Add New**.
2. Name your page (e.g., *YouTube Tag Generator*).
3. Insert a Shortcode block with:
   ```text
   [youtube_tag_generator]
   ```
4. Click **Publish**.

---

## File Structure

```text
youtube-tag-generator/
├── youtube-tag-generator.php   # Main plugin entry file
├── readme.txt                  # WordPress plugin repository metadata
├── README.md                   # Markdown guide
├── uninstall.php               # Clean database cleanup on delete
│
├── includes/
│   ├── class-settings.php      # Admin dashboard settings page
│   ├── class-api-provider.php  # Base AI provider abstraction
│   ├── class-anthropic-provider.php # Anthropic Messages API client
│   ├── class-openai-provider.php    # OpenAI Chat Completions client
│   ├── class-tag-processor.php # Tag cleaner, normalizer & fallback
│   ├── class-ajax-handler.php  # Secure AJAX, nonce & rate limiter
│   └── class-shortcode.php     # [youtube_tag_generator] shortcode
│
├── admin/
│   ├── css/admin.css           # Admin styling
│   └── js/admin.js             # Admin dynamic UI logic
│
└── assets/
    ├── css/frontend.css        # Clean SaaS frontend interface
    └── js/frontend.js          # Interactive AJAX & copy logic
```

## License

GPLv2 or later. Free to use, modify, and distribute.
