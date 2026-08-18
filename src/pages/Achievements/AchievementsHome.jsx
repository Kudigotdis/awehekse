import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const allBadges = [
  { id: 'first_checkin', name: 'First Steps', icon: '🌱', desc: 'Complete your first daily check-in', category: 'Mood' },
  { id: 'week_streak', name: 'Week Warrior', icon: '🔥', desc: '7-day check-in streak', category: 'Mood' },
  { id: 'month_streak', name: 'Monthly Master', icon: '👑', desc: '30-day check-in streak', category: 'Mood' },
  { id: 'first_journal', name: 'Dear Diary', icon: '📓', desc: 'Write your first journal entry', category: 'Mood' },
  { id: 'safety_plan', name: 'Safety First', icon: '🛡️', desc: 'Create your safety plan', category: 'Safety' },
  { id: 'first_poll', name: 'Honest Voice', icon: '🗳️', desc: 'Complete your first honesty poll', category: 'Polls' },
  { id: '5_polls', name: 'Truth Teller', icon: '✋', desc: 'Complete 5 honesty polls', category: 'Polls' },
  { id: 'habit_tracker', name: 'Habit Watcher', icon: '📊', desc: 'Track habits for a full week', category: 'Habits' },
  { id: 'ckn_perfect', name: 'Fact Master', icon: '🔍', desc: 'Score 10/10 on Chokwadi Kana Nhema', category: 'Games' },
  { id: 'ku_finish', name: 'Life Chooser', icon: '⚖️', desc: 'Complete a Kuenzanisa Upenyu game', category: 'Games' },
  { id: 'bc_speed', name: 'Quick Spotter', icon: '🎯', desc: 'Score 10+ on Bata Chiratidzo', category: 'Games' },
  { id: 'first_campaign', name: 'Campaign Starter', icon: '📢', desc: 'Create your first campaign', category: 'Campaign' },
  { id: 'explorer', name: 'Knowledge Seeker', icon: '📚', desc: 'Read 10 articles from the Information Hub', category: 'Learning' },
  { id: 'substance_free_7', name: 'Clean Week', icon: '✅', desc: '7 consecutive substance-free days logged', category: 'Habits' },
  { id: 'substance_free_30', name: 'Clean Month', icon: '🏆', desc: '30 consecutive substance-free days logged', category: 'Habits' },
]

export default function AchievementsHome() {
  const { activeProfile } = useActiveProfile()
  const achievements = useLiveQuery(
    () => db.achievements.where('profileId').equals(activeProfile?.id).toArray(),
    [activeProfile?.id]
  ) || []

  const earnedIds = new Set(achievements.map(a => a.badgeId))
  const earned = allBadges.filter(b => earnedIds.has(b.id))
  const locked = allBadges.filter(b => !earnedIds.has(b.id))

  return (
    <div data-page="Achievements_Page" aria-label="Achievements Page" className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-800">Achievements</h1>
      <p className="text-sm text-stone-500">Earn badges as you build healthy habits.</p>

      <div className="rounded-2xl bg-tov-green/5 border border-tov-green/20 p-4 text-center">
        <p className="text-3xl font-bold text-tov-green">{earned.length}/{allBadges.length}</p>
        <p className="text-xs text-stone-500">Badges earned</p>
      </div>

      {earned.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-500 uppercase">Earned</h3>
          <div className="grid grid-cols-2 gap-3">
            {earned.map(b => (
              <Link key={b.id} to={`/achievements/${b.id}`}
                className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm hover:shadow-md">
                <span className="text-4xl">{b.icon}</span>
                <p className="mt-2 text-center text-xs font-medium text-stone-800">{b.name}</p>
                <p className="text-[10px] text-stone-400">{b.category}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-stone-500 uppercase">Locked</h3>
        <div className="grid grid-cols-2 gap-3">
          {locked.map(b => (
            <div key={b.id} className="flex flex-col items-center rounded-2xl bg-stone-50 p-4 opacity-60">
              <span className="text-4xl grayscale">{b.icon}</span>
              <p className="mt-2 text-center text-xs font-medium text-stone-500">{b.name}</p>
              <p className="text-[10px] text-stone-400">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
