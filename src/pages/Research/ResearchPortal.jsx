import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'

export default function ResearchPortal() {
  const surveys = useLiveQuery(() => db.surveys.toArray()) || []
  const referrals = useLiveQuery(() => db.referrals.toArray()) || []

  return (
    <div data-page="Research_Portal_Page" aria-label="Research Portal Page" className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-800">Research Portal</h1>
      <p className="text-sm text-stone-500">Anonymous data collection for evidence-based policy.</p>

      <div className="rounded-2xl bg-tov-purple/5 border border-tov-purple/20 p-4">
        <p className="text-xs text-tov-purple">
          All data is de-identified and aggregated. No personal information is ever collected or shared.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-tov-purple/10 p-4 text-center">
          <p className="text-3xl font-bold text-tov-purple">{surveys.length}</p>
          <p className="text-xs text-stone-500">Surveys Created</p>
        </div>
        <div className="rounded-2xl bg-tov-blue/10 p-4 text-center">
          <p className="text-3xl font-bold text-tov-blue">{referrals.length}</p>
          <p className="text-xs text-stone-500">Referrals Logged</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-stone-500 uppercase">Research Tools</h3>
        {[
          { to: '/research/survey-builder', label: 'Build Survey', icon: '📝', desc: 'Create anonymous questionnaires' },
          { to: '/research/take-survey', label: 'Take Survey', icon: '✅', desc: 'Respond to available surveys' },
          { to: '/research/school', label: 'School Dashboard', icon: '🏫', desc: 'School-level aggregated data' },
          { to: '/research/export', label: 'Export Data', icon: '📦', desc: 'Download de-identified datasets' },
        ].map(({ to, label, icon, desc }) => (
          <Link key={to} to={to} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="font-medium text-stone-800">{label}</p>
              <p className="text-xs text-stone-400">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
