import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { creativeContributors } from '../../data/aweh-ekse'
import BackButton from '../../components/ui/BackButton'
import fbOff from '../../assets/icons/facebook_icon_off.png'
import fbOn from '../../assets/icons/facebook_icon_on.png'
import igOff from '../../assets/icons/Instagram_Off.png'
import igOn from '../../assets/icons/Instagram_On.png'
import ttOff from '../../assets/icons/TikTok_Off.png'
import ttOn from '../../assets/icons/TikTok_On.png'
import twOff from '../../assets/icons/Twitter_Off.png'
import twOn from '../../assets/icons/Twitter_On.png'
import ytOff from '../../assets/icons/YouTube_Off.png'
import ytOn from '../../assets/icons/YouTube_On.png'
import wsOff from '../../assets/icons/Website_Off.png'
import wsOn from '../../assets/icons/Website_On.png'

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', on: fbOn, off: fbOff },
  { id: 'instagram', label: 'Instagram', on: igOn, off: igOff },
  { id: 'tiktok', label: 'TikTok', on: ttOn, off: ttOff },
  { id: 'twitter', label: 'Twitter', on: twOn, off: twOff },
  { id: 'youtube', label: 'YouTube', on: ytOn, off: ytOff },
  { id: 'website', label: 'Website', on: wsOn, off: wsOff },
]

function getInitials(name) {
  const parts = name.split(' ')
  return (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '')
}

function buildSocialUrl(platform, handle) {
  const h = handle || ''
  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${h.replace(/^@/, '')}`
    case 'tiktok':
      return `https://www.tiktok.com/${h.startsWith('@') ? h : '@' + h}`
    case 'twitter':
      return `https://x.com/${h.replace(/^@/, '')}`
    case 'facebook':
      return `https://www.facebook.com/search/top?q=${encodeURIComponent(h)}`
    case 'youtube':
      return `https://www.youtube.com/results?search_query=${encodeURIComponent(h)}`
    case 'website':
      return h.startsWith('http') ? h : `https://${h}`
    default:
      return '#'
  }
}

export default function ArtistProfile() {
  const { id } = useParams()
  const artist = creativeContributors.find(c => c.id === id)

  const [photo, setPhoto] = useState('')
  const [gallery, setGallery] = useState({})
  const fileRef = useRef(null)
  const pendingTarget = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (id) {
      setPhoto(localStorage.getItem(`cc-photo-${id}`) || '')
      try {
        setGallery(JSON.parse(localStorage.getItem(`cc-gallery-${id}`)) || {})
      } catch {
        setGallery({})
      }
    }
  }, [id])

  if (!artist) {
    return (
      <div data-page="Creative_Contributor_Profile" aria-label="Contributor Not Found" className="py-16 text-center">
        <p className="text-stone-500">Contributor not found.</p>
        <div className="mt-6">
          <BackButton to="/aweh/contributors" label="Back to Contributors" />
        </div>
      </div>
    )
  }

  const related = creativeContributors
    .filter(c => c.category === artist.category && c.id !== artist.id)
    .slice(0, 6)

  function requestImageChange(target) {
    pendingTarget.current = target
    fileRef.current?.click()
  }

  function onFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      const target = pendingTarget.current
      if (target === 'profile') {
        setPhoto(dataUrl)
        localStorage.setItem(`cc-photo-${artist.id}`, dataUrl)
      } else if (target && target.startsWith('gallery-')) {
        const idx = Number(target.replace('gallery-', ''))
        setGallery(prev => {
          const next = { ...prev, [idx]: dataUrl }
          localStorage.setItem(`cc-gallery-${artist.id}`, JSON.stringify(next))
          return next
        })
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div data-page="Creative_Contributor_Profile" aria-label={`${artist.name} Profile`} className="space-y-4">
      <div className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm">
        <button
          type="button"
          onClick={() => requestImageChange('profile')}
          title="Change profile photo"
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[20px]"
          style={{ backgroundColor: `${artist.color}22` }}
        >
          {photo ? (
            <img src={photo} alt={artist.name} className="h-full w-full object-cover" />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center text-3xl font-extrabold"
              style={{ color: artist.color }}
            >
              {getInitials(artist.name)}
            </span>
          )}
          <span className="absolute bottom-1 right-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-stone-600 shadow-sm">
            ✎
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-extrabold text-stone-800">{artist.name}</h2>
          <span className="mt-1 inline-block rounded-full bg-stone-800 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            {artist.field}
          </span>
          <p className="mt-1 text-xs text-stone-400">📍 {artist.region}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400">Bio</p>
        <p className="mt-1 text-sm leading-relaxed text-stone-600">{artist.bio}</p>
      </div>

      <div className="rounded-2xl bg-stone-50 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400">Tactical Contribution</p>
        <p className="mt-1 text-sm leading-relaxed text-stone-600">{artist.tactical}</p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400">Follow</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          {PLATFORMS.map(p => {
            const handle = artist.socials?.[p.id]
            const img = (
              <img
                src={handle ? p.on : p.off}
                alt={`${p.label} ${handle ? 'on' : 'off'}`}
                className="h-9 w-9"
                loading="lazy"
              />
            )
            return handle ? (
              <a
                key={p.id}
                href={buildSocialUrl(p.id, handle)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.label}: ${handle}`}
                className="opacity-100 transition-opacity active:scale-95"
              >
                {img}
              </a>
            ) : (
              <span key={p.id} aria-label={`${p.label} not listed`} className="opacity-40">
                {img}
              </span>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400">Gallery</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {Array.from({ length: artist.gallerySlots || 3 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => requestImageChange(`gallery-${i}`)}
              title="Change image"
              className="relative aspect-square overflow-hidden rounded-xl"
              style={{ backgroundColor: `${artist.color}22` }}
            >
              {gallery[i] ? (
                <img src={gallery[i]} alt={`${artist.name} artwork ${i + 1}`} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-3xl opacity-50" style={{ color: artist.color }}>
                  🖼️
                </span>
              )}
              <span className="absolute bottom-1 right-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-stone-600 shadow-sm">
                ✎
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-stone-400">Tap any image to change it from your device.</p>
      </div>

      {related.length > 0 && (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400">Other Contributors in this Field</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {related.map(c => (
              <Link
                key={c.id}
                to={`/aweh/contributors/${c.id}`}
                className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:bg-stone-800 hover:text-white"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

      <BackButton to="/aweh/contributors" label="Back to Contributors" />
    </div>
  )
}
