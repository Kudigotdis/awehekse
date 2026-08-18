import { Link } from 'react-router-dom'

const groups = [
  { id: 'rehabs', label: 'Rehabs', count: 12, icon: '🏥', desc: 'Treatment & recovery centres', to: '/menu/participants/rehabs' },
  { id: 'health-pros', label: 'Health Professionals', count: 19, icon: '🩺', desc: 'Doctors, counsellors, nurses', to: '/menu/participants/professionals' },
  { id: 'donors', label: 'Donors', count: 8, icon: '🤲', desc: 'Funding partners', to: '/menu/participants/donors' },
  { id: 'communities', label: 'Communities', count: 24, icon: '🏘️', desc: 'Community groups', to: '/menu/participants/communities' },
  { id: 'education', label: 'Education', count: 31, icon: '🏫', desc: 'Schools & colleges', to: '/menu/participants/education' },
  { id: 'religious', label: 'Religious', count: 15, icon: '⛪', desc: 'Faith communities', to: '/menu/participants/religious' },
]

export default function Participants() {
  const total = groups.reduce((sum, g) => sum + g.count, 0)

  return (
    <div data-page="Participants_Page" aria-label="Participants Page" className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-tov-gold to-amber-500 p-6 text-white shadow-sm">
        <span className="text-3xl">👥</span>
        <h1 className="mt-2 text-2xl font-bold">Participants</h1>
        <p className="mt-1 text-sm text-white/85">The family that makes the work possible.</p>
        <p className="mt-3 text-3xl font-black">{total}</p>
        <p className="text-xs text-white/80">partner groups across the region</p>
      </div>

      <div className="space-y-2">
        {groups.map(g => (
          <Link
            key={g.id}
            to={g.to}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
          >
            <span className="text-2xl">{g.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-stone-800">{g.label}</p>
              <p className="text-xs text-stone-400">{g.desc}</p>
            </div>
            <span className="rounded-full bg-tov-green/10 px-3 py-1 text-sm font-bold text-tov-green">{g.count}</span>
            <svg className="h-4 w-4 text-stone-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ))}
      </div>

      <p className="text-center text-xs text-stone-400">Counts are illustrative and updated as partners join.</p>

      <Link to="/menu" className="block w-full rounded-xl bg-tov-blue py-3 text-center text-sm font-semibold text-white shadow-sm active:scale-[0.99]">
        &larr; Menu
      </Link>
    </div>
  )
}
