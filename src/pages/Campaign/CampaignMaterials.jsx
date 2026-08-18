import { Link } from 'react-router-dom'
import { useState } from 'react'

const materials = [
  { id: 'poster-1', name: 'Aweh Ekse! Poster Pack', type: 'PDF', size: '2.3 MB', category: 'Print' },
  { id: 'poster-2', name: 'Myth vs Fact Cards', type: 'PDF', size: '1.1 MB', category: 'Print' },
  { id: 'social-1', name: 'Social Media Templates', type: 'ZIP', size: '5.4 MB', category: 'Digital' },
  { id: 'video-1', name: 'Campaign Launch Video', type: 'MP4', size: '12.8 MB', category: 'Video' },
  { id: 'guide-1', name: 'Facilitator Guide', type: 'PDF', size: '890 KB', category: 'Guide' },
  { id: 'kit-1', name: 'Field Kit (Complete)', type: 'ZIP', size: '18.2 MB', category: 'Kit' },
  { id: 'kit-2', name: 'School Activation Kit', type: 'ZIP', size: '8.5 MB', category: 'Kit' },
  { id: 'podcast-1', name: 'Podcast Discussion Guide', type: 'PDF', size: '420 KB', category: 'Guide' },
]

const categories = ['All', 'Print', 'Digital', 'Video', 'Guide', 'Kit']

export default function CampaignMaterials() {
  const [filter, setFilter] = useState('All')
  const [downloaded, setDownloaded] = useState({})

  const filtered = filter === 'All' ? materials : materials.filter(m => m.category === filter)

  const toggleDownload = (id) => {
    setDownloaded(d => ({ ...d, [id]: !d[id] }))
  }

  return (
    <div data-page="Campaign_Materials_Page" aria-label="Campaign Materials Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/campaign" className="text-sm text-tov-green hover:underline">&larr; Back</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">Campaign Materials</h1>
      <p className="text-sm text-stone-500">Download materials for offline use.</p>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              filter === c ? 'bg-tov-green text-white' : 'bg-stone-100 text-stone-600'
            }`}>{c}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(m => (
          <div key={m.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
            <span className="text-2xl">
              {m.type === 'PDF' ? '📄' : m.type === 'ZIP' ? '📦' : m.type === 'MP4' ? '🎬' : '📁'}
            </span>
            <div className="flex-1">
              <p className="font-medium text-stone-800">{m.name}</p>
              <p className="text-xs text-stone-400">{m.type} • {m.size}</p>
            </div>
            <button onClick={() => toggleDownload(m.id)}
              className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                downloaded[m.id]
                  ? 'bg-tov-green/10 text-tov-green'
                  : 'bg-tov-green text-white hover:bg-tov-green/80'
              }`}>
              {downloaded[m.id] ? '✓ Saved' : 'Save Offline'}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-stone-400">
        Saved materials are stored in your device's offline cache.
      </p>
    </div>
  )
}
