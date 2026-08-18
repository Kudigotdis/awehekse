import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'

export default function CampaignCalendar() {
  const events = useLiveQuery(() => db.campaignEvents.toArray()) || []

  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay()

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const monthName = today.toLocaleString('en', { month: 'long', year: 'numeric' })

  const getEventsForDay = (day) => {
    if (!day) return []
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => e.date === dateStr)
  }

  return (
    <div data-page="Campaign_Calendar_Page" aria-label="Campaign Calendar Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/campaign" className="text-sm text-tov-green hover:underline">&larr; Back</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">Event Calendar</h1>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-center font-semibold text-stone-800">{monthName}</h3>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {['S','M','T','W','T','F','S'].map(d => (
            <div key={d} className="text-center text-[10px] text-stone-400">{d}</div>
          ))}
          {days.map((day, i) => {
            const dayEvents = getEventsForDay(day)
            const isToday = day === today.getDate()
            return (
              <div key={i} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${
                isToday ? 'bg-tov-green text-white font-bold' : day ? 'hover:bg-stone-50' : ''
              }`}>
                {day}
                {dayEvents.length > 0 && (
                  <span className="mt-0.5 h-1 w-1 rounded-full bg-tov-orange" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {events.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-500">Upcoming Events</h3>
          {events.slice(0, 5).map(e => (
            <div key={e.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="font-medium text-stone-800">{e.title}</p>
              <p className="text-xs text-stone-500">{e.date} • {e.location || 'Online'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-stone-400">No events yet. Create one from the Campaign Hub.</p>
        </div>
      )}
    </div>
  )
}
