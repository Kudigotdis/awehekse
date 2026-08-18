import { Link } from 'react-router-dom'
import useRegionFilter from '../../hooks/useRegionFilter'
import { getHotlinesByCountry } from '../../data'

export default function Hotlines() {
  const { region, current, isFallback } = useRegionFilter()
  const hotlines = getHotlinesByCountry(region)
  return (
    <div data-page="Hotlines_Page" aria-label="Hotlines Page" className="space-y-6">
      <div>
        <Link to="/help" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-stone-800">Crisis Hotlines</h1>
        <p className="mt-1 text-sm text-stone-500">Tap any number to call. All information is cached for offline access.</p>
      </div>

      {isFallback && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
          Showing Zimbabwe hotlines — not yet available in {current.name}.
        </div>
      )}

      <div className="space-y-3">
        {hotlines.map((h, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-stone-800">{h.name}</h3>
                <p className="mt-0.5 text-xs text-stone-400">{h.type} • {h.hours}</p>
                <p className="mt-1 text-sm text-stone-500">{h.description}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <a
                href={`tel:${h.number.replace(/\s/g, '')}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-tov-green py-2.5 text-sm font-medium text-white transition-colors hover:bg-tov-green-light"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                Call {h.number}
              </a>
              <a
                href={`https://wa.me/${h.number.replace(/[^0-9+]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-xl bg-green-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-600"
              >
                WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
