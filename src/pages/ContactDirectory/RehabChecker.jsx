import { useMemo, useState } from 'react'
import checker from '../../data/rehab-checker-data.json'
import BackButton from '../../components/ui/BackButton'
import useRegionFilter from '../../hooks/useRegionFilter'

const SUBSTANCES = checker.substances
const CONDITIONING = checker.conditioning
const MENTAL_HEALTH = checker.mental_health
const PROFESSIONALS = checker.professionals
const REHAB_FACILITIES = checker.rehab_facilities

const NAVY = '#1a3c6e'
const ACCENT = '#e67e22'
const GREEN = '#27ae60'
const RED = '#e74c3c'
const YELLOW = '#f1c40f'

const SUPPORT_OPTIONS = [
  'Counseling / Talking',
  'Rehab Assessment',
  'Medical Doctor / GP',
  'Psychiatrist',
  'Legal Help',
  'Police Safety',
  'Pastor / Spiritual',
  'Emergency Services',
]

const COUNTRIES = [
  ['ZW', 'Zimbabwe 🇿🇼'],
  ['ZA', 'South Africa 🇿🇦'],
  ['ZM', 'Zambia 🇿🇲'],
  ['MW', 'Malawi 🇲🇼'],
  ['BW', 'Botswana 🇧🇼'],
]

const FORMATS = ['in_person', 'phone', 'whatsapp', 'video', 'home_visit']

const RELATIONSHIPS = [
  ['friend', 'Friend'],
  ['sibling', 'Sibling'],
  ['parent', 'Parent'],
  ['child', 'Child'],
  ['partner', 'Partner'],
  ['other', 'Other'],
]

const AGE_GROUPS = [
  ['under_13', 'Under 13'],
  ['13_17', '13-17'],
  ['18_25', '18-25'],
  ['26_35', '26-35'],
  ['36_plus', '36+'],
]

const TYPE_COLORS = {
  Government: '#1a3c6e',
  Private: '#27ae60',
  NGO: '#e67e22',
}

function Progress({ step }) {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i < step ? 'bg-tov-green' : i === step ? 'bg-tov-orange' : 'bg-stone-200'}`}
        />
      ))}
    </div>
  )
}

function Btn({ color = NAVY, small = false, children, onClick, className = '' }) {
  const palette = {
    [NAVY]: 'bg-[#1a3c6e] text-white',
    [ACCENT]: 'bg-[#e67e22] text-white',
    [GREEN]: 'bg-[#27ae60] text-white',
    [RED]: 'bg-[#e74c3c] text-white',
    outline: 'border border-stone-300 bg-white text-stone-700',
  }
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl font-semibold active:scale-[0.99] ${
        small ? 'px-4 py-2 text-xs' : 'px-4 py-3.5 text-sm'
      } ${palette[color] || palette[NAVY]} ${className}`}
    >
      {children}
    </button>
  )
}

function Tag({ children, color }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ background: `${color}1A`, color }}
    >
      {children}
    </span>
  )
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-h-[80dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 animate-slide-up">
        {children}
      </div>
    </div>
  )
}

function Toast({ message }) {
  if (!message) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-6">
      <span className="rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
        {message}
      </span>
    </div>
  )
}

function Hero() {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
      <span className="text-4xl">🛡️</span>
      <h1 className="mt-2 text-xl font-bold text-stone-800">You're not alone.</h1>
      <p className="mt-1 text-sm text-stone-500">Let's figure this out together. Private, 5 minutes, no diagnosis — just clear next steps.</p>
      <p className="mt-3 text-xs text-stone-400">
        Emergency? Call <span className="font-bold text-tov-red">ZRP 999</span> | Child Helpline{' '}
        <span className="font-bold text-tov-red">116</span>
      </p>
    </div>
  )
}

function RehabTab({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800">{title}</h2>
      <div className="mt-2 space-y-3 text-sm text-stone-600">{children}</div>
    </div>
  )
}

function HighlightBox({ children }) {
  return <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-stone-700">{children}</div>
}

function YellowCard({ onStart }) {
  return (
    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
      <p className="mb-2 text-sm font-semibold text-stone-700">Do you or someone you know need Rehab?</p>
      <Btn color={ACCENT} small onClick={onStart}>
        📋 Rehab Assistance Test
      </Btn>
    </div>
  )
}

const initialTest = {
  whoFor: null,
  relationship: null,
  ageGroup: null,
  canContact: null,
  selected: { substances: [], conditioning: [], mental_health: [] },
  step: 0,
  supportTypes: [],
  country: 'ZW',
  city: 'Harare',
  area: 'Central',
  format: 'in_person',
  bookedPro: null,
  bookingDate: null,
  bookingTime: null,
  bookingFormat: 'whatsapp',
}

export default function RehabChecker() {
  const { region } = useRegionFilter()
  const [view, setView] = useState('home')
  const [test, setTest] = useState({ ...initialTest, country: region })
  const [activeList, setActiveList] = useState('substances')
  const [openGroups, setOpenGroups] = useState({})
  const [rehabCity, setRehabCity] = useState('Harare')
  const [rehabArea, setRehabArea] = useState('Central')
  const [facilityQuery, setFacilityQuery] = useState(false)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [rehabTab, setRehabTab] = useState('what')

  const showToast = msg => {
    setToast(msg)
    clearTimeout(showToast._tid)
    showToast._tid = setTimeout(() => setToast(''), 2800)
  }

  const hasCrisis = useMemo(
    () => test.selected.mental_health.some(id => MENTAL_HEALTH.find(m => m.id === id)?.crisis),
    [test.selected.mental_health]
  )

  const totalSelected = test.selected.substances.length + test.selected.conditioning.length + test.selected.mental_health.length

  const startTest = who => {
    setTest({ ...initialTest, whoFor: who })
    setView('test')
  }

  const next = back => {
    if (back) {
      setTest(t => ({ ...t, step: Math.max(0, t.step - 2) }))
      return
    }
    const step = test.step
    if (step === 0) {
      if (!test.ageGroup) return showToast('Please select age.')
      if (test.whoFor === 'someone' && !test.relationship) return showToast('Please select relationship.')
      if (test.canContact === null) return showToast('Please select contact preference.')
    }
    if (step === 1) {
      if (totalSelected === 0 && !window.confirm('No items selected. Continue anyway?')) return
      if (hasCrisis) {
        if (!window.confirm('⚠️ You selected a crisis item (self-harm/suicide). Are you safe? Press OK to continue, or Cancel to call 999.')) {
          window.location.href = 'tel:999'
          return
        }
      }
    }
    if (step === 2) {
      if (!test.city) return showToast('Please enter a city.')
      if (!test.area) return showToast('Please enter an area.')
    }
    setTest(t => ({ ...t, step: t.step + 1 }))
  }

  const toggleItem = (list, id) => {
    setTest(t => {
      const cur = t.selected[list]
      const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]
      return { ...t, selected: { ...t.selected, [list]: next } }
    })
  }

  const toggleSupport = val => {
    setTest(t => {
      const arr = t.supportTypes
      const next = arr.includes(val) ? arr.filter(s => s !== val) : [...arr, val]
      return { ...t, supportTypes: next }
    })
  }

  const generateResults = () => ({
    substances: test.selected.substances.length,
    conditioning: test.selected.conditioning.length,
    mental: test.selected.mental_health.length,
  })

  const matches = useMemo(() => {
    const sel = test.selected
    const age = test.ageGroup || '18_25'
    const city = test.city || 'Harare'
    return PROFESSIONALS.filter(p => {
      if (!p.ageGroups.includes(age)) return false
      if (p.city.toLowerCase() !== city.toLowerCase()) return false
      const subMatch = sel.substances.length === 0 || sel.substances.some(s => (p.tags.substances || []).includes(s))
      const condMatch = sel.conditioning.length === 0 || sel.conditioning.some(c => (p.tags.conditioning || []).includes(c))
      const mhMatch = sel.mental_health.length === 0 || sel.mental_health.some(m => (p.tags.mental_health || []).includes(m))
      return subMatch && condMatch && mhMatch && p.verified
    }).sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }, [test.selected, test.ageGroup, test.city])

  const selectPro = p => {
    setTest(t => ({
      ...t,
      bookedPro: p.id,
      bookingDate: new Date().toLocaleDateString(),
      bookingTime: '10:00am',
      bookingFormat: 'whatsapp',
      step: 5,
    }))
    showToast('✅ Pro selected!')
  }

  const filteredFacilities = useMemo(() => {
    if (!facilityQuery) return REHAB_FACILITIES
    const c = rehabCity.toLowerCase().trim()
    const a = rehabArea.toLowerCase().trim()
    return REHAB_FACILITIES.filter(r => {
      if (c && !r.city.toLowerCase().includes(c)) return false
      if (a && !r.area.toLowerCase().includes(a)) return false
      return true
    })
  }, [facilityQuery, rehabCity, rehabArea])

  const proTags = p => {
    const tags = [...(p.tags.substances || []), ...(p.tags.conditioning || []), ...(p.tags.mental_health || [])]
      .slice(0, 6)
      .map(t => t.replace('_', ' '))
    return tags
  }

  const openInfo = (item, list) => setModal({ type: 'info', item, list })
  const openFacility = facility => setModal({ type: 'facility', facility })

  const renderGroup = (list, groupName, groupItems, first) => {
    const key = `${list}:${groupName}`
    const open = openGroups[key] === undefined ? groupName === first : openGroups[key]
    return (
      <div key={groupName} className="overflow-hidden rounded-xl border border-stone-100">
        <button
          onClick={() => setOpenGroups(g => ({ ...g, [key]: !open }))}
          className={`flex w-full items-center justify-between bg-stone-50 px-3.5 py-2.5 text-left ${
            open ? 'border-b border-stone-100' : ''
          }`}
        >
          <span className="text-sm font-bold text-stone-700">{groupName}</span>
          <span className={`text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {open && (
          <div>
            {groupItems.map(item => (
              <div
                key={item.id}
                className={`flex items-center gap-2 border-b border-stone-50 px-3.5 py-2.5 last:border-0 ${
                  test.selected[list].includes(item.id) ? 'bg-tov-green-pale/40' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={test.selected[list].includes(item.id)}
                  onChange={() => toggleItem(list, item.id)}
                  className="h-4 w-4 accent-[#1a3c6e]"
                />
                <span className="flex-1 text-sm text-stone-700">
                  {item.crisis ? '⚠️ ' : ''}
                  {item.name}
                </span>
                <button onClick={() => openInfo(item, list)} className="text-sm text-stone-400 hover:text-tov-blue">
                  ℹ️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderChecklist = () => {
    const tabs = [
      ['substances', `Substances (${test.selected.substances.length}/${SUBSTANCES.length})`],
      ['conditioning', `Conditioning (${test.selected.conditioning.length}/${CONDITIONING.length})`],
      ['mental', `Mental Health (${test.selected.mental_health.length}/${MENTAL_HEALTH.length})`],
    ]
    return (
      <div className="space-y-3">
        <div className="flex gap-1 rounded-xl bg-stone-100 p-1">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveList(id)}
              className={`flex-1 rounded-lg px-1 py-2 text-[11px] font-semibold ${
                activeList === id ? 'bg-white text-tov-blue shadow-sm' : 'text-stone-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeList === 'substances' && (
          <div className="space-y-2">
            {['Uppers', 'Downers', 'Other'].map(group => {
              const items = SUBSTANCES.filter(s => (s.zone || 'Other') === group)
              if (items.length === 0) return null
              return renderGroup('substances', group, items, 'Uppers')
            })}
          </div>
        )}
        {activeList === 'conditioning' && (
          <div className="space-y-2">{renderGroup('conditioning', 'All', CONDITIONING, 'All')}</div>
        )}
        {activeList === 'mental' && (
          <div className="space-y-2">
            {Array.from(new Set(MENTAL_HEALTH.map(m => m.cat || 'Other'))).map((cat, idx) => {
              const items = MENTAL_HEALTH.filter(m => (m.cat || 'Other') === cat)
              return renderGroup('mental', cat, items, idx === 0 ? cat : undefined)
            })}
          </div>
        )}
      </div>
    )
  }

  const results = generateResults()
  const totalFlags = results.substances + results.conditioning + results.mental
  const status =
    totalFlags === 0
      ? { text: 'LOW RISK', color: GREEN }
      : totalFlags <= 3
        ? { text: 'MODERATE RISK', color: YELLOW }
        : { text: 'HIGH RISK', color: RED }

  const bookedPro = test.bookedPro ? PROFESSIONALS.find(p => p.id === test.bookedPro) : null

  const renderTest = () => {
    if (!test.whoFor) {
      return (
        <div className="space-y-4">
          <Hero />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => startTest('me')}
              className="rounded-2xl bg-[#1a3c6e] p-4 text-left text-white shadow-sm active:scale-[0.99]"
            >
              <p className="text-2xl">👤</p>
              <p className="mt-1.5 text-sm font-bold">Check Myself</p>
              <p className="mt-0.5 text-[11px] text-white/70">I'm concerned about me</p>
            </button>
            <button
              onClick={() => startTest('someone')}
              className="rounded-2xl bg-[#e67e22] p-4 text-left text-white shadow-sm active:scale-[0.99]"
            >
              <p className="text-2xl">👥</p>
              <p className="mt-1.5 text-sm font-bold">Check Someone I Know</p>
              <p className="mt-0.5 text-[11px] text-white/70">Friend, family, student</p>
            </button>
          </div>
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-center">
            <p className="text-xs font-semibold text-stone-700">
              "You can't force someone. But you can see clearly. This is not snitching. This is caring."
            </p>
          </div>
        </div>
      )
    }

    const step = test.step

    if (step === 0) {
      return (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-tov-blue">Step 1 of 6</p>
          <Progress step={0} />
          <h2 className="text-lg font-bold text-stone-800">Who is this for?</h2>
          <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
            <div>
              <p className="mb-1.5 text-xs font-semibold text-stone-500">Who needs help? *</p>
              <div className="flex gap-4 text-sm">
                {[
                  ['me', 'Me'],
                  ['someone', 'Someone I know'],
                ].map(([val, label]) => (
                  <label key={val} className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="testWho"
                      checked={test.whoFor === val}
                      onChange={() => setTest(t => ({ ...t, whoFor: val }))}
                      className="accent-[#1a3c6e]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            {test.whoFor === 'someone' && (
              <div>
                <p className="mb-1.5 text-xs font-semibold text-stone-500">Relationship</p>
                <select
                  value={test.relationship || ''}
                  onChange={e => setTest(t => ({ ...t, relationship: e.target.value }))}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1a3c6e]"
                >
                  <option value="">Select...</option>
                  {RELATIONSHIPS.map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <p className="mb-1.5 text-xs font-semibold text-stone-500">Age of person *</p>
              <select
                value={test.ageGroup || ''}
                onChange={e => setTest(t => ({ ...t, ageGroup: e.target.value }))}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1a3c6e]"
              >
                <option value="">Select...</option>
                {AGE_GROUPS.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold text-stone-500">Can we contact them directly?</p>
              <div className="flex gap-4 text-sm">
                {[
                  ['yes', 'Yes'],
                  ['no', 'No, Anonymous'],
                ].map(([val, label]) => (
                  <label key={val} className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="testContact"
                      checked={test.canContact === (val === 'yes')}
                      onChange={() => setTest(t => ({ ...t, canContact: val === 'yes' }))}
                      className="accent-[#1a3c6e]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <Btn onClick={() => next()}>NEXT →</Btn>
        </div>
      )
    }

    if (step === 1) {
      return (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-tov-blue">Step 2 of 6</p>
          <Progress step={1} />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-800">What are you struggling with?</h2>
            <span className="rounded-full bg-tov-green-pale px-2.5 py-1 text-xs font-bold text-tov-green">{totalSelected} selected</span>
          </div>
          <p className="text-xs text-stone-400">Select all that apply. Tap ℹ️ for details.</p>
          {hasCrisis && (
            <div className="flex items-center gap-2 rounded-xl bg-[#e74c3c] p-3 text-white">
              <span className="text-lg">⚠️</span>
              <p className="flex-1 text-xs font-semibold">If you or they are in danger, call ZRP 999 now</p>
              <button onClick={() => (window.location.href = 'tel:999')} className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#e74c3c]">
                Call Now
              </button>
            </div>
          )}
          {renderChecklist()}
          <Btn onClick={() => next()}>NEXT →</Btn>
        </div>
      )
    }

    if (step === 2) {
      return (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-tov-blue">Step 3 of 6</p>
          <Progress step={2} />
          <h2 className="text-lg font-bold text-stone-800">What kind of support do you need?</h2>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {SUPPORT_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSupport(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    test.supportTypes.includes(s) ? 'bg-[#1a3c6e] text-white' : 'border border-stone-200 text-stone-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div>
              <p className="mb-1.5 text-xs font-semibold text-stone-500">Country</p>
              <select
                value={test.country}
                onChange={e => setTest(t => ({ ...t, country: e.target.value }))}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1a3c6e]"
              >
                {COUNTRIES.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 text-xs font-semibold text-stone-500">City / Town</p>
                <input
                  value={test.city}
                  onChange={e => setTest(t => ({ ...t, city: e.target.value }))}
                  placeholder="e.g. Harare"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-[#1a3c6e]"
                />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold text-stone-500">Area / Neighbourhood</p>
                <input
                  value={test.area}
                  onChange={e => setTest(t => ({ ...t, area: e.target.value }))}
                  placeholder="e.g. Central"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-[#1a3c6e]"
                />
              </div>
            </div>
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-semibold text-stone-500">Preferred Format</p>
              <div className="flex flex-wrap gap-2">
                {FORMATS.map(f => (
                  <label key={f} className="flex items-center gap-1.5 text-xs text-stone-600">
                    <input
                      type="radio"
                      name="testFormat"
                      checked={test.format === f}
                      onChange={() => setTest(t => ({ ...t, format: f }))}
                      className="accent-[#1a3c6e]"
                    />
                    {f.replace('_', ' ').toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <Btn onClick={() => next()}>FIND PROS 🔍</Btn>
        </div>
      )
    }

    if (step === 3) {
      return (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-tov-blue">Step 4 of 6 — Results</p>
          <Progress step={3} />
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-5xl font-black text-stone-800">{totalFlags}</p>
            <p className="mt-1 text-sm text-stone-400">flags detected</p>
            <span
              className="mt-3 inline-block rounded-full px-4 py-1 text-sm font-black"
              style={{ background: `${status.color}1A`, color: status.color }}
            >
              {status.text}
            </span>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            {[
              ['Substances', results.substances],
              ['Conditioning', results.conditioning],
              ['Mental Health', results.mental],
            ].map(([label, n]) => (
              <div key={label} className="flex items-center justify-between border-b border-stone-50 py-2.5 last:border-0">
                <span className="text-sm font-semibold text-stone-700">{label}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${n > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                >
                  {n} flagged
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Btn color={GREEN} onClick={() => next()}>🤝 Find Help Now</Btn>
            <Btn color="outline" onClick={() => next(true)}>← Back to Checklist</Btn>
          </div>
        </div>
      )
    }

    if (step === 4) {
      return (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-tov-blue">Step 5 of 6 — Action Plan</p>
          <Progress step={4} />
          <h2 className="text-lg font-bold text-stone-800">Pros Who Can Help</h2>
          <p className="text-xs text-stone-400">Matched to your selections. Tap a pro to book.</p>
          {matches.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="text-3xl">🔍</p>
              <p className="mt-2 font-bold text-stone-800">No exact matches found</p>
              <p className="mt-1 text-xs text-stone-400">Try broadening your search or contact a general counselor.</p>
              <div className="mt-4">
                <Btn small color="outline" onClick={() => showToast('Broadening search...')}>Broaden Search</Btn>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {matches.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectPro(p)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm active:scale-[0.99]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1a3c6e] text-lg font-bold text-white">
                    {p.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-stone-800">{p.name}</p>
                    <p className="text-xs text-stone-400">{p.title} • {p.clinic}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {proTags(p).map((t, i) => (
                        <Tag key={i} color={NAVY}>{t}</Tag>
                      ))}
                    </div>
                    <p className="mt-1.5 text-[11px] text-stone-400">
                      📍 {p.city}, {p.area} · ⭐ {p.rating} · 🕐 {p.urgency} days
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-tov-green">{p.fee === 0 ? 'Free' : `$${p.fee}`}</span>
                </button>
              ))}
            </div>
          )}
          <div className="space-y-2">
            <Btn color={RED} small onClick={() => (window.location.href = 'tel:999')}>📞 Emergency — ZRP 999</Btn>
            <Btn color="outline" small onClick={() => showToast('Sharing results... (feature coming soon)')}>🔗 Share Results</Btn>
            <Btn color="outline" small onClick={() => setView('home')}>🏠 Go Home</Btn>
          </div>
        </div>
      )
    }

    if (step === 5 && bookedPro) {
      return (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-tov-blue">Step 6 of 6 — Confirmed ✅</p>
          <Progress step={5} />
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
            <p className="text-4xl">✅</p>
            <h2 className="mt-2 text-lg font-bold text-stone-800">Booking Confirmed!</h2>
            <p className="text-xs text-stone-400">You've taken a brave step.</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            {[
              ['Pro', bookedPro.name],
              ['Date', test.bookingDate || 'Pending'],
              ['Time', test.bookingTime || 'Pending'],
              ['Format', (test.bookingFormat || 'whatsapp').toUpperCase()],
              ['Fee', bookedPro.fee === 0 ? 'Free' : `$${bookedPro.fee}`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-stone-50 py-2.5 last:border-0">
                <span className="text-xs font-semibold text-stone-500">{label}</span>
                <span className="text-sm font-bold text-stone-800">{value}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Btn
              color={GREEN}
              onClick={() => (window.location.href = `https://wa.me/${bookedPro.whatsapp.replace(/[^0-9]/g, '')}`)}
            >
              💬 WhatsApp Pro
            </Btn>
            <Btn color="outline" small onClick={() => showToast('Follow-up reminder set for 24hrs.')}>🔔 Set Reminder</Btn>
            <Btn color="outline" small onClick={() => setView('home')}>🏠 Go Home</Btn>
          </div>
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-center">
            <p className="text-xs text-stone-600">💬 You'll get a follow-up in 24 hours. We're here for you.</p>
          </div>
        </div>
      )
    }

    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-stone-500">Something went wrong.</p>
        <div className="mt-3">
          <Btn small onClick={() => startTest('me')}>Restart Test</Btn>
        </div>
      </div>
    )
  }

  const renderRehab = () => {
    const tabs = [
      ['what', 'What'],
      ['how', 'How Commission'],
      ['when', 'When'],
      ['why', 'Why'],
      ['where', 'Where'],
    ]
    return (
      <div className="space-y-4">
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-stone-100 p-1">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setRehabTab(id)}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
                rehabTab === id ? 'bg-white text-tov-blue shadow-sm' : 'text-stone-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {rehabTab === 'what' && (
          <RehabTab title="What is Rehab?">
            <p>
              <strong>Rehabilitation</strong> (rehab) is a structured program designed to help people recover from substance
              use disorders, behavioral addictions, and mental health conditions. It's not a punishment — it's a healing space
              with professional support.
            </p>
            <HighlightBox>
              <p className="mb-1.5 font-bold text-stone-800">Types of Rehab:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li><strong>Inpatient / Residential:</strong> Live at the facility for 28–90+ days. 24/7 medical and therapeutic support.</li>
                <li><strong>Outpatient:</strong> Live at home, attend therapy sessions several times a week. Good for mild-to-moderate cases.</li>
                <li><strong>Detox:</strong> Medically supervised withdrawal. Usually 5–10 days. First step for many.</li>
                <li><strong>Dual Diagnosis:</strong> Treats both substance use and mental health conditions together.</li>
                <li><strong>Behavioural:</strong> For gambling, porn, social media, gaming — no substances, but still addictive.</li>
              </ul>
            </HighlightBox>
            <p>
              Rehab includes therapy (individual and group), medical care, life skills training, and aftercare planning. The goal
              is not just to stop using, but to build a meaningful life in recovery.
            </p>
            <YellowCard onStart={() => startTest('me')} />
          </RehabTab>
        )}

        {rehabTab === 'how' && (
          <RehabTab title="How Commission Works">
            <p>
              <strong>Getting someone committed to rehab</strong> is a legal and medical process designed to protect the
              individual and others. It varies by country, but here's how it typically works in Zimbabwe and many SADC countries:
            </p>
            <ul className="list-disc space-y-1.5 pl-4">
              <li><strong>Assessment:</strong> A licensed psychiatrist or addiction specialist must evaluate the person. They determine if the person poses a danger to themselves or others, or is unable to care for themselves due to substance use.</li>
              <li><strong>Application:</strong> A family member, guardian, or medical professional can apply to a court or mental health board for involuntary commitment. In emergencies, police or doctors can detain someone for 24–72 hours for evaluation.</li>
              <li><strong>Court Order:</strong> If the assessment shows need, a court order is issued for treatment. This is usually for 14–30 days, renewable.</li>
              <li><strong>Treatment Plan:</strong> The facility creates a personalized plan. The person has rights — they can appeal, have legal representation, and receive humane care.</li>
            </ul>
            <HighlightBox>
              <p className="mb-1.5 font-bold text-stone-800">Expected Costs (Zimbabwe estimate):</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Assessment: $50 – $150 USD</li>
                <li>Detox (7–10 days): $300 – $800 USD</li>
                <li>Inpatient Rehab (28 days): $1,500 – $5,000 USD</li>
                <li>Outpatient (per session): $15 – $50 USD</li>
                <li>Government facilities: Often free or low-cost but may have waiting lists.</li>
              </ul>
              <p className="mt-2 text-xs italic">Note: Some NGOs and faith-based organizations offer subsidized or free rehab.</p>
            </HighlightBox>
            <YellowCard onStart={() => startTest('me')} />
          </RehabTab>
        )}

        {rehabTab === 'when' && (
          <RehabTab title="When is it time for Rehab?">
            <p>It's never "too early" to seek help. But here are clear signs that rehab is necessary:</p>
            <ul className="list-disc space-y-1.5 pl-4">
              <li><strong>Loss of control:</strong> Can't stop using despite wanting to. Repeated failed attempts to quit.</li>
              <li><strong>Health problems:</strong> Physical decline, organ damage, mental health crises, overdoses.</li>
              <li><strong>Relationship damage:</strong> Losing family, friends, or jobs due to substance use or behavior.</li>
              <li><strong>Danger to self or others:</strong> Driving drunk, violence, suicidal thoughts, self-harm.</li>
              <li><strong>Withdrawal symptoms:</strong> Shakes, seizures, severe anxiety when not using.</li>
              <li><strong>Legal trouble:</strong> Arrests, DUIs, or theft to support the habit.</li>
              <li><strong>Mental health decline:</strong> Depression, paranoia, psychosis, or severe anxiety linked to use.</li>
            </ul>
            <HighlightBox>
              <p className="mb-1.5 font-bold text-[#e74c3c]">Red flags that need immediate action:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Suicidal talk or self-harm — <strong>Call 999 NOW</strong></li>
                <li>Severe withdrawal (seizures, hallucinations) — <strong>ER immediately</strong></li>
                <li>Overdose — <strong>Call 999 NOW</strong></li>
              </ul>
            </HighlightBox>
            <YellowCard onStart={() => startTest('me')} />
          </RehabTab>
        )}

        {rehabTab === 'why' && (
          <RehabTab title="Why Rehab?">
            <p><strong>Rehab saves lives.</strong> Here's why it's one of the best investments you can make for yourself or someone you love:</p>
            <ul className="list-disc space-y-1.5 pl-4">
              <li><strong>Medical safety:</strong> Withdrawal can be deadly. Rehab provides 24/7 medical monitoring.</li>
              <li><strong>Professional support:</strong> Access to psychiatrists, therapists, and addiction specialists who understand the brain science of addiction.</li>
              <li><strong>Removal from triggers:</strong> A safe, substance-free environment away from people, places, and things that enable use.</li>
              <li><strong>Peer support:</strong> Group therapy with others on the same journey. You realize you're not alone.</li>
              <li><strong>Life skills:</strong> Learn to manage stress, build healthy relationships, and find purpose without substances.</li>
              <li><strong>Aftercare planning:</strong> Rehab doesn't end at discharge. You get a plan for ongoing support.</li>
              <li><strong>Healing families:</strong> Family therapy helps repair relationships and build a support system.</li>
            </ul>
            <HighlightBox>
              <p>
                <strong>Success rates:</strong> With proper treatment and aftercare, recovery is possible. Many people go on to
                live fulfilling, substance-free lives. Relapse is part of the journey — it doesn't mean failure.
              </p>
            </HighlightBox>
            <YellowCard onStart={() => startTest('me')} />
          </RehabTab>
        )}

        {rehabTab === 'where' && (
          <RehabTab title="Where is Rehab?">
            <p>Find registered rehab facilities near you. Tap a facility to see its profile.</p>
            <div className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={rehabCity}
                  onChange={e => { setRehabCity(e.target.value); setFacilityQuery(false) }}
                  placeholder="Village / Town / City"
                  className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-[#1a3c6e]"
                />
                <input
                  value={rehabArea}
                  onChange={e => { setRehabArea(e.target.value); setFacilityQuery(false) }}
                  placeholder="Area / Neighbourhood"
                  className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-[#1a3c6e]"
                />
              </div>
              <Btn color={NAVY} small onClick={() => setFacilityQuery(true)}>🔍 Search Facilities</Btn>
            </div>
            {filteredFacilities.length === 0 ? (
              <p className="py-6 text-center text-sm text-stone-400">No facilities found. Try a different location.</p>
            ) : (
              <div className="space-y-2">
                {filteredFacilities.map(r => (
                  <button
                    key={r.id}
                    onClick={() => openFacility(r)}
                    className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm active:scale-[0.99]"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ background: TYPE_COLORS[r.type] || NAVY }}
                    >
                      {r.image}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-stone-800">{r.name}</p>
                      <p className="text-xs text-stone-400">
                        <span style={{ color: TYPE_COLORS[r.type] || NAVY }}>{r.type}</span> • {r.city}, {r.area}
                      </p>
                    </div>
                    <span className="text-stone-300">›</span>
                  </button>
                ))}
              </div>
            )}
            <YellowCard onStart={() => startTest('me')} />
          </RehabTab>
        )}
      </div>
    )
  }

  const renderPros = () => {
    if (matches.length === 0) {
      return (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-3xl">👨‍⚕️</p>
            <p className="mt-2 text-sm text-stone-400">Complete the Rehab Assistance Test to see matched professionals.</p>
          </div>
          <Btn color={NAVY} small onClick={() => setView('test')}>📋 Take the Test</Btn>
        </div>
      )
    }
    return (
      <div className="space-y-2">
        {matches.map(p => (
          <button
            key={p.id}
            onClick={() => selectPro(p)}
            className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm active:scale-[0.99]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1a3c6e] text-lg font-bold text-white">
              {p.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-stone-800">{p.name}</p>
              <p className="text-xs text-stone-400">{p.title} • {p.clinic}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {proTags(p).map((t, i) => (
                  <Tag key={i} color={NAVY}>{t}</Tag>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-stone-400">
                📍 {p.city}, {p.area} · ⭐ {p.rating} · 🕐 {p.urgency} days · {p.formats[0]}
              </p>
            </div>
            <span className="shrink-0 text-sm font-bold text-tov-green">{p.fee === 0 ? 'Free' : `$${p.fee}`}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div data-page="rehab_checker" aria-label="Rehab Checker" className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Aweh Rehab Checker</h1>
        <p className="mt-1 text-sm text-stone-500">Private, 5 minutes, no diagnosis — just clear next steps.</p>
      </div>

      <div className="flex gap-1 rounded-xl bg-stone-100 p-1">
        {[
          ['home', '🏠 Home'],
          ['rehab', '🏥 Rehab'],
          ['test', '📋 Test'],
          ['pros', '👨‍⚕️ Pros'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold ${
              view === id ? 'bg-white text-tov-blue shadow-sm' : 'text-stone-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'home' && (
        <div className="space-y-4">
          <Hero />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => startTest('me')}
              className="rounded-2xl bg-tov-green p-4 text-left text-white shadow-sm active:scale-[0.99]"
            >
              <p className="text-2xl">👤</p>
              <p className="mt-1.5 text-sm font-bold">Check Myself</p>
              <p className="mt-0.5 text-[11px] text-white/70">I'm concerned about me</p>
            </button>
            <button
              onClick={() => startTest('someone')}
              className="rounded-2xl bg-tov-blue p-4 text-left text-white shadow-sm active:scale-[0.99]"
            >
              <p className="text-2xl">👥</p>
              <p className="mt-1.5 text-sm font-bold">Check Someone I Know</p>
              <p className="mt-0.5 text-[11px] text-white/70">Friend, family, student</p>
            </button>
          </div>
          <button
            onClick={() => setView('rehab')}
            className="w-full rounded-2xl bg-white p-4 text-left shadow-sm active:scale-[0.99]"
          >
            <p className="text-sm font-bold text-stone-800">🏥 Learn About Rehab</p>
            <p className="mt-0.5 text-xs text-stone-400">What it is, how it works, when to go, and where to find help.</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['What is Rehab', 'How Commission Works', 'When', 'Why', 'Where'].map(t => (
                <Tag key={t} color={NAVY}>{t}</Tag>
              ))}
            </div>
          </button>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-bold text-[#1a3c6e]">ℹ️ Need immediate help?</p>
            <p className="mt-1 text-xs text-stone-600">If you or someone you know is in crisis, call now:</p>
            <div className="mt-3 flex gap-2">
              <Btn color={RED} small className="flex-1" onClick={() => (window.location.href = 'tel:999')}>📞 999</Btn>
              <Btn color={NAVY} small className="flex-1" onClick={() => (window.location.href = 'tel:116')}>📞 116</Btn>
            </div>
          </div>
        </div>
      )}

      {view === 'rehab' && renderRehab()}
      {view === 'test' && renderTest()}
      {view === 'pros' && (
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-stone-800">Professionals</h2>
            <p className="text-xs text-stone-400">Matched to your needs. Tap to book.</p>
          </div>
          {renderPros()}
        </div>
      )}

      <div className="rounded-2xl border border-tov-red/20 bg-tov-red/5 p-4">
        <p className="text-xs text-stone-600">
          Need immediate help? Call ZRP <span className="font-bold text-tov-red">999</span> or the Child Helpline{' '}
          <span className="font-bold text-tov-red">116</span> now.
        </p>
      </div>

      <BackButton to="/help/rehab" />

      {modal?.type === 'info' && (
        <Modal onClose={() => setModal(null)}>
          <h3 className="text-lg font-bold text-stone-800">
            {modal.item.crisis ? '⚠️ ' : ''}
            {modal.item.name}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {modal.item.cat && <Tag color={NAVY}>{modal.item.cat}</Tag>}
            {modal.item.zone && <Tag color={ACCENT}>{modal.item.zone}</Tag>}
          </div>
          <div className="mt-3 space-y-3 text-sm text-stone-600">
            <p><strong>What:</strong> {modal.item.desc}</p>
            <p><strong>Why it hooks:</strong> {modal.item.hook}</p>
            <p><strong>First step:</strong> {modal.item.step}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <Btn
              small
              color={NAVY}
              className="flex-1"
              onClick={() => {
                toggleItem(modal.list, modal.item.id)
                setModal(null)
                showToast('Added to your check.')
              }}
            >
              + Add to my check
            </Btn>
            <Btn small color="outline" onClick={() => setModal(null)}>Close</Btn>
          </div>
        </Modal>
      )}

      {modal?.type === 'facility' && (
        <Modal onClose={() => setModal(null)}>
          <div className="flex items-center gap-3">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white"
              style={{ background: TYPE_COLORS[modal.facility.type] || NAVY }}
            >
              {modal.facility.image}
            </span>
            <div>
              <h3 className="text-lg font-bold text-stone-800">{modal.facility.name}</h3>
              <p className="text-xs text-stone-400">{modal.facility.type} • {modal.facility.city}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm text-stone-600">
            <p>📍 {modal.facility.city}, {modal.facility.area}</p>
            <p>📞 {modal.facility.phone}</p>
            <p>ℹ️ {modal.facility.desc}</p>
          </div>
          <div className="mt-5 flex gap-2">
            <Btn small color={NAVY} className="flex-1" onClick={() => (window.location.href = `tel:${modal.facility.phone.replace(/[^0-9]/g, '')}`)}>
              📞 Call
            </Btn>
            <Btn small color="outline" onClick={() => setModal(null)}>Close</Btn>
          </div>
        </Modal>
      )}

      <Toast message={toast} />
    </div>
  )
}
