import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatsOverview from './StatsOverview'
import ResponseList from './ResponseList'
import useBackendApi from './useBackendApi'

export default function BackendDashboard() {
  const api = useBackendApi()
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.fetchAllStats().then(data => {
      setQuizzes(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="carpet-bg min-h-screen flex items-center justify-center">
        <div className="text-teal-400 font-body">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="carpet-bg min-h-screen p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-orange-400 font-display text-2xl font-bold">Backend Dashboard</h1>
            <p className="text-teal-500 text-sm font-body mt-1">Quiz results &amp; response data</p>
          </div>
          <a href="/" className="text-teal-400 hover:text-orange-400 text-sm font-body transition-colors">
            &larr; Back to App
          </a>
        </div>

        <div className="mb-6">
          <select
            value={selectedQuiz || ''}
            onChange={e => setSelectedQuiz(e.target.value || null)}
            className="bg-teal-900/60 border border-teal-700/40 text-cream/90 text-sm px-3 py-2.5 rounded-lg cursor-pointer focus:outline-none focus:border-orange-500/60"
          >
            <option value="">All Quizzes</option>
            {quizzes.map(q => (
              <option key={q.quizId} value={q.quizId}>{q.quizId}</option>
            ))}
          </select>
        </div>

        <StatsOverview quizzes={quizzes} selectedQuiz={selectedQuiz} />
        <ResponseList api={api} selectedQuiz={selectedQuiz} />
      </motion.div>
    </div>
  )
}
