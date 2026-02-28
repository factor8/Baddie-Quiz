import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuizApi } from './useQuizApi'
import QuizMetadataEditor from './QuizMetadataEditor'
import QuestionList from './QuestionList'
import VerdictList from './VerdictList'

export default function AdminPanel({ onBack }) {
  const api = useQuizApi()
  const [quizzes, setQuizzes] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [savedSnapshot, setSavedSnapshot] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const hasUnsavedChanges = JSON.stringify(quiz) !== JSON.stringify(savedSnapshot)

  useEffect(() => {
    api.listQuizzes().then(list => {
      setQuizzes(list)
      if (list.length > 0) {
        setSelectedId(list[0].id)
        setQuiz(structuredClone(list[0]))
        setSavedSnapshot(structuredClone(list[0]))
      }
    })
  }, [])

  const selectQuiz = (id) => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Discard them?')) return
    const found = quizzes.find(q => q.id === id)
    if (found) {
      setSelectedId(id)
      setQuiz(structuredClone(found))
      setSavedSnapshot(structuredClone(found))
      setMessage(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const saved = await api.saveQuiz(quiz)
      setSavedSnapshot(structuredClone(saved))
      const list = await api.listQuizzes()
      setQuizzes(list)
      setMessage({ type: 'success', text: 'Saved!' })
      setTimeout(() => setMessage(null), 2000)
    } catch (err) {
      setMessage({ type: 'error', text: `Save failed: ${err.message}` })
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = () => {
    if (!window.confirm('Discard all unsaved changes?')) return
    setQuiz(structuredClone(savedSnapshot))
    setMessage(null)
  }

  const handleNewQuiz = async () => {
    const id = window.prompt('Enter a quiz ID (e.g. my-new-quiz):')
    if (!id) return
    const newQuiz = {
      id,
      title: 'New Quiz',
      subtitle: '',
      tagline: '',
      cta: 'Start',
      shareTitle: 'New Quiz',
      questions: [],
      verdicts: [],
    }
    await api.createQuiz(newQuiz)
    const list = await api.listQuizzes()
    setQuizzes(list)
    setSelectedId(id)
    setQuiz(structuredClone(newQuiz))
    setSavedSnapshot(structuredClone(newQuiz))
    setMessage({ type: 'success', text: 'Quiz created! Remember to add it to index.js.' })
  }

  const handleBack = async () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Leave anyway?')) return
    const latest = await api.listQuizzes()
    onBack(latest)
  }

  if (!quiz) {
    return (
      <div className="text-teal-400 text-center py-20">Loading quizzes...</div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl w-full mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="text-teal-400 hover:text-orange-400 text-sm cursor-pointer"
        >
          &larr; Back to App
        </button>
        <h1 className="text-orange-400 font-display text-xl font-bold">Quiz Editor</h1>
        <span className="text-teal-600 text-xs">dev only</span>
      </div>

      {/* Quiz selector */}
      <div className="flex items-center gap-3 mb-6">
        <select
          value={selectedId}
          onChange={e => selectQuiz(e.target.value)}
          className="flex-1 bg-teal-900/60 border border-teal-700/40 text-cream/90 text-sm px-3 py-2.5 rounded-lg cursor-pointer focus:outline-none focus:border-orange-500/60"
        >
          {quizzes.map(q => (
            <option key={q.id} value={q.id}>{q.id}</option>
          ))}
        </select>
        <button
          onClick={handleNewQuiz}
          className="bg-teal-800/60 text-teal-300 text-sm px-4 py-2.5 rounded-lg border border-teal-600/40 hover:bg-teal-700/60 cursor-pointer"
        >
          + New Quiz
        </button>
      </div>

      {/* Unsaved indicator */}
      {hasUnsavedChanges && (
        <div className="bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs px-3 py-2 rounded-lg mb-4">
          You have unsaved changes
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`text-xs px-3 py-2 rounded-lg mb-4 ${
          message.type === 'success'
            ? 'bg-teal-500/10 border border-teal-500/30 text-teal-300'
            : 'bg-red-500/10 border border-red-500/30 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Editor sections */}
      <div className="space-y-8 mb-8">
        <QuizMetadataEditor
          quiz={quiz}
          onChange={setQuiz}
        />

        <QuestionList
          questions={quiz.questions}
          onChange={questions => setQuiz({ ...quiz, questions })}
        />

        <VerdictList
          verdicts={quiz.verdicts}
          onChange={verdicts => setQuiz({ ...quiz, verdicts })}
        />
      </div>

      {/* Spacer for fixed bottom bar */}
      <div className="h-20" />

      {/* Fixed action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-teal-950/90 backdrop-blur-sm border-t border-teal-700/40 px-4 py-3">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || saving}
            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-teal-950 font-display font-bold text-sm py-3 rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-default hover:shadow-lg hover:shadow-orange-500/20 transition-shadow"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleDiscard}
            disabled={!hasUnsavedChanges}
            className="bg-teal-900/50 border border-teal-700/50 text-teal-300 text-sm px-6 py-3 rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-default hover:bg-teal-800/60"
          >
            Discard
          </button>
        </div>
      </div>
    </motion.div>
  )
}
