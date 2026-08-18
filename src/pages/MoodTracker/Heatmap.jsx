import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

export default function Heatmap() {
  const { activeProfile } = useActiveProfile()
  const checkins = useLiveQuery(
    () => db.moodMatrix.where('profileId').equals(activeProfile?.id).toArray(),
    [activeProfile?.id]
  ) || []

  const moodEmojis = { 1: '😞', 2: '😟', 3: '😐', 4: '😊', 5: '😄' }
  const moodColors = { 1: 'bg-red-200', 2: 'bg-orange-200', 3: 'bg-amber-200', 4: 'bg-green-200', 5: 'bg-emerald-200' }

  const checkinMap = {}
  checkins.forEach(c => { checkinMap[c.date] = c })

  const today = new Date()
  const days = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    days.push({
      date: dateStr,
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      mood: checkinMap[dateStr]?.mood,
      habits: checkinMap[dateStr]?.habits
    })
  }

  const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  checkins.forEach(c => { if (c.mood) moodCounts[c.mood]++ })

  return (
    <div data-page="Mood_Heatmap_Page" aria-label="Mood Heatmap Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/mood" className="text-sm text-tov-purple hover:underline">&larr; Mood Journal</Link>
        <Link to="/mood/insights" className="text-xs text-tov-purple hover:underline">Insights →</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">30-Day Mood Heatmap</h1>

      <div className="grid grid-cols-7 gap-1.5">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] text-stone-400">{d}</div>
        ))}
        {days.map((d, i) => (
          <div
            key={i}
            className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
              d.mood ? moodColors[d.mood] : 'bg-stone-100'
            }`}
            title={d.date}
          >
            {d.mood ? moodEmojis[d.mood] : ''}
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-stone-800">Mood Summary</h3>
        <div className="space-y-2">
          {Object.entries(moodCounts).reverse().map(([val, count]) => (
            <div key={val} className="flex items-center gap-2">
              <span className="text-lg">{moodEmojis[val]}</span>
              <div className="flex-1 h-3 rounded-full bg-stone-100 overflow-hidden">
                <div className={`h-full rounded-full ${moodColors[val]}`} style={{ width: `${checkins.length ? (count / checkins.length) * 100 : 0}%` }} />
              </div>
              <span className="text-xs text-stone-400 w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-400">{checkins.length} check-ins in the last 30 days</p>
      </div>
    </div>
  )
}
