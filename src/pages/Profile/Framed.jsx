import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const FRAME_STYLES = {
  classic: { label: 'Classic', frame: 'border-[6px] border-tov-gold/70 shadow-lg' },
  wood: { label: 'Wood', frame: 'border-[6px] border-[#8b5a2b]/80 shadow-lg' },
  black: { label: 'Black', frame: 'border-[6px] border-stone-800 shadow-lg' },
  white: { label: 'White', frame: 'border-[6px] border-white shadow-lg' },
}

export default function Framed() {
  const { activeProfile } = useActiveProfile()
  const framed = useLiveQuery(() =>
    activeProfile
      ? db.framed.where('profileId').equals(activeProfile.id).reverse().sortBy('createdAt')
      : [],
    [activeProfile]
  ) || []

  const [caption, setCaption] = useState('')
  const [style, setStyle] = useState('classic')
  const [showPicker, setShowPicker] = useState(false)
  const [files, setFiles] = useState([])

  const handleFiles = (list) => {
    const next = []
    for (const file of list) {
      if (!file.type.startsWith('image/')) continue
      const reader = new FileReader()
      reader.onload = () => {
        next.push(reader.result)
        if (next.length === list.length) {
          setFiles(f => [...f, ...next])
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const saveFrame = async (dataUrl) => {
    if (!activeProfile) return
    await db.framed.add({
      profileId: activeProfile.id,
      image: dataUrl,
      caption: caption.trim(),
      style,
      createdAt: new Date().toISOString(),
    })
    setCaption('')
    setFiles([])
    setShowPicker(false)
  }

  const deleteFrame = async (id) => {
    await db.framed.delete(id)
  }

  const inputCls = 'w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:border-tov-green focus:outline-none'

  return (
    <div data-page="Framed_Page" aria-label="Framed Page" className="space-y-4">
      <Link to="/profile" className="inline-block text-sm text-tov-green hover:underline">&larr; Profile</Link>

      <div className="rounded-2xl bg-gradient-to-br from-tov-gold to-amber-400 p-6 text-white shadow-sm">
        <span className="text-3xl">🖼️</span>
        <h1 className="mt-2 text-2xl font-bold">Framed</h1>
        <p className="mt-1 text-sm text-white/85">Collect the moments and wins that remind you why you stay the course.</p>
      </div>

      {!activeProfile ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-stone-400">Sign in to create your gallery.</p>
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowPicker(s => !s)}
            className="w-full rounded-xl border-2 border-dashed border-stone-300 bg-white/60 py-4 text-sm font-semibold text-stone-500 hover:border-tov-gold hover:text-tov-gold"
          >
            {showPicker ? '✕ Close picker' : '+ Frame a new moment'}
          </button>

          {showPicker && (
            <div className="rounded-2xl bg-white p-4 shadow-sm animate-slide-up">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={e => handleFiles([...e.target.files])}
                className="mb-3 block w-full text-sm text-stone-500 file:mr-3 file:rounded-lg file:border-0 file:bg-tov-gold file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
              />
              <input
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className={inputCls}
                placeholder="Why does this moment matter?"
              />
              <div className="mt-3 flex gap-2">
                {Object.entries(FRAME_STYLES).map(([key, f]) => (
                  <button
                    key={key}
                    onClick={() => setStyle(key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${style === key ? 'bg-tov-gold text-white' : 'bg-stone-100 text-stone-500'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {files.length > 0 && (
                <button
                  onClick={() => saveFrame(files[0])}
                  className="mt-4 w-full rounded-xl bg-tov-gold py-3 text-sm font-semibold text-white"
                >
                  Frame this moment
                </button>
              )}
            </div>
          )}

          {framed.length === 0 && !showPicker ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="text-sm text-stone-400">No framed moments yet. Add your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {framed.map(item => {
                const frame = FRAME_STYLES[item.style] || FRAME_STYLES.classic
                return (
                  <div key={item.id} className={`overflow-hidden rounded-xl bg-stone-100 ${frame.frame}`}>
                    <div className="aspect-square">
                      <img src={item.image} alt={item.caption || 'Framed moment'} className="h-full w-full object-cover" />
                    </div>
                    {item.caption && (
                      <p className="bg-white px-2 py-2 text-center text-xs font-medium text-stone-600">{item.caption}</p>
                    )}
                    <button
                      onClick={() => deleteFrame(item.id)}
                      className="absolute mt-[-34px] ml-1 rounded-full bg-white/80 px-2 py-0.5 text-xs text-tov-red hover:bg-white"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
