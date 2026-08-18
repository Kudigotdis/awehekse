import db from '../db/schema'

export async function createProfile(data) {
  const id = await db.profiles.add({
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  return id
}

export async function getProfile(id) {
  return db.profiles.get(id)
}

export async function getAllProfiles() {
  return db.profiles.toArray()
}

export async function updateProfile(id, data) {
  await db.profiles.update(id, {
    ...data,
    updatedAt: new Date().toISOString()
  })
}

export async function deleteProfile(id) {
  await db.transaction('rw', db.profiles, db.progress, db.journal, db.moodMatrix, db.recoveryDiary, db.habitLog, db.safetyPlan, db.achievements, async () => {
    await db.profiles.delete(id)
    await db.progress.where('profileId').equals(id).delete()
    await db.journal.where('profileId').equals(id).delete()
    await db.moodMatrix.where('profileId').equals(id).delete()
    await db.recoveryDiary.where('profileId').equals(id).delete()
    await db.habitLog.where('profileId').equals(id).delete()
    await db.safetyPlan.where('profileId').equals(id).delete()
    await db.achievements.where('profileId').equals(id).delete()
  })
}

export async function setActiveProfile(id) {
  localStorage.setItem('tov_active_profile', String(id))
}

export async function getActiveProfileId() {
  const id = localStorage.getItem('tov_active_profile')
  return id ? Number(id) : null
}

export function computeAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}
