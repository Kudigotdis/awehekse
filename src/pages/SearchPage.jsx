import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../core/db/schema'
import insights from '../data/insights.json'
import { contentPillars } from '../data'
import { libraryEntries, entryIcon, entryShortDesc } from '../data/library'

export default function SearchPage() {
  const [query, setQuery] = useState('')

  const dbResults = useLiveQuery(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return db.content
      .filter(c =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q)
      )
      .limit(20)
      .toArray()
  }, [query]) || []

  const q = query.toLowerCase()
  const insightResults = q
    ? insights.filter(i => i.title.toLowerCase().includes(q) || i.excerpt.toLowerCase().includes(q))
    : []
  const pillarResults = q
    ? contentPillars.filter(p => p.name.toLowerCase().includes(q) || p.shortDesc?.toLowerCase().includes(q))
    : []
  const libraryResults = q
    ? libraryEntries.filter(e => e.title.toLowerCase().includes(q) || entryShortDesc(e).toLowerCase().includes(q))
    : []

  return (
    <div data-page="Search_Page" aria-label="Search Page" className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm text-tov-green hover:underline">&larr; Back</Link>
        <span className="text-sm text-stone-400">Search</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {!query.trim() ? (
          <div className="py-16 text-center">
            <p className="text-stone-400">Search substances, conditions, stories &amp; more.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {libraryResults.length > 0 && (
              <section>
                <h2 className="mb-2 text-xs font-semibold text-stone-400 uppercase">Library</h2>
                <div className="space-y-2">
                  {libraryResults.map(e => (
                    <Link
                      key={e.id}
                      to={e.category === 'substance' ? `/aweh/library/substances/${e.id}` : `/aweh/library/conditioning/${e.id}`}
                      className="block rounded-xl bg-white p-3 shadow-sm"
                    >
                      <p className="text-sm font-medium text-stone-800">{entryIcon(e)} {e.title}</p>
                      <p className="text-xs text-stone-500">{entryShortDesc(e)}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {pillarResults.length > 0 && (
              <section>
                <h2 className="mb-2 text-xs font-semibold text-stone-400 uppercase">Substances &amp; Topics</h2>
                <div className="space-y-2">
                  {pillarResults.map(p => (
                    <Link key={p.id} to={`/aweh/library/substances/${p.id}`} className="block rounded-xl bg-white p-3 shadow-sm">
                      <p className="text-sm font-medium text-stone-800">{p.icon} {p.name}</p>
                      <p className="text-xs text-stone-500">{p.shortDesc}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {insightResults.length > 0 && (
              <section>
                <h2 className="mb-2 text-xs font-semibold text-stone-400 uppercase">Stories &amp; News</h2>
                <div className="space-y-2">
                  {insightResults.map(i => (
                    <Link key={i.id} to={`/insights/item/${i.id}`} className="block rounded-xl bg-white p-3 shadow-sm">
                      <p className="text-sm font-medium text-stone-800">{i.title}</p>
                      <p className="text-xs text-stone-500">{i.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {dbResults.length > 0 && (
              <section>
                <h2 className="mb-2 text-xs font-semibold text-stone-400 uppercase">Saved Content</h2>
                <div className="space-y-2">
                  {dbResults.map(c => (
                    <Link key={c.id} to="/" className="block rounded-xl bg-white p-3 shadow-sm">
                      <p className="text-sm font-medium text-stone-800">{c.title}</p>
                      <p className="text-xs text-stone-500">{c.category}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {pillarResults.length === 0 && insightResults.length === 0 && dbResults.length === 0 && libraryResults.length === 0 && (
              <p className="py-12 text-center text-sm text-stone-400">No results for "{query}".</p>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-30 mx-auto max-w-2xl px-4">
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search the app..."
          className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm shadow-lg focus:border-tov-blue focus:outline-none"
        />
      </div>
    </div>
  )
}
