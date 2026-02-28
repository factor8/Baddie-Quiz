const FIELDS = [
  { key: 'id', label: 'Quiz ID', placeholder: 'my-quiz-id' },
  { key: 'title', label: 'Title', placeholder: 'Quiz title' },
  { key: 'subtitle', label: 'Subtitle', placeholder: 'Quiz subtitle' },
  { key: 'tagline', label: 'Tagline', placeholder: 'Catchy tagline' },
  { key: 'cta', label: 'CTA Button', placeholder: 'Begin the Reckoning' },
  { key: 'shareTitle', label: 'Share Title', placeholder: 'Title for sharing' },
  { key: 'shareButtonText', label: 'Share Button Text', placeholder: 'Share Your L (or W)' },
]

const TOGGLES = [
  { key: 'showCommunityStats', label: 'Show "X% of people got the same result" line' },
]

export default function QuizMetadataEditor({ quiz, onChange }) {
  const update = (field, value) => {
    onChange({ ...quiz, [field]: value })
  }

  return (
    <div className="space-y-3">
      <h3 className="text-orange-400 font-display text-lg font-bold">Metadata</h3>
      {FIELDS.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="text-teal-400 text-xs block mb-1">{label}</label>
          <input
            type="text"
            value={quiz[key] || ''}
            onChange={e => update(key, e.target.value)}
            placeholder={placeholder}
            className="w-full bg-teal-950/50 border border-teal-700/40 text-cream/90 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500/60"
          />
        </div>
      ))}
      {TOGGLES.map(({ key, label }) => (
        <label key={key} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={quiz[key] !== false}
            onChange={e => update(key, e.target.checked)}
            className="accent-orange-500 w-4 h-4"
          />
          <span className="text-teal-400 text-xs">{label}</span>
        </label>
      ))}
    </div>
  )
}
