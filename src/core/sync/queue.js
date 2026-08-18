import db from '../db/schema'

export async function addToSyncQueue(tableName, recordId, action) {
  await db.syncQueue.add({
    tableName,
    recordId,
    action,
    createdAt: new Date().toISOString(),
    retries: 0
  })
}

export async function getPendingSyncItems() {
  return db.syncQueue.orderBy('createdAt').toArray()
}

export async function removeSyncItem(id) {
  await db.syncQueue.delete(id)
}

export async function incrementRetry(id) {
  const item = await db.syncQueue.get(id)
  if (item) {
    await db.syncQueue.update(id, { retries: (item.retries || 0) + 1 })
  }
}

export async function processSyncQueue(syncFn) {
  const items = await getPendingSyncItems()
  for (const item of items) {
    try {
      await syncFn(item)
      await removeSyncItem(item.id)
    } catch {
      await incrementRetry(item.id)
      if ((item.retries || 0) >= 5) await removeSyncItem(item.id)
    }
  }
  return items.length
}

export async function getSyncQueueCount() {
  return db.syncQueue.count()
}

export async function clearSyncQueue() {
  await db.syncQueue.clear()
}
