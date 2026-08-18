import { useState, useEffect, useCallback } from 'react'
import { createProfile, getProfile, getAllProfiles, updateProfile, deleteProfile, setActiveProfile, getActiveProfileId, computeAge } from '../core/auth/profileManager'

export function useProfile() {
  const [activeProfile, setActiveProfileState] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  const refreshProfiles = useCallback(async () => {
    const all = await getAllProfiles()
    setProfiles(all)
  }, [])

  const loadActive = useCallback(async () => {
    setLoading(true)
    const id = await getActiveProfileId()
    if (id) {
      const profile = await getProfile(id)
      setActiveProfileState(profile)
    }
    await refreshProfiles()
    setLoading(false)
  }, [refreshProfiles])

  useEffect(() => {
    loadActive()
  }, [loadActive])

  const switchProfile = useCallback(async (id) => {
    await setActiveProfile(id)
    const profile = await getProfile(id)
    setActiveProfileState(profile)
  }, [])

  const addProfile = useCallback(async (data) => {
    const age = computeAge(data.dob)
    const id = await createProfile({ ...data, age })
    await refreshProfiles()
    return id
  }, [refreshProfiles])

  const editProfile = useCallback(async (id, data) => {
    const age = computeAge(data.dob || activeProfile?.dob)
    await updateProfile(id, { ...data, age })
    await refreshProfiles()
    if (activeProfile?.id === id) {
      const updated = await getProfile(id)
      setActiveProfileState(updated)
    }
  }, [activeProfile, refreshProfiles])

  const logout = useCallback(async () => {
    localStorage.removeItem('tov_active_profile')
    setActiveProfileState(null)
  }, [])

  const removeProfile = useCallback(async (id) => {
    await deleteProfile(id)
    if (activeProfile?.id === id) {
      setActiveProfileState(null)
      localStorage.removeItem('tov_active_profile')
    }
    await refreshProfiles()
  }, [activeProfile, refreshProfiles])

  return { activeProfile, profiles, loading, switchProfile, addProfile, editProfile, removeProfile, logout, refreshProfiles }
}
