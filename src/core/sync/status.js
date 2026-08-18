import { addToSyncQueue } from './queue'

export async function queueForSync(tableName, recordId, action = 'update') {
  if (navigator.onLine) return false
  await addToSyncQueue(tableName, recordId, action)
  return true
}

export function registerSyncListener() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => {
      if ('sync' in reg) {
        navigator.serviceWorker.addEventListener('message', event => {
          if (event.data?.type === 'SYNC_COMPLETE') {
            window.dispatchEvent(new CustomEvent('tov-sync-complete', { detail: event.data }))
          }
        })
      }
    })
  }
}

export async function triggerBackgroundSync() {
  if ('serviceWorker' in navigator && 'sync' in (await navigator.serviceWorker.ready).registration) {
    const reg = await navigator.serviceWorker.ready
    await reg.sync.register('tov-data-sync')
  }
}
