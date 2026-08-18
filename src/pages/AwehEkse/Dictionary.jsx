import { useState } from 'react'
import dictionary from '../../data/dictionary.json'
import BackButton from '../../components/ui/BackButton'
import useRegionFilter from '../../hooks/useRegionFilter'

const TYPE_LABELS = { substance: 'Substance', conditioning: 'Conditioning', mental: 'Mental Health' }
const TYPE_STYLES = {
  substance: 'bg-red-100 text-red-700',
  conditioning: 'bg-purple-100 text-purple-700',
  mental: 'bg-blue-100 text-blue-700',
}

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'substance', label: 'Substances' },
  { id: 'conditioning', label: 'Conditioning' },
  { id: 'mental', label: 'Mental Health' },
]

export default function Dictionary() {
  const { region } = useRegionFilter()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')
  const [openId, setOpenId] = useState(null)

  const q = search.toLowerCase()
  const filtered = dictionary.filter(d => {
    const matchesRegion = d.region === 'GLOBAL' || d.region === region || d.region === 'MULTI'
    const inTab = tab === 'all' || d.type === tab
    if (!matchesRegion || !inTab) return false
    if (!q) return true
    return (
      d.name.toLowerCase().includes(q) ||
      d.slang.toLowerCase().includes(q) ||
      d.short_desc.toLowerCase().includes(q)
    )
  })

  return (
    <div data-page="Dictionary_Page" aria-label="Dictionary Page" className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Dictionary &amp; Slang</h1>
        <p className="mt-1 text-sm text-stone-500">{dictionary.length} terms across substances, conditioning &amp; mental health.</p>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search a term, slang or street name..."
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm focus:border-tov-purple focus:outline-none"
      />

      <div className="space-y-2">
        {filtered.map(d => (
          <div key={d.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <button
              onClick={() => setOpenId(openId === d.id ? null : d.id)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-stone-800">{d.name}</p>
                  <p className="mt-0.5 text-xs text-stone-400">{d.short_desc}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_STYLES[d.type] || 'bg-stone-100 text-stone-600'}`}>
                  {TYPE_LABELS[d.type] || d.type}
                </span>
              </div>
              {d.slang && (
                <p className="mt-2 text-xs text-tov-purple">
                  <span className="font-semibold">Slang:</span> {d.slang}
                </p>
              )}
            </button>

            {openId === d.id && (
              <div className="mt-3 space-y-3 border-t border-stone-100 pt-3">
                {d.pronunciation && <p className="text-xs text-stone-400">Pronunciation: {d.pronunciation}</p>}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-tov-blue">What it is</p>
                  <p className="mt-1 text-sm text-stone-600">{d.what_it_is}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-tov-blue">What it does</p>
                  <p className="mt-1 text-sm text-stone-600">{d.what_it_does}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-stone-400">No terms match "{search}".</p>}
      </div>

      <BackButton to="/aweh/library" />

      <div data-page="Filter Bar" className="sticky bottom-20 z-10 -mx-4 flex gap-1 border-t border-stone-100 bg-white px-4 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-colors ${
              tab === t.id ? 'bg-tov-blue text-white' : 'text-stone-500 hover:bg-stone-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
