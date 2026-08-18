import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

export default function SurveyBuilder() {
  const { activeProfile } = useActiveProfile()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState([{ text: '', type: 'yes_no' }])
  const [saving, setSaving] = useState(false)

  const addQuestion = () => setQuestions(q => [...q, { text: '', type: 'yes_no' }])
  const updateQ = (i, key, val) => setQuestions(q => q.map((item, idx) => idx === i ? { ...item, [key]: val } : item))
  const removeQ = (i) => { if (questions.length > 1) setQuestions(q => q.filter((_, idx) => idx !== i)) }

  const valid = title.trim() && questions.every(q => q.text.trim())

  const save = async () => {
    if (!valid) return
    setSaving(true)
    await db.surveys.add({
      creatorProfileId: activeProfile.id,
      title: title.trim(),
      questions,
      active: true,
      createdAt: new Date().toISOString()
    })
    navigate('/research')
  }

  return (
    <div data-page="Survey_Builder_Page" aria-label="Survey Builder Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/research" className="text-sm text-tov-purple hover:underline">&larr; Back</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">Build Survey</h1>

      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-medium text-stone-500">Survey Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-tov-purple focus:outline-none"
            placeholder="e.g. Student Wellbeing Survey" />
        </div>

        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={i} className="rounded-xl border border-stone-200 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-400">Question {i + 1}</span>
                {questions.length > 1 && (
                  <button onClick={() => removeQ(i)} className="text-xs text-tov-red hover:underline">Remove</button>
                )}
              </div>
              <input value={q.text} onChange={e => updateQ(i, 'text', e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-tov-purple focus:outline-none"
                placeholder="Your question here..." />
              <select value={q.type} onChange={e => updateQ(i, 'type', e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-tov-purple focus:outline-none">
                <option value="yes_no">Yes / No</option>
                <option value="scale_1_5">Scale 1-5</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="text">Open Text</option>
              </select>
            </div>
          ))}
          <button onClick={addQuestion} className="text-xs text-tov-purple hover:underline">+ Add Question</button>
        </div>
      </div>

      <button onClick={save} disabled={!valid || saving}
        className="w-full rounded-2xl bg-tov-purple py-3 text-sm font-semibold text-white hover:bg-tov-purple/80 disabled:opacity-50">
        {saving ? 'Saving...' : 'Create Survey'}
      </button>
    </div>
  )
}
