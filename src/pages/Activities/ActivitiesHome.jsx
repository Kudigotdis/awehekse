import { Link } from 'react-router-dom'

const games = [
  { to: '/activities/street-name-quiz', label: 'Street Name Quiz', desc: 'Rapid-fire slang to clinical match' },
  { to: '/activities/match-word', label: 'Match Word', desc: 'Match slang to its clinical term' },
  { to: '/activities/term-builder', label: 'Term Builder', desc: 'Unscramble substances & mental health terms' },
  { to: '/activities/fact-fiction', label: 'Fact & Fiction', desc: 'Which statements are true?' },
  { to: '/activities/the-verdict', label: 'The Verdict', desc: 'Zimbabwean law scenarios' },
]

const extras = [
  { to: '/polls/participate', label: 'Polls', desc: 'Answer anonymously. Earn honesty points.' },
]

export default function ActivitiesHome() {
  return (
    <div data-page="Activities_Page" aria-label="Activities Page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Activities</h1>
        <p className="mt-1 text-sm text-stone-500">Learn the facts through play.</p>
      </div>

      <section>
        <h3 className="text-sm font-bold text-stone-800">Games</h3>
        <div className="mt-2 space-y-2">
          {games.map(game => (
            <Link
              key={game.to}
              to={game.to}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex-1">
                <p className="font-semibold text-stone-800">{game.label}</p>
                <p className="text-xs text-stone-400">{game.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-stone-800">Community</h3>
        <div className="mt-2 space-y-2">
          {extras.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex-1">
                <p className="font-semibold text-stone-800">{item.label}</p>
                <p className="text-xs text-stone-400">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
