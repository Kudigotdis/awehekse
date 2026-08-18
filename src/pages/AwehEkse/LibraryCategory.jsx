import { Link, useParams } from 'react-router-dom'
import { substances, conditioningEntries, entryIcon, entryShortDesc } from '../../data/library'
import { contentPillars } from '../../data'
import BackButton from '../../components/ui/BackButton'

const categories = {
  substances: {
    title: 'Substances',
    desc: 'Drugs, alcohol, tobacco & more',
    icon: '💊',
    list: () => substances,
    linkTo: s => `/aweh/library/substances/${s.id}`,
  },
  conditioning: {
    title: 'Conditioning',
    desc: 'Contents that condition behaviour',
    icon: '📱',
    list: () => conditioningEntries,
    linkTo: c => `/aweh/library/conditioning/${c.id}`,
  },
  'mental-health': {
    title: 'Mental Health',
    desc: 'Minds, moods & coping',
    icon: '🧠',
    list: () => contentPillars.filter(c => c.category !== 'Substances'),
    linkTo: m => `/aweh/library/mental-health/${m.id}`,
  },
}

export default function LibraryCategory() {
  const { category } = useParams()
  const cat = categories[category]

  if (!cat) {
    return (
      <div data-page="Library_Category_Page" aria-label="Library Category Page" className="py-16 text-center">
        <p className="text-stone-500">Category not found.</p>
        <BackButton to="/aweh/library" />
      </div>
    )
  }

  const items = cat.list()

  return (
    <div data-page="Library_Category_Page" aria-label="Library Category Page" className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">{cat.title}</h1>
        <p className="mt-1 text-sm text-stone-500">{cat.desc}</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-200 p-10 text-center">
          <p className="text-sm text-stone-500">No entries here yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <Link
              key={item.id}
              to={cat.linkTo(item)}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm active:scale-[0.99]"
            >
              <span className="text-2xl">{item.icon || entryIcon(item)}</span>
              <div className="flex-1">
                <p className="font-semibold text-stone-800">{item.title || item.name}</p>
                <p className="text-xs text-stone-400">{item.shortDesc || entryShortDesc(item)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <BackButton to="/aweh/library" />
    </div>
  )
}
