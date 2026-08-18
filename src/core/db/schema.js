import Dexie from 'dexie'

const db = new Dexie('TovNativeDB')

db.version(1).stores({
  profiles: '++id, name, createdAt',
  content: 'id, pillar, category, ageGroup, title',
  progress: '++id, profileId, moduleId, status',
  assessments: '++id, profileId, type, createdAt',
  journal: '++id, profileId, createdAt',
  moodMatrix: '++id, profileId, date, [profileId+date]',
  habitLog: '++id, profileId, date, [profileId+date]',
  safetyPlan: 'profileId',
  polls: 'id, category, createdAt',
  pollResponses: '++id, profileId, pollId, createdAt',
  habitLedger: '++id, profileId, createdAt',
  campaigns: '++id, profileId, status, createdAt',
  campaignEvents: '++id, campaignId, date',
  surveys: '++id, profileId, surveyId, createdAt',
  referrals: '++id, profileId, status, createdAt',
  achievements: '++id, profileId, badgeId',
  syncQueue: '++id, tableName, recordId, action, createdAt',
  downloads: 'id, type, size, downloadedAt',
  gameScores: '++id, profileId, gameId, createdAt',
  gameSyncCodes: 'code, gameId, createdAt'
})

db.version(2).stores({
  dateNotes: '++id, profileId, date, [profileId+date]',
  bookings: '++id, profileId, professionalId, date, createdAt',
  professionals: 'id'
})

db.version(3).stores({
  plannerEvents: '++id, profileId, createdAt',
  framed: '++id, profileId, createdAt'
})

db.version(4).stores({
  recoveryDiary: '++id, profileId, date, [profileId+date]'
})

db.version(5).stores({
  content: 'id, pillar, category, ageGroup, title, type'
})

export default db
