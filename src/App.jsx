import { useState, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import Landing from './components/Landing'
import Quiz from './components/Quiz'
import Results from './components/Results'
import quizzes from './data/quizzes'

const AdminPanel = import.meta.env.DEV
  ? lazy(() => import('./components/admin/AdminPanel'))
  : null

function App() {
  const [screen, setScreen] = useState('landing') // landing | quiz | results | admin
  const [finalScore, setFinalScore] = useState(0)
  const [currentQuiz, setCurrentQuiz] = useState(quizzes[0])

  const handleStart = () => setScreen('quiz')

  const handleComplete = (score) => {
    setFinalScore(score)
    setScreen('results')
  }

  const handleRestart = () => {
    setFinalScore(0)
    setScreen('landing')
  }

  const handleQuizChange = (quizId) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (quiz) {
      setCurrentQuiz(quiz)
      setFinalScore(0)
      setScreen('landing')
    }
  }

  const isDev = import.meta.env.DEV

  return (
    <div className="carpet-bg min-h-screen flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <Landing key={`landing-${currentQuiz.id}`} quiz={currentQuiz} onStart={handleStart} />
        )}
        {screen === 'quiz' && (
          <Quiz key={`quiz-${currentQuiz.id}`} quiz={currentQuiz} onComplete={handleComplete} />
        )}
        {screen === 'results' && (
          <Results key={`results-${currentQuiz.id}`} quiz={currentQuiz} score={finalScore} onRestart={handleRestart} />
        )}
        {screen === 'admin' && AdminPanel && (
          <Suspense key="admin" fallback={<div className="text-teal-400">Loading editor...</div>}>
            <AdminPanel onBack={() => setScreen('landing')} />
          </Suspense>
        )}
      </AnimatePresence>

      {isDev && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 z-50">
          <button
            onClick={() => setScreen('admin')}
            className="bg-teal-800/80 text-purple-300 text-xs px-3 py-1.5 rounded-lg border border-teal-600/50 hover:bg-teal-700/80 cursor-pointer"
          >
            Editor
          </button>
          <button
            onClick={handleRestart}
            className="bg-teal-800/80 text-teal-200 text-xs px-3 py-1.5 rounded-lg border border-teal-600/50 hover:bg-teal-700/80 cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => { setScreen('quiz') }}
            className="bg-teal-800/80 text-teal-200 text-xs px-3 py-1.5 rounded-lg border border-teal-600/50 hover:bg-teal-700/80 cursor-pointer"
          >
            Quiz
          </button>
          <button
            onClick={() => { setFinalScore(25); setScreen('results') }}
            className="bg-teal-800/80 text-green-300 text-xs px-3 py-1.5 rounded-lg border border-teal-600/50 hover:bg-teal-700/80 cursor-pointer"
          >
            Result+
          </button>
          <button
            onClick={() => { setFinalScore(-5); setScreen('results') }}
            className="bg-teal-800/80 text-red-300 text-xs px-3 py-1.5 rounded-lg border border-teal-600/50 hover:bg-teal-700/80 cursor-pointer"
          >
            Result-
          </button>
          <select
            value={currentQuiz.id}
            onChange={(e) => handleQuizChange(e.target.value)}
            className="bg-teal-800/80 text-orange-300 text-xs px-2 py-1.5 rounded-lg border border-teal-600/50 cursor-pointer appearance-none"
          >
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>{q.id}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

export default App
