import { Link } from 'react-router-dom'

export default function KUMulti() {
  return (
    <div data-page="Kuenzanisa_Upenyu_Multi_Page" aria-label="Kuenzanisa Upenyu Multiplayer Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/games/ku" className="text-sm text-tov-purple hover:underline">&larr; Back</Link>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-tov-purple to-purple-700 p-6 text-white">
        <h1 className="text-2xl font-bold">KU Multiplayer</h1>
        <p className="text-sm text-white/70">Compare life paths with friends</p>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm text-center space-y-4">
        <span className="text-4xl">🔗</span>
        <h3 className="font-semibold text-stone-800">How Multiplayer Works</h3>
        <ol className="mx-auto max-w-xs space-y-2 text-left text-sm text-stone-600">
          <li>1. Create a room in the Sync Code Lobby</li>
          <li>2. Share the code with friends</li>
          <li>3. Everyone makes the same choices</li>
          <li>4. Compare your life outcomes</li>
        </ol>
        <Link to="/games/sync" className="mt-4 block rounded-2xl bg-tov-purple py-3 text-sm font-semibold text-white">
          Go to Sync Code Lobby
        </Link>
      </div>
    </div>
  )
}
