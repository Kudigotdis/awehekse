import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useState } from 'react'

const categories = [
  { id: 'substance-abuse', label: 'Substance Abuse', desc: 'Facts, myths, and local context', color: 'bg-tov-green', icon: '💊' },
  { id: 'mental-health', label: 'Mental Health', desc: 'Stress, depression, and coping', color: 'bg-tov-blue', icon: '🧠' },
  { id: 'intersection', label: 'How They Connect', desc: 'Why these issues overlap', color: 'bg-tov-purple', icon: '🔗' },
  { id: 'zimbabwe', label: 'Zimbabwe Context', desc: 'Local prevalence and barriers', color: 'bg-tov-orange', icon: '🇿🇼' },
  { id: 'practical', label: 'Practical Guides', desc: 'What to do in real situations', color: 'bg-tov-gold', icon: '📝' },
  { id: 'substances', label: 'Substance Library', desc: 'Detailed substance encyclopedia', color: 'bg-tov-red', icon: '📖' },
]

export default function HubHome() {
  const [search, setSearch] = useState('')
  const articles = useLiveQuery(() => db.content.toArray()) || []

  return (
    <div data-page="Information_Hub_Page" aria-label="Information Hub Page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Information Hub</h1>
        <p className="mt-1 text-sm text-stone-500">Browse evidence-based content on substances & mental health</p>
      </div>

      <Link to="/hub/search" className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-stone-400">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <span>Search articles...</span>
      </Link>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-stone-500 uppercase tracking-wide">Categories</h2>
        <div className="space-y-2">
          {categories.map(({ id, label, desc, color, icon }) => (
            <Link
              key={id}
              to={id === 'substances' ? '/hub/substances' : `/hub/category/${id}`}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} text-2xl text-white`}>
                {icon}
              </div>
              <div className="flex-1">
                <span className="font-semibold text-stone-800">{label}</span>
                <p className="text-xs text-stone-400">{desc}</p>
              </div>
              <svg className="h-5 w-5 text-stone-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      <Link to="/hub/bookmarks" className="flex items-center gap-3 rounded-2xl bg-tov-cream p-4 text-tov-green">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
        <span className="font-semibold">My Bookmarks</span>
      </Link>

      {articles.length > 0 && (
        <p className="text-center text-xs text-stone-400">{articles.length} articles available offline</p>
      )}
    </div>
  )
}
