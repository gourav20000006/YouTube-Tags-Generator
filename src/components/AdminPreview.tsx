import React, { useState } from 'react';
import { ShieldCheck, Check, Copy, Key, Sparkles, ExternalLink } from 'lucide-react';

export const AdminPreview: React.FC = () => {
  const [provider, setProvider] = useState<'anthropic' | 'openai'>('anthropic');
  const [anthropicKey, setAnthropicKey] = useState('sk-ant-api03-sample993847291048ABCD');
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicModel, setAnthropicModel] = useState('claude-3-5-haiku-20241022');
  const [openaiModel, setOpenaiModel] = useState('gpt-4o-mini');
  const [savedNotice, setSavedNotice] = useState(false);
  const [copiedShortcode, setCopiedShortcode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleCopyShortcode = () => {
    navigator.clipboard.writeText('[youtube_tag_generator]');
    setCopiedShortcode(true);
    setTimeout(() => setCopiedShortcode(false), 2000);
  };

  const mask = (val: string) => {
    if (!val) return '';
    const last4 = val.slice(-4);
    return '••••••••••••••••••••' + last4;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* WordPress Admin Bar Mock */}
      <div className="bg-[#1d2327] text-white px-4 py-2 rounded-t-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-200">WordPress Dashboard</span>
          <span className="text-slate-500">›</span>
          <span className="text-slate-300">Settings</span>
          <span className="text-slate-500">›</span>
          <span className="font-semibold text-blue-400">YouTube Tag Generator</span>
        </div>
        <span className="text-slate-400 text-[11px]">wp-admin/options-general.php</span>
      </div>

      <div className="bg-[#f0f0f1] border-x border-b border-slate-300 rounded-b-xl p-5 sm:p-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-300 gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-800">YouTube Video Tag Generator</h2>
            <p className="text-xs text-slate-500">Version 1.0.0 — Production Ready WordPress Plugin</p>
          </div>
          <span className="inline-block bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold px-2.5 py-1 rounded">
            AI-Powered SEO Tool
          </span>
        </div>

        {/* Save Notice */}
        {savedNotice && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 mb-4 rounded-r text-sm text-emerald-900 shadow-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Settings saved successfully!</strong> Your AI provider configuration is active.</span>
          </div>
        )}

        {/* Security Guarantee Banner */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3.5 mb-5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900">
            <strong className="block font-semibold mb-0.5">Enterprise Security Guarantee</strong>
            <span>Your API key is stored securely in your WordPress database and processed strictly server-side. It is NEVER exposed to website visitors, frontend JavaScript, or browser page source.</span>
          </div>
        </div>

        {/* Grid: Settings Form & Quick Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="bg-white border border-slate-300 rounded-lg p-5 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">AI Provider & Credentials</h3>
                <p className="text-xs text-slate-500">
                  Choose which AI service generates your 20 YouTube tags and enter your secret API key.
                </p>
              </div>

              {/* Provider Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  AI Provider
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setProvider('anthropic')}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border-2 cursor-pointer transition ${
                      provider === 'anthropic'
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="provider"
                      checked={provider === 'anthropic'}
                      onChange={() => setProvider('anthropic')}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="font-semibold text-sm text-slate-900">Anthropic Claude</div>
                      <div className="text-xs text-slate-500 mt-0.5">Claude 3.5 Haiku / Sonnet. Fast, cost-efficient, high accuracy.</div>
                    </div>
                  </label>

                  <label
                    onClick={() => setProvider('openai')}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border-2 cursor-pointer transition ${
                      provider === 'openai'
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="provider"
                      checked={provider === 'openai'}
                      onChange={() => setProvider('openai')}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="font-semibold text-sm text-slate-900">OpenAI</div>
                      <div className="text-xs text-slate-500 mt-0.5">GPT-4o mini or GPT-4o. Industry standard tags generation.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Provider Details */}
              {provider === 'anthropic' ? (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-800">Anthropic API Key</label>
                      <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        ✓ Configured
                      </span>
                    </div>
                    <input
                      type="text"
                      value={mask(anthropicKey)}
                      onChange={(e) => setAnthropicKey(e.target.value)}
                      placeholder="sk-ant-api03-..."
                      className="w-full font-mono text-xs p-2.5 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Masked for security (••••••••ABCD). Stored in WordPress server options.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Claude Model</label>
                    <select
                      value={anthropicModel}
                      onChange={(e) => setAnthropicModel(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
                    >
                      <option value="claude-3-5-haiku-20241022">
                        claude-3-5-haiku-20241022 (Fastest, High Accuracy, Lowest Cost - Recommended)
                      </option>
                      <option value="claude-3-5-sonnet-20241022">
                        claude-3-5-sonnet-20241022 (Deep Niche Keyword Nuance)
                      </option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-800">OpenAI API Key</label>
                      <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        Key Required
                      </span>
                    </div>
                    <input
                      type="password"
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      placeholder="sk-proj-..."
                      className="w-full font-mono text-xs p-2.5 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Obtained from platform.openai.com/api-keys.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">OpenAI Model</label>
                    <select
                      value={openaiModel}
                      onChange={(e) => setOpenaiModel(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
                    >
                      <option value="gpt-4o-mini">
                        gpt-4o-mini (Super fast, economical, optimized for SEO lists - Recommended)
                      </option>
                      <option value="gpt-4o">gpt-4o (Flagship Omni Model)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200">
                <button
                  type="submit"
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white font-medium text-xs sm:text-sm px-5 py-2 rounded shadow-xs transition"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>

          {/* Quick Guide Sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3">
                How to Display on Your Site
              </h4>
              <ol className="text-xs text-slate-600 space-y-3 pl-4 list-decimal">
                <li>
                  <strong>Save your API Key</strong>
                  <p className="text-slate-500 text-[11px] mt-0.5">Enter key on the left and click Save Settings.</p>
                </li>
                <li>
                  <strong>Create a WordPress Page</strong>
                  <p className="text-slate-500 text-[11px] mt-0.5">Go to Pages → Add New (e.g. "YouTube Tag Tool").</p>
                </li>
                <li>
                  <strong>Paste Shortcode</strong>
                  <div className="bg-slate-100 border border-slate-300 rounded p-1.5 flex items-center justify-between font-mono text-[11px] mt-1">
                    <code className="text-blue-700 font-bold">[youtube_tag_generator]</code>
                    <button
                      type="button"
                      onClick={handleCopyShortcode}
                      className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-[10px] px-2 py-0.5 rounded font-sans"
                    >
                      {copiedShortcode ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </li>
                <li>
                  <strong>Publish Page</strong>
                  <p className="text-slate-500 text-[11px] mt-0.5">Your interactive generator will appear immediately!</p>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50/60 border-l-4 border-blue-500 p-3 text-xs text-slate-700 rounded-r">
              <strong className="block text-slate-900 mb-0.5">Built-in Rate Limiting</strong>
              <span>Includes a 6-second cooldown and 30 request/hour limit per visitor IP to protect your API budget from automated abuse.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
