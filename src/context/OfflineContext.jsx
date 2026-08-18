import { createContext, useContext, useState, useEffect } from 'react'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

const OfflineContext = createContext(null)

export function OfflineProvider({ children }) {
  const isOnline = useOnlineStatus()
  const [wasOffline, setWasOffline] = useState(!isOnline)
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true)
      const timer = setTimeout(() => setShowReconnected(false), 3000)
      return () => clearTimeout(timer)
    }
    if (!isOnline) setWasOffline(true)
    else setWasOffline(false)
  }, [isOnline, wasOffline])

  return (
    <OfflineContext.Provider value={{ isOnline, showReconnected }}>
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline() {
  const ctx = useContext(OfflineContext)
  if (!ctx) throw new Error('useOffline must be used within OfflineProvider')
  return ctx
}
