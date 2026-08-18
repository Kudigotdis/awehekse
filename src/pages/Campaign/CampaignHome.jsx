import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'

export default function CampaignHome() {
  const campaigns = useLiveQuery(() => db.campaigns.toArray()) || []
  const activeCampaigns = campaigns.filter(c => c.active)

  return (
    <div data-page="Campaign_Page" aria-label="Campaign Page" className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-800">Campaign Hub</h1>
      <p className="text-sm text-stone-500">Manage awareness campaigns and events.</p>

      <Link to="/campaign/aweh-ekse" className="block rounded-2xl bg-gradient-to-br from-tov-green to-emerald-700 p-6 text-white shadow-md hover:shadow-lg">
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Featured Campaign</span>
        <h2 className="mt-3 text-xl font-bold">Aweh Ekse!</h2>
        <p className="mt-1 text-sm text-white/80">An Addictive Substances & Conditioning Contents campaign</p>
      </Link>

      {activeCampaigns.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-500 uppercase">Active Campaigns</h3>
          {activeCampaigns.map(c => (
            <Link key={c.id} to={`/campaign/calendar/${c.id}`}
              className="block rounded-2xl bg-white p-5 shadow-sm hover:shadow-md">
              <h3 className="font-semibold text-stone-800">{c.name}</h3>
              <p className="text-xs text-stone-500">{c.theme} • {c.duration || '4 weeks'}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-stone-500 uppercase">Tools</h3>
        {[
          { to: '/campaign/calendar', label: 'Event Calendar', icon: '📅', desc: 'View and plan events' },
          { to: '/campaign/materials', label: 'Campaign Materials', icon: '📦', desc: 'Download offline kits' },
          { to: '/campaign/attendance', label: 'Attendance Tracker', icon: '👥', desc: 'Log event attendance' },
          { to: '/campaign/report', label: 'Impact Report', icon: '📊', desc: 'Generate summary reports' },
          { to: '/campaign/build', label: 'Create Campaign', icon: '➕', desc: 'Start a new campaign' },
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
