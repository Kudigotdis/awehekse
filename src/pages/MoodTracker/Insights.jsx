import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

export default function Insights() {
  const { activeProfile } = useActiveProfile()
  const checkins = useLiveQuery(
    () => db.moodMatrix.where('profileId').equals(activeProfile?.id).toArray(),
    [activeProfile?.id]
  ) || []

  const avgMood = checkins.length ? (checkins.reduce((s, c) => s + (c.mood || 0), 0) / checkins.length).toFixed(1) : '--'

  const dayOfWeekMood = {}
  const dayCounts = {}
  checkins.forEach(c => {
    const day = new Date(c.date).getDay()
    dayOfWeekMood[day] = (dayOfWeekMood[day] || 0) + (c.mood || 0)
    dayCounts[day] = (dayCounts[day] || 0) + 1
  })

  const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const worstDay = Object.entries(dayOfWeekMood).map(([d, v]) => [d, v / (dayCounts[d] || 1)])
    .sort((a, b) => a[1] - b[1])[0]
  const bestDay = Object.entries(dayOfWeekMood).map(([d, v]) => [d, v / (dayCounts[d] || 1)])
    .sort((a, b) => b[1] - a[1])[0]

  const substanceFreeDays = checkins.filter(c => c.habits?.substance_free).length

  const insights = []
  if (worstDay) insights.push(`Your mood tends to dip on ${dayLabels[worstDay[0]]}`)
  if (bestDay && bestDay[0] !== worstDay?.[0]) insights.push(`${dayLabels[bestDay[0]]} tends to be your best day`)
  if (substanceFreeDays > 0) insights.push(`You've logged ${substanceFreeDays} substance-free day${substanceFreeDays > 1 ? 's' : ''} this month`)

  return (
    <div data-page="Mood_Insights_Page" aria-label="Mood Insights Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/mood" className="text-sm text-tov-purple hover:underline">&larr; Mood Journal</Link>
        <Link to="/mood/journal" className="text-xs text-tov-purple hover:underline">Journal →</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">Your Insights</h1>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-tov-purple/10 p-4 text-center">
          <p className="text-3xl font-bold text-tov-purple">{avgMood}</p>
          <p className="text-xs text-stone-500">Avg Mood (1-5)</p>
        </div>
        <div className="rounded-2xl bg-tov-green/10 p-4 text-center">
          <p className="text-3xl font-bold text-tov-green">{checkins.length}</p>
          <p className="text-xs text-stone-500">Check-ins</p>
        </div>
      </div>

      {insights.length > 0 ? (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-semibold text-stone-800">Patterns detected</h3>
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-stone-600">
                <span className="mt-0.5 text-tov-purple">•</span>
                {insight}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-stone-400">Track for a few days to see patterns emerge.</p>
        </div>
      )}

      <p className="text-center text-xs text-stone-400">
        All analysis happens on-device. Your data never leaves your phone.
      </p>
    </div>
  )
}
