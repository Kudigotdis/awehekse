import { useParams } from 'react-router-dom'
import { getLibraryEntry, SECTION_LABELS, SECTION_ORDER, entryIcon } from '../../data/library'
import { contentPillars } from '../../data'
import BackButton from '../../components/ui/BackButton'
function renderLine(line, i) {
  const isSubhead =
    /^(Short-term|Long-term|Withdrawal|Brain|Body|What it is|How it works|Treatment|The|Money|Excitement|Social|Escape|Skill|Marketing|Accessibility)/.test(line) &&
    (line.endsWith(':') || line.endsWith(':'))
  if (isSubhead || /^(Brain|Body|Short-term effects|Long-term)/.test(line)) {
    return (
      <p key={i} className="mt-3 text-sm font-bold text-stone-800 first:mt-0">{line}</p>
    )
  }
  const colon = line.indexOf(':')
  if (colon > 0 && colon < 30) {
    const label = line.slice(0, colon)
    const rest = line.slice(colon + 1).trim()
    return (
      <div key={i} className="mt-2 flex gap-2 text-sm text-stone-600 first:mt-0">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tov-blue" />
        <p><span className="font-semibold text-stone-800">{label}:</span> {rest}</p>
      </div>
    )
  }
  return (
    <p key={i} className="mt-2 text-sm text-stone-600 first:mt-0">{line}</p>
  )
}

export default function LibraryDetail() {
  const { id } = useParams()
  const entry = getLibraryEntry(id)
  const pillar = entry ? null : contentPillars.find(c => c.id === id)
  const headerTitle = entry?.title || pillar?.name || null

  if (!headerTitle) {
    return (
      <div data-page="Library_Detail_Page" aria-label="Library Detail Page" className="py-16 text-center">
        <p className="text-stone-500">Entry not found.</p>
        <BackButton to="/aweh/library" />
      </div>
    )
  }

  if (pillar) {
    return (
      <div data-page="Library_Detail_Page" aria-label="Library Detail Page" className="space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{pillar.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-stone-800">{pillar.name}</h1>
              <p className="text-xs text-stone-400">{pillar.category}</p>
            </div>
          </div>
          {pillar.shortDesc && <p className="mt-3 text-sm text-stone-600">{pillar.shortDesc}</p>}
        </div>
        {pillar.effects?.length > 0 && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wide text-tov-blue">Effects</h2>
            <div className="mt-2 flex flex-wrap gap-1">
              {pillar.effects.map((e, i) => (
                <span key={i} className="rounded-full bg-red-50 px-2 py-1 text-[11px] text-red-600">{e}</span>
              ))}
            </div>
          </div>
        )}
        {pillar.myths?.length > 0 && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wide text-tov-blue">Myths vs Facts</h2>
            {pillar.myths.map((m, i) => (
              <div key={i} className="mt-2 rounded-xl bg-stone-50 p-3">
                <p className="text-xs text-red-600 line-through">{m.myth}</p>
                <p className="mt-1 text-xs font-medium text-tov-green">{m.fact}</p>
              </div>
            ))}
          </div>
        )}
        {pillar.regionalContext && (
          <div className="rounded-2xl bg-tov-orange/5 border border-tov-orange/20 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wide text-tov-orange">Regional Context</h2>
            <p className="mt-1 text-xs text-stone-600">{pillar.regionalContext}</p>
          </div>
        )}
        <BackButton to="/aweh/library" />
      </div>
    )
  }

  return (
    <div data-page="Library_Detail_Page" aria-label="Library Detail Page" className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{entryIcon(entry)}</span>
          <div>
            <h1 className="text-xl font-bold text-stone-800">{entry.title}</h1>
            <p className="text-xs text-stone-400">
              {entry.category === 'substance' ? 'Addictive Substance' : 'Conditioning Content'}
            </p>
          </div>
        </div>
      </div>

      {SECTION_ORDER.map(section => {
        const lines = entry.sections[section]
        if (!lines || lines.length === 0) return null
        const isHarm = section === 'harmReduction'
        return (
          <div key={section} className={`rounded-2xl bg-white p-5 shadow-sm ${isHarm ? 'border border-tov-green/20' : ''}`}>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isHarm ? 'bg-tov-green' : 'bg-tov-blue'}`} />
              <h2 className={`text-sm font-bold uppercase tracking-wide ${isHarm ? 'text-tov-green' : 'text-tov-blue'}`}>
                {SECTION_LABELS[section]}
              </h2>
            </div>
            <div className="mt-2">
              {lines.map(renderLine)}
            </div>
          </div>
        )
      })}

      <div className="rounded-2xl bg-tov-orange/5 border border-tov-orange/20 p-4">
        <p className="text-xs text-stone-600">
          This information is educational. We are not doctors. If you or someone you know needs help, reach out through the Help! flow or a local health service.
        </p>
      </div>

      <BackButton to="/aweh/library" />
    </div>
  )
}
