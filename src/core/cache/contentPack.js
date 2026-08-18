import db from '../db/schema'

export async function installContentPack(pack) {
  await db.transaction('rw', db.content, db.downloads, async () => {
    for (const article of (pack.articles || [])) {
      await db.content.put(article)
    }
    await db.downloads.put({
      id: `content-pack-${pack.content_pack_version}`,
      type: 'content-pack',
      size: JSON.stringify(pack).length,
      downloadedAt: new Date().toISOString(),
      version: pack.content_pack_version
    })
  })
}

export async function getContentVersion() {
  const record = await db.downloads.get('content-pack-current')
  return record?.version || null
}

export async function searchContent(query) {
  const lower = query.toLowerCase()
  return db.content
    .filter(c =>
      c.title?.toLowerCase().includes(lower) ||
      c.body?.toLowerCase().includes(lower) ||
      c.tags?.some(t => t.toLowerCase().includes(lower))
    )
    .toArray()
}

export async function getContentByPillar(pillar) {
  return db.content.where('pillar').equals(pillar).toArray()
}

export async function getContentByCategory(category) {
  return db.content.where('category').equals(category).toArray()
}

export async function getContentById(id) {
  return db.content.get(id)
}

export async function bookmarkContent(id) {
  const item = await db.content.get(id)
  if (item) {
    await db.content.update(id, { bookmarked: !item.bookmarked })
  }
}

export async function getBookmarks() {
  return db.content.filter(c => c.bookmarked === true).toArray()
}

export async function getDownloadedContent() {
  return db.downloads.where('type').equals('content-pack').toArray()
}
