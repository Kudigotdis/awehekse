import { Link, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const badgeData = {
  first_checkin: { name: 'First Steps', icon: '🌱', desc: 'You completed your first daily check-in. This is the beginning of self-awareness.', category: 'Mood', tip: 'Keep checking in daily. Patterns emerge over time.' },
  week_streak: { name: 'Week Warrior', icon: '🔥', desc: 'Seven days of consistent check-ins. You are building discipline.', category: 'Mood', tip: 'Set a reminder for the same time each day.' },
  month_streak: { name: 'Monthly Master', icon: '👑', desc: '30 days of daily tracking. You are the master of your habits.', category: 'Mood', tip: 'Celebrate this milestone! You have earned it.' },
  first_journal: { name: 'Dear Diary', icon: '📓', desc: 'Writing helps process emotions. Your first entry is the hardest.', category: 'Mood', tip: 'Try to write for just 2 minutes each day.' },
  safety_plan: { name: 'Safety First', icon: '🛡️', desc: 'You built a safety plan for difficult moments. This shows real courage.', category: 'Safety', tip: 'Review and update your plan every few months.' },
  first_poll: { name: 'Honest Voice', icon: '🗳️', desc: 'Honesty is the first step to change. You took a poll.', category: 'Polls', tip: 'Try different polls to explore different topics.' },
  '5_polls': { name: 'Truth Teller', icon: '✋', desc: 'Five honest responses. You are making your voice heard.', category: 'Polls', tip: 'Share the platform with friends to get more perspectives.' },
  habit_tracker: { name: 'Habit Watcher', icon: '📊', desc: 'A full week of habit tracking. Awareness is the first step.', category: 'Habits', tip: 'Focus on one habit at a time for best results.' },
  ckn_perfect: { name: 'Fact Master', icon: '🔍', desc: 'Perfect score on Chokwadi Kana Nhema. You really know your facts!', category: 'Games', tip: 'Try the multiplayer mode to share your knowledge.' },
  ku_finish: { name: 'Life Chooser', icon: '⚖️', desc: 'You explored different life paths. Every choice has consequences.', category: 'Games', tip: 'Try again with different choices to see new outcomes.' },
  bc_speed: { name: 'Quick Spotter', icon: '🎯', desc: 'Lightning-fast reflexes on Bata Chiratidzo!', category: 'Games', tip: 'Practice makes perfect. Try to beat your high score.' },
  first_campaign: { name: 'Campaign Starter', icon: '📢', desc: 'You created your first awareness campaign. Be the change.', category: 'Campaign', tip: 'Use the Aweh Ekse! materials to get started.' },
  explorer: { name: 'Knowledge Seeker', icon: '📚', desc: 'Ten articles read. Knowledge is power against substance abuse.', category: 'Learning', tip: 'Try exploring different content pillars.' },
  substance_free_7: { name: 'Clean Week', icon: '✅', desc: 'Seven substance-free days logged. Every day counts.', category: 'Habits', tip: 'Remember: one day at a time.' },
  substance_free_30: { name: 'Clean Month', icon: '🏆', desc: '30 substance-free days. This is a major achievement.', category: 'Habits', tip: 'Share your journey if you feel comfortable.' },
}

export default function BadgeDetail() {
  const { id } = useParams()
  const { activeProfile } = useActiveProfile()
  const badge = badgeData[id]
  const achievement = useLiveQuery(
    () => db.achievements.where({ profileId: activeProfile?.id, badgeId: id }).first(),
    [activeProfile?.id, id]
  )

  if (!badge) {
    return (
      <div data-page="Badge_Detail_Page" aria-label="Badge Detail Page" className="py-8 text-center">
        <p className="text-stone-400">Badge not found.</p>
        <Link to="/achievements" className="mt-4 inline-block text-tov-green text-sm hover:underline">Back to Achievements</Link>
      </div>
    )
  }

  return (
    <div data-page="Badge_Detail_Page" aria-label="Badge Detail Page" className="space-y-6 py-4">
      <Link to="/achievements" className="text-sm text-tov-green hover:underline">&larr; Back</Link>

      <div className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm">
        <span className="text-7xl">{badge.icon}</span>
        <h1 className="mt-4 text-2xl font-bold text-stone-800">{badge.name}</h1>
        <span className="mt-1 rounded-full bg-stone-100 px-3 py-0.5 text-[10px] font-medium text-stone-500">{badge.category}</span>
        <p className="mt-4 text-center text-sm text-stone-600">{badge.desc}</p>

        {achievement ? (
          <div className="mt-6 w-full rounded-xl bg-tov-green/10 p-3 text-center">
            <p className="text-sm font-medium text-tov-green">✓ Earned {achievement.earnedAt ? new Date(achievement.earnedAt).toLocaleDateString() : ''}</p>
          </div>
        ) : (
          <div className="mt-6 w-full rounded-xl bg-stone-100 p-3 text-center">
            <p className="text-sm font-medium text-stone-500">Not yet earned</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-tov-green/5 border border-tov-green/20 p-4">
        <p className="text-xs font-medium text-tov-green">Tips to earn this badge:</p>
        <p className="mt-1 text-sm text-stone-600">{badge.tip}</p>
      </div>
    </div>
  )
}
