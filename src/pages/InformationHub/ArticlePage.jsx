import { useParams, Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import db from '../../core/db/schema'
import { contentPillars } from '../../data'

export default function ArticlePage() {
  const { id } = useParams()
  const dbArticle = useLiveQuery(() => db.content.get(id), [id])
  const bundled = contentPillars.find(c => c.id === id)
  const article = bundled || dbArticle
  const [bookmarked, setBookmarked] = useState(false)

  if (!article) {
    return (
      <div data-page="Hub_Article_Page" aria-label="Hub Article Page" className="py-8 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-tov-green border-t-transparent" />
        <p className="mt-4 text-sm text-stone-400">Loading article...</p>
      </div>
    )
  }

  const toggleBookmark = async () => {
    if (dbArticle) {
      await db.content.update(id, { bookmarked: !bookmarked })
    }
    setBookmarked(!bookmarked)
  }

  return (
    <div data-page="Hub_Article_Page" aria-label="Hub Article Page" className="space-y-6">
      <div>
        <Link to="/hub" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back</Link>
        <div className="flex items-start justify-between">
          <div>
            {article.icon && <span className="text-3xl">{article.icon}</span>}
            <h1 className="mt-2 text-2xl font-bold text-stone-800">{article.name || article.title}</h1>
          </div>
          <button onClick={toggleBookmark} className="ml-4 shrink-0 p-2">
            <svg className={`h-6 w-6 ${bookmarked ? 'fill-tov-gold text-tov-gold' : 'text-stone-300'}`} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
          </button>
        </div>
      </div>

      {(article.shortDesc || article.tldr) && (
        <div className="rounded-2xl bg-tov-green/5 border border-tov-green/20 p-4">
          <h3 className="text-xs font-semibold text-tov-green uppercase">Overview</h3>
          <p className="mt-1 text-sm text-stone-700">{article.shortDesc || article.tldr}</p>
        </div>
      )}

      {article.effects && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-stone-800">Health Effects</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {article.effects.map((e, i) => (
              <span key={i} className="rounded-full bg-red-50 px-3 py-1 text-xs text-red-600">{e}</span>
            ))}
          </div>
        </div>
      )}

      {article.myths && article.myths.length > 0 && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-stone-800">Myths vs Facts</h3>
          <div className="mt-3 space-y-3">
            {article.myths.map((m, i) => (
              <div key={i} className="rounded-xl bg-stone-50 p-4">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <p className="text-sm text-stone-600 line-through">{m.myth}</p>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <span className="text-tov-green mt-0.5">✓</span>
                  <p className="text-sm font-medium text-tov-green">{m.fact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {article.regionalContext && (
        <div className="rounded-2xl bg-tov-orange/5 border border-tov-orange/20 p-4">
          <h3 className="text-xs font-semibold text-tov-orange uppercase">Zimbabwe Context</h3>
          <p className="mt-1 text-sm text-stone-600">{article.regionalContext}</p>
        </div>
      )}

      {article.strategies && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-stone-800">Strategies</h3>
          <ul className="mt-2 space-y-1">
            {article.strategies.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-stone-600">
                <span className="text-tov-green">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {article.content && (
        <div className="prose prose-stone max-w-none">
          <p className="text-sm text-stone-600">{article.content}</p>
        </div>
      )}

      {article.body && (
        <div className="prose prose-stone max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.body }} />
        </div>
      )}

      {article.sources && article.sources.length > 0 && (
        <div className="rounded-2xl bg-stone-100 p-4">
          <h3 className="text-xs font-semibold text-stone-500 uppercase">Sources</h3>
          <ul className="mt-2 space-y-1 text-xs text-stone-500">
            {article.sources.map((src, i) => (
              <li key={i}>{typeof src === 'string' ? src : src.citation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
