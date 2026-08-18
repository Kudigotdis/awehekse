import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import rehabs from '../../data/rehabs.json'
import BackButton from '../../components/ui/BackButton'
import useRegionFilter from '../../hooks/useRegionFilter'

const typeFilters = [
  { id: 'all', label: 'All Facilities' },
  { id: 'Rehab Centre', label: 'Rehab Centres' },
  { id: 'Government Psychiatric Ward', label: 'Government Wards' },
]

const BW_EMERGENCY_LINES = [
  { label: 'Botswana Police Emergency', number: '999' },
  { label: 'Emergency Medical Services (Ambulance)', number: '997' },
  { label: 'Medical Rescue Response', number: '992' },
  { label: 'Lifeline Botswana Crisis Line', number: '+267 391 1270', note: '24/7 Suicide Prevention & Crisis Helpline' },
  { label: 'Youth Helpline Botswana', number: '+267 391 2345', note: 'Youth Mental Health & Support' },
  { label: 'Childline Botswana', number: '116', alt: '+267 390 0900', note: 'Toll-Free Child Protection & Youth Counseling' },
]

export default function RehabDirectory({ backTo = '/help', profileTo = null, hideExtras = false, dataPage = 'Rehab_Directory_Page' }) {
  const { region, current, isFallback, filterByRegion } = useRegionFilter()
  const regionRehabs = useMemo(() => filterByRegion(rehabs), [region])
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return regionRehabs.filter(r => {
      if (type !== 'all' && r.type !== type) return false
      if (!q) return true
      return `${r.name} ${r.city} ${r.location} ${r.phones.join(' ')}`.toLowerCase().includes(q)
    })
  }, [query, type, regionRehabs])

  return (
    <div data-page={dataPage} aria-label="Rehab Directory Page" className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Rehab &amp; Recovery Directory</h1>
        <p className="mt-1 text-sm text-stone-500">{regionRehabs.length} facilities {isFallback ? `across ${current.name}` : `across ${current.name}`}</p>
      </div>

      {region === 'BW' && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-bold text-purple-800">Botswana 3-Tier Rehab System</p>
          <p className="mt-1 text-xs text-purple-600">Botswana operates a three-tier referral system: Primary (community clinics &amp; NGOs) → Secondary (district hospitals like Sekgoma Memorial) → Tertiary (Sbrana Psychiatric Hospital). Contact any facility to begin the admission process.</p>
          <div className="mt-2 flex gap-2">
            <div className="flex-1 rounded-lg bg-white p-2 text-center">
              <p className="text-[10px] font-bold text-purple-700">TIER 1</p>
              <p className="text-[10px] text-stone-500">Community</p>
            </div>
            <div className="flex-1 rounded-lg bg-white p-2 text-center">
              <p className="text-[10px] font-bold text-purple-700">TIER 2</p>
              <p className="text-[10px] text-stone-500">District</p>
            </div>
            <div className="flex-1 rounded-lg bg-white p-2 text-center">
              <p className="text-[10px] font-bold text-purple-700">TIER 3</p>
              <p className="text-[10px] text-stone-500">Tertiary</p>
            </div>
          </div>
        </div>
      )}

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search facility, city, contact..."
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm focus:border-tov-blue focus:outline-none"
      />

      <div className="flex gap-2 overflow-x-auto">
        {typeFilters.map(t => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
              type === t.id ? 'bg-tov-blue text-white' : 'bg-white text-stone-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-stone-400">No facilities match your search.</p>
        )}
        {filtered.map(f => {
          const isGov = f.type === 'Government Psychiatric Ward'
          const phone = f.phones[0] || ''
          const identity = (
            <>
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{ background: f.accent || '#1F618D' }}
              >
                {f.initials || f.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-stone-800">{f.name}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                    isGov ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {isGov ? 'Gov Ward' : 'Rehab'}
                  </span>
                </div>
                {f.city && <p className="mt-0.5 text-xs text-stone-400">{f.city}</p>}
                {f.tagline && <p className="mt-1 text-xs text-stone-500">{f.tagline}</p>}
              </div>
            </>
          )
          return (
            <div key={f.id} className="rounded-2xl bg-white p-4 shadow-sm">
              {profileTo ? (
                <Link to={`${profileTo}/${f.id}`} className="flex items-start gap-3 active:scale-[0.99]">
                  {identity}
                </Link>
              ) : (
                <div className="flex items-start gap-3">
                  {identity}
                </div>
              )}
              {phone && (
                <div className="mt-3 flex gap-2">
                  <a href={`tel:${phone.replace(/\s/g, '')}`}
                    className="flex-1 rounded-xl bg-tov-green py-2 text-center text-sm font-medium text-white hover:bg-tov-green-light">
                    Call {phone}
                  </a>
                  {f.whatsapp && (
                    <a href={`https://wa.me/${f.whatsapp.replace(/[^0-9+]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
                      WhatsApp
                    </a>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!hideExtras && (
        <>
          <Link
            to="/help/rehab/checker"
            data-page="rehab_checker"
            className="block rounded-2xl bg-tov-orange py-4 text-center text-sm font-bold text-white shadow-sm active:scale-[0.99]"
          >
            Rehab Assistance Checker
          </Link>

          <div className="rounded-2xl bg-tov-orange/5 border border-tov-orange/20 p-4">
            <p className="text-xs text-stone-600">
              This directory is informational. Facilities vary in cost, capacity and accreditation — always call ahead.
            </p>
          </div>
        </>
      )}

      {region === 'BW' && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-red-50 p-4">
            <h2 className="text-sm font-bold text-red-800">Emergency &amp; Crisis Lines — Botswana</h2>
            <p className="mt-1 text-xs text-red-600">If you or someone you know is in immediate danger, call emergency services.</p>
          </div>
          <div className="space-y-2">
            {BW_EMERGENCY_LINES.map((line, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-stone-800">{line.label}</p>
                  {line.note && <p className="mt-0.5 text-xs text-stone-400">{line.note}</p>}
                </div>
                <div className="flex shrink-0 gap-2">
                  <a href={`tel:${line.number.replace(/\s/g, '')}`}
                    className="rounded-xl bg-tov-green px-4 py-2 text-sm font-medium text-white hover:bg-tov-green-light">
                    {line.number}
                  </a>
                  {line.alt && (
                    <a href={`tel:${line.alt.replace(/\s/g, '')}`}
                      className="rounded-xl bg-stone-200 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-300">
                      {line.alt}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <BackButton to={backTo} />
    </div>
  )
}
