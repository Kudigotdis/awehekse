import { Link } from 'react-router-dom'

const directoryCategories = [
  { id: 'hotlines', label: 'Crisis Hotlines', desc: '24/7 support lines', icon: '📞', color: 'bg-tov-red', to: '/help/hotlines' },
  { id: 'rehab', label: 'Rehabilitation Centres', desc: 'Treatment centres & programmes', icon: '🏥', color: 'bg-tov-green', to: '/help/rehab' },
  { id: 'nearby', label: 'Find Nearest Help', desc: 'Use your location to find nearby facilities', icon: '📍', color: 'bg-tov-orange', to: '/help/nearby' },
]

export default function DirectoryHome() {
  return (
    <div data-page="Directory_Page" aria-label="Directory Page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Get Help</h1>
        <p className="mt-1 text-sm text-stone-500">Helplines, treatment centres, and support. Always available offline.</p>
      </div>

      <div className="rounded-2xl bg-tov-red p-4 text-white">
        <p className="font-semibold">In immediate danger?</p>
        <p className="mt-1 text-sm text-white/80">Call emergency services: <strong>995</strong> (Ambulance) or <strong>999</strong> (Police)</p>
      </div>

      <div className="space-y-3">
        {directoryCategories.map(({ id, label, desc, icon, color, to }) => (
          <Link
            key={id}
            to={to}
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
    </div>
  )
}
