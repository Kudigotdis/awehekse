import { useParams, Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { contentPillars } from '../../data'

const categoryMap = {
  'substance-abuse': { label: 'Substance Abuse', icon: '💊', pillars: ['Knowledge'] },
  'mental-health': { label: 'Mental Health', icon: '🧠', pillars: ['Wellbeing'] },
  'intersection': { label: 'How They Connect', icon: '🔗', pillars: [] },
  'zimbabwe': { label: 'Zimbabwe Context', icon: '🇿🇼', pillars: [] },
  'practical': { label: 'Practical Guides', icon: '📝', pillars: ['Life Skills'] },
}

export default function CategoryView() {
  const { category } = useParams()
  const dbArticles = useLiveQuery(() => db.content.where('category').equals(category).toArray(), [category]) || []

  const info = categoryMap[category] || { label: category, icon: '📄', pillars: [] }
  const bundledArticles = contentPillars.filter(c => info.pillars.includes(c.pillar))
  const allArticles = [...bundledArticles, ...dbArticles]

  return (
    <div data-page="Hub_Category_Page" aria-label="Hub Category Page" className="space-y-6">
      <div>
        <Link to="/hub" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back to Hub</Link>
        <h1 className="text-2xl font-bold text-stone-800">{info.icon} {info.label}</h1>
        <p className="mt-1 text-sm text-stone-500">{allArticles.length} articles available</p>
      </div>

      {allArticles.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center">
          <p className="text-stone-400">No articles in this category yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allArticles.map(article => (
            <Link
              key={article.id}
              to={`/hub/article/${article.id}`}
              className="block rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                {article.icon && <span className="text-2xl">{article.icon}</span>}
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-800">{article.name || article.title}</h3>
                  {article.shortDesc && <p className="mt-1 text-sm text-stone-500">{article.shortDesc}</p>}
                  {article.tldr && <p className="mt-1 text-sm text-stone-500">{article.tldr}</p>}
                  <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
                    {article.category && <span>{article.category}</span>}
                    {article.pillar && <span className="rounded-full bg-tov-green/10 px-2 py-0.5 text-tov-green">{article.pillar}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
