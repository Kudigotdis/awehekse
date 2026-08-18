import { Link } from 'react-router-dom'
import { useState } from 'react'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const prompts = [
  'How did you handle peer pressure today?',
  'What made you feel stressed or anxious today?',
  'What is one thing you are grateful for today?',
  'How did you take care of your mental health today?',
  'What coping strategy did you use today?',
]

export default function JournalEntry() {
  const { activeProfile } = useActiveProfile()
  const [entry, setEntry] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const saveEntry = async () => {
    if (!entry.trim()) return
    setSaving(true)
    await db.journal.add({
      profileId: activeProfile.id,
      content: entry,
      createdAt: new Date().toISOString()
    })
    setSaving(false)
    setSaved(true)
    setEntry('')
  }

  if (saved) {
    return (
      <div data-page="Journal_Entry_Page" aria-label="Journal Entry Page" className="space-y-6 py-8 text-center">
        <span className="text-6xl">📓</span>
        <h2 className="text-xl font-bold text-stone-800">Entry saved!</h2>
        <p className="text-sm text-stone-500">Your thoughts are private and encrypted.</p>
        <button onClick={() => setSaved(false)} className="rounded-2xl bg-tov-purple px-4 py-2.5 text-sm font-medium text-white">
          Write another
        </button>
      </div>
    )
  }

  return (
    <div data-page="Journal_Entry_Page" aria-label="Journal Entry Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/mood" className="text-sm text-tov-purple hover:underline">&larr; Mood Journal</Link>
        <Link to="/mood/heatmap" className="text-xs text-tov-purple hover:underline">Heatmap →</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">Private Journal</h1>

      <div className="rounded-2xl bg-tov-purple/5 border border-tov-purple/20 p-3 text-xs text-tov-purple">
        Your journal is encrypted and stored only on your device.
      </div>

      <div className="space-y-2">
        <p className="text-xs text-stone-500">Prompts to get you started:</p>
        {prompts.map((p, i) => (
          <button key={i} onClick={() => setEntry(e => e ? e + '\n\n' + p : p)}
            className="w-full rounded-xl bg-white p-3 text-left text-xs text-stone-500 shadow-sm hover:shadow-md">
            {p}
          </button>
        ))}
      </div>

      <textarea
        value={entry} onChange={e => setEntry(e.target.value)}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm focus:border-tov-purple focus:outline-none"
        rows={8}
        placeholder="Write freely. This is just for you..."
      />

      <button onClick={saveEntry} disabled={!entry.trim() || saving}
        className="w-full rounded-2xl bg-tov-purple py-3 text-sm font-semibold text-white hover:bg-tov-purple/80 disabled:opacity-50">
        {saving ? 'Saving...' : 'Save Entry'}
      </button>
    </div>
  )
}
