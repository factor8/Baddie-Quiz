const COLOR_OPTIONS = ['teal', 'orange', 'red']

export default function VerdictEditor({ verdict, onChange, onDelete }) {
  const update = (field, value) => {
    onChange({ ...verdict, [field]: value })
  }

  return (
    <div className="bg-teal-900/30 border border-teal-700/30 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-lg">{verdict.emoji || '?'}</span>
        <button
          onClick={onDelete}
          className="text-red-400/60 hover:text-red-400 text-xs px-2 py-1 cursor-pointer"
        >
          Delete
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-teal-400 text-xs block mb-1">Key</label>
          <input
            type="text"
            value={verdict.key || ''}
            onChange={e => update('key', e.target.value)}
            placeholder="green"
            className="w-full bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500/60"
          />
        </div>
        <div>
          <label className="text-teal-400 text-xs block mb-1">Emoji</label>
          <input
            type="text"
            value={verdict.emoji || ''}
            onChange={e => update('emoji', e.target.value)}
            placeholder="🟢"
            className="w-full bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500/60"
          />
        </div>
        <div>
          <label className="text-teal-400 text-xs block mb-1">Min Score</label>
          <input
            type="number"
            value={verdict.min}
            onChange={e => update('min', Number(e.target.value))}
            className="w-full bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500/60"
          />
        </div>
        <div>
          <label className="text-teal-400 text-xs block mb-1">Max Score</label>
          <input
            type="number"
            value={verdict.max}
            onChange={e => update('max', Number(e.target.value))}
            className="w-full bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500/60"
          />
        </div>
      </div>

      <div>
        <label className="text-teal-400 text-xs block mb-1">Title</label>
        <input
          type="text"
          value={verdict.title || ''}
          onChange={e => update('title', e.target.value)}
          placeholder="Verdict title"
          className="w-full bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500/60"
        />
      </div>

      <div>
        <label className="text-teal-400 text-xs block mb-1">Description</label>
        <textarea
          value={verdict.description || ''}
          onChange={e => update('description', e.target.value)}
          placeholder="Verdict description"
          rows={3}
          className="w-full bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg resize-none focus:outline-none focus:border-orange-500/60"
        />
      </div>

      <div>
        <label className="text-teal-400 text-xs block mb-1">Color</label>
        <select
          value={verdict.color || 'teal'}
          onChange={e => update('color', e.target.value)}
          className="w-full bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500/60 cursor-pointer"
        >
          {COLOR_OPTIONS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
