import entries from './entries.json'
import dictionary from '../dictionary.json'
import { contentPillars } from '..'

export const libraryEntries = entries

export const substances = entries.filter(e => e.category === 'substance')
export const conditioningEntries = entries.filter(e => e.category === 'conditioning')

export const getLibraryEntry = id => entries.find(e => e.id === id)

export const SECTION_LABELS = {
  mechanism: 'Mechanism',
  demographics: 'Demographics',
  whyPeopleUse: 'Why People Use It',
  effects: 'Effects on Body & Brain',
  healthImpact: 'Health Impact',
  socialImpact: 'Social Impact',
  harmReduction: 'Harm Reduction & Help',
}

export const SECTION_ORDER = [
  'mechanism',
  'demographics',
  'whyPeopleUse',
  'effects',
  'healthImpact',
  'socialImpact',
  'harmReduction',
]

const ICON_MAP = {
  '1-meth': '❄️',
  '2-cocaine': '🥂',
  '3-khat': '🌿',
  '4-energy-drinks': '⚡',
  '5-heroine': '💉',
  '6-cough-syrups': '🧴',
  '7-ketamine': '🐎',
  '8-glue': '🛢️',
  '9-alcohol': '🍺',
  '10-marijuana': '🌿',
  '11-tobacco': '🚬',
  '12-vaping-e-cigarettes': '💨',
  '13-bute': '🔥',
  '14-halucenegens': '🌈',
  '15-processed-sugars': '🍭',
  '23-otc-s': '💊',
  '16-gambling': '🎰',
  '17-forex-cryto-trading': '📈',
  '18-poronography': '🚫',
  '19-dating-hookup-apps': '💘',
  '20-e-commerce-shopping': '🛒',
  '21-television': '📺',
  '22-social-media-facebook': '📘',
  '22-social-media-twitter': '🐦',
  '22-social-media-instagram': '📸',
  '22-social-media-tiktok': '🎶',
  '22-social-media-whatsapp': '💬',
}

export const entryIcon = entry => ICON_MAP[entry.id] || (entry.category === 'substance' ? '💊' : '📱')

export function entryShortDesc(entry) {
  const pillar = contentPillars.find(p => {
    const pName = p.name.toLowerCase().split(' (')[0]
    return entry.title.toLowerCase().includes(pName) || pName.includes(entry.title.toLowerCase())
  })
  if (pillar?.shortDesc) return pillar.shortDesc
  const first = entry.sections.mechanism.find(l => l.startsWith('What it is'))
  if (first) return first.replace('What it is:', '').trim().slice(0, 90)
  return `${entry.category === 'substance' ? 'Substance' : 'Conditioning'} entry`
}

export function getDictionaryEntry(slang) {
  return dictionary.find(d => d.slang === slang)
}

export function dictionarySubstanceId(substance) {
  if (!substance) return null
  const s = substance.toLowerCase().split(' (')[0]
  const entry = entries.find(e => e.title.toLowerCase().includes(s))
  return entry?.id || null
}
