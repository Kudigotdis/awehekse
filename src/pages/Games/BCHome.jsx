import { Link } from 'react-router-dom'

export default function BCHome() {
  return (
    <div data-page="Bata_Chiratidzo_Page" aria-label="Bata Chiratidzo Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/games" className="text-sm text-tov-orange hover:underline">&larr; Back</Link>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-tov-orange to-orange-700 p-6 text-white">
        <span className="text-4xl">🎯</span>
        <h1 className="mt-3 text-2xl font-bold">Bata Chiratidzo</h1>
        <p className="text-sm text-white/70">Grab the Sign — quick reflexes, quick knowledge</p>
      </div>

      <div className="space-y-3">
        <Link to="/games/bc/solo"
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md">
          <span className="text-2xl">🎮</span>
          <div>
            <p className="font-semibold text-stone-800">Solo Mode</p>
            <p className="text-xs text-stone-400">Test your reflexes and knowledge</p>
          </div>
        </Link>

        <Link to="/games/bc/multi"
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md">
          <span className="text-2xl">👥</span>
          <div>
            <p className="font-semibold text-stone-800">Multiplayer</p>
            <p className="text-xs text-stone-400">Compete head-to-head with friends</p>
          </div>
        </Link>

        <Link to="/games/bc/paper"
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md">
          <span className="text-2xl">📝</span>
          <div>
            <p className="font-semibold text-stone-800">Paper Mode</p>
            <p className="text-xs text-stone-400">Quick-fire quiz cards for groups</p>
          </div>
        </Link>
      </div>

      <div className="rounded-2xl bg-orange-50 p-4 text-xs text-orange-700">
        <p className="font-medium">How to play:</p>
        <p className="mt-1">Tap the correct health symbol as fast as you can. Speed and accuracy both count!</p>
      </div>
    </div>
  )
}
