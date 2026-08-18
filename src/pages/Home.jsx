import { Link } from 'react-router-dom'
import { useActiveProfile } from '../context/ProfileContext'
import { useOffline } from '../context/OfflineContext'

const quickActions = [
  { to: '/hub', label: 'Information Hub', desc: 'Learn about substances & mental health', color: 'bg-tov-green', icon: '📚' },
  { to: '/check', label: 'Quick Risk Check', desc: 'Self-assessment tools', color: 'bg-tov-blue', icon: '🛡️' },
  { to: '/help', label: 'Get Help Now', desc: 'Hotlines & contacts', color: 'bg-tov-red', icon: '📞' },
  { to: '/safety-plan', label: 'Safety Plan', desc: 'Your personal crisis plan', color: 'bg-tov-orange', icon: '🚨' },
  { to: '/mood', label: 'Daily Check-in', desc: 'Track mood & habits', color: 'bg-tov-purple', icon: '📊' },
  { to: '/games', label: 'Games', desc: 'Learn through play', color: 'bg-tov-gold', icon: '🎮' },
  { to: '/campaigns', label: 'Aweh Ekse!', desc: 'Campaign hub', color: 'bg-tov-orange', icon: '📢' },
  { to: '/lessons', label: 'Lesson Plans', desc: 'For educators', color: 'bg-tov-blue', icon: '📋' },
]

export default function Home() {
  const { activeProfile } = useActiveProfile()
  const { isOnline } = useOffline()

  return (
    <div data-page="Home_Page" aria-label="Home Page" className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-tov-green to-tov-green-light p-6 text-white">
        <h1 className="text-xl font-bold">
          {getGreeting()}, {activeProfile?.name}
        </h1>
        <p className="mt-1 text-sm text-white/80">
          {isOnline ? 'Connected' : 'Offline mode'} &bull; All features available
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-stone-500 uppercase tracking-wide">Quick Access</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ to, label, desc, color, icon }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            >
              <span className="mb-2 text-2xl">{icon}</span>
              <span className="text-sm font-semibold text-stone-800">{label}</span>
              <span className="mt-0.5 text-xs text-stone-400">{desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-tov-orange/5 border border-tov-orange/20 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📢</span>
          <div>
            <h3 className="font-semibold text-tov-orange">Aweh Ekse!</h3>
            <p className="mt-0.5 text-sm text-stone-600">
              Addictive substances & conditioning contents. Discover how media shapes your choices.
            </p>
            <Link to="/campaigns" className="mt-2 inline-block text-sm font-semibold text-tov-orange hover:underline">
              Explore campaign &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
