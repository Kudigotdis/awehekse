const STORAGE_PREFIX = 'tov-native'

export const getItem = (key) => {
  try {
    const val = localStorage.getItem(`${STORAGE_PREFIX}-${key}`)
    return val ? JSON.parse(val) : null
  } catch {
    return null
  }
}

export const setItem = (key, value) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}-${key}`, JSON.stringify(value))
  } catch {
    console.warn('Storage full or unavailable')
  }
}

export const removeItem = (key) => {
  localStorage.removeItem(`${STORAGE_PREFIX}-${key}`)
}

export const getStorageEstimate = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate()
    return {
      used: estimate.usage || 0,
      total: estimate.quota || 0,
      percentage: estimate.quota ? Math.round((estimate.usage / estimate.quota) * 100) : 0
    }
  }
  return { used: 0, total: 0, percentage: 0 }
}

export const requestPersistentStorage = async () => {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    return await navigator.storage.persist()
  }
  return false
}

export const clearAllData = () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX))
  keys.forEach(k => localStorage.removeItem(k))
}
