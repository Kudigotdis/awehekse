import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import db from '../../core/db/schema'

export default function RiskHistory() {
  const history = useLiveQuery(() => db.assessments.orderBy('createdAt').reverse().toArray()) || []

  return (
    <div data-page="Risk_Checker_History_Page" aria-label="Risk Checker History Page" className="space-y-6">
      <div>
        <Link to="/check" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-stone-800">Assessment History</h1>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center">
          <p className="text-3xl">📋</p>
          <p className="mt-3 text-stone-500">No assessments yet. Take one to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map(item => (
            <Link
              key={item.id}
              to={`/check/results/${item.id}`}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div>
                <span className="font-medium text-stone-800">{item.type.replace(/-/g, ' ')}</span>
                <p className="text-xs text-stone-400">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <svg className="h-5 w-5 text-stone-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-stone-400">
        All assessments are stored privately on your device.
      </p>
    </div>
  )
}
