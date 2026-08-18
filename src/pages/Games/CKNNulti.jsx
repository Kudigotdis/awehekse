import { Link } from 'react-router-dom'

export default function CKNNulti() {
  return (
    <div data-page="Chokwadi_Kana_Nhema_Multi_Page" aria-label="Chokwadi Kana Nhema Multiplayer Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/games/ckn" className="text-sm text-tov-blue hover:underline">&larr; Back</Link>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-tov-blue to-blue-700 p-6 text-white">
        <h1 className="text-2xl font-bold">CKN Multiplayer</h1>
        <p className="text-sm text-white/70">Compete with friends using Sync Codes</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-center space-y-4">
        <span className="text-4xl">🔗</span>
        <h3 className="font-semibold text-stone-800">How Multiplayer Works</h3>
        <ol className="mx-auto max-w-xs space-y-2 text-left text-sm text-stone-600">
          <li>1. One person creates a room in the Sync Code Lobby</li>
          <li>2. Share the 6-character code with friends</li>
          <li>3. Everyone reads the same statements</li>
          <li>4. Compare scores at the end</li>
        </ol>
        <Link to="/games/sync"
          className="mt-4 block rounded-2xl bg-tov-blue py-3 text-sm font-semibold text-white">
          Go to Sync Code Lobby
        </Link>
      </div>
    </div>
  )
}
