import { useRegion } from '../context/RegionContext'

const FALLBACK = 'BW'

export default function useRegionFilter() {
  const { region, current } = useRegion()

  const isFallback = region !== FALLBACK

  function filterByRegion(items, field = 'country') {
    if (!items || !Array.isArray(items)) return []
    return items.filter(item => item[field] === region || item[field] === FALLBACK || item[field] === 'GLOBAL')
  }

  function filterByQuizRegion(items) {
    if (!items || !Array.isArray(items)) return []
    const tagMap = { ZW: 'ZW', ZA: 'ZA', BW: 'BW' }
    const tag = tagMap[region]
    if (!tag) return items.filter(i => i.region === 'GLOBAL')
    return items.filter(i => i.region === tag || i.region === 'GLOBAL')
  }

  return { region, current, isFallback, filterByRegion, filterByQuizRegion, FALLBACK }
}
