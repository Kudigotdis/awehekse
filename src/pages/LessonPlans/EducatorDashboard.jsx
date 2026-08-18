import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

export default function EducatorDashboard() {
  const { activeProfile } = useActiveProfile()
  const campaigns = useLiveQuery(() => db.campaigns.where('creatorProfileId').equals(activeProfile?.id).toArray(), [activeProfile?.id]) || []
  const events = useLiveQuery(() => db.campaignEvents.where('creatorProfileId').equals(activeProfile?.id).toArray(), [activeProfile?.id]) || []

  const totalAttendance = events.reduce((s, e) => s + (e.attendanceCount || 0), 0)

  return (
    <div data-page="Educator_Dashboard_Page" aria-label="Educator Dashboard Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/lessons" className="text-sm text-tov-green hover:underline">&larr; Back</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">Educator Dashboard</h1>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-tov-green/10 p-4 text-center">
          <p className="text-3xl font-bold text-tov-green">{campaigns.length}</p>
          <p className="text-xs text-stone-500">Campaigns Created</p>
        </div>
        <div className="rounded-2xl bg-tov-blue/10 p-4 text-center">
          <p className="text-3xl font-bold text-tov-blue">{events.length}</p>
          <p className="text-xs text-stone-500">Events Logged</p>
        </div>
        <div className="rounded-2xl bg-tov-purple/10 p-4 text-center">
          <p className="text-3xl font-bold text-tov-purple">{totalAttendance}</p>
          <p className="text-xs text-stone-500">Students Reached</p>
        </div>
        <div className="rounded-2xl bg-tov-orange/10 p-4 text-center">
          <p className="text-3xl font-bold text-tov-orange">6</p>
          <p className="text-xs text-stone-500">Lesson Plans</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-stone-500 uppercase">Quick Actions</h3>
        {[
          { to: '/campaign/build', label: 'Create Campaign', icon: '📢' },
          { to: '/campaign/attendance', label: 'Log Attendance', icon: '👥' },
          { to: '/campaign/materials', label: 'Download Materials', icon: '📦' },
          { to: '/campaign/report', label: 'Generate Report', icon: '📊' },
        ].map(({ to, label, icon }) => (
          <Link key={to} to={to} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
            <span className="text-2xl">{icon}</span>
            <p className="font-medium text-stone-800">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
