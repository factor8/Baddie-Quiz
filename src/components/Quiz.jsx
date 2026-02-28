import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sliderToScore } from '../data/questions'
import Question from './Question'

export default function Quiz({ quiz, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward

  const questions = quiz.questions
  const question = questions[currentIndex]
  const progress = ((currentIndex) / questions.length) * 100

  const handleAnswer = (points) => {
    const newScore = score + points
    setDirection(1)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setScore(newScore)
    } else {
      onComplete(newScore)
    }
  }

  const handleSlider = (value) => {
    handleAnswer(sliderToScore(value))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="carpet-border max-w-lg w-full rounded-2xl p-6 sm:p-10 relative overflow-hidden"
    >
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-teal-400 text-xs font-body tracking-wide">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-orange-500 text-xs font-body">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1 bg-teal-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Question area */}
      <AnimatePresence mode="wait" custom={direction}>
        <Question
          key={question.id}
          question={question}
          direction={direction}
          onAnswer={handleAnswer}
          onSlider={handleSlider}
          isDev={import.meta.env.DEV}
        />
      </AnimatePresence>

      {import.meta.env.DEV && (
        <div className="flex justify-between mt-6 pt-4 border-t border-teal-800/50">
          <button
            onClick={() => { setDirection(-1); setCurrentIndex(Math.max(0, currentIndex - 1)) }}
            disabled={currentIndex === 0}
            className="text-teal-500 text-xs px-3 py-1 rounded border border-teal-700/50 hover:bg-teal-900/50 cursor-pointer disabled:opacity-30 disabled:cursor-default"
          >
            Prev
          </button>
          <span className="text-orange-400 text-xs self-center font-mono">Score: {score}</span>
          <button
            onClick={() => { setDirection(1); setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1)) }}
            disabled={currentIndex === questions.length - 1}
            className="text-teal-500 text-xs px-3 py-1 rounded border border-teal-700/50 hover:bg-teal-900/50 cursor-pointer disabled:opacity-30 disabled:cursor-default"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  )
}
