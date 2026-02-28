export default function OptionEditor({ option, index, onChange, onDelete }) {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-teal-500 text-xs w-5 shrink-0">{index + 1}.</span>
      <input
        type="text"
        value={option.text}
        onChange={e => onChange({ ...option, text: e.target.value })}
        placeholder="Option text"
        className="flex-1 bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500/60"
      />
      <input
        type="number"
        value={option.score}
        onChange={e => onChange({ ...option, score: Number(e.target.value) })}
        className="w-20 bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg text-center focus:outline-none focus:border-orange-500/60"
        title="Score"
      />
      <button
        onClick={onDelete}
        className="text-red-400/60 hover:text-red-400 text-sm px-2 py-1 cursor-pointer"
        title="Remove option"
      >
        &times;
      </button>
    </div>
  )
}
