import { createContext, useContext, useState, useEffect } from 'react'
import { processSyncQueue, getSyncQueueCount } from '../core/sync/queue'
import { useState as useOnlineState } from 'react'

const useOnlineStatus = () => {
  const [online, setOnline] = useOnlineState(navigator.onLine)
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => setOnline(true))
    window.addEventListener('offline', () => setOnline(false))
  }
  return online
}

const SyncContext = createContext()

export function SyncProvider({ children }) {
  const isOnline = useOnlineStatus()
  const [pendingCount, setPendingCount] = useState(0)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const loadCount = async () => {
      const count = await getSyncQueueCount()
      setPendingCount(count)
    }
    loadCount()
  }, [])

  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      setSyncing(true)
      processSyncQueue(() => Promise.resolve()).then(() => {
        setSyncing(false)
        getSyncQueueCount().then(setPendingCount)
      }).catch(() => setSyncing(false))
    }
  }, [isOnline, pendingCount])

  return (
    <SyncContext.Provider value={{ isOnline, pendingCount, syncing }}>
      {children}
    </SyncContext.Provider>
  )
}

export const useSync = () => useContext(SyncContext)
