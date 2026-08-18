import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'
import StoryActions from '../../components/ui/StoryActions'

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export default function InsightsCalendar() {
  const navigate = useNavigate()
  const { activeProfile } = useActiveProfile()

  const today = new Date()
  const [monthOffset, setMonthOffset] = useState(0)
  const [selected, setSelected] = useState(today.toISOString().slice(0, 10))
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')
  const [openIndex, setOpenIndex] = useState(null)

  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const notes = useLiveQuery(() =>
    activeProfile
      ? db.dateNotes.where('[profileId+date]').equals([activeProfile.id, selected]).toArray()
      : db.dateNotes.where('date').equals(selected).toArray()
  ) || []

  const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`
  const monthEvents = useLiveQuery(() =>
    db.campaignEvents.where('date').between(monthStart, monthEnd).toArray()
  ) || []

  const events = monthEvents.filter(e => e.date === selected)

  const monthName = viewDate.toLocaleString('en', { month: 'long', year: 'numeric' })

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const selectedDate = new Date(selected + 'T00:00:00')
  const dayLabel = `${selectedDate.toLocaleString('en', { weekday: 'long' })} ${ordinal(selectedDate.getDate())}`

  const addNote = async () => {
    if (!activeProfile || !draft.trim()) return
    await db.dateNotes.add({
      profileId: activeProfile.id,
      date: selected,
      text: draft.trim(),
      createdAt: new Date().toISOString(),
    })
    setDraft('')
    setAdding(false)
  }

  const entries = [
    ...notes.map(n => ({ kind: 'note', id: n.id, title: n.text, detail: n.text })),
    ...events.map(e => ({ kind: 'event', id: e.id, title: e.title || 'Campaign event', detail: e.location || 'Campaign event' })),
  ]

  return (
    <div data-page="Insights_Calendar_Page" aria-label="Insights Calendar Page" className="space-y-4 pb-2">
      <div className="Calender_Date_Viewer rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <button onClick={() => setMonthOffset(o => o - 1)} className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100">‹</button>
          <h3 className="font-semibold text-stone-800">{monthName}</h3>
          <button onClick={() => setMonthOffset(o => o + 1)} className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100">›</button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] text-stone-400">{d}</div>
          ))}
          {days.map((day, i) => {
            if (!day) return <div key={i} />
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isToday = dateStr === today.toISOString().slice(0, 10)
            const isSelected = dateStr === selected
            const hasEvent = monthEvents.some(e => e.date === dateStr)
            return (
              <button
                key={i}
                onClick={() => setSelected(dateStr)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${
                  isSelected ? 'bg-tov-blue text-white font-bold'
                  : isToday ? 'bg-tov-green text-white font-semibold'
                  : 'hover:bg-stone-50'
                }`}
              >
                {day}
                {hasEvent && <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${isSelected || isToday ? 'bg-white' : 'bg-stone-300'}`} />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="Calender_Notes_Viewer rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="Day Date text-sm font-semibold text-stone-800">{dayLabel}</h3>
          <button onClick={() => setAdding(a => !a)} className="text-xs font-medium text-tov-green hover:underline">
            + Add Note
          </button>
        </div>

        {adding && (
          <div className="mb-3 rounded-xl bg-tov-cream p-3">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addNote() }}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus:border-tov-green focus:outline-none"
              placeholder="Write a note..."
              autoFocus
            />
            <button onClick={addNote} disabled={!draft.trim()}
              className="mt-2 w-full rounded-lg bg-tov-green py-2 text-xs font-semibold text-white disabled:opacity-50">
              Save Note
            </button>
          </div>
        )}

        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {entries.length === 0 && (
            <p className="Date_Notes py-6 text-center text-sm text-stone-400">No notes for this date yet.</p>
          )}
          {entries.map((entry, i) => (
            <div key={entry.id} className={`rounded-xl p-3 ${entry.kind === 'event' ? 'bg-tov-orange/5 border border-tov-orange/20' : 'bg-tov-cream'}`}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left"
              >
                <span className={`mr-2 text-xs font-semibold ${entry.kind === 'event' ? 'text-tov-orange' : 'text-tov-green'}`}>{i + 1}.</span>
                <span className={`text-sm font-medium ${entry.kind === 'event' ? 'text-tov-orange' : 'text-stone-700'}`}>
                  {entry.kind === 'event' ? '📅 ' : '• '}{entry.title}
                </span>
              </button>
              {openIndex === i && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-600">
                  <li>{entry.detail}</li>
                </ul>
              )}
            </div>
          ))}
        </div>

        <StoryActions favKey={`calendar-${selected}`} title={dayLabel} text={entries.map(e => e.title).join('\n')} />
      </div>

      <button
        onClick={() => navigate('/campaign/build')}
        className="create_event w-full rounded-xl bg-tov-blue px-3 py-2 text-xs font-semibold text-white hover:bg-tov-blue-light"
      >
        Create Event
      </button>
    </div>
  )
}
