import { Link, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const organiseItems = [
  { to: '/profile/bonding', label: 'Bonding Activities', desc: 'Fun icebreakers & team builders', icon: '🤝' },
  { to: '/profile/obstacle-course', label: 'Obstacle Course', desc: 'Challenge-based activities', icon: '🏃' },
  { to: '/profile/event-planner', label: 'Event Planner', desc: 'SMART goals & printable plan', icon: '📅' },
  { to: '/polls/ledger', label: 'Habit Tracker', desc: 'Track daily habits', icon: '✅' },
  { to: '/profile/framed', label: 'Framed', desc: 'Frame your memories', icon: '🖼️' },
]

const toolsItems = [
  { to: '/achievements', label: 'Achievements', desc: 'Your badges', icon: '🏆' },
  { to: '/safety-plan', label: 'Safety Plan', desc: 'Your personal plan', icon: '🛡️' },
  { to: '/check', label: 'Risk Checker', desc: 'Assess your situation', icon: '⚠️' },
  { to: '/mood', label: 'Mood Journal', desc: 'Diary, check-in & recovery guide', icon: '😌' },
  { to: '/profile/select', label: 'Switch Profile', desc: 'Change active profile', icon: '👤' },
  { to: '/research', label: 'Research Portal', desc: 'Data & surveys', icon: '🔬' },
]

const playItems = [
  { to: '/activities/memory', label: 'Memory', desc: 'Recall & match flashcards', icon: '🧠' },
  { to: '/activities/music-match', label: 'Music Match', desc: 'Pair songs & vibes', icon: '🎵' },
]

export default function ProfileHome() {
  const { activeProfile, logout } = useActiveProfile()
  const navigate = useNavigate()

  const bookings = useLiveQuery(() =>
    activeProfile
      ? db.bookings.where('profileId').equals(activeProfile.id).reverse().sortBy('createdAt')
      : [],
    [activeProfile]
  ) || []

  return (
    <div data-page="Profile_Page" aria-label="Profile Page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Profile</h1>
        <p className="mt-1 text-sm text-stone-500">Your identity, tools &amp; progress.</p>
      </div>

      {!activeProfile ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <span className="text-4xl">👤</span>
          <h2 className="mt-3 text-lg font-bold text-stone-800">Login or Create Profile</h2>
          <p className="mt-1 text-sm text-stone-500">Track progress, save notes and access tools.</p>
          <button
            onClick={() => navigate('/profile/select')}
            className="mt-4 w-full rounded-xl bg-tov-blue py-3 text-sm font-semibold text-white"
          >
            Login / Create Profile
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-gradient-to-br from-tov-green to-tov-green-light p-5 text-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-bold">
              {activeProfile.name?.[0]}{activeProfile.surname?.[0]}
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold">{activeProfile.name} {activeProfile.surname}</p>
              <p className="text-xs text-white/80">
                {activeProfile.username && <span>@{activeProfile.username} · </span>}
                {activeProfile.profileType || 'Member'}{activeProfile.age ? ` • Age ${activeProfile.age}` : ''}
              </p>
            </div>
          </div>
          <button onClick={logout} className="mt-4 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/25">
            Sign out
          </button>
        </div>
      )}

      <section>
        <h3 className="mb-2 text-sm font-semibold text-stone-500 uppercase tracking-wide">My Help Requests</h3>
        {bookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <p className="text-sm text-stone-400">No help requests yet.</p>
            <Link to="/aweh/help" className="mt-2 inline-block text-sm font-medium text-tov-red hover:underline">Start the Help! flow →</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {bookings.map(b => (
              <div key={b.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-stone-800">
                    Help request · {b.when === 'now' ? 'Urgent' : b.when === 'today' ? 'Today' : b.when === 'week' ? 'This week' : 'Exploring'}
                  </p>
                  <span className="rounded-full bg-tov-red/10 px-2 py-0.5 text-[10px] font-semibold text-tov-red">{b.date}</span>
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  {b.who} · {b.where} · Contact: {b.how}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-stone-500 uppercase tracking-wide">Tools</h3>
        <div className="space-y-2">
          {toolsItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <span className="text-2xl">{item.icon}</span>
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
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-stone-500 uppercase tracking-wide">Play</h3>
        <div className="space-y-2">
          {playItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <span className="text-2xl">{item.icon}</span>
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
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-stone-500 uppercase tracking-wide">Organise</h3>
        <div className="space-y-2">
          {organiseItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <span className="text-2xl">{item.icon}</span>
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
      </section>
    </div>
  )
}
