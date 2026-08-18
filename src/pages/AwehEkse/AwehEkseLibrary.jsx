import { Link } from 'react-router-dom'
import { useState } from 'react'
import { contentPillars } from '../../data'
import dictionary from '../../data/dictionary.json'
import { substances as allSubstances, conditioningEntries, entryIcon, entryShortDesc } from '../../data/library'
import BackButton from '../../components/ui/BackButton'

const substances = allSubstances.length ? allSubstances : contentPillars.filter(c => c.category === 'Substances')
const conds = conditioningEntries
const mentalHealth = contentPillars.filter(c => c.category !== 'Substances')

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'subs', label: 'Substances' },
  { id: 'conds', label: 'Conditioning' },
  { id: 'mentals', label: 'Mental Health' },
]

const sections = [
  { id: 'rehab', label: 'Rehab', desc: 'Treatment & recovery centres', icon: '🏥', to: '/aweh/library/rehabs' },
  { id: 'laws', label: 'Laws', desc: 'Substance laws in your region', icon: '⚖️', to: '/aweh/library/laws' },
  { id: 'lessons', label: 'Lesson Plans', desc: 'For educators & facilitators', icon: '📋', to: '/lessons' },
]

export default function AwehEkseLibrary() {
  const [tab, setTab] = useState('all')

  const subs = tab === 'all' || tab === 'subs' ? substances : []
  const shownConds = tab === 'all' || tab === 'conds' ? conds : []
  const mentals = tab === 'all' || tab === 'mentals' ? mentalHealth : []

  return (
    <div data-page="Library_Page" aria-label="Library Page" className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Library</h1>
        <p className="mt-1 text-sm text-stone-500">Substances, conditioning contents, health, rehab &amp; the law.</p>
      </div>

      {tab === 'all' && (
        <div className="space-y-2">
          {sections.map(s => (
            <Link key={s.id} to={s.to} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm active:scale-[0.99]">
              <span className="text-2xl">{s.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-stone-800">{s.label}</p>
                <p className="text-xs text-stone-400">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab !== 'all' && (
        <>
          {tab === 'subs' && (
            <div className="space-y-2">
              {subs.map(s => (
                <Link key={s.id} to={`/aweh/library/substances/${s.id}`} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm active:scale-[0.99]">
                  <span className="text-2xl">{entryIcon(s)}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800">{s.title}</p>
                    <p className="text-xs text-stone-400">{entryShortDesc(s)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {tab === 'conds' && (
            <div className="space-y-2">
              {shownConds.map(c => (
                <Link key={c.id} to={`/aweh/library/conditioning/${c.id}`} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm active:scale-[0.99]">
                  <span className="text-2xl">{entryIcon(c)}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800">{c.title}</p>
                    <p className="text-xs text-stone-400">{entryShortDesc(c)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {tab === 'mentals' && (
            <div className="space-y-2">
              {mentals.map(m => (
                <Link key={m.id} to={`/aweh/library/mental-health/${m.id}`} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm active:scale-[0.99]">
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800">{m.name}</p>
                    <p className="text-xs text-stone-400">{m.shortDesc}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      <Link
        to="/aweh/library/dictionary"
        data-page="Dictionary_&_Slang_Button"
        className="block rounded-2xl bg-gradient-to-br from-tov-purple to-purple-700 p-5 text-white shadow-sm active:scale-[0.99]"
      >
        <h2 className="text-lg font-bold">Dictionary &amp; Slang</h2>
        <p className="text-xs text-white/80">Understand the street names. {dictionary.length} terms and counting.</p>
      </Link>

      <BackButton to="/aweh" />

      <div
        data-page="Filter Bar"
        className="fixed inset-x-0 z-40 border-t border-stone-100 bg-white px-4 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
        style={{ bottom: 'calc(45px + env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto flex max-w-2xl gap-1">
          {filterTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-colors ${
                tab === t.id ? 'bg-tov-green text-white' : 'text-stone-500 hover:bg-stone-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
