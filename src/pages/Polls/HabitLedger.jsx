import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const substances = ['Alcohol', 'Tobacco', 'Cannabis', 'Meth', 'Other']

export default function HabitLedger() {
  const { activeProfile } = useActiveProfile()
  const entries = useLiveQuery(
    () => db.habitLedger.where('profileId').equals(activeProfile?.id).toArray(),
    [activeProfile?.id]
  ) || []

  const getWeekKey = () => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay() + 1)
    return start.toISOString().split('T')[0]
  }

  const weekKey = getWeekKey()
  const thisWeek = entries.filter(e => e.weekKey === weekKey)

  const toggleEntry = async (day, substance) => {
    const existing = thisWeek.find(e => e.day === day && e.substance === substance)
    if (existing) {
      await db.habitLedger.delete(existing.id)
    } else {
      await db.habitLedger.add({
        profileId: activeProfile.id,
        weekKey,
        day,
        substance,
        createdAt: new Date().toISOString()
      })
    }
  }

  return (
    <div data-page="Habit_Ledger_Page" aria-label="Habit Ledger Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/polls" className="text-sm text-tov-blue hover:underline">&larr; Back</Link>
        <span className="text-xs text-stone-400">Week of {weekKey}</span>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">Habit Ledger</h1>
      <p className="text-sm text-stone-500">Honest weekly tracking. No judgment, just clarity.</p>

      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-stone-50">
                <th className="p-2 text-left text-stone-500 font-medium">Substance</th>
                {weekdays.map(d => <th key={d} className="p-2 text-center text-stone-500 font-medium">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {substances.map(sub => (
                <tr key={sub} className="border-t border-stone-100">
                  <td className="p-2 font-medium text-stone-700">{sub}</td>
                  {weekdays.map(day => {
                    const active = thisWeek.some(e => e.day === day && e.substance === sub)
                    return (
                      <td key={day} className="p-2 text-center">
                        <button
                          onClick={() => toggleEntry(day, sub)}
                          className={`h-8 w-8 rounded-lg text-sm transition-all ${
                            active ? 'bg-tov-red text-white' : 'bg-stone-100 text-stone-300 hover:bg-stone-200'
                          }`}
                        >
                          {active ? '×' : ''}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl bg-tov-blue/5 border border-tov-blue/20 p-4 text-xs text-tov-blue">
        Tap a cell to toggle. This data stays on your device and is never synced.
      </div>
    </div>
  )
}
