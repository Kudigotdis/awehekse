import { createContext, useContext, useState, useCallback } from 'react'
import sadcRegions from '../data/sadc-regions.json'

const RegionContext = createContext(null)
const STORAGE_KEY = 'tov-region'
export const FALLBACK_REGION = 'BW'

export function RegionProvider({ children }) {
  const [region, setRegion] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'BW'
  })

  const setCurrentRegion = useCallback((code) => {
    localStorage.setItem(STORAGE_KEY, code)
    setRegion(code)
  }, [])

  const current = sadcRegions.find(r => r.code === region) || sadcRegions.find(r => r.code === 'BW')

  return (
    <RegionContext.Provider value={{ region, setCurrentRegion, current, regions: sadcRegions }}>
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion() {
  const ctx = useContext(RegionContext)
  if (!ctx) throw new Error('useRegion must be used within RegionProvider')
  return ctx
}
