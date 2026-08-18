import { useState } from 'react'
import { useActiveProfile } from '../context/ProfileContext'
import db from '../core/db/schema'

export function useDownload() {
  const { activeProfile } = useActiveProfile()
  const [downloading, setDownloading] = useState(false)

  const downloadContent = async (contentId, type) => {
    setDownloading(true)
    try {
      await db.downloads.put({
        profileId: activeProfile?.id,
        contentId,
        type,
        downloadedAt: new Date().toISOString()
      })
    } finally {
      setDownloading(false)
    }
  }

  const isDownloaded = async (contentId) => {
    const dl = await db.downloads.get({ profileId: activeProfile?.id, contentId })
    return !!dl
  }

  return { downloadContent, isDownloaded, downloading }
}

export function useEncryption() {
  const encrypt = async (data, key) => {
    const enc = new TextEncoder()
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const cryptoKey = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'AES-GCM' }, false, ['encrypt'])
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, enc.encode(JSON.stringify(data)))
    return { iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) }
  }

  const decrypt = async (encrypted, key) => {
    const enc = new TextEncoder()
    const dec = new TextDecoder()
    const cryptoKey = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'AES-GCM' }, false, ['decrypt'])
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(encrypted.iv) }, cryptoKey, new Uint8Array(encrypted.data))
    return JSON.parse(dec.decode(decrypted))
  }

  return { encrypt, decrypt }
}

export function useExport() {
  const exportJSON = async (tableName) => {
    const data = await db[tableName].toArray()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tov-${tableName}-export.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return { exportJSON }
}

export function useAchievement() {
  const { activeProfile } = useActiveProfile()

  const checkAndAward = async (badgeId) => {
    if (!activeProfile) return
    const existing = await db.achievements.get({ profileId: activeProfile.id, badgeId })
    if (!existing) {
      await db.achievements.put({
        profileId: activeProfile.id,
        badgeId,
        earnedAt: new Date().toISOString()
      })
    }
  }

  const hasBadge = async (badgeId) => {
    if (!activeProfile) return false
    const a = await db.achievements.get({ profileId: activeProfile.id, badgeId })
    return !!a
  }

  return { checkAndAward, hasBadge }
}

export function useGPS() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  const getCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not available')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => setError(err.message)
    )
  }

  return { location, error, getCurrentLocation }
}
