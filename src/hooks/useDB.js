import { useLiveQuery } from 'dexie-react-hooks'
import db from '../core/db/schema'

export function useDB() {
  const profiles = useLiveQuery(() => db.profiles.toArray())
  const content = useLiveQuery(() => db.content.toArray())
  const progress = useLiveQuery(() => db.progress.toArray())
  const achievements = useLiveQuery(() => db.achievements.toArray())
  const syncQueueCount = useLiveQuery(() => db.syncQueue.count())

  return { db, profiles, content, progress, achievements, syncQueueCount }
}
