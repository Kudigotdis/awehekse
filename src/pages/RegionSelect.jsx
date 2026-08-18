import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegion } from '../context/RegionContext'
import { useActiveProfile } from '../context/ProfileContext'
import Modal from '../components/ui/Modal'

const AVAILABLE = ['BW', 'ZW']

export default function RegionSelect() {
  const navigate = useNavigate()
  const { regions, region, setCurrentRegion } = useRegion()
  const { activeProfile } = useActiveProfile()
  const [showUnavailable, setShowUnavailable] = useState(false)
  const [unavailableName, setUnavailableName] = useState('')

  const sortedRegions = useMemo(() => {
    const available = regions.filter(r => AVAILABLE.includes(r.code))
    const unavailable = regions.filter(r => !AVAILABLE.includes(r.code))
    return [...available, ...unavailable]
  }, [regions])

  const select = (code, name) => {
    if (!AVAILABLE.includes(code)) {
      setUnavailableName(name)
      setShowUnavailable(true)
      return
    }
    setCurrentRegion(code)
    navigate('/')
  }

  return (
    <div data-page="Region_Select_Page" aria-label="Region Select Page" className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-sm text-tov-green hover:underline">&larr; Back</button>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Select Region</h1>
        <p className="mt-1 text-sm text-stone-500">SADC countries. Your region adjusts the content that loads into the app.</p>
      </div>
      {!activeProfile && (
        <div className="rounded-2xl border border-tov-orange/30 bg-tov-orange/5 p-4">
          <p className="text-sm font-medium text-tov-orange">Create a profile to select a region</p>
          <p className="mt-1 text-xs text-stone-600">A profile is required to save your region selection.</p>
          <button onClick={() => navigate('/profile')}
            className="mt-3 rounded-xl bg-tov-orange px-4 py-2 text-sm font-semibold text-white">
            Login / Create Profile
          </button>
        </div>
      )}
      <div className="space-y-2">
        {sortedRegions.map(r => {
          const isAvailable = AVAILABLE.includes(r.code)
          return (
            <button
              key={r.code}
              onClick={() => select(r.code, r.name)}
              className={`flex w-full items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99] ${
                !isAvailable ? 'opacity-50' : ''
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 text-2xl">
                {r.flag}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-stone-800">{r.name}</p>
                <p className="text-xs text-stone-400">{r.code}</p>
              </div>
              {region === r.code && (
                <svg className="h-5 w-5 text-tov-green" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </button>
          )
        })}
      </div>

      <Modal isOpen={showUnavailable} onClose={() => setShowUnavailable(false)} title="Region Unavailable">
        <p className="text-sm text-stone-600">
          Content for <span className="font-semibold">{unavailableName}</span> is not available yet. We're working on bringing tailored content to this region soon.
        </p>
        <button
          onClick={() => setShowUnavailable(false)}
          className="mt-4 w-full rounded-xl bg-tov-green px-4 py-2.5 text-sm font-semibold text-white"
        >
          Got it
        </button>
      </Modal>
    </div>
  )
}
