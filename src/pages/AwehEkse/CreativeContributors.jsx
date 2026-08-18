import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { creativeContributors, awehEkseContributorFields, awehEkseTrapLabels } from '../../data/aweh-ekse'
import BackButton from '../../components/ui/BackButton'

const TRAPS = ['anti-drug', 'anti-hopeium', 'attention']

const CATEGORY_ORDER = ['visual', 'theatre', 'literature', 'film', 'music']

const CATEGORY_LABELS = {
  visual: 'Visual Arts & Sculpture',
  theatre: 'Theatre & Spoken Word',
  literature: 'Literature & Print',
  film: 'Film & Digital Satire',
  music: 'Music & Audio',
}

const CATEGORY_DOTS = {
  visual: '#B7410E',
  theatre: '#8F00FF',
  literature: '#4B0082',
  film: '#FFBF00',
  music: '#FF0000',
}

function getInitials(name) {
  const parts = name.split(' ')
  return (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '')
}

function FieldPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active ? 'bg-tov-blue text-white' : 'bg-white text-stone-600 border border-stone-200'
      }`}
    >
      {children}
    </button>
  )
}

export default function CreativeContributors() {
  const [field, setField] = useState('all')
  const [trap, setTrap] = useState('all')

  const filtered = useMemo(() => {
    return creativeContributors.filter(c => {
      const matchField = field === 'all' || c.category === field
      const matchTrap = trap === 'all' || (c.traps && c.traps.includes(trap))
      return matchField && matchTrap
    })
  }, [field, trap])

  const grouped = useMemo(() => {
    const result = {}
    filtered.forEach(c => {
      if (!result[c.category]) result[c.category] = []
      result[c.category].push(c)
    })
    return result
  }, [filtered])

  return (
    <div data-page="Creative_Contributors" aria-label="Creative Contributors Page" className="space-y-4 pb-16">
      <div className="rounded-2xl bg-gradient-to-br from-tov-purple to-purple-700 p-6 text-white shadow-sm">
        <h1 className="text-2xl font-bold">Creative Contributors</h1>
        <p className="mt-2 text-sm text-white/85">
          Mapping the artists re-engineering the Zimbabwean subconscious.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400">Creative Field</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <FieldPill active={field === 'all'} onClick={() => setField('all')}>All</FieldPill>
          {awehEkseContributorFields.map(f => (
            <FieldPill key={f.id} active={field === f.id} onClick={() => setField(f.id)}>
              {f.label}
            </FieldPill>
          ))}
        </div>

        <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-stone-400">Systemic Trap Countered</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <FieldPill active={trap === 'all'} onClick={() => setTrap('all')}>All Traps</FieldPill>
          {TRAPS.map(t => (
            <FieldPill key={t} active={trap === t} onClick={() => setTrap(t)}>
              🛡️ {awehEkseTrapLabels[t]}
            </FieldPill>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {CATEGORY_ORDER.map(cat => {
          if (!grouped[cat] || grouped[cat].length === 0) return null
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 px-1 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_DOTS[cat] }} />
                {CATEGORY_LABELS[cat]}
              </div>
              <div className="space-y-2">
                {grouped[cat].map(c => (
                  <Link
                    key={c.id}
                    to={`/aweh/contributors/${c.id}`}
                    className="flex items-center gap-3.5 rounded-2xl bg-white p-3.5 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
                  >
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-lg font-extrabold"
                      style={{ backgroundColor: `${c.color}22`, color: c.color }}
                    >
                      {getInitials(c.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-stone-800">{c.name}</span>
                      <span className="block text-xs font-medium text-stone-400">{c.field}</span>
                    </span>
                    <span className="text-xl font-light text-stone-300">›</span>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-stone-400">No contributors match those filters.</p>
        )}
      </div>

      <Link
        to="/aweh/contributors/register"
        data-page="Contributor_Register_Button"
        className="block w-full rounded-full bg-tov-red py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white shadow-md active:scale-[0.99]"
      >
        ✚ Register as Creative Contributor
      </Link>

      <BackButton to="/aweh" />
    </div>
  )
}
