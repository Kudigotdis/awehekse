import { createContext, useContext, useCallback } from 'react'
import { useProfile } from '../hooks/useProfile'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const profileState = useProfile()

  return (
    <ProfileContext.Provider value={profileState}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useActiveProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useActiveProfile must be used within ProfileProvider')
  return ctx
}
