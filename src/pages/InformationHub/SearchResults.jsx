import { useState } from 'react'
import { Link } from 'react-router-dom'
import { searchContent } from '../../core/cache/contentPack'

export default function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    const hits = await searchContent(query.trim())
    setResults(hits)
    setSearched(true)
  }

  return (
    <div data-page="Hub_Search_Page" aria-label="Hub Search Page" className="space-y-6">
      <Link to="/hub" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back to Hub</Link>
      <h1 className="text-2xl font-bold text-stone-800">Search</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text" value={query} onChange={e => setQuery(e.target.value)}
          className="flex-1 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm focus:border-tov-green focus:outline-none"
          placeholder="Search articles, substances, topics..."
          autoFocus
        />
        <button type="submit" className="rounded-xl bg-tov-green px-4 py-2.5 text-sm font-medium text-white">
          Search
        </button>
      </form>

      {searched && results.length === 0 && (
        <p className="text-center text-sm text-stone-400">No results found for "{query}"</p>
      )}

      <div className="space-y-2">
        {results.map(article => (
          <Link
            key={article.id}
            to={`/hub/article/${article.id}`}
            className="block rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <h3 className="font-semibold text-stone-800">{article.title}</h3>
            {article.tldr && <p className="mt-1 text-sm text-stone-500 line-clamp-2">{article.tldr}</p>}
            <span className="mt-1 inline-block text-xs text-tov-green">{article.category}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
