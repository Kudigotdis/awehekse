import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import insights from '../../data/insights.json'
import sampleImage from '../../assets/Sample_Image.webp'
import StoryActions from '../../components/ui/StoryActions'

function renderContext(text) {
  if (!text) return null
  return text.split('\n\n').map((block, i) => {
    const boldMatch = block.match(/^\*\*(.+?)\*\*$/)
    if (boldMatch) {
      return (
        <p key={i} className="mt-3 text-sm font-semibold text-stone-700">{boldMatch[1]}</p>
      )
    }
    if (block.startsWith('- ')) {
      const items = block.split('\n').map(b => b.replace(/^-\s*/, ''))
      return (
        <ul key={i} className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-600">
          {items.map((it, j) => <li key={j}>{it}</li>)}
        </ul>
      )
    }
    return <p key={i} className="mt-3 text-sm text-stone-600">{block}</p>
  })
}

export default function ContentDetail() {
  const { id } = useParams()
  const item = insights.find(i => i.id === id)
  const [image, setImage] = useState(sampleImage)
  const fileRef = useRef(null)

  if (!item) {
    return (
      <div data-page="Insight_Context_Page" aria-label="Insights Content Detail Page" className="py-16 text-center">
        <p className="text-stone-500">Item not found.</p>
      </div>
    )
  }

  const onPickImage = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) setImage(URL.createObjectURL(file))
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div data-page="Insight_Context_Page" aria-label="Insights Content Detail Page" className="space-y-4">
      <button
        type="button"
        onClick={() => fileRef.current && fileRef.current.click()}
        className="block w-full overflow-hidden rounded-2xl"
        aria-label="Story image"
      >
        <img src={image} alt="" className="h-44 w-full object-cover" />
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickImage} />

      <div className="Detail_Text_Box rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="Text_Box_Header text-xl font-bold text-stone-800">{item.title}</h1>
        {item.excerpt && <p className="mt-2 text-sm text-stone-600">{item.excerpt}</p>}
        <div className="Text_Box_Context">{renderContext(item.context)}</div>
        {item.tags && item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.tags.map(tag => (
              <span key={tag} className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-500">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <StoryActions favKey={item.id} title={item.title} text={item.excerpt || item.context || ''} />
      </div>
    </div>
  )
}
