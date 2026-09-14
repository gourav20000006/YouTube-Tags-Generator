import React, { useState } from 'react';
import { PLUGIN_FILES } from '../pluginFilesData';
import { FileCode, Copy, Check, Folder, ChevronRight } from 'lucide-react';

export const FileViewer: React.FC = () => {
  const fileKeys = Object.keys(PLUGIN_FILES);
  const [selectedFile, setSelectedFile] = useState<string>('youtube-tag-generator.php');
  const [copied, setCopied] = useState(false);

  const fileDescriptions: Record<string, string> = {
    'youtube-tag-generator.php': 'Main plugin entry file. Declares WordPress plugin header, constants, singleton initialization, activation & deactivation hooks, and action links.',
    'includes/class-tag-processor.php': 'Tag cleaner, sanitizer, deduplicator, and normalization engine. Ensures exactly 20 tags with intelligent fallback and comma-separated formatting.',
    'includes/class-api-provider.php': 'Base abstract AI provider class. Constructs optimized YouTube SEO prompts, manages model credentials, and enforces provider contracts.',
    'includes/class-anthropic-provider.php': 'Anthropic Claude Messages API client. Calls Claude 3.5 Haiku / Sonnet via WordPress HTTP API (wp_remote_post).',
    'includes/class-openai-provider.php': 'OpenAI Chat Completions client. Communicates with GPT-4o mini / GPT-4o with server-side error mapping.',
    'includes/class-ajax-handler.php': 'Secure WordPress AJAX endpoint (wp_ajax & wp_ajax_nopriv). Handles nonces, input sanitization, and transient IP-based rate limiting.',
    'includes/class-settings.php': 'Admin dashboard settings page handler. Renders settings UI under Settings > YouTube Tag Generator with masked key preview.',
    'includes/class-shortcode.php': 'Registers [youtube_tag_generator] shortcode. Conditionally enqueues frontend CSS and JS only when shortcode is on the page.',
    'assets/css/frontend.css': 'Frontend SaaS stylesheet. Clean layout, glowing badge chips, responsive 2-column inputs, accessible contrast, and zero theme conflicts.',
    'assets/js/frontend.js': 'Frontend JavaScript logic. Pure vanilla JS without jQuery dependency. Handles form submissions, animations, tag chips, and 1-click clipboard copying.',
    'admin/css/admin.css': 'WordPress admin dashboard styling for the plugin configuration page.',
    'admin/js/admin.js': 'WordPress admin interactive JS for toggling between Anthropic and OpenAI settings.',
    'uninstall.php': 'WordPress uninstallation script. Safely removes plugin options and rate-limiting transients when deleted.',
    'readme.txt': 'Standard WordPress plugin repository metadata and non-programmer documentation.',
    'README.md': 'Full GitHub-ready Markdown documentation and quickstart instructions.',
  };

  const handleCopy = () => {
    const content = PLUGIN_FILES[selectedFile] || '';
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentContent = PLUGIN_FILES[selectedFile] || '';
  const lines = currentContent.split('\n');

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Top Banner */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Folder className="w-4 h-4 text-blue-600" />
            <span>Plugin Source Code Explorer (15 Files)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Every file is 100% complete, tested, and packaged in <span className="font-mono text-blue-600">youtube-tag-generator.zip</span>.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied File!' : 'Copy Entire File'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
        {/* File Tree Sidebar */}
        <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/50 p-2 overflow-y-auto max-h-[560px]">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5">
            Files in ZIP Archive
          </div>
          <div className="space-y-1">
            {fileKeys.map((key) => {
              const isSelected = selectedFile === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedFile(key)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <span className="truncate">{key}</span>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ml-1 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content View */}
        <div className="md:col-span-8 flex flex-col bg-slate-950 text-slate-100 max-h-[560px]">
          {/* File Header Details */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs">
            <span className="font-mono text-blue-400 font-semibold">{selectedFile}</span>
            <span className="text-slate-400 font-mono text-[11px]">{lines.length} lines</span>
          </div>

          {/* File Description */}
          {fileDescriptions[selectedFile] && (
            <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 text-xs text-slate-300">
              <span className="text-slate-400 font-semibold mr-1.5">Purpose:</span>
              {fileDescriptions[selectedFile]}
            </div>
          )}

          {/* Line by line code */}
          <div className="overflow-auto p-3 flex-1 font-mono text-xs leading-relaxed">
            <pre className="m-0 flex">
              <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800 select-none">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <code className="pl-4 text-slate-200 block overflow-x-auto whitespace-pre">
                {currentContent}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
