import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getVerdict } from '../data/questions'

const verdictColors = {
  teal: {
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/50',
    text: 'text-teal-300',
    glow: 'shadow-teal-500/20',
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/50',
    text: 'text-orange-300',
    glow: 'shadow-orange-500/20',
  },
  red: {
    bg: 'bg-burgundy-500/10',
    border: 'border-burgundy-500/50',
    text: 'text-burgundy-300',
    glow: 'shadow-burgundy-500/20',
  },
}

export default function Results({ quiz, score, onRestart }) {
  const verdict = getVerdict(score, quiz.verdicts)
  const colors = verdictColors[verdict.color]
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId: quiz.id, verdict: verdict.key }),
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {})
  }, [quiz.id, verdict.key])

  const totalResponses = stats
    ? stats.green + stats.yellow + stats.orange + stats.red
    : 0
  const yourPercent = stats && totalResponses > 0
    ? Math.round((stats[verdict.key] / totalResponses) * 100)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="carpet-border medallion max-w-lg w-full rounded-2xl p-8 sm:p-12 text-center"
    >
      {/* Dramatic emoji reveal */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
        className="text-6xl sm:text-7xl mb-6"
      >
        {verdict.emoji}
      </motion.div>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-teal-300 text-sm font-body tracking-wider uppercase mb-1">
          Your Score
        </p>
        <p className={`font-display text-5xl font-bold ${colors.text} mb-6`}>
          {score}
        </p>
      </motion.div>

      {/* Verdict */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className={`${colors.bg} ${colors.border} border rounded-xl p-6 mb-6 shadow-lg ${colors.glow}`}
      >
        <h2 className={`font-display text-2xl sm:text-3xl font-bold ${colors.text} mb-3`}>
          {verdict.title}
        </h2>
        <p className="text-cream/80 font-body text-base leading-relaxed">
          {verdict.description}
        </p>
      </motion.div>

      {/* Community stats */}
      {yourPercent !== null && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-teal-400 text-sm font-body mb-8"
        >
          {yourPercent}% of people who took this quiz got the same result.{' '}
          {verdict.key === 'red' ? "Y'all are cooked." : verdict.key === 'green' ? 'Rare breed.' : 'Interesting.'}
        </motion.p>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="space-y-3"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            const text = `I got "${verdict.title}" on the "${quiz.shareTitle}" quiz ${verdict.emoji}`
            if (navigator.share) {
              navigator.share({ title: quiz.shareTitle, text })
            } else {
              navigator.clipboard.writeText(text)
            }
          }}
          className="w-full gold-shimmer bg-gradient-to-r from-orange-600 to-orange-500 text-teal-950 font-display font-bold text-base py-3.5 rounded-xl cursor-pointer tracking-wide shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow duration-300"
        >
          {quiz.shareButtonText || 'Share Your L (or W)'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRestart}
          className="w-full bg-teal-900/50 border border-teal-700/50 text-teal-200 font-body text-sm py-3 rounded-xl cursor-pointer hover:bg-teal-800/60 hover:border-orange-600/30 transition-all duration-200"
        >
          Take It Again (lying won't help)
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
