import db from '../db/schema'
import {
  contentPillars,
  gameContent,
  assessments,
  hotlines,
  facilities
} from '../../data'
import { libraryEntries } from '../../data/library'
import dictionary from '../../data/dictionary.json'
import professionals from '../../data/professionals.json'

const SEED_VERSION = 'tov-native-seed-v2'
const SEED_FLAG_KEY = '__seed_complete__'

async function isAlreadySeeded() {
  try {
    const flag = await db.downloads.get(SEED_FLAG_KEY)
    return flag && flag.downloadedAt === SEED_VERSION
  } catch {
    return false
  }
}

async function markSeeded() {
  await db.downloads.put({
    id: SEED_FLAG_KEY,
    type: 'meta',
    size: 0,
    downloadedAt: SEED_VERSION
  })
}

async function seedContent() {
  const count = await db.content.count()
  if (count > 0) return

  const records = contentPillars.map(item => ({
    id: `bundled-${item.id}`,
    pillar: item.pillar,
    category: item.category,
    ageGroup: 'all',
    title: item.name,
    body: item.content || item.shortDesc || '',
    language: 'en',
    type: 'article',
    region: item.region || 'ZW',
    json: item,
    cachedAt: new Date().toISOString()
  }))

  await db.content.bulkPut(records)
}

async function seedLibrary() {
  const count = await db.content.where('type').equals('library').count()
  if (count > 0) return

  const records = libraryEntries.map(item => ({
    id: `lib-${item.id}`,
    pillar: item.category === 'substance' ? 'Knowledge' : 'Conditioning',
    category: item.category === 'substance' ? 'Substances' : 'Conditioning Contents',
    ageGroup: 'all',
    title: item.title,
    body: '',
    language: 'en',
    type: 'library',
    json: item,
    cachedAt: new Date().toISOString()
  }))

  records.push(...dictionary.map(d => ({
    id: `dict-${d.slang.toLowerCase()}`,
    pillar: 'Knowledge',
    category: 'Dictionary',
    ageGroup: 'all',
    title: d.slang,
    body: d.meaning,
    language: 'en',
    type: 'dictionary',
    json: d,
    cachedAt: new Date().toISOString()
  })))

  await db.content.bulkPut(records)
}

async function seedProfessionals() {
  const count = await db.professionals.count()
  if (count > 0) return
  await db.professionals.bulkPut(professionals.map(p => ({ ...p, source: 'bundled' })))
}

async function seedGameContent() {
  const count = await db.content.where('type').equals('game').count()
  if (count > 0) return

  const records = gameContent.map(item => ({
    id: item.id,
    pillar: 'Knowledge',
    category: 'Games',
    ageGroup: 'all',
    title: item.id.toUpperCase(),
    body: item.text,
    language: 'en',
    type: 'game',
    json: item,
    cachedAt: new Date().toISOString()
  }))

  await db.content.bulkPut(records)
}

async function seedAssessments() {
  const count = await db.assessments.where('profileId').equals(-1).count()
  if (count > 0) return

  const records = assessments.map(item => ({
    profileId: -1,
    type: item.type,
    createdAt: new Date().toISOString(),
    score: null,
    answers: [],
    json: item
  }))

  await db.assessments.bulkPut(records)
}

async function seedHotlinesAndFacilities() {
  const hCount = await db.downloads.where('type').equals('hotline').count()
  if (hCount === 0) {
    await db.downloads.bulkPut(hotlines.map(h => ({
      id: h.id,
      type: 'hotline',
      size: 0,
      downloadedAt: new Date().toISOString(),
      json: h
    })))
  }

  const fCount = await db.downloads.where('type').equals('facility').count()
  if (fCount === 0) {
    await db.downloads.bulkPut(facilities.map(f => ({
      id: f.id,
      type: 'facility',
      size: 0,
      downloadedAt: new Date().toISOString(),
      json: f
    })))
  }
}

export async function seedAll() {
  try {
    if (await isAlreadySeeded()) {
      return { seeded: false, reason: 'Already seeded' }
    }

    await db.transaction('rw', [db.content, db.assessments, db.downloads, db.professionals], async () => {
      await seedContent()
      await seedLibrary()
      await seedGameContent()
      await seedAssessments()
      await seedHotlinesAndFacilities()
      await seedProfessionals()
    })

    await markSeeded()

    const contentCount = await db.content.count()
    const assessmentCount = await db.assessments.count()
    const downloadCount = await db.downloads.count()

    return {
      seeded: true,
      counts: {
        content: contentCount,
        assessments: assessmentCount,
        downloads: downloadCount
      }
    }
  } catch (err) {
    console.error('[Seed] Error seeding database:', err)
    return { seeded: false, error: err.message }
  }
}

export async function resetSeed() {
  try {
    await db.downloads.delete(SEED_FLAG_KEY)
    return { reset: true }
  } catch (err) {
    return { reset: false, error: err.message }
  }
}

export default seedAll
