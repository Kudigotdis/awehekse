import { Link } from 'react-router-dom'
import { useState } from 'react'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const moods = [
  { value: 1, label: 'Terrible', emoji: '😞', color: 'bg-red-100 border-red-300' },
  { value: 2, label: 'Bad', emoji: '😟', color: 'bg-orange-100 border-orange-300' },
  { value: 3, label: 'Okay', emoji: '😐', color: 'bg-amber-100 border-amber-300' },
  { value: 4, label: 'Good', emoji: '😊', color: 'bg-green-100 border-green-300' },
  { value: 5, label: 'Great', emoji: '😄', color: 'bg-emerald-100 border-emerald-300' },
]

const habits = [
  { id: 'sleep', label: 'Slept well', icon: '😴' },
  { id: 'exercise', label: 'Exercised', icon: '🏃' },
  { id: 'substance_free', label: 'Substance-free today', icon: '✅' },
  { id: 'social', label: 'Connected with someone', icon: '👥' },
  { id: 'medication', label: 'Took medication', icon: '💊' },
]

export default function DailyCheckin() {
  const { activeProfile } = useActiveProfile()
  const [mood, setMood] = useState(null)
  const [selectedHabits, setSelectedHabits] = useState({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const toggleHabit = (id) => {
    setSelectedHabits(h => ({ ...h, [id]: !h[id] }))
  }

  const saveCheckin = async () => {
    if (!mood) return
    setSaving(true)
    await db.moodMatrix.put({
      profileId: activeProfile.id,
      date: today,
      mood,
      habits: selectedHabits,
      createdAt: new Date().toISOString()
    })
    setSaved(true)
    setSaving(false)
  }

  if (saved) {
    return (
      <div data-page="Daily_Checkin_Page" aria-label="Daily Checkin Page" className="space-y-6 py-8 text-center">
        <span className="text-6xl">✨</span>
        <h2 className="text-xl font-bold text-stone-800">Check-in saved!</h2>
        <p className="text-sm text-stone-500">You're building a great habit.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/mood" className="rounded-2xl bg-tov-purple px-4 py-2.5 text-sm font-medium text-white">Back to Mood Journal</Link>
          <Link to="/mood/insights" className="rounded-2xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600">Insights</Link>
        </div>
      </div>
    )
  }

  return (
    <div data-page="Daily_Checkin_Page" aria-label="Daily Checkin Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Daily Check-in</h1>
        <Link to="/mood" className="text-xs text-tov-purple hover:underline">Mood Journal →</Link>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-stone-800">How are you feeling today?</h2>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {moods.map(m => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${
                mood === m.value ? m.color + ' shadow-md scale-105' : 'border-stone-100 hover:border-stone-200'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[10px] text-stone-500">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-stone-800">Today's habits</h2>
        <div className="mt-4 space-y-2">
          {habits.map(h => (
            <button
              key={h.id}
              onClick={() => toggleHabit(h.id)}
              className={`flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm transition-all ${
                selectedHabits[h.id] ? 'bg-tov-green/10 border border-tov-green/30' : 'bg-stone-50 border border-transparent hover:bg-stone-100'
              }`}
            >
              <span className="text-xl">{h.icon}</span>
              <span className="flex-1 font-medium text-stone-700">{h.label}</span>
              {selectedHabits[h.id] && (
                <svg className="h-5 w-5 text-tov-green" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={saveCheckin}
        disabled={!mood || saving}
        className="w-full rounded-2xl bg-tov-purple py-3 text-sm font-semibold text-white hover:bg-tov-purple/80 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Check-in'}
      </button>

      <p className="text-center text-xs text-stone-400">
        Tracking is optional. Skip any day — no guilt.
      </p>
    </div>
  )
}
