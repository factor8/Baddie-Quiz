const verdictConfig = [
  { key: 'green', label: 'Green', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  { key: 'yellow', label: 'Yellow', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { key: 'orange', label: 'Orange', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { key: 'red', label: 'Red', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
]

export default function StatsOverview({ quizzes, selectedQuiz }) {
  const filtered = selectedQuiz
    ? quizzes.filter(q => q.quizId === selectedQuiz)
    : quizzes

  const totals = filtered.reduce(
    (acc, q) => ({
      green: acc.green + q.stats.green,
      yellow: acc.yellow + q.stats.yellow,
      orange: acc.orange + q.stats.orange,
      red: acc.red + q.stats.red,
    }),
    { green: 0, yellow: 0, orange: 0, red: 0 }
  )

  const total = totals.green + totals.yellow + totals.orange + totals.red

  return (
    <div className="mb-8">
      <h2 className="text-orange-400 font-display text-lg font-bold mb-4">
        Stats Overview
        <span className="text-teal-500 text-xs font-body ml-2">{total} total responses</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {verdictConfig.map(v => (
          <div key={v.key} className={`${v.bg} border ${v.border} rounded-xl p-4 text-center`}>
            <div className={`font-display text-3xl font-bold ${v.color}`}>{totals[v.key]}</div>
            <div className="text-teal-400 text-xs font-body mt-1">{v.label}</div>
            {total > 0 && (
              <div className="text-teal-500 text-xs font-body">
                {Math.round((totals[v.key] / total) * 100)}%
              </div>
            )}
          </div>
        ))}
      </div>

      {!selectedQuiz && quizzes.length > 1 && (
        <div className="mt-4 space-y-2">
          {quizzes.map(q => {
            const qTotal = q.stats.green + q.stats.yellow + q.stats.orange + q.stats.red
            return (
              <div key={q.quizId} className="bg-teal-900/30 border border-teal-700/30 rounded-lg p-3 flex items-center justify-between">
                <span className="text-cream/90 text-sm font-body">{q.quizId}</span>
                <span className="text-teal-400 text-xs font-body">{qTotal} responses</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
