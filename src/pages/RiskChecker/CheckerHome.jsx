import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'

const assessmentTypes = [
  { type: 'substance-risk', label: 'Substance Use Risk Check', desc: 'Recognize warning signs of substance use', icon: '🛡️', color: 'bg-tov-green' },
  { type: 'mental-health', label: 'Mental Health Check', desc: 'Check in on your mental wellbeing', icon: '🧠', color: 'bg-tov-blue' },
  { type: 'peer-pressure', label: 'Peer Pressure Response', desc: 'How do you handle social pressure?', icon: '👥', color: 'bg-tov-purple' },
  { type: 'stress', label: 'Stress Management', desc: 'Assess your stress levels', icon: '😤', color: 'bg-tov-orange' },
]

export default function CheckerHome() {
  const history = useLiveQuery(() => db.assessments.orderBy('createdAt').reverse().limit(10).toArray()) || []

  return (
    <div data-page="Risk_Checker_Page" aria-label="Risk Checker Page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Quick Risk Check</h1>
        <p className="mt-1 text-sm text-stone-500">Private self-assessment tools. Your answers stay on your device.</p>
      </div>

      <div className="space-y-3">
        {assessmentTypes.map(({ type, label, desc, icon, color }) => (
          <Link
            key={type}
            to={`/check/take/${type}`}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} text-2xl text-white`}>
              {icon}
            </div>
            <div className="flex-1">
              <span className="font-semibold text-stone-800">{label}</span>
              <p className="text-xs text-stone-400">{desc}</p>
            </div>
            <svg className="h-5 w-5 text-stone-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ))}
      </div>

      {history.length > 0 && (
        <div>
          <Link to="/check/history" className="mb-3 block text-sm font-semibold text-tov-green hover:underline">
            View history &rarr;
          </Link>
          <div className="space-y-2">
            {history.slice(0, 3).map(item => (
              <Link
                key={item.id}
                to={`/check/results/${item.id}`}
                className="flex items-center justify-between rounded-xl bg-white p-3 text-sm shadow-sm"
              >
                <span className="text-stone-600">{item.type}</span>
                <span className="text-stone-400">{new Date(item.createdAt).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
