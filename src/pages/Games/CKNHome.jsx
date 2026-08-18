import { Link } from 'react-router-dom'

export default function CKNHome() {
  return (
    <div data-page="Chokwadi_Kana_Nhema_Page" aria-label="Chokwadi Kana Nhema Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/games" className="text-sm text-tov-blue hover:underline">&larr; Back</Link>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-tov-blue to-blue-700 p-6 text-white">
        <span className="text-4xl">🔍</span>
        <h1 className="mt-3 text-2xl font-bold">Chokwadi Kana Nhema</h1>
        <p className="text-sm text-white/70">Truth or Lie — Can you spot the facts?</p>
      </div>

      <div className="space-y-3">
        <Link to="/games/ckn/solo"
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md">
          <span className="text-2xl">🎮</span>
          <div>
            <p className="font-semibold text-stone-800">Solo Practice</p>
            <p className="text-xs text-stone-400">Learn at your own pace</p>
          </div>
        </Link>

        <Link to="/games/ckn/multi"
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md">
          <span className="text-2xl">👥</span>
          <div>
            <p className="font-semibold text-stone-800">Multiplayer</p>
            <p className="text-xs text-stone-400">Use a Sync Code to play with friends</p>
          </div>
        </Link>

        <Link to="/games/ckn/paper"
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md">
          <span className="text-2xl">📝</span>
          <div>
            <p className="font-semibold text-stone-800">Paper Mode</p>
            <p className="text-xs text-stone-400">Read questions aloud, no screen needed</p>
          </div>
        </Link>
      </div>

      <div className="rounded-2xl bg-blue-50 p-4 text-xs text-blue-700">
        <p className="font-medium">How to play:</p>
        <p className="mt-1">Read each statement and decide: is it TRUE or FALSE? Learn real facts about substance abuse as you play.</p>
      </div>
    </div>
  )
}
