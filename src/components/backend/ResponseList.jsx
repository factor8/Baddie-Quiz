import { useState, useEffect } from 'react'

const verdictColors = {
  green: 'text-green-400',
  yellow: 'text-yellow-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
}

export default function ResponseList({ api, selectedQuiz }) {
  const [responses, setResponses] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const loadResponses = async (reset) => {
    setLoading(true)
    const result = await api.fetchResponses({
      quizId: selectedQuiz,
      cursor: reset ? undefined : cursor,
      limit: 25,
    })
    setResponses(prev => reset ? result.responses : [...prev, ...result.responses])
    setCursor(result.cursor)
    setHasMore(result.hasMore)
    setLoading(false)
  }

  useEffect(() => {
    setResponses([])
    setCursor(null)
    loadResponses(true)
  }, [selectedQuiz])

  const handleDelete = async (key) => {
    if (!window.confirm('Delete this response?')) return
    setDeleting(key)
    await api.deleteResponse(key)
    setResponses(prev => prev.filter(r => r.key !== key))
    setDeleting(null)
  }

  return (
    <div>
      <h2 className="text-orange-400 font-display text-lg font-bold mb-4">
        Individual Responses
        <span className="text-teal-500 text-xs font-body ml-2">{responses.length} loaded</span>
      </h2>

      {responses.length === 0 && !loading && (
        <div className="bg-teal-900/30 border border-teal-700/30 rounded-xl p-6 text-center text-teal-500 text-sm font-body">
          No responses found.
        </div>
      )}

      <div className="space-y-2">
        {responses.map(r => (
          <div key={r.key} className="bg-teal-900/30 border border-teal-700/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`font-display font-bold ${verdictColors[r.verdict] || 'text-teal-300'}`}>
                  {r.verdict?.toUpperCase()}
                </span>
                <span className="text-teal-400 text-sm font-body">Score: {r.score}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-teal-500 text-xs font-body">
                  {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : ''}
                </span>
                <button
                  onClick={() => handleDelete(r.key)}
                  disabled={deleting === r.key}
                  className="text-red-400/60 hover:text-red-400 text-xs cursor-pointer disabled:opacity-40"
                >
                  {deleting === r.key ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            <details className="mt-2">
              <summary className="text-teal-400 text-xs cursor-pointer hover:text-orange-400">
                View answers ({r.answers?.length || 0})
              </summary>
              <div className="mt-2 space-y-1.5 pl-3 border-l border-teal-700/30">
                {r.answers?.map((a, i) => (
                  <div key={i} className="text-xs font-body">
                    <span className="text-teal-300">{a.questionText}</span>
                    <br />
                    <span className="text-cream/70">&rarr; {a.answerText || `Slider: ${a.value}`}</span>
                    <span className={`ml-2 ${a.score >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
                      ({a.score > 0 ? '+' : ''}{a.score})
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => loadResponses(false)}
          disabled={loading}
          className="w-full mt-4 text-teal-400 hover:text-orange-400 text-sm py-3 border border-dashed border-teal-700/40 rounded-xl cursor-pointer hover:border-orange-500/40 transition-colors disabled:opacity-40"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
