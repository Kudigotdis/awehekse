import { useState } from 'react'
import { Link } from 'react-router-dom'
import guide from '../../data/recovery-guide.json'

const ICON_MAP = {
  crystal: '💎', leaf: '🌿', bolt: '⚡', drop: '💧', moon: '🌙', wind: '🌬️',
  sparkle: '✨', flame: '🔥', capsule: '💊', phone: '📱', controller: '🎮',
  'heart-outline': '💚', bag: '👜', dice: '🎲', chart: '📈', screen: '🖥️',
  radio: '📻', music: '🎵', 'cloud-rain': '🌧️', scale: '⚖️', sun: '☀️',
  zigzag: '📉', 'heart-pulse': '💓', eye: '👁️', door: '🚪', shield: '🛡️',
  compass: '🧭', feather: '🪶', bandage: '🩹', utensils: '🍽️', target: '🎯',
  puzzle: '🧩', book: '📖', refresh: '🔄', mirror: '🪞', box: '📦',
  brain: '🧠', layers: '🗂️',
}

const TOOL_BUTTONS = {
  'urge-timer': { label: '⏱️ Run 15-min urge timer', action: 'urge' },
  'taper-log': { label: '📊 Open step-down logger', action: 'taper' },
}

export default function RecoveryGuide() {
  const [domain, setDomain] = useState('substances')
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [search, setSearch] = useState('')
  const [showCrisis, setShowCrisis] = useState(false)

  const domains = guide.domains
  const issues = guide.issues.filter(i => i.domain === domain)
  const groupOrder = guide.groupOrder[domain] || []

  const filtered = search.trim()
    ? issues.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        (i.slang || []).some(s => s.toLowerCase().includes(search.toLowerCase())))
    : issues

  const renderModuleBody = (html) => {
    if (!html) return null
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  }

  if (selectedIssue) {
    const details = guide.details[selectedIssue.id]
    const generic = guide.genericTemplates[selectedIssue.domain]
    const modules = details ? details.modules : (generic || [])
    return (
      <div data-page="Recovery_Guide_Issue_Page" aria-label="Recovery Guide Issue Page" className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedIssue(null)} className="text-sm text-tov-green hover:underline">
            &larr; Back to guide
          </button>
          <Link to="/mood" className="text-xs text-tov-green hover:underline">Mood Journal</Link>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-tov-blue to-tov-blue-light p-5 text-white shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{ICON_MAP[selectedIssue.icon] || '🧠'}</span>
            <div>
              <h1 className="text-xl font-bold">{selectedIssue.title}</h1>
              {selectedIssue.slang && selectedIssue.slang.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedIssue.slang.map(s => (
                    <span key={s} className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px]">"{s}"</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {modules.map((m, i) => {
          const tool = TOOL_BUTTONS[m.tool]
          return (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-stone-800">{i + 1}. {m.title}</h3>
                {tool && (
                  <button
                    onClick={() => setShowCrisis(true)}
                    className="rounded-full bg-tov-blue-pale px-3 py-1.5 text-[10px] font-semibold text-tov-blue"
                  >
                    {tool.label}
                  </button>
                )}
              </div>
              <p className="mb-2 text-xs font-medium text-stone-500">🎯 {m.goal}</p>
              <div className="guide-body space-y-2 text-sm leading-relaxed text-stone-700">{renderModuleBody(m.body)}</div>
              {m.inputs && m.inputs.length > 0 && (
                <div className="mt-3 rounded-xl bg-tov-blue-pale/50 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-stone-400">Recording inputs</p>
                  {m.inputs.map((inp, j) => (
                    <p key={j} className="text-xs text-stone-600">
                      {inp.type === 'scale' ? '📏' : inp.type === 'baseline' ? '🧪' : '📝'} {inp.label}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        <button
          onClick={() => setShowCrisis(true)}
          className="w-full rounded-2xl bg-tov-red py-3 text-sm font-semibold text-white shadow-sm hover:bg-tov-red/90"
        >
          🚨 Emergency Crisis Protocol
        </button>

        {showCrisis && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowCrisis(false)}>
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-stone-800">🚨 {guide.riskProtocol.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{guide.riskProtocol.body}</p>
              <div className="mt-4 space-y-2">
                {guide.riskProtocol.numbers.map((n, i) => (
                  <div key={i} className="rounded-xl bg-tov-red/5 p-3">
                    <p className="text-xs text-stone-500">{n.label}</p>
                    <p className="font-semibold text-tov-red">{n.value}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowCrisis(false)} className="mt-4 w-full rounded-2xl bg-stone-100 py-3 text-sm font-semibold text-stone-600">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div data-page="Recovery_Guide_Page" aria-label="Recovery Guide Page" className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/mood" className="text-sm text-tov-green hover:underline">&larr; Mood Journal</Link>
        <button onClick={() => setShowCrisis(true)} className="rounded-full bg-tov-red px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
          🆘 Emergency
        </button>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-tov-green to-tov-green-light p-5 text-white shadow-sm">
        <h1 className="text-2xl font-bold">Recovery Guide</h1>
        <p className="mt-1 text-xs text-white/80">Small steps. Steady ground.</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {domains.map(d => (
          <button
            key={d.id}
            onClick={() => { setDomain(d.id); setSearch('') }}
            className={`rounded-2xl border-2 p-3 text-center transition-colors ${
              domain === d.id
                ? 'border-tov-blue bg-tov-blue-pale text-tov-blue'
                : 'border-stone-100 bg-white text-stone-600'
            }`}
          >
            <p className="text-sm font-semibold">{d.short}</p>
            <p className="text-[10px] text-stone-400">{d.count} topics</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="mb-2 text-xs font-medium text-stone-500">{domains.find(d => d.id === domain).tagline}</p>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search issues…"
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-tov-green focus:outline-none"
        />
      </div>

      {groupOrder.map(group => {
        const groupIssues = filtered.filter(i => i.group === group)
        if (groupIssues.length === 0) return null
        return (
          <section key={group}>
            <h3 className="mb-2 text-sm font-semibold text-stone-500 uppercase tracking-wide">{group}</h3>
            <div className="space-y-2">
              {groupIssues.map(issue => (
                <button
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tov-blue-pale text-xl">
                    {ICON_MAP[issue.icon] || '🧠'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-stone-800">{issue.title}</p>
                    {issue.slang && issue.slang.length > 0 && (
                      <p className="mt-0.5 text-[10px] text-stone-400">aka {issue.slang.join(' · ')}</p>
                    )}
                  </div>
                  <svg className="h-4 w-4 text-stone-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ))}
            </div>
          </section>
        )
      })}

      {filtered.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-stone-400">No issues found. Try a different search.</p>
        </div>
      )}

      <div className="rounded-2xl bg-tov-blue-pale/60 p-4 text-xs text-stone-500">
        <b className="text-tov-blue">This is not a substitute for care.</b> The Recovery Guide supports self-guided and
        facilitator-led work. Always involve a qualified health professional for medical concerns.
      </div>

      {showCrisis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowCrisis(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-stone-800">🚨 {guide.riskProtocol.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{guide.riskProtocol.body}</p>
            <div className="mt-4 space-y-2">
              {guide.riskProtocol.numbers.map((n, i) => (
                <div key={i} className="rounded-xl bg-tov-red/5 p-3">
                  <p className="text-xs text-stone-500">{n.label}</p>
                  <p className="font-semibold text-tov-red">{n.value}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowCrisis(false)} className="mt-4 w-full rounded-2xl bg-stone-100 py-3 text-sm font-semibold text-stone-600">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
