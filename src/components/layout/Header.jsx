import { useNavigate } from 'react-router-dom'
import { useActiveProfile } from '../../context/ProfileContext'
import { useRegion } from '../../context/RegionContext'
import badge from '../../assets/aweh_ekse_badge.webp'

export default function Header() {
  const { activeProfile } = useActiveProfile()
  const { current } = useRegion()
  const navigate = useNavigate()

  return (
    <header aria-label="App header" className="fixed top-0 inset-x-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur safe-top">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <img
            src={badge}
            alt="Aweh Ekse!"
            className="h-9 w-9 object-contain"
          />
          <span className="text-lg font-bold text-tov-blue">Aweh Ekse!</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/search')}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-stone-600 transition-colors hover:bg-stone-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>

          <button
            onClick={() => navigate('/region')}
            aria-label="Select region"
            className="flex items-center gap-1 rounded-full bg-tov-blue px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-tov-blue-light"
          >
            <span>{current.code}</span>
          </button>
        </div>
      </div>
      {activeProfile && (
        <div className="mx-auto flex max-w-2xl items-center justify-end px-4 pb-2">
          <span className="text-xs text-stone-400">
            {activeProfile.name} {activeProfile.surname}
          </span>
        </div>
      )}
    </header>
  )
}
