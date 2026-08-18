import { Link } from 'react-router-dom'

export default function PollHome() {
  return (
    <div data-page="Honesty_Zone_Page" aria-label="Honesty Zone Page" className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-800">Honesty Zone</h1>
      <p className="text-sm text-stone-500">Anonymous polls, honest answers, zero judgment.</p>

      <div className="space-y-3">
        <Link to="/polls/participate" className="flex items-center gap-4 rounded-2xl bg-tov-blue p-5 text-white shadow-sm hover:shadow-md">
          <span className="text-3xl">🗳️</span>
          <div>
            <h3 className="font-semibold">Take a Poll</h3>
            <p className="text-xs text-white/70">Answer anonymously. Earn honesty points.</p>
          </div>
        </Link>

        <Link to="/polls/ledger" className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
          <span className="text-3xl">📊</span>
          <div>
            <h3 className="font-semibold text-stone-800">Habit Ledger</h3>
            <p className="text-xs text-stone-500">Track weekly substance use honestly.</p>
          </div>
        </Link>

        <Link to="/polls/results" className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
          <span className="text-3xl">📈</span>
          <div>
            <h3 className="font-semibold text-stone-800">Community Results</h3>
            <p className="text-xs text-stone-500">See how others responded — fully anonymous.</p>
          </div>
        </Link>

        <Link to="/polls/create" className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
          <span className="text-3xl">✍️</span>
          <div>
            <h3 className="font-semibold text-stone-800">Create a Poll</h3>
            <p className="text-xs text-stone-500">Design your own anonymous question.</p>
          </div>
        </Link>
      </div>

      <div className="rounded-2xl bg-tov-blue/5 border border-tov-blue/20 p-4">
        <p className="text-xs text-tov-blue">
          All responses are anonymous. No device fingerprinting. No IP logging. Honesty is the currency.
        </p>
      </div>
    </div>
  )
}
