import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegion } from '../../context/RegionContext'
import insights from '../../data/insights.json'

const TYPE_META = {
  news: { label: 'News', color: 'bg-tov-blue/10 text-tov-blue' },
  blog: { label: 'Blogs', color: 'bg-tov-gold/15 text-yellow-700' },
  podcast: { label: 'PodCast', color: 'bg-tov-purple/10 text-tov-purple' },
  notice: { label: 'Notices', color: 'bg-tov-orange/10 text-tov-orange' },
  'did-you-know': { label: 'Did You Know', color: 'bg-tov-green/10 text-tov-green' },
}

const FILTER_TYPES = ['news', 'blog', 'podcast', 'notice', 'did-you-know']

export default function InsightsHome() {
  const navigate = useNavigate()
  const { region } = useRegion()
  const [activeType, setActiveType] = useState(null)
  const [activeTag, setActiveTag] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showTags, setShowTags] = useState(false)

  const regionInsights = useMemo(() => {
    if (!region) return insights
    return insights.filter(i => i.country === region || i.country === 'GLOBAL')
  }, [region])

  const allTags = useMemo(() => {
    const set = new Set()
    for (const item of regionInsights) for (const tag of item.tags || []) set.add(tag)
    return [...set].sort()
  }, [regionInsights])

  const items = useMemo(() => {
    let list = activeType ? regionInsights.filter(i => i.type === activeType) : regionInsights
    if (activeTag) list = list.filter(i => (i.tags || []).includes(activeTag))
    return list
  }, [activeType, activeTag, regionInsights])

  const headerText = activeTag
    ? `Up to date information. Tagged: ${activeTag}`
    : activeType
      ? `Up to date information. Showing ${(TYPE_META[activeType]?.label || 'feed').toLowerCase()}`
      : 'Up to date information.'

  return (
    <div data-page="Insights_Page" aria-label="Insights Page" className="space-y-6 pb-2">
      <div className="Insights_Header rounded-2xl bg-gradient-to-br from-tov-green to-tov-green-light p-6 text-white">
        <h1 className="text-xl font-bold">Insights</h1>
        <p className="mt-1 text-sm text-white/80">{headerText}</p>
      </div>

      <div className="Insights_Cards_Listed space-y-3">
        {items.map(item => {
          const meta = TYPE_META[item.type] || TYPE_META.blog
          return (
            <Link
              key={item.id}
              to={item.type === 'did-you-know' ? `/insights/did-you-know/${item.id}` : `/insights/item/${item.id}`}
              className="Insight_Card block rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.color}`}>{meta.label}</span>
              </div>
              <h3 className="mt-2 font-semibold text-stone-800">{item.title}</h3>
              <p className="mt-1 text-sm text-stone-500">{item.excerpt}</p>
            </Link>
          )
        })}

        {items.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-stone-400">No {activeType || activeTag} items yet.</p>
          </div>
        )}
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={() => { setShowFilters(false); setShowTags(false) }}>
          <div
            className="Insights_Filter_Menu absolute bottom-16 left-0 right-0 mx-auto max-w-2xl rounded-t-2xl bg-white p-4 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {!showTags ? (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-stone-500 uppercase">Filter content</h3>
                  <button
                    onClick={() => setShowTags(true)}
                    className="text-xs font-medium text-tov-green hover:underline"
                  >
                    Tags
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {FILTER_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => { setActiveType(activeType === t ? null : t); setShowFilters(false) }}
                      className={`rounded-xl px-3 py-2 text-left text-sm font-medium ${
                        activeType === t ? 'bg-tov-blue text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {TYPE_META[t].label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <button
                    onClick={() => setShowTags(false)}
                    className="text-sm font-semibold text-stone-500 uppercase"
                  >
                    &larr; Filter content
                  </button>
                  <span className="text-xs font-medium text-stone-400">{allTags.length} tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => { setActiveTag(activeTag === tag ? null : tag); setShowFilters(false); setShowTags(false) }}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        activeTag === tag ? 'bg-tov-blue text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-16 left-0 right-0 z-30 mx-auto max-w-2xl px-4">
        <div className="Insights_Filter flex items-center justify-around rounded-2xl bg-stone-200/90 px-2 py-2 backdrop-blur">
          <button
            onClick={() => setShowFilters(true)}
            className={`Listed_Detail_Cards_Filter rounded-xl px-6 py-2 text-sm font-semibold ${activeType || activeTag ? 'bg-tov-blue text-white' : 'text-stone-700'}`}
          >
            Filter
          </button>
          <button
            onClick={() => navigate('/insights/calendar')}
            className="rounded-xl px-6 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-300"
          >
            Calendar
          </button>
        </div>
      </div>
    </div>
  )
}
