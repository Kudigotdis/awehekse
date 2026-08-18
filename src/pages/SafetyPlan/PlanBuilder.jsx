import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const sections = [
  { key: 'warningSigns', title: 'Warning Signs', placeholder: 'What thoughts, feelings, or situations tell you that you might need help? (e.g. "I start isolating myself", "I feel overwhelming sadness")', icon: '⚠️' },
  { key: 'copingStrategies', title: 'Internal Coping Strategies', placeholder: 'What can you do on your own to feel better? (e.g. "Go for a walk", "Listen to music", "Deep breathing")', icon: '💪' },
  { key: 'socialSettings', title: 'People & Social Settings That Help', placeholder: 'Who and where make you feel safe and connected? (e.g. "Sitting with my friend at lunch", "Being at church")', icon: '👥' },
  { key: 'peopleToAsk', title: 'People You Can Ask For Help', placeholder: 'Who can you reach out to directly? (Names and contact numbers)', icon: '📞' },
  { key: 'professionals', title: 'Professional Contacts', placeholder: 'Counsellors, helplines, doctors you can contact (names, numbers, hours)', icon: '🏥' },
  { key: 'environment', title: 'Making Your Environment Safer', placeholder: 'What steps can you take to make your immediate space safer? (e.g. "Remove harmful items", "Stay around people")', icon: '🏠' },
]

export default function PlanBuilder() {
  const { activeProfile } = useActiveProfile()
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [plan, setPlan] = useState({})
  const [saving, setSaving] = useState(false)

  const section = sections[current]
  const progress = ((current + 1) / sections.length) * 100

  const updateField = (key) => (e) => setPlan(p => ({ ...p, [key]: e.target.value }))

  const handleNext = () => {
    if (current < sections.length - 1) setCurrent(c => c + 1)
    else savePlan()
  }

  const savePlan = async () => {
    setSaving(true)
    await db.safetyPlan.put({
      profileId: activeProfile.id,
      ...plan,
      updatedAt: new Date().toISOString()
    })
    navigate('/safety-plan/view')
  }

  return (
    <div data-page="Safety_Plan_Builder_Page" aria-label="Safety Plan Builder Page" className="space-y-6">
      <div>
        <Link to="/safety-plan" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back</Link>
        <div className="flex items-center justify-between">
          <span className="text-sm text-stone-500">{section.title}</span>
          <span className="text-xs text-stone-400">Step {current + 1} of {sections.length}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-stone-100">
          <div className="h-2 rounded-full bg-tov-orange transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <span className="text-3xl">{section.icon}</span>
        <h2 className="mt-3 text-lg font-semibold text-stone-800">{section.title}</h2>
        <textarea
          value={plan[section.key] || ''}
          onChange={updateField(section.key)}
          className="mt-3 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-tov-orange focus:outline-none"
          rows={5}
          placeholder={section.placeholder}
          autoFocus
        />
      </div>

      <div className="flex gap-3">
        {current > 0 && (
          <button onClick={() => setCurrent(c => c - 1)}
            className="flex-1 rounded-2xl border border-stone-200 py-3 text-sm font-medium text-stone-600 hover:bg-stone-50">
            Previous
          </button>
        )}
        <button onClick={handleNext} disabled={saving}
          className="flex-1 rounded-2xl bg-tov-orange py-3 text-sm font-semibold text-white hover:bg-tov-orange/80 disabled:opacity-50">
          {current === sections.length - 1 ? (saving ? 'Saving...' : 'Save Plan') : 'Next'}
        </button>
      </div>
    </div>
  )
}
