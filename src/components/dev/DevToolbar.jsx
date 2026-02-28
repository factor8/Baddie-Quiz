import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DevToolbar({ screen, onNavigate, onSetScore, quizList, currentQuizId, onQuizChange }) {
  const [open, setOpen] = useState(false)

  const navButtons = [
    { label: 'Home', icon: '\u2302', action: () => onNavigate('landing'), active: screen === 'landing' },
    { label: 'Quiz', icon: '\u270E', action: () => onNavigate('quiz'), active: screen === 'quiz' },
    { label: 'Editor', icon: '\u2699', action: () => onNavigate('admin'), active: screen === 'admin', accent: true },
  ]

  const resultButtons = [
    { label: 'Result+', icon: '\u2191', score: 25, color: 'green' },
    { label: 'Result\u2212', icon: '\u2193', score: -5, color: 'red' },
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ transformOrigin: 'bottom right' }}
            className="bg-teal-950/90 backdrop-blur-md border border-teal-700/40 rounded-xl shadow-2xl shadow-black/40 w-56 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-teal-800/60">
              <span className="text-orange-400 font-display text-xs font-bold tracking-wider uppercase">Dev Tools</span>
              <button
                onClick={() => setOpen(false)}
                className="text-teal-500 hover:text-teal-300 text-sm cursor-pointer leading-none"
              >
                \u2715
              </button>
            </div>

            {/* Navigation */}
            <div className="p-2 space-y-1">
              {navButtons.map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => { btn.action(); setOpen(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-body cursor-pointer transition-colors duration-150
                    ${btn.active
                      ? 'bg-teal-800/80 text-orange-300'
                      : btn.accent
                        ? 'text-purple-300 hover:bg-teal-800/50'
                        : 'text-teal-200 hover:bg-teal-800/50'
                    }`}
                >
                  <span className="text-sm opacity-70">{btn.icon}</span>
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="border-t border-teal-800/60 p-2">
              <div className="flex gap-1.5">
                {resultButtons.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => { onSetScore(btn.score); onNavigate('results'); setOpen(false) }}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-body cursor-pointer transition-colors duration-150
                      ${btn.color === 'green'
                        ? 'text-green-300 hover:bg-green-900/30'
                        : 'text-red-300 hover:bg-red-900/30'
                      }`}
                  >
                    <span className="text-sm">{btn.icon}</span>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz selector */}
            <div className="border-t border-teal-800/60 p-2">
              <label className="text-teal-500 text-[10px] uppercase tracking-wider font-body px-1 mb-1 block">Quiz</label>
              <select
                value={currentQuizId}
                onChange={(e) => { onQuizChange(e.target.value); setOpen(false) }}
                className="w-full bg-teal-900/60 text-orange-300 text-xs px-2.5 py-2 rounded-lg border border-teal-700/40 cursor-pointer focus:outline-none focus:border-orange-500/50 appearance-none"
              >
                {quizList.map((q) => (
                  <option key={q.id} value={q.id}>{q.title || q.id}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DEV pill toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={`font-display font-bold text-[11px] px-3 py-1.5 rounded-full cursor-pointer tracking-wider shadow-lg transition-colors duration-200
          ${open
            ? 'bg-teal-700/90 text-teal-200 shadow-teal-900/40'
            : 'bg-orange-600/90 text-teal-950 shadow-orange-500/30 hover:shadow-orange-500/50'
          }`}
      >
        DEV
      </motion.button>
    </div>
  )
}
