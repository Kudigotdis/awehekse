import { Link } from 'react-router-dom'

export default function KUHome() {
  return (
    <div data-page="Kuenzanisa_Upenyu_Page" aria-label="Kuenzanisa Upenyu Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/games" className="text-sm text-tov-purple hover:underline">&larr; Back</Link>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-tov-purple to-purple-700 p-6 text-white">
        <span className="text-4xl">⚖️</span>
        <h1 className="mt-3 text-2xl font-bold">Kuenzanisa Upenyu</h1>
        <p className="text-sm text-white/70">Compare Lives — which path leads where?</p>
      </div>

      <div className="space-y-3">
        <Link to="/games/ku/solo"
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md">
          <span className="text-2xl">🎮</span>
          <div>
            <p className="font-semibold text-stone-800">Solo Mode</p>
            <p className="text-xs text-stone-400">Compare life scenarios at your own pace</p>
          </div>
        </Link>

        <Link to="/games/ku/multi"
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md">
          <span className="text-2xl">👥</span>
          <div>
            <p className="font-semibold text-stone-800">Multiplayer</p>
            <p className="text-xs text-stone-400">Compete with friends via Sync Code</p>
          </div>
        </Link>

        <Link to="/games/ku/paper"
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md">
          <span className="text-2xl">📝</span>
          <div>
            <p className="font-semibold text-stone-800">Paper Mode</p>
            <p className="text-xs text-stone-400">Offline group discussion cards</p>
          </div>
        </Link>
      </div>

      <div className="rounded-2xl bg-purple-50 p-4 text-xs text-purple-700">
        <p className="font-medium">How to play:</p>
        <p className="mt-1">Choose between two life scenarios. Each choice has consequences. See where your decisions lead over time.</p>
      </div>
    </div>
  )
}
