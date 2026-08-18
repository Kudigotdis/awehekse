import { Outlet, useLocation } from 'react-router-dom'
import { useActiveProfile } from '../../context/ProfileContext'
import BottomNav from './BottomNav'
import Header from './Header'

const HIDE_NAV_ROUTES = [
  '/profile/select',
  '/profile/create',
  '/onboarding',
  '/search',
  '/region',
  '/aweh/help/wizard',
]

export default function AppShell() {
  const { loading } = useActiveProfile()
  const location = useLocation()
  const hideNav = HIDE_NAV_ROUTES.includes(location.pathname)

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-tov-cream">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-tov-green border-t-transparent" />
          <p className="text-sm text-stone-500">Loading Aweh Ekse!...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-stone-50">
      <Header />
      <main aria-label="Main content" className="flex-1 overflow-y-auto pb-24 pt-20">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <Outlet />
        </div>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
