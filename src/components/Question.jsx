import { useState } from 'react'
import { motion } from 'framer-motion'

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
}

export default function Question({ question, direction, onAnswer, onSlider }) {
  const [sliderValue, setSliderValue] = useState(5)
  const [selected, setSelected] = useState(null)

  const handleOptionClick = (option, index) => {
    setSelected(index)
    // Small delay for visual feedback
    setTimeout(() => onAnswer(option.score), 300)
  }

  const handleSliderSubmit = () => {
    onSlider(sliderValue)
  }

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <h2 className="font-display text-2xl sm:text-3xl text-cream font-bold mb-8 leading-snug">
        {question.text}
      </h2>

      {question.type === 'slider' ? (
        <div className="space-y-6">
          <div className="flex justify-between text-sm text-teal-300 font-body">
            <span>{question.labels.low}</span>
            <span>{question.labels.high}</span>
          </div>

          <div className="relative">
            <input
              type="range"
              min={question.min}
              max={question.max}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2 bg-teal-900 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-8
                [&::-webkit-slider-thumb]:h-8
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-gradient-to-br
                [&::-webkit-slider-thumb]:from-orange-400
                [&::-webkit-slider-thumb]:to-orange-600
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:shadow-orange-500/30
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-orange-300"
            />
          </div>

          <div className="text-center">
            <span className="text-orange-400 font-display text-4xl font-bold">
              {sliderValue}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSliderSubmit}
            className="w-full gold-shimmer bg-gradient-to-r from-orange-600 to-orange-500 text-teal-950 font-display font-bold text-base py-3.5 rounded-xl cursor-pointer tracking-wide shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow duration-300"
          >
            Lock It In
          </motion.button>
        </div>
      ) : (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionClick(option, index)}
              className={`w-full text-left p-4 rounded-xl font-display text-sm sm:text-base cursor-pointer transition-all duration-200 border tracking-wide
                ${
                  selected === index
                    ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                    : 'bg-teal-900/40 border-teal-700/50 text-cream hover:bg-teal-800/60 hover:border-orange-600/50'
                }
              `}
            >
              {option.text}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
