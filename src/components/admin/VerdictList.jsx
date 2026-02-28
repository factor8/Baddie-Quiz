import VerdictEditor from './VerdictEditor'

export default function VerdictList({ verdicts, onChange }) {
  const updateVerdict = (idx, updated) => {
    const next = [...verdicts]
    next[idx] = updated
    onChange(next)
  }

  const deleteVerdict = (idx) => {
    onChange(verdicts.filter((_, i) => i !== idx))
  }

  const addVerdict = () => {
    onChange([
      ...verdicts,
      {
        key: '',
        emoji: '',
        min: 0,
        max: 0,
        title: '',
        description: '',
        color: 'teal',
      },
    ])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-orange-400 font-display text-lg font-bold">Verdicts</h3>
        <span className="text-teal-500 text-xs">{verdicts.length} total</span>
      </div>

      {verdicts.map((v, idx) => (
        <VerdictEditor
          key={idx}
          verdict={v}
          onChange={updated => updateVerdict(idx, updated)}
          onDelete={() => deleteVerdict(idx)}
        />
      ))}

      <button
        onClick={addVerdict}
        className="w-full text-teal-400 hover:text-orange-400 text-sm py-3 border border-dashed border-teal-700/40 rounded-xl cursor-pointer hover:border-orange-500/40 transition-colors"
      >
        + Add Verdict
      </button>
    </div>
  )
}
