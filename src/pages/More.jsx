import { Link } from 'react-router-dom'
import { useActiveProfile } from '../context/ProfileContext'
import { useOffline } from '../context/OfflineContext'
import { getStorageEstimate } from '../core/utils/storage'
import { useState, useEffect } from 'react'

export default function More() {
  const { activeProfile } = useActiveProfile()
  const { isOnline } = useOffline()
  const [storage, setStorage] = useState(null)

  useEffect(() => {
    getStorageEstimate().then(setStorage)
  }, [])

  const menuItems = [
    { section: 'Features', items: [
      { to: '/lessons', icon: '📋', label: 'Lesson Plans', desc: 'Facilitator resources' },
      { to: '/campaign', icon: '📢', label: 'Campaign Hub', desc: 'Awareness campaigns' },
      { to: '/polls', icon: '🗳️', label: 'Honesty Zone', desc: 'Anonymous polls' },
      { to: '/research', icon: '🔬', label: 'Research Portal', desc: 'Data & surveys' },
      { to: '/games', icon: '🎮', label: 'Games', desc: 'Learn through play' },
      { to: '/achievements', icon: '🏆', label: 'Achievements', desc: 'Your badges' },
    ]},
    { section: 'Settings', items: [
      { to: '/profile/select', icon: '👤', label: 'Switch Profile', desc: 'Change active profile' },
    ]},
    { section: 'About', items: [
      { to: 'https://tovnation.org', external: true, icon: '🌍', label: 'Aweh Ekse! Website', desc: 'Visit our site' },
    ]},
  ]

  return (
    <div data-page="More_Page" aria-label="More Page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">More</h1>
        <p className="mt-1 text-sm text-stone-500">Additional features and settings</p>
      </div>

      {activeProfile && (
        <div className="rounded-2xl bg-tov-green/5 border border-tov-green/20 p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tov-green text-lg font-bold text-white">
            {activeProfile.name?.[0]}{activeProfile.surname?.[0]}
          </div>
          <div>
            <p className="font-semibold text-stone-800">{activeProfile.name} {activeProfile.surname}</p>
            <p className="text-xs text-stone-500">{activeProfile.province || 'Zimbabwe'} {activeProfile.age ? `• Age ${activeProfile.age}` : ''}</p>
          </div>
        </div>
      )}

      {menuItems.map(({ section, items }) => (
        <div key={section} className="space-y-2">
          <h3 className="text-sm font-semibold text-stone-500 uppercase">{section}</h3>
          {items.map(({ to, icon, label, desc, external, type, value, onToggle }) => (
            type === 'toggle' ? (
              <div key={label}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <span className="text-2xl">{icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-stone-800">{label}</p>
                  <p className="text-xs text-stone-400">{desc}</p>
                </div>
                <button
                  onClick={onToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-tov-green' : 'bg-stone-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ) : external ? (
              <a key={to} href={to} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <span className="text-2xl">{icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-stone-800">{label}</p>
                  <p className="text-xs text-stone-400">{desc}</p>
                </div>
                <svg className="h-4 w-4 text-stone-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            ) : (
              <Link key={to} to={to}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <span className="text-2xl">{icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-stone-800">{label}</p>
                  <p className="text-xs text-stone-400">{desc}</p>
                </div>
                <svg className="h-4 w-4 text-stone-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            )
          ))}
        </div>
      ))}

      <div className="rounded-2xl bg-stone-100 p-4 space-y-2">
        <h3 className="text-xs font-semibold text-stone-500 uppercase">Device Status</h3>
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Network</span>
          <span className={isOnline ? 'text-tov-green font-medium' : 'text-tov-red font-medium'}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        {storage && (
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Storage used</span>
            <span>{(storage.used / 1024 / 1024).toFixed(1)} MB ({storage.percentage}%)</span>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-stone-400">
        Aweh Ekse! v0.1.0 — Built with ❤️ by Aweh Ekse!
      </p>
    </div>
  )
}
