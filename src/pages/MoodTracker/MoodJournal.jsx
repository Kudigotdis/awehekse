import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

export default function MoodJournal() {
  const { activeProfile } = useActiveProfile()
  const [panicOpen, setPanicOpen] = useState(false)

  const diaryEntries = useLiveQuery(
    () => activeProfile
      ? db.recoveryDiary.where('profileId').equals(activeProfile.id).toArray()
      : [],
    [activeProfile]
  ) || []

  const checkins = useLiveQuery(
    () => activeProfile
      ? db.moodMatrix.where('profileId').equals(activeProfile.id).toArray()
      : [],
    [activeProfile]
  ) || []

  const journalEntries = useLiveQuery(
    () => activeProfile
      ? db.journal.where('profileId').equals(activeProfile.id).toArray()
      : [],
    [activeProfile]
  ) || []

  const today = new Date().toISOString().split('T')[0]
  const todayDiary = diaryEntries.find(e => e.date === today)

  const streak = (() => {
    const map = {}
    diaryEntries.forEach(e => { map[e.date] = e })
    let count = 0
    const check = new Date()
    for (;;) {
      const key = `${check.getFullYear()}-${String(check.getMonth() + 1).padStart(2, '0')}-${String(check.getDate()).padStart(2, '0')}`
      if (map[key]) {
        count++
        check.setDate(check.getDate() - 1)
      } else {
        break
      }
    }
    return count
  })()

  const avgCraving = diaryEntries.length
    ? (diaryEntries.reduce((s, e) => s + (e.craving || 0), 0) / diaryEntries.length).toFixed(1)
    : '—'

  const features = [
    {
      to: '/mood/diary',
      icon: '📓',
      label: 'Recovery Diary',
      desc: todayDiary
        ? `Logged today · craving ${todayDiary.craving}/10${todayDiary.incident ? ' · ⚠️' : ''}`
        : 'Log cravings, triggers, sleep & more',
      accent: 'from-tov-blue to-tov-blue-light',
    },
    {
      to: '/mood/checkin',
      icon: '😌',
      label: 'Daily Check-in',
      desc: `${checkins.length} check-in${checkins.length === 1 ? '' : 's'} · mood & habits`,
      accent: 'from-tov-green to-tov-green-light',
    },
    {
      to: '/mood/guide',
      icon: '🧭',
      label: 'Recovery Guide',
      desc: '75 topics across substances, conditioning & mental health',
      accent: 'from-tov-purple to-tov-purple/80',
    },
    {
      to: '/mood/journal',
      icon: '📝',
      label: 'Private Journal',
      desc: `${journalEntries.length} saved entr${journalEntries.length === 1 ? 'y' : 'ies'} · encrypted on-device`,
      accent: 'from-tov-gold to-tov-orange-light',
    },
    {
      to: '/mood/insights',
      icon: '📊',
      label: 'Insights',
      desc: 'Patterns & averages across your check-ins',
      accent: 'from-tov-orange to-tov-red',
    },
    {
      to: '/mood/heatmap',
      icon: '🔥',
      label: 'Mood Heatmap',
      desc: '30-day visual of your emotional state',
      accent: 'from-stone-500 to-stone-700',
    },
  ]

  return (
    <div data-page="Mood_Journal_Page" aria-label="Mood Journal Page" className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Mood Journal</h1>
          <p className="mt-1 text-sm text-stone-500">Daily recovery, moods &amp; guidance</p>
        </div>
        <button
          onClick={() => setPanicOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-tov-red text-xl text-white shadow-sm"
          aria-label="Emergency"
        >
          🆘
        </button>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-tov-blue to-tov-blue-light p-5 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/70">Recovery streak</p>
            <p className="text-3xl font-bold">🔥 {streak} day{streak === 1 ? '' : 's'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/70">Avg craving</p>
            <p className="text-3xl font-bold">{avgCraving}<span className="text-base text-white/60">/10</span></p>
          </div>
        </div>
        <p className="mt-3 text-xs text-white/80">
          {todayDiary ? 'Today logged. Keep going — small steps, steady ground.' : 'No entry today yet. Log your day below.'}
        </p>
      </div>

      <div className="space-y-2.5">
        {features.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-2xl text-white shadow-sm`}>
              {item.icon}
            </span>
            <div className="flex-1">
              <p className="font-semibold text-stone-800">{item.label}</p>
              <p className="text-xs text-stone-400">{item.desc}</p>
            </div>
            <svg className="h-4 w-4 text-stone-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-tov-purple/5 border border-tov-purple/20 p-4 text-xs text-tov-purple">
        All mood, journal and diary data is stored only on this device. Nothing is ever uploaded or shared.
      </div>

      {panicOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPanicOpen(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl" onClick={e => e.stopPropagation()}>
            <span className="text-5xl">🆘</span>
            <h2 className="mt-3 text-lg font-bold text-stone-800">You are not alone</h2>
            <p className="mt-1 text-sm text-stone-500">If you're in crisis, reach out to someone who can help right now.</p>
            <div className="mt-4 space-y-2">
              <a href="tel:+2638001234" className="block rounded-2xl bg-tov-red p-4 text-sm font-semibold text-white">📞 +263 800 1234 — National Crisis Line</a>
              <a href="tel:+263712345678" className="block rounded-2xl border border-tov-red/30 bg-tov-red/5 p-4 text-sm font-semibold text-tov-red">📞 +263 71 234 5678 — 24/7 Support</a>
            </div>
            <button onClick={() => setPanicOpen(false)} className="mt-4 w-full rounded-2xl bg-stone-100 py-3 text-sm font-semibold text-stone-600">
              I'm safe for now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
