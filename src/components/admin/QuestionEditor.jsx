import OptionEditor from './OptionEditor'

export default function QuestionEditor({ question, onChange, onDelete }) {
  const updateField = (field, value) => {
    onChange({ ...question, [field]: value })
  }

  const switchType = (newType) => {
    if (newType === question.type) return
    if (newType === 'slider') {
      const { options, ...rest } = question
      onChange({ ...rest, type: 'slider', min: 0, max: 10, labels: { low: '', high: '' } })
    } else {
      const { min, max, labels, ...rest } = question
      onChange({ ...rest, type: 'choice', options: [{ text: '', score: 0 }, { text: '', score: 0 }] })
    }
  }

  const updateOption = (idx, updated) => {
    const options = [...question.options]
    options[idx] = updated
    onChange({ ...question, options })
  }

  const deleteOption = (idx) => {
    const options = question.options.filter((_, i) => i !== idx)
    onChange({ ...question, options })
  }

  const moveOption = (idx, direction) => {
    const target = idx + direction
    if (target < 0 || target >= question.options.length) return
    const options = [...question.options]
    ;[options[idx], options[target]] = [options[target], options[idx]]
    onChange({ ...question, options })
  }

  const addOption = () => {
    onChange({ ...question, options: [...question.options, { text: '', score: 0 }] })
  }

  const updateLabel = (key, value) => {
    onChange({ ...question, labels: { ...question.labels, [key]: value } })
  }

  return (
    <div className="bg-teal-900/30 border border-teal-700/30 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-orange-400 font-display text-sm font-bold">Q{question.id}</span>
        <div className="flex gap-1">
          <button
            onClick={() => switchType('choice')}
            className={`text-xs px-2.5 py-1 rounded-md cursor-pointer ${
              question.type === 'choice'
                ? 'bg-orange-600/80 text-cream'
                : 'bg-teal-800/50 text-teal-400 hover:bg-teal-700/50'
            }`}
          >
            Choice
          </button>
          <button
            onClick={() => switchType('slider')}
            className={`text-xs px-2.5 py-1 rounded-md cursor-pointer ${
              question.type === 'slider'
                ? 'bg-orange-600/80 text-cream'
                : 'bg-teal-800/50 text-teal-400 hover:bg-teal-700/50'
            }`}
          >
            Slider
          </button>
        </div>
        <button
          onClick={onDelete}
          className="text-red-400/60 hover:text-red-400 text-xs px-2 py-1 cursor-pointer"
        >
          Delete
        </button>
      </div>

      <textarea
        value={question.text}
        onChange={e => updateField('text', e.target.value)}
        placeholder="Question text"
        rows={2}
        className="w-full bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg resize-none focus:outline-none focus:border-orange-500/60"
      />

      {question.type === 'choice' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-teal-400 text-xs uppercase tracking-wider">Options</span>
            <span className="text-teal-600 text-xs">Score</span>
          </div>
          {question.options.map((opt, idx) => (
            <OptionEditor
              key={idx}
              option={opt}
              index={idx}
              isFirst={idx === 0}
              isLast={idx === question.options.length - 1}
              onChange={updated => updateOption(idx, updated)}
              onDelete={() => deleteOption(idx)}
              onMoveUp={() => moveOption(idx, -1)}
              onMoveDown={() => moveOption(idx, 1)}
            />
          ))}
          <button
            onClick={addOption}
            className="text-teal-400 hover:text-orange-400 text-xs px-3 py-1.5 border border-teal-700/30 rounded-lg cursor-pointer hover:border-orange-500/40"
          >
            + Add Option
          </button>
        </div>
      )}

      {question.type === 'slider' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-teal-400 text-xs block mb-1">Min</label>
            <input
              type="number"
              value={question.min}
              onChange={e => updateField('min', Number(e.target.value))}
              className="w-full bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500/60"
            />
          </div>
          <div>
            <label className="text-teal-400 text-xs block mb-1">Max</label>
            <input
              type="number"
              value={question.max}
              onChange={e => updateField('max', Number(e.target.value))}
              className="w-full bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500/60"
            />
          </div>
          <div>
            <label className="text-teal-400 text-xs block mb-1">Low Label</label>
            <input
              type="text"
              value={question.labels?.low || ''}
              onChange={e => updateLabel('low', e.target.value)}
              className="w-full bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500/60"
            />
          </div>
          <div>
            <label className="text-teal-400 text-xs block mb-1">High Label</label>
            <input
              type="text"
              value={question.labels?.high || ''}
              onChange={e => updateLabel('high', e.target.value)}
              className="w-full bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500/60"
            />
          </div>
        </div>
      )}
    </div>
  )
}
