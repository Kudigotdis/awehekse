import { Link } from 'react-router-dom'
import { useState } from 'react'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

export default function AttendanceTracker() {
  const { activeProfile } = useActiveProfile()
  const [count, setCount] = useState(0)
  const [eventName, setEventName] = useState('')
  const [location, setLocation] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!eventName.trim()) return
    setSaving(true)
    await db.campaignEvents.add({
      creatorProfileId: activeProfile.id,
      title: eventName.trim(),
      location: location.trim(),
      attendanceCount: count,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    })
    setSaving(false)
    setSaved(true)
  }

  if (saved) {
    return (
      <div data-page="Attendance_Tracker_Page" aria-label="Attendance Tracker Page" className="space-y-6 py-8 text-center">
        <span className="text-6xl">✅</span>
        <h2 className="text-xl font-bold text-stone-800">Attendance logged!</h2>
        <p className="text-sm text-stone-500">{count} people recorded at {eventName}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setSaved(false); setCount(0); setEventName(''); setLocation(''); }}
            className="rounded-2xl bg-tov-green px-4 py-2.5 text-sm font-medium text-white">Log Another</button>
          <Link to="/campaign" className="rounded-2xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600">Back</Link>
        </div>
      </div>
    )
  }

  return (
    <div data-page="Attendance_Tracker_Page" aria-label="Attendance Tracker Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/campaign" className="text-sm text-tov-green hover:underline">&larr; Back</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">Attendance Tracker</h1>

      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-medium text-stone-500">Event Name</label>
          <input value={eventName} onChange={e => setEventName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-tov-green focus:outline-none"
            placeholder="e.g. School Assembly Talk" />
        </div>

        <div>
          <label className="text-xs font-medium text-stone-500">Location (optional)</label>
          <input value={location} onChange={e => setLocation(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-tov-green focus:outline-none"
            placeholder="e.g. Harare High School" />
        </div>

        <div>
          <label className="text-xs font-medium text-stone-500">How many people attended?</label>
          <div className="mt-3 flex items-center justify-center gap-6">
            <button onClick={() => setCount(c => Math.max(0, c - 5))}
              className="h-12 w-12 rounded-full bg-stone-100 text-2xl font-bold text-stone-600 hover:bg-stone-200">−</button>
            <div className="text-center">
              <p className="text-5xl font-bold text-tov-green">{count}</p>
              <p className="text-xs text-stone-400">people</p>
            </div>
            <button onClick={() => setCount(c => c + 5)}
              className="h-12 w-12 rounded-full bg-stone-100 text-2xl font-bold text-stone-600 hover:bg-stone-200">+</button>
          </div>
        </div>
      </div>

      <button onClick={save} disabled={!eventName.trim() || saving}
        className="w-full rounded-2xl bg-tov-green py-3 text-sm font-semibold text-white hover:bg-tov-green/80 disabled:opacity-50">
        {saving ? 'Saving...' : 'Log Attendance'}
      </button>
    </div>
  )
}
