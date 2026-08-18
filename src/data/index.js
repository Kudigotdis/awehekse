import contentPillars from './content-pillars.json'
import assessments from './assessments.json'
import hotlines from './hotlines.json'
import facilities from './facilities.json'
import provinces from './provinces.json'
import tribes from './tribes.json'
import campaigns from './campaigns.json'
import lessonPlans from './lesson-plans.json'
import gameContent from './game-content.json'
import achievementRules from './achievement-rules.json'
import rehabs from './rehabs.json'
import rehabDirectory from './rehab-directory.json'
import professionals from './professionals.json'

export {
  contentPillars,
  assessments,
  hotlines,
  facilities,
  provinces,
  tribes,
  campaigns,
  lessonPlans,
  gameContent,
  achievementRules,
  rehabs,
  rehabDirectory,
  professionals
}

export const getContentByPillar = (pillar) => {
  return contentPillars.filter(item => item.pillar === pillar)
}

export const getContentById = (id) => {
  return contentPillars.find(item => item.id === id)
}

export const getAssessmentById = (id) => {
  return assessments.find(item => item.id === id)
}

export const getHotlineById = (id) => {
  return hotlines.find(item => item.id === id)
}

export const getFacilityById = (id) => {
  return facilities.find(item => item.id === id)
}

export const getFacilitiesByProvince = (province) => {
  return facilities.filter(item => item.province === province)
}

export const searchContent = (query) => {
  const q = query.toLowerCase()
  return contentPillars.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.shortDesc?.toLowerCase().includes(q) ||
    item.category?.toLowerCase().includes(q)
  )
}

export const getGameContent = (game) => {
  return gameContent.filter(item => item.id.startsWith(game))
}

export const getAchievementById = (id) => {
  return achievementRules.find(item => item.id === id)
}

export const getHotlinesByCountry = (country) => {
  return hotlines.filter(h => h.country === country || h.country === 'GLOBAL')
}

export const getFacilitiesByCountry = (country) => {
  return facilities.filter(f => f.country === country || f.country === 'GLOBAL')
}

export const getRehabsByCountry = (country) => {
  return rehabs.filter(r => r.country === country || r.country === 'GLOBAL')
}

export const getRehabDirectoryByCountry = (country) => {
  return rehabDirectory.filter(r => r.country === country || r.country === 'GLOBAL')
}

export const getProfessionalsByCountry = (country) => {
  return professionals.filter(p => p.country === country || p.country === 'GLOBAL')
}

export const getContentByRegion = (region) => {
  return contentPillars.filter(c => c.region === region || c.region === 'GLOBAL')
}
