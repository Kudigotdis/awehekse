import { useMemo, useState } from 'react'
import pros from '../../data/professionals-directory.json'
import BackButton from '../../components/ui/BackButton'

export default function ProfessionalsDirectory({ backTo = '/help/rehab' }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    if (!q) return pros
    return pros.filter(p =>
      `${p.name} ${p.title} ${p.location} ${p.substances.join(' ')} ${p.mental_health.join(' ')} ${p.modalities.join(' ')}`
        .toLowerCase()
        .includes(q)
    )
  }, [query])

  return (
    <div data-page="Professionals_Directory_Page" aria-label="Professionals Directory Page" className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Professionals Directory</h1>
        <p className="mt-1 text-sm text-stone-500">{pros.length} mental health &amp; addiction professionals</p>
      </div>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search name, city, focus..."
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm focus:border-tov-blue focus:outline-none"
      />

      <div className="space-y-2">
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-stone-400">No professionals match your search.</p>}
        {filtered.map(p => (
          <div key={p.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tov-blue text-sm font-bold text-white">
                {p.name.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-stone-800">{p.name}</p>
                <p className="text-xs text-tov-green">{p.title}</p>
                <p className="mt-0.5 text-xs text-stone-400">{p.location}</p>
              </div>
            </div>
            {p.bio && <p className="mt-2 text-sm text-stone-600">{p.bio}</p>}
            <div className="mt-2 flex flex-wrap gap-1">
              {p.substances.slice(0, 2).map(s => (
                <span key={s} className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">{s}</span>
              ))}
              {p.mental_health.slice(0, 2).map(s => (
                <span key={s} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">{s}</span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-500">
              {p.modalities.slice(0, 2).map(m => (
                <span key={m} className="rounded-full bg-stone-100 px-2 py-0.5">{m}</span>
              ))}
            </div>
            <div className="mt-2 space-y-0.5 text-xs text-stone-500">
              {p.schedule && <p>{p.schedule}</p>}
              {p.fees && <p className="font-medium text-stone-600">{p.fees}</p>}
            </div>
            {p.contact && (
              <p className="mt-2 text-xs text-tov-green">{p.contact}</p>
            )}
          </div>
        ))}
      </div>

      <BackButton to={backTo} />
    </div>
  )
}
