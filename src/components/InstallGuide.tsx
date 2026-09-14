import React, { useState } from 'react';
import { Download, CheckCircle2, Key, Layout, HelpCircle, Shield, Copy, Check } from 'lucide-react';

export const InstallGuide: React.FC = () => {
  const [copiedShortcode, setCopiedShortcode] = useState(false);

  const copyShortcode = () => {
    navigator.clipboard.writeText('[youtube_tag_generator]');
    setCopiedShortcode(true);
    setTimeout(() => setCopiedShortcode(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 sm:p-8 text-white shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Zero-Coding WordPress Installation Guide</h2>
        <p className="text-blue-100 text-sm max-w-2xl">
          You do not need any coding knowledge or PHP editing skills. Simply download the ZIP file, upload it to your WordPress site, add your API key, and paste the shortcode.
        </p>
      </div>

      {/* 5 Step Visual Flow */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">5 Simple Steps from Download to Live Tool</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Download the Plugin ZIP</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Click the <span className="font-semibold text-blue-600">Download youtube-tag-generator.zip</span> button on this page. Save the ZIP file to your computer. (Do not unzip it).
              </p>
              <a
                href="/youtube-tag-generator.zip"
                download="youtube-tag-generator.zip"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ZIP (31 KB)</span>
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Upload via WordPress Dashboard</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log in to your WordPress admin area. Go to:
                <br />
                <span className="font-semibold text-slate-800">Plugins → Add New → Upload Plugin</span>
                <br />
                Click <span className="font-medium text-slate-700">Choose File</span>, select the downloaded <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">youtube-tag-generator.zip</code>, and click <span className="font-semibold text-slate-800">Install Now</span>.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Activate the Plugin</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Once installation finishes, click the blue <span className="font-semibold text-slate-800">Activate Plugin</span> button. The plugin automatically creates its safe default settings.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Add Your AI API Key</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                In your WordPress sidebar, go to:
                <br />
                <span className="font-semibold text-slate-800">Settings → YouTube Tag Generator</span>
                <br />
                Choose your AI provider (Anthropic Claude or OpenAI), paste your secret API key, and click <span className="font-semibold text-slate-800">Save Settings</span>.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs md:col-span-2 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
              5
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 text-base mb-1">Display on Any Page with Shortcode</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                Create or edit a normal WordPress page (e.g. titled "YouTube SEO Tag Generator"). Add a Shortcode block or paste this shortcode:
              </p>
              <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 font-mono text-xs">
                <span className="font-bold text-blue-700">[youtube_tag_generator]</span>
                <button
                  type="button"
                  onClick={copyShortcode}
                  className="bg-white hover:bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-sans text-slate-700 flex items-center gap-1"
                >
                  {copiedShortcode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedShortcode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Publish your page, and your visitors can instantly generate 20 tags and copy them with 1 click!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security FAQ */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>Security & Best Practices</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="block text-slate-900 mb-1">Is my API Key safe from visitors?</strong>
            Yes. The API key is stored only on your server in WordPress options. All API calls to Anthropic or OpenAI are made server-to-server. The visitor's browser never sees the key.
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="block text-slate-900 mb-1">Does this protect my API budget?</strong>
            Yes. The plugin includes automatic IP-based rate limiting (1 request every 6 seconds, and max 30 generations per hour per IP) so bots cannot drain your credits.
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="block text-slate-900 mb-1">How do I paste tags into YouTube?</strong>
            When you click "Copy All Tags", they are copied as comma-separated text. Simply open YouTube Studio → Video Details → Show More → Tags, and press Paste (Ctrl+V or Cmd+V).
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="block text-slate-900 mb-1">What if I click Generate again?</strong>
            The plugin replaces the previous 20 tags with a completely fresh, alternative set of 20 high-ranking keywords for the same topic.
          </div>
        </div>
      </div>
    </div>
  );
};
