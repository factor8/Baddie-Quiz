import QuestionEditor from './QuestionEditor'

export default function QuestionList({ questions, onChange }) {
  const updateQuestion = (idx, updated) => {
    const next = [...questions]
    next[idx] = updated
    onChange(next)
  }

  const deleteQuestion = (idx) => {
    onChange(questions.filter((_, i) => i !== idx))
  }

  const addQuestion = () => {
    const maxId = questions.reduce((max, q) => Math.max(max, q.id), 0)
    onChange([
      ...questions,
      {
        id: maxId + 1,
        text: '',
        type: 'choice',
        options: [
          { text: '', score: 0 },
          { text: '', score: 0 },
        ],
      },
    ])
  }

  const moveQuestion = (idx, direction) => {
    const target = idx + direction
    if (target < 0 || target >= questions.length) return
    const next = [...questions]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-orange-400 font-display text-lg font-bold">Questions</h3>
        <span className="text-teal-500 text-xs">{questions.length} total</span>
      </div>

      {questions.map((q, idx) => (
        <div key={q.id} className="relative">
          <div className="absolute -left-8 top-4 flex flex-col gap-0.5">
            <button
              onClick={() => moveQuestion(idx, -1)}
              disabled={idx === 0}
              className="text-teal-500 hover:text-orange-400 disabled:text-teal-800 text-xs cursor-pointer disabled:cursor-default"
              title="Move up"
            >
              ▲
            </button>
            <button
              onClick={() => moveQuestion(idx, 1)}
              disabled={idx === questions.length - 1}
              className="text-teal-500 hover:text-orange-400 disabled:text-teal-800 text-xs cursor-pointer disabled:cursor-default"
              title="Move down"
            >
              ▼
            </button>
          </div>
          <QuestionEditor
            question={q}
            onChange={updated => updateQuestion(idx, updated)}
            onDelete={() => deleteQuestion(idx)}
          />
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="w-full text-teal-400 hover:text-orange-400 text-sm py-3 border border-dashed border-teal-700/40 rounded-xl cursor-pointer hover:border-orange-500/40 transition-colors"
      >
        + Add Question
      </button>
    </div>
  )
}
