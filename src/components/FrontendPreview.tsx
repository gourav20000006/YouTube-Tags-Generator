import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, Check, RefreshCw, AlertCircle, Info, ChevronDown, X, SlidersHorizontal, Orbit } from 'lucide-react';

interface FrontendPreviewProps {
  providerName?: string;
}

export const FrontendPreview: React.FC<FrontendPreviewProps> = ({ providerName = 'Anthropic Claude' }) => {
  const [title, setTitle] = useState('10 AI Tools That Will Blow Your Mind in 2026');
  const [description, setDescription] = useState('In this video we review the top artificial intelligence productivity tools for content creators, automation, and workflow enhancement.');
  const [keyword, setKeyword] = useState('best AI tools');
  const [niche, setNiche] = useState('Tech & Productivity');

  // Animation toggle states
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [showRawOutput, setShowRawOutput] = useState(false);
  const [antigravity, setAntigravity] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // High quality realistic tags simulation mirroring the exact PHP tag processor
  const sampleSets = [
    [
      "best ai tools 2026",
      "top ai software",
      "ai productivity tools",
      "artificial intelligence tutorial",
      "best ai apps for creators",
      "ai tools for workflow",
      "chatgpt alternatives",
      "ai content creation",
      "automation tools 2026",
      "free ai tools",
      "generative ai guide",
      "future of ai technology",
      "best productivity software",
      "ai video and audio tools",
      "how to use ai for work",
      "tech productivity hacks",
      "new ai websites",
      "ai tools review",
      "must have ai tools",
      "ai tools for beginners"
    ],
    [
      "ai software walkthrough",
      "top 10 ai tools",
      "ai productivity hacks",
      "artificial intelligence 2026",
      "best free ai apps",
      "ai workflow optimization",
      "automated content creation",
      "claude ai tutorial",
      "chatgpt vs claude",
      "creative ai tools",
      "boost productivity with ai",
      "ai tools for small business",
      "top ai websites you need",
      "ai automation workflow",
      "secret ai websites",
      "ai tools for students",
      "tech review 2026",
      "generative ai tools",
      "ai browser extensions",
      "ultimate ai guide"
    ]
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !description.trim()) {
      setError('Please enter a video title or description before generating tags.');
      return;
    }

    setError(null);
    setIsLoading(true);

    // Simulate server roundtrip to WordPress AJAX -> AI Provider -> Tag Processor
    setTimeout(() => {
      const setIdx = hasGenerated ? 1 : 0;
      setTags(sampleSets[setIdx]);
      setHasGenerated(true);
      setIsLoading(false);
    }, 750);
  };

  const handleCopyAll = () => {
    if (tags.length === 0) return;
    const commaString = tags.join(', ');
    navigator.clipboard.writeText(commaString);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleCopySingle = (tag: string, index: number) => {
    navigator.clipboard.writeText(tag);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  const handleCloseResults = () => {
    setHasGenerated(false);
    setTags([]);
  };

  // Animation container variants for staggered tag chips
  const chipsContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.035,
        delayChildren: 0.1,
      },
    },
  };

  const chipItemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.85 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 380,
        damping: 22,
      },
    },
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Simulation Browser Bar */}
      <div className="bg-slate-100 border border-slate-200 rounded-t-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600 font-sans font-medium">Your Website Page (Shortcode Output)</span>
        </div>
        <div className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[11px] text-slate-600">
          [youtube_tag_generator]
        </div>
      </div>

      {/* Actual Rendered Plugin Card (Identical to WordPress frontend) */}
      <motion.div
        layout
        className="bg-white border-x border-b border-slate-200 rounded-b-xl shadow-sm p-6 sm:p-8"
      >
        {/* Header Section */}
        <div className="text-center mb-7">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200/60 uppercase tracking-wider mb-2.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            YouTube SEO Engine
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            YouTube Video Tag Generator
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Enter your video details below to generate exactly 20 high-ranking, SEO-optimized YouTube tags.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Video Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 10 AI Tools That Will Blow Your Mind in 2026"
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              required
            />
            <p className="text-xs text-slate-400 mt-1">Your proposed or published YouTube video headline.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Video Description / Topic Overview
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what your video covers, key takeaways, software featured, or problems solved..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            />
            <p className="text-xs text-slate-400 mt-1">Provides context for specific long-tail keyword generation.</p>
          </div>

          {/* Animated Accordion for Optional Fields */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition select-none"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>Optional Targeted Keyword & Niche Filters</span>
              </div>
              <motion.div
                animate={{ rotate: showAdvanced ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {showAdvanced && (
                <motion.div
                  key="advanced-filters"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-3.5 pt-1 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">Main Focus Keyword</label>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded">Optional</span>
                      </div>
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="e.g., best AI tools"
                        className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">Niche / Category</label>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded">Optional</span>
                      </div>
                      <input
                        type="text"
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        placeholder="e.g., Tech, Productivity, Gaming"
                        className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Animated Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-2 flex gap-3">
            <motion.button
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg text-sm sm:text-base shadow-sm hover:shadow transition"
            >
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Generating your 20 tags...</span>
                </motion.div>
              ) : hasGenerated ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Regenerate 20 Tags</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 20 Tags</span>
                </motion.div>
              )}
            </motion.button>
          </div>
        </form>

        {/* Animated Results Section (Opening / Closing) */}
        <AnimatePresence>
          {hasGenerated && tags.length === 20 && (
            <motion.div
              key="results-section"
              initial={{ opacity: 0, y: 24, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -16, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mt-8 pt-7 border-t border-slate-200 overflow-hidden"
            >
              {/* Header of results */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold text-slate-900">Generated Tags</h3>
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full"
                  >
                    20 / 20 Tags
                  </motion.span>
                  <button
                    type="button"
                    onClick={() => setAntigravity(!antigravity)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition border ${
                      antigravity
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs'
                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-700'
                    }`}
                    title="Toggle zero-gravity floating tags"
                  >
                    <Orbit className={`w-3.5 h-3.5 ${antigravity ? 'animate-spin text-indigo-600' : ''}`} style={{ animationDuration: '6s' }} />
                    <span>Antigravity: {antigravity ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Copy All Button with micro-animation */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleCopyAll}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition ${
                      copiedAll
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {copiedAll ? (
                        <motion.span
                          key="copied"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>✓ 20 Tags Copied!</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-1.5"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy All Tags</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Close / Dismiss button */}
                  <button
                    type="button"
                    onClick={handleCloseResults}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    title="Close results"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mb-4">
                <p className="text-xs text-slate-500">
                  Click any individual tag to copy, or use <strong>Copy All Tags</strong> for YouTube Studio format.
                </p>
                {antigravity && (
                  <span className="text-[11px] text-indigo-600/80 font-medium hidden sm:inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    Zero-G Floating Active
                  </span>
                )}
              </div>

              {/* Staggered 20 Chips Grid with Antigravity Floating Motion */}
              <motion.div
                variants={chipsContainerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-wrap gap-2.5 mb-5 py-2 relative"
              >
                {tags.map((tag, idx) => {
                  const isJustCopied = copiedIndex === idx;
                  return (
                    <motion.button
                      key={`${tag}-${idx}`}
                      variants={chipItemVariants}
                      animate={
                        antigravity
                          ? {
                              y: [0, -(4 + (idx % 3) * 2), 0, (3 + (idx % 2) * 2), 0],
                              rotate: [0, (idx % 2 === 0 ? 0.75 : -0.75), 0, (idx % 2 === 0 ? -0.75 : 0.75), 0],
                            }
                          : { y: 0, rotate: 0 }
                      }
                      transition={
                        antigravity
                          ? {
                              duration: 3.2 + (idx % 5) * 0.45,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: (idx % 7) * 0.15,
                            }
                          : { duration: 0.2 }
                      }
                      whileHover={{
                        y: -8,
                        scale: 1.08,
                        rotate: idx % 2 === 0 ? 1 : -1,
                        boxShadow: '0 10px 22px -3px rgba(59, 130, 246, 0.2)',
                        transition: { type: 'spring', stiffness: 450, damping: 16 },
                      }}
                      whileTap={{ scale: 0.94 }}
                      type="button"
                      onClick={() => handleCopySingle(tag, idx)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium border transition-colors cursor-pointer select-none ${
                        isJustCopied
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : 'bg-white hover:bg-blue-50/70 border-slate-200 text-slate-700 hover:border-blue-300 shadow-xs'
                      }`}
                      title="Click to copy this tag"
                    >
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <span>{tag}</span>
                      {isJustCopied && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                          <Check className="w-3 h-3 text-emerald-600 ml-0.5" />
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Collapsible Raw Comma Output Box */}
              <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
                <button
                  type="button"
                  onClick={() => setShowRawOutput(!showRawOutput)}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider transition select-none"
                >
                  <span>Comma-Separated Output (Ready for YouTube Studio)</span>
                  <motion.div
                    animate={{ rotate: showRawOutput ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {showRawOutput && (
                    <motion.div
                      key="raw-output"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 bg-white border-t border-slate-200">
                        <textarea
                          readOnly
                          rows={3}
                          value={tags.join(', ')}
                          className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-md text-slate-600 focus:outline-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-3 border-t border-dashed border-slate-200">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Paste directly into YouTube Studio → Video Details → Show More → Tags.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
