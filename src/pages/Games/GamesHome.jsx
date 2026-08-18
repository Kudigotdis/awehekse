import { Link } from 'react-router-dom'

const games = [
  { to: '/games/ckn', name: 'Chokwadi Kana Nhema', subtitle: 'Truth or Lie', icon: '🔍', color: 'from-tov-blue to-blue-700', desc: 'Spot the truth and the lies about substances' },
  { to: '/games/ku', name: 'Kuenzanisa Upenyu', subtitle: 'Compare Lives', icon: '⚖️', color: 'from-tov-purple to-purple-700', desc: 'Compare healthy vs unhealthy life paths' },
  { to: '/games/bc', name: 'Bata Chiratidzo', subtitle: 'Grab the Sign', icon: '🎯', color: 'from-tov-orange to-orange-700', desc: 'Quick reflexes with health knowledge' },
]

export default function GamesHome() {
  return (
    <div data-page="Games_Page" aria-label="Games Page" className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-800">Zero-Network Games</h1>
      <p className="text-sm text-stone-500">Play offline. Compete with friends using Sync Codes.</p>

      <div className="space-y-3">
        {games.map(g => (
          <Link key={g.to} to={g.to}
            className={`block rounded-2xl bg-gradient-to-br ${g.color} p-6 text-white shadow-md hover:shadow-lg`}>
            <span className="text-3xl">{g.icon}</span>
            <h2 className="mt-3 text-lg font-bold">{g.name}</h2>
            <p className="text-xs text-white/60">{g.subtitle}</p>
            <p className="mt-2 text-sm text-white/80">{g.desc}</p>
          </Link>
        ))}
      </div>

      <Link to="/games/sync" className="block rounded-2xl border-2 border-dashed border-stone-300 p-5 text-center hover:border-tov-green">
        <p className="font-medium text-stone-600">Sync Code Lobby</p>
        <p className="text-xs text-stone-400">Start a multiplayer game with friends</p>
      </Link>
    </div>
  )
}
