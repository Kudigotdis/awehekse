import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

export default function PollBuilder() {
  const { activeProfile } = useActiveProfile()
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [saving, setSaving] = useState(false)

  const addOption = () => { if (options.length < 6) setOptions(o => [...o, '']) }
  const removeOption = (idx) => { if (options.length > 2) setOptions(o => o.filter((_, i) => i !== idx)) }
  const updateOption = (idx, val) => setOptions(o => o.map((v, i) => i === idx ? val : v))

  const valid = question.trim() && options.filter(o => o.trim()).length >= 2

  const savePoll = async () => {
    if (!valid) return
    setSaving(true)
    await db.polls.add({
      creatorProfileId: activeProfile.id,
      question: question.trim(),
      options: options.filter(o => o.trim()),
      type: 'honesty',
      active: true,
      createdAt: new Date().toISOString()
    })
    navigate('/polls')
  }

  return (
    <div data-page="Poll_Builder_Page" aria-label="Poll Builder Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/polls" className="text-sm text-tov-blue hover:underline">&larr; Back</Link>
        <span className="text-xs text-stone-400">Create Poll</span>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">New Honesty Poll</h1>
      <p className="text-sm text-stone-500">Questions must be honest and respectful.</p>

      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-medium text-stone-500">Your question</label>
          <input
            value={question} onChange={e => setQuestion(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-tov-blue focus:outline-none"
            placeholder="e.g. Have you tried saying no to peer pressure?"
            maxLength={200}
          />
          <p className="mt-1 text-[10px] text-stone-400">{question.length}/200</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-stone-500">Options</label>
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={opt} onChange={e => updateOption(i, e.target.value)}
                className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-tov-blue focus:outline-none"
                placeholder={`Option ${i + 1}`}
              />
              {options.length > 2 && (
                <button onClick={() => removeOption(i)} className="text-stone-400 hover:text-tov-red text-lg">×</button>
              )}
            </div>
          ))}
          {options.length < 6 && (
            <button onClick={addOption} className="text-xs text-tov-blue hover:underline">+ Add option</button>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-tov-blue/5 border border-tov-blue/20 p-4 text-xs text-tov-blue">
        Polls are anonymous. No usernames, no tracking.
      </div>

      <button onClick={savePoll} disabled={!valid || saving}
        className="w-full rounded-2xl bg-tov-blue py-3 text-sm font-semibold text-white hover:bg-tov-blue/80 disabled:opacity-50">
        {saving ? 'Creating...' : 'Create Poll'}
      </button>
    </div>
  )
}
