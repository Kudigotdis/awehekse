import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActiveProfile } from '../../context/ProfileContext'
import { hashPassword } from '../../core/auth/password'

const TYPE_ICONS = {
  Student: '🎒', Teacher: '👩‍🏫', Adult: '🧑', Counselor: '🗣️', 'Law Officiate': '⚖️',
}

export default function ProfileSelect() {
  const { profiles, switchProfile } = useActiveProfile()
  const navigate = useNavigate()
  const [unlocking, setUnlocking] = useState(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSelect = async (id) => {
    await switchProfile(id)
    navigate('/')
  }

  const handleTap = async (profile) => {
    if (!profile.password) {
      await handleSelect(profile.id)
      return
    }
    setUnlocking(profile)
    setPassword('')
    setError('')
  }

  const handleUnlock = async (e) => {
    e.preventDefault()
    if (!unlocking) return
    setBusy(true)
    setError('')
    const hash = await hashPassword(password)
    if (hash === unlocking.password) {
      await handleSelect(unlocking.id)
    } else {
      setError('Incorrect password. Try again.')
      setBusy(false)
    }
  }

  return (
    <div data-page="Profile_Select_Page" aria-label="Profile Select Page" className="flex min-h-dvh flex-col bg-tov-cream px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tov-green text-2xl font-bold text-white">
            AE
          </div>
          <h1 className="text-2xl font-bold text-tov-green">Aweh Ekse!</h1>
          <p className="mt-1 text-sm text-stone-500">Who's using the app?</p>
        </div>

        <div className="space-y-3">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleTap(profile)}
              className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tov-green text-lg font-bold text-white">
                {profile.name?.[0]}{profile.surname?.[0]}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-stone-800">
                  {profile.name} {profile.surname}
                  {profile.profileType && (
                    <span className="ml-2 rounded-full bg-tov-blue/10 px-2 py-0.5 text-[10px] font-medium text-tov-blue">
                      {TYPE_ICONS[profile.profileType] || ''} {profile.profileType}
                    </span>
                  )}
                </p>
                <p className="text-xs text-stone-400">
                  {profile.username ? `@${profile.username}` : ''}
                  {profile.age ? ` • Age ${profile.age}` : ''}
                </p>
              </div>
              <svg className="h-5 w-5 text-stone-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          ))}

          <button
            onClick={() => navigate('/profile/create')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-white/50 p-4 text-stone-400 transition-all hover:border-tov-green hover:text-tov-green"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="font-medium">Create new profile</span>
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-stone-400">
          All data stays on this device. Your privacy is protected.
        </p>
      </div>

      {unlocking && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4" onClick={() => setUnlocking(null)}>
          <form
            onSubmit={handleUnlock}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-stone-800">Enter password</h2>
            <p className="mt-1 text-sm text-stone-500">
              @{unlocking.username || unlocking.name} — this unlocks your profile.
            </p>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-4 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:border-tov-green focus:outline-none"
            />
            {error && <p className="mt-2 text-sm text-tov-red">{error}</p>}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setUnlocking(null)}
                className="flex-1 rounded-xl bg-stone-100 py-3 text-sm font-semibold text-stone-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy || !password}
                className="flex-1 rounded-xl bg-tov-green py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy ? 'Checking...' : 'Unlock'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
