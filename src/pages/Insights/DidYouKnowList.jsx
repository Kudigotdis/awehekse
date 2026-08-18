import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRegion } from '../../context/RegionContext'
import insights from '../../data/insights.json'

export default function DidYouKnowList() {
  const { region } = useRegion()

  const items = useMemo(() => {
    return insights.filter(i => {
      if (i.type !== 'did-you-know') return false
      if (!region) return true
      return i.country === region || i.country === 'GLOBAL'
    })
  }, [region])

  return (
    <div data-page="Did_You_Know_Page" aria-label="Did You Know Page" className="space-y-4">
      <div>
        <Link to="/" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-stone-800">Did You Know?</h1>
        <p className="mt-1 text-sm text-stone-500">25 deep, factually recorded stories on Addictive Substances, Conditioning Contents and Mental Health.</p>
      </div>

      <div className="Insights_Cards_Listed space-y-3">
        {items.map((item, i) => (
          <Link
            key={item.id}
            to={`/insights/did-you-know/${item.id}`}
            className="Insight_Card flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tov-green text-sm font-bold text-white">
              {i + 1}
            </span>
            <div className="flex-1">
              <h3 className="font-semibold text-stone-800">{item.title}</h3>
              <p className="mt-0.5 text-xs text-stone-500">{item.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-tov-cream p-4 text-center text-xs text-stone-500">
        Each story is supported by at least 5 credible, recorded sources.
      </div>
    </div>
  )
}
