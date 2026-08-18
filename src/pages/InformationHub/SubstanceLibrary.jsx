import { Link } from 'react-router-dom'
import { useState } from 'react'
import { contentPillars } from '../../data'
import SearchBar from '../../components/ui/SearchBar'

const substances = contentPillars.filter(c => c.pillar === 'Knowledge' && c.category === 'Substances')

const localNames = {
  alcohol: 'Chibuku, Kachasu, Musombodia',
  tobacco: 'Cigarettes, Tabs, Swepi',
  cannabis: 'Mbanje, Dagga, Zol',
  meth: 'Mutoriro, Guka, Dombo',
  prescription_drugs: 'Bronco, Bronclear, Mangemba',
}

const severityColors = {
  'Alcohol': 'bg-amber-100 text-amber-700',
  'Tobacco': 'bg-orange-100 text-orange-700',
  'Cannabis (Marijuana)': 'bg-green-100 text-green-700',
  'Methamphetamine': 'bg-red-100 text-red-700',
  'Prescription Drug Misuse': 'bg-purple-100 text-purple-700',
}

export default function SubstanceLibrary() {
  const [expanded, setExpanded] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = search
    ? substances.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.shortDesc?.toLowerCase().includes(search.toLowerCase()))
    : substances

  return (
    <div data-page="Substance_Library_Page" aria-label="Substance Library Page" className="space-y-6">
      <div>
        <Link to="/hub" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-stone-800">Substance Library</h1>
        <p className="mt-1 text-sm text-stone-500">Zimbabwe-relevant substances with local names, myths, and facts</p>
      </div>

      <SearchBar onSearch={setSearch} placeholder="Search substances..." />

      <div className="space-y-3">
        {filtered.map(s => (
          <div key={s.id} className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              className="flex w-full items-center gap-4 p-4 text-left"
            >
              <span className="text-3xl">{s.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-stone-800">{s.name}</h3>
                <p className="text-xs text-stone-400">{localNames[s.id] || s.category}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${severityColors[s.name] || 'bg-stone-100 text-stone-600'}`}>
                {s.shortDesc ? 'Info' : 'View'}
              </span>
            </button>
            {expanded === s.id && (
              <div className="border-t border-stone-100 p-4 space-y-3">
                {s.shortDesc && (
                  <p className="text-sm text-stone-600">{s.shortDesc}</p>
                )}
                {s.effects && (
                  <div>
                    <h4 className="text-xs font-semibold text-stone-500 uppercase">Health Effects</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {s.effects.map((e, i) => (
                        <span key={i} className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] text-red-600">{e}</span>
                      ))}
                    </div>
                  </div>
                )}
                {s.myths && s.myths.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-stone-500 uppercase">Myths vs Facts</h4>
                    {s.myths.map((m, i) => (
                      <div key={i} className="mt-2 rounded-xl bg-stone-50 p-3">
                        <p className="text-xs text-red-600 line-through">{m.myth}</p>
                        <p className="mt-1 text-xs font-medium text-tov-green">{m.fact}</p>
                      </div>
                    ))}
                  </div>
                )}
                {s.regionalContext && (
                  <div className="rounded-xl bg-tov-orange/5 border border-tov-orange/20 p-3">
                    <h4 className="text-xs font-semibold text-tov-orange">Zimbabwe Context</h4>
                    <p className="mt-1 text-xs text-stone-600">{s.regionalContext}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-tov-orange/5 border border-tov-orange/20 p-4">
        <p className="text-sm text-stone-600">
          Each entry contains myths, facts, health effects, and local Zimbabwean context.
        </p>
      </div>
    </div>
  )
}
