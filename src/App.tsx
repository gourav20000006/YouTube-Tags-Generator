import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { FrontendPreview } from './components/FrontendPreview';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans relative overflow-x-hidden">
      {/* Subtle Antigravity Ambient Glow Orbs */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none fixed -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl z-0"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="pointer-events-none fixed top-1/2 -right-32 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl z-0"
      />

      {/* Top Banner & Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                y: [0, -4, 0, 4, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-xs shrink-0 cursor-pointer"
              whileHover={{ scale: 1.12, rotate: 8 }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-none">
                  YouTube Video Tag Generator
                </h1>
                <motion.span
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                  WordPress Plugin v1.0.0
                </motion.span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Installable ZIP archive with Anthropic Claude & OpenAI support, secure server-side API, and 1-click copy.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Quick Highlights bar with subtle antigravity hover float */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <motion.div
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 350, damping: 20 } }}
            className="bg-white border border-slate-200 rounded-lg p-3 text-xs flex items-center gap-2.5 shadow-xs transition-shadow hover:shadow-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="font-semibold text-slate-800">Exactly 20 Tags</div>
              <div className="text-slate-500 text-[11px]">Strict prompt + normalizer</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 350, damping: 20 } }}
            className="bg-white border border-slate-200 rounded-lg p-3 text-xs flex items-center gap-2.5 shadow-xs transition-shadow hover:shadow-md"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="font-semibold text-slate-800">100% Server-Side</div>
              <div className="text-slate-500 text-[11px]">Zero API key exposure</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 350, damping: 20 } }}
            className="bg-white border border-slate-200 rounded-lg p-3 text-xs flex items-center gap-2.5 shadow-xs transition-shadow hover:shadow-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="font-semibold text-slate-800">Claude & OpenAI</div>
              <div className="text-slate-500 text-[11px]">Dual provider toggle</div>
            </div>
          </motion.div>
        </div>

        {/* Frontend Generator View */}
        <FrontendPreview />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>YouTube Video Tag Generator WordPress Plugin — Ready for WordPress 5.8 to 6.7+ and PHP 7.4 to 8.3+.</span>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">GPLv2 Licensed</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
