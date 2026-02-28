import { motion } from 'framer-motion'

export default function Landing({ quiz, onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.5 }}
      className="carpet-border medallion max-w-lg w-full rounded-2xl p-8 sm:p-12 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-orange-400 font-body text-sm tracking-[0.3em] uppercase mb-4"
      >
        A moment of truth
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="font-display text-4xl sm:text-5xl font-bold text-cream leading-tight mb-2"
      >
        {quiz.title}
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent my-6"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="text-teal-200 font-body text-base sm:text-lg mb-8 leading-relaxed"
      >
        {quiz.subtitle} <br />
        <span className="text-orange-400 italic">{quiz.tagline}</span>
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="gold-shimmer bg-gradient-to-r from-orange-600 to-orange-500 text-teal-950 font-display font-bold text-lg px-10 py-4 rounded-xl cursor-pointer tracking-wide shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow duration-300"
      >
        {quiz.cta}
      </motion.button>

    </motion.div>
  )
}
