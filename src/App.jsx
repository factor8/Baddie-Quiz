import { useState, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import Landing from './components/Landing'
import Quiz from './components/Quiz'
import Results from './components/Results'
import quizzes from './data/quizzes'

const AdminPanel = import.meta.env.DEV
  ? lazy(() => import('./components/admin/AdminPanel'))
  : null

const DevToolbar = import.meta.env.DEV
  ? lazy(() => import('./components/dev/DevToolbar'))
  : null

function App() {
  const [screen, setScreen] = useState('landing') // landing | quiz | results | admin
  const [finalScore, setFinalScore] = useState(0)
  const [finalAnswers, setFinalAnswers] = useState([])
  const [quizList, setQuizList] = useState(quizzes)
  const [currentQuiz, setCurrentQuiz] = useState(quizzes[0])

  const handleStart = () => setScreen('quiz')

  const handleComplete = (score, answers) => {
    setFinalScore(score)
    setFinalAnswers(answers)
    setScreen('results')
  }

  const handleRestart = () => {
    setFinalScore(0)
    setScreen('landing')
  }

  const handleQuizChange = (quizId) => {
    const quiz = quizList.find((q) => q.id === quizId)
    if (quiz) {
      setCurrentQuiz(quiz)
      setFinalScore(0)
      setScreen('landing')
    }
  }

  const handleAdminBack = (updatedQuizzes) => {
    if (updatedQuizzes) {
      setQuizList(updatedQuizzes)
      const refreshed = updatedQuizzes.find((q) => q.id === currentQuiz.id)
      if (refreshed) setCurrentQuiz(refreshed)
    }
    setScreen('landing')
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
          <Results key={`results-${currentQuiz.id}`} quiz={currentQuiz} score={finalScore} answers={finalAnswers} onRestart={handleRestart} />
        )}
        {screen === 'admin' && AdminPanel && (
          <Suspense key="admin" fallback={<div className="text-teal-400">Loading editor...</div>}>
            <AdminPanel onBack={handleAdminBack} />
          </Suspense>
        )}
      </AnimatePresence>

      {isDev && DevToolbar && (
        <Suspense fallback={null}>
          <DevToolbar
            screen={screen}
            onNavigate={setScreen}
            onSetScore={setFinalScore}
            quizList={quizList}
            currentQuizId={currentQuiz.id}
            onQuizChange={handleQuizChange}
          />
        </Suspense>
      )}
    </div>
  )
}

export default App
