import { useState } from 'react'
import { Link } from 'react-router-dom'
import lawsZW from '../../data/laws.json'
import lawsBW from '../../data/laws-botswana.json'
import BackButton from '../../components/ui/BackButton'
import useRegionFilter from '../../hooks/useRegionFilter'

const ZONE_ICONS = {
  cherry: {
    box: 'bg-rose-100 text-rose-600',
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  },
  sky: {
    box: 'bg-sky-100 text-sky-600',
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
  lime: {
    box: 'bg-green-100 text-green-600',
    icon: <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />,
  },
  purple: {
    box: 'bg-purple-100 text-purple-600',
    icon: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </>
    ),
  },
}

const FILTERS = [
  { id: 'all', label: 'All Entries' },
  { id: 'laws', label: 'Laws & Punishments' },
  { id: 'substance', label: 'Substances (25)' },
  { id: 'conditioning', label: 'Conditioning (12)' },
  { id: 'mental_health', label: 'Mental Health (49)' },
]

export default function Laws() {
  const { region, current, isFallback } = useRegionFilter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(null)

  const laws = region === 'BW' ? lawsBW : lawsZW

  const q = search.toLowerCase().trim()
  const zones = laws.zones.filter(zone => {
    const matchesQuery = q === '' || zone.keywords.toLowerCase().includes(q)
    const matchesFilter = filter === 'all' || zone.category.includes(filter)
    return matchesQuery && matchesFilter
  })
  const openTag = zones.some(z => z.tag === open) ? open : null

  return (
    <div data-page="Laws_Page" aria-label="Laws Page" className="space-y-4">
      <div>
        <span className="inline-block rounded bg-purple-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-purple-700">
          Legal &amp; Dictionary Hub
        </span>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900">{current.name} Laws &amp; Substances</h1>
        <p className="text-xs text-slate-500">Search 86 Dictionary Entries &amp; Statutory Punishments</p>
      </div>

      {isFallback && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
          Showing Zimbabwe laws — not yet available in {current.name}.
        </div>
      )}

      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#64748b"
          strokeWidth="2.5"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search laws, crystal meth, alcohol, ADHD..."
          className="w-full rounded-xl border-[1.5px] border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-purple-500"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold transition-colors ${
              filter === f.id
                ? 'border-purple-500 bg-purple-500 text-white'
                : 'border-slate-300 bg-slate-100 text-slate-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border-[1.5px] border-sky-500 bg-sky-50 p-3">
        <p className="text-[11px] font-extrabold uppercase tracking-wide text-sky-600">{laws.agency.name}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-800">{laws.agency.desc}</p>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {laws.agency.divisions.map(d => (
            <div key={d.name} className="rounded-md border border-sky-200 bg-white p-1.5">
              <p className="text-[11px] font-bold text-sky-700">{d.name}</p>
              <p className="mt-0.5 text-[11px] text-slate-600">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border-[1.5px] border-rose-500 bg-rose-50 p-3">
        <p className="text-[11px] font-extrabold uppercase tracking-wide text-rose-600">{laws.statute.title}</p>
        <div className="mt-1 flex flex-col gap-1">
          {laws.statute.items.map(s => (
            <div key={s.label} className="rounded-md border border-rose-200 bg-white px-2 py-1.5 text-xs text-slate-600">
              <strong className={s.tone === 'rose' ? 'text-rose-600' : 'text-orange-600'}>{s.label}</strong> {s.text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {zones.map(zone => {
          const isOpen = openTag === zone.tag
          const icon = ZONE_ICONS[zone.icon] || ZONE_ICONS.purple
          return (
            <div
              key={zone.tag}
              className={`overflow-hidden rounded-xl border bg-white transition-colors ${
                isOpen
                  ? 'border-purple-500 shadow-[0_2px_8px_rgba(168,85,247,0.08)]'
                  : 'border-slate-200'
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : zone.tag)}
                className="flex w-full items-center gap-2.5 bg-slate-50 px-3.5 py-3 text-left hover:bg-slate-100"
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${icon.box}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {icon.icon}
                  </svg>
                </span>
                <span className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{zone.tag}</span>
                  <span className="text-sm font-bold text-slate-900">{zone.title}</span>
                </span>
              </button>

              {isOpen && (
                <div className="space-y-3 border-t border-slate-100 bg-white px-3.5 pb-3.5 pt-3">
                  {zone.items.map(item => (
                    <div key={item.heading}>
                      {item.level === 'h2' ? (
                        <h2 className="text-[15px] font-bold text-slate-900">{item.heading}</h2>
                      ) : (
                        <h3 className="text-[13px] font-bold text-slate-700">{item.heading}</h3>
                      )}
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        <strong className="font-semibold text-slate-700">Primary Law:</strong> {item.law}
                      </p>
                      {item.note && (
                        <div className="mt-1.5 rounded-lg border border-sky-200 bg-sky-50 p-2.5">
                          <p className="text-xs font-semibold text-sky-700">
                            <em>Note: {item.note}</em>
                          </p>
                        </div>
                      )}
                      <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5">
                        {item.punishmentsTitle && (
                          <h4 className="mb-1 flex items-center gap-1 text-[11px] font-extrabold uppercase text-rose-700">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {item.punishmentsTitle}
                          </h4>
                        )}
                        <div className="space-y-1">
                          {item.punishments.map((p, j) => (
                            <p key={j} className="text-xs font-semibold leading-relaxed text-rose-900">
                              <strong className="font-semibold">{p.label}</strong> {p.text}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {zones.length === 0 && (
        <p className="py-10 text-center text-sm text-stone-400">No laws match your search or filter.</p>
      )}

      <Link
        to="/aweh/library/dictionary"
        className="block rounded-xl bg-gradient-to-br from-tov-purple to-purple-700 p-4 text-white active:scale-[0.99]"
      >
        <h2 className="text-sm font-bold">Dictionary &amp; Slang</h2>
        <p className="mt-0.5 text-xs text-white/80">
          Browse the full dictionary of substances, conditioning &amp; mental health terms.
        </p>
      </Link>

      <div className="rounded-xl border border-sky-200 bg-sky-50 p-3">
        <p className="text-xs font-semibold text-sky-700">
          This information is educational and not legal advice. Drug laws in {current.name} are being reformed — always
          check the latest legislation.
        </p>
      </div>

      <BackButton to="/aweh/library" />
    </div>
  )
}
