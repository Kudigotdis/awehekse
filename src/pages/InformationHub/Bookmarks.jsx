import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import db from '../../core/db/schema'

export default function Bookmarks() {
  const bookmarks = useLiveQuery(
    () => db.content.filter(c => c.bookmarked === true).toArray()
  ) || []

  return (
    <div data-page="Hub_Bookmarks_Page" aria-label="Hub Bookmarks Page" className="space-y-6">
      <Link to="/hub" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back</Link>
      <h1 className="text-2xl font-bold text-stone-800">My Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center">
          <p className="text-3xl">📚</p>
          <p className="mt-3 text-stone-500">No bookmarks yet. Tap the bookmark icon on any article to save it here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookmarks.map(article => (
            <Link
              key={article.id}
              to={`/hub/article/${article.id}`}
              className="block rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <h3 className="font-semibold text-stone-800">{article.title}</h3>
              <p className="mt-1 text-xs text-stone-400">{article.category}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
