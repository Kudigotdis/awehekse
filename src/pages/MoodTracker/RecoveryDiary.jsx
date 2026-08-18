import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const TRIGGER_OPTIONS = [
  { id: 'friends', label: 'Specific friends' },
  { id: 'location', label: 'Certain location' },
  { id: 'social', label: 'Social media app' },
  { id: 'news', label: 'Stressful news' },
  { id: 'money', label: 'Financial anxiety' },
  { id: 'loneliness', label: 'Loneliness' },
  { id: 'boredom', label: 'Boredom' },
  { id: 'work', label: 'Work stress' },
  { id: 'relationship', label: 'Relationship issue' },
  { id: 'other', label: 'Other' },
]

const SYMPTOM_OPTIONS = [
  { id: 'tremors', label: 'Tremors' },
  { id: 'sweating', label: 'Sweating' },
  { id: 'brain_fog', label: 'Brain fog' },
  { id: 'racing_thoughts', label: 'Racing thoughts' },
  { id: 'panic', label: 'Panic attacks' },
  { id: 'nausea', label: 'Nausea' },
  { id: 'headache', label: 'Headache' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'irritability', label: 'Irritability' },
  { id: 'depressed', label: 'Depressed mood' },
]

const DISCHARGE_OPTIONS = [
  { id: 'court', label: 'Court mandate' },
  { id: 'outpatient', label: 'Outpatient check-in' },
  { id: 'therapy', label: 'Therapy appointment' },
  { id: 'support', label: 'Support group meeting' },
  { id: 'medication', label: 'Medication review' },
  { id: 'other', label: 'Other' },
]

const TRIGGER_LABELS = Object.fromEntries(TRIGGER_OPTIONS.map(t => [t.id, t.label]))
const SYMPTOM_LABELS = Object.fromEntries(SYMPTOM_OPTIONS.map(s => [s.id, s.label]))

const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDisplayDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

const emptyEntry = {
  craving: 0, triggers: [], media_time: '', media_impact: 0, sleep_hours: '',
  sleep_quality: 0, exercise: '', hydration: '', meals: '', symptoms: [],
  gratitude: '', therapy_session: false, therapy_focus: '', therapy_takeaway: '',
  discharge_tasks: [], sponsor_contact: '', incident: false, incident_details: '',
  medication_taken: false, medication_missed: false, notes: '',
}

export default function RecoveryDiary() {
  const { activeProfile } = useActiveProfile()
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [selected, setSelected] = useState(getTodayStr())
  const [sheetOpen, setSheetOpen] = useState(false)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [panicOpen, setPanicOpen] = useState(false)
  const [form, setForm] = useState({ ...emptyEntry })
  const [saving, setSaving] = useState(false)

  const entries = useLiveQuery(
    () => activeProfile
      ? db.recoveryDiary.where('profileId').equals(activeProfile.id).toArray()
      : [],
    [activeProfile]
  ) || []

  const entryMap = {}
  entries.forEach(e => { entryMap[e.date] = e })

  const monthEntries = Object.entries(entryMap).filter(([d]) => {
    const [y, m] = d.split('-').map(Number)
    return y === viewYear && m === viewMonth + 1
  })

  const totalEntries = entries.length
  const highCravingDays = monthEntries.filter(([, e]) => e.craving >= 7).length

  const streak = (() => {
    let count = 0
    const check = new Date()
    for (;;) {
      const key = `${check.getFullYear()}-${String(check.getMonth() + 1).padStart(2, '0')}-${String(check.getDate()).padStart(2, '0')}`
      if (entryMap[key]) {
        count++
        check.setDate(check.getDate() - 1)
      } else {
        break
      }
    }
    return count
  })()

  const buildCalendar = () => {
    const first = new Date(viewYear, viewMonth, 1)
    const startOffset = first.getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < startOffset; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }

  const cellDate = (day) => `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const cravingColor = (entry) => {
    if (!entry) return 'bg-stone-100'
    if (entry.craving >= 7) return 'bg-tov-red/20 text-tov-red'
    if (entry.craving >= 4) return 'bg-amber-200 text-amber-900'
    return 'bg-tov-green/15 text-tov-green'
  }

  const openDate = (date) => {
    setSelected(date)
    setForm({ ...emptyEntry, ...entryMap[date] })
    setSheetOpen(true)
  }

  const openEntry = (day) => openDate(cellDate(day))

  const editSelected = () => {
    setForm({ ...emptyEntry, ...entryMap[selected] })
    setSheetOpen(true)
  }

  const toggleInList = (key, id) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(id) ? f[key].filter(x => x !== id) : [...f[key], id],
    }))
  }

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const saveEntry = async () => {
    if (!activeProfile) return
    setSaving(true)
    const data = { ...form }
    Object.keys(data).forEach(k => {
      if (Array.isArray(data[k]) && data[k].length === 0) delete data[k]
      if (typeof data[k] === 'string' && data[k] === '') delete data[k]
      if (typeof data[k] === 'boolean' && !data[k]) delete data[k]
      if (typeof data[k] === 'number' && data[k] === 0 && k !== 'craving' && k !== 'media_impact' && k !== 'sleep_quality') delete data[k]
    })
    await db.recoveryDiary.put({
      profileId: activeProfile.id,
      date: selected,
      ...data,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    setSheetOpen(false)
  }

  const deleteEntry = async () => {
    const existing = entryMap[selected]
    if (existing) {
      await db.recoveryDiary.delete(existing.id)
    }
    setSheetOpen(false)
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) } else { setViewMonth(viewMonth - 1) }
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) } else { setViewMonth(viewMonth + 1) }
  }
  const goToday = () => {
    const t = new Date()
    setViewYear(t.getFullYear())
    setViewMonth(t.getMonth())
    setSelected(getTodayStr())
  }

  const selectedEntry = entryMap[selected]
  const selectedDisplay = formatDisplayDate(selected)

  const exportReport = () => {
    if (totalEntries === 0) return
    let report = 'AWEH EKSE! — CLINICAL REPORT\n'
    report += '='.repeat(50) + '\n'
    report += `Generated: ${new Date().toLocaleString()}\n`
    report += `Total entries: ${totalEntries}\n`
    report += '='.repeat(50) + '\n\n'
    Object.keys(entryMap).sort().forEach(d => {
      const e = entryMap[d]
      report += `📅 ${formatDisplayDate(d)}\n`
      report += `  Craving: ${e.craving !== undefined ? e.craving + '/10' : '—'}\n`
      report += `  Triggers: ${(e.triggers || []).join(', ') || 'None'}\n`
      report += `  Sleep: ${e.sleep_hours || '—'} hrs (quality: ${e.sleep_quality || '—'}/10)\n`
      report += `  Medication: ${e.medication_taken ? '✅ Taken' : e.medication_missed ? '❌ Missed' : '—'}\n`
      report += `  Therapy: ${e.therapy_session ? '✅ Attended' : '—'}\n`
      report += `  Incident: ${e.incident ? '⚠️ Reported' : 'None'}\n`
      if (e.notes) report += `  Notes: ${e.notes}\n`
      report += '\n'
    })
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tov_clinical_report_${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div data-page="Recovery_Diary_Page" aria-label="Recovery Diary Page" className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/mood" className="text-sm text-tov-green hover:underline">&larr; Mood Journal</Link>
        <button
          onClick={() => setPanicOpen(true)}
          className="rounded-full bg-tov-red px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
        >
          🆘 Emergency
        </button>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-tov-blue to-tov-blue-light p-5 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Recovery Diary</h1>
            <p className="mt-1 text-xs text-white/80">Track cravings, triggers, sleep &amp; more</p>
          </div>
          <button
            onClick={() => setAnalyticsOpen(true)}
            className="rounded-xl bg-white/15 px-3 py-2 text-sm hover:bg-white/25"
            aria-label="Analytics"
          >
            📊
          </button>
        </div>
        <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
          🔥 {streak}-day streak
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600">‹</button>
          <span className="text-sm font-semibold text-stone-800">
            {new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={goToday} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">Today</button>
            <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600">›</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((d, i) => <div key={i} className="text-center text-[10px] font-medium text-stone-400">{d}</div>)}
          {buildCalendar().map((day, i) => {
            if (day === null) return <div key={`x${i}`} />
            const date = cellDate(day)
            const entry = entryMap[date]
            return (
              <button
                key={day}
                onClick={() => openEntry(day)}
                className={`flex aspect-square items-center justify-center rounded-lg text-xs font-medium transition-all ${cravingColor(entry)} ${
                  selected === date ? 'ring-2 ring-tov-blue ring-offset-1' : ''
                } ${date === getTodayStr() ? 'ring-1 ring-tov-green/50' : ''}`}
              >
                {day}
              </button>
            )
          })}
        </div>

        <div className="mt-4 border-t border-stone-100 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-800">{selectedDisplay}</p>
              <p className="mt-0.5 text-xs text-stone-400">
                {selectedEntry
                  ? `Craving ${selectedEntry.craving}/10 · ${(selectedEntry.triggers || []).length} trigger${(selectedEntry.triggers || []).length === 1 ? '' : 's'}${selectedEntry.incident ? ' · ⚠️' : ''}`
                  : 'No entry for this day'}
              </p>
            </div>
            {selectedEntry ? (
              <div className="flex gap-2">
                <button onClick={editSelected} className="rounded-lg bg-tov-blue-pale px-3 py-1.5 text-xs font-medium text-tov-blue">✏️ Edit</button>
                <button onClick={deleteEntry} className="rounded-lg bg-tov-red/10 px-3 py-1.5 text-xs font-medium text-tov-red">🗑️</button>
              </div>
            ) : (
              <button onClick={() => openDate(selected)} className="rounded-lg bg-tov-green px-3 py-1.5 text-xs font-medium text-white">+ New</button>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={editSelected}
        className="w-full rounded-2xl bg-tov-green py-3 text-sm font-semibold text-white shadow-sm hover:bg-tov-green-light"
      >
        {selectedEntry ? '✏️ Edit Today / Selected Day' : '➕ Log Today\'s Entry'}
      </button>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-800">This month</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-tov-green/10 p-3 text-center">
            <p className="text-xl font-bold text-tov-green">{monthEntries.length}</p>
            <p className="text-[10px] text-stone-500">Days logged</p>
          </div>
          <div className="rounded-xl bg-tov-red/10 p-3 text-center">
            <p className="text-xl font-bold text-tov-red">{highCravingDays}</p>
            <p className="text-[10px] text-stone-500">High craving days</p>
          </div>
        </div>
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-0" onClick={() => setSheetOpen(false)}>
          <div
            className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-stone-200" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-800">{formatDisplayDate(selected)}</h2>
              <button onClick={() => setSheetOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500">✕</button>
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-stone-800"><span>🔥</span> Craving Intensity</div>
                <label className="mb-1 block text-xs text-stone-500">Rate your craving strength today (1 = none, 10 = overwhelming)</label>
                <input type="range" min="0" max="10" step="1" value={form.craving} onChange={e => set('craving', Number(e.target.value))} className="w-full accent-tov-blue" />
                <div className={`mt-1 text-center text-sm font-bold ${form.craving >= 7 ? 'text-tov-red' : form.craving >= 4 ? 'text-amber-600' : 'text-tov-green'}`}>{form.craving} / 10</div>
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-stone-800"><span>🎯</span> Craving Triggers</div>
                <label className="mb-2 block text-xs text-stone-500">What triggered your cravings today? (tap to select)</label>
                <div className="flex flex-wrap gap-2">
                  {TRIGGER_OPTIONS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => toggleInList('triggers', t.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        form.triggers.includes(t.id) ? 'border-tov-orange bg-orange-50 text-tov-orange' : 'border-stone-200 bg-white text-stone-600'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-stone-800"><span>📱</span> Media Consumption</div>
                <input
                  type="text"
                  value={form.media_time}
                  onChange={e => set('media_time', e.target.value)}
                  placeholder="e.g. 2.5 hours"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-tov-blue focus:outline-none"
                />
                <label className="mt-3 mb-1 block text-xs text-stone-500">Impact on mood / urges (1 = none, 10 = severe)</label>
                <input type="range" min="0" max="10" step="1" value={form.media_impact} onChange={e => set('media_impact', Number(e.target.value))} className="w-full accent-tov-blue" />
                <div className="mt-1 text-center text-sm font-bold text-stone-700">{form.media_impact} / 10</div>
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-stone-800"><span>😴</span> Sleep</div>
                <input
                  type="text"
                  value={form.sleep_hours}
                  onChange={e => set('sleep_hours', e.target.value)}
                  placeholder="Hours slept, e.g. 7.5"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-tov-blue focus:outline-none"
                />
                <label className="mt-3 mb-1 block text-xs text-stone-500">Sleep quality (1 = poor, 10 = excellent)</label>
                <input type="range" min="0" max="10" step="1" value={form.sleep_quality} onChange={e => set('sleep_quality', Number(e.target.value))} className="w-full accent-tov-blue" />
                <div className="mt-1 text-center text-sm font-bold text-stone-700">{form.sleep_quality} / 10</div>
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-stone-800"><span>🏃</span> Body &amp; Fuel</div>
                <input type="text" value={form.exercise} onChange={e => set('exercise', e.target.value)} placeholder="Exercise (type & duration), e.g. 30 min walk" className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-tov-blue focus:outline-none" />
                <input type="text" value={form.hydration} onChange={e => set('hydration', e.target.value)} placeholder="Hydration (glasses / liters), e.g. 6 glasses" className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-tov-blue focus:outline-none" />
                <input type="text" value={form.meals} onChange={e => set('meals', e.target.value)} placeholder="Meals eaten today, e.g. 3 meals, 2 snacks" className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-tov-blue focus:outline-none" />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-stone-800"><span>🩺</span> Symptoms</div>
                <label className="mb-2 block text-xs text-stone-500">Physical or psychological symptoms today</label>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOM_OPTIONS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => toggleInList('symptoms', s.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        form.symptoms.includes(s.id) ? 'border-tov-purple bg-tov-purple/10 text-tov-purple' : 'border-stone-200 bg-white text-stone-600'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-stone-800"><span>🙏</span> Gratitude</div>
                <textarea rows="2" value={form.gratitude} onChange={e => set('gratitude', e.target.value)} placeholder="One positive thing or milestone today" className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-tov-blue focus:outline-none" />
              </div>

              <div className="rounded-xl border border-tov-green/20 bg-tov-green/5 p-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-800">
                  <input type="checkbox" checked={form.therapy_session} onChange={e => set('therapy_session', e.target.checked)} className="h-4 w-4 accent-tov-green" />
                  🛋️ Had a therapy session today
                </label>
                {form.therapy_session && (
                  <div className="mt-3 space-y-2">
                    <input type="text" value={form.therapy_focus} onChange={e => set('therapy_focus', e.target.value)} placeholder="Focus of session" className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-tov-green focus:outline-none" />
                    <textarea rows="2" value={form.therapy_takeaway} onChange={e => set('therapy_takeaway', e.target.value)} placeholder="Personal takeaways" className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-tov-green focus:outline-none" />
                  </div>
                )}
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-stone-800"><span>📋</span> Tasks or conditions to track</div>
                <div className="flex flex-wrap gap-2">
                  {DISCHARGE_OPTIONS.map(o => (
                    <button
                      key={o.id}
                      onClick={() => toggleInList('discharge_tasks', o.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        form.discharge_tasks.includes(o.id) ? 'border-tov-blue bg-tov-blue-pale text-tov-blue' : 'border-stone-200 bg-white text-stone-600'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={form.sponsor_contact}
                  onChange={e => set('sponsor_contact', e.target.value)}
                  placeholder="Last contact with sponsor / peer support, e.g. Spoke today, 10am"
                  className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-tov-blue focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-tov-red/20 bg-tov-red/5 p-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-800">
                  <input type="checkbox" checked={form.incident} onChange={e => set('incident', e.target.checked)} className="h-4 w-4 accent-tov-red" />
                  ⚠️ I had a near-miss or incident
                </label>
                {form.incident && (
                  <textarea rows="2" value={form.incident_details} onChange={e => set('incident_details', e.target.value)} placeholder="Details (what happened, how you handled it)" className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-tov-red focus:outline-none" />
                )}
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-stone-800"><span>💊</span> Medication</div>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 text-sm text-stone-700">
                    <input type="checkbox" checked={form.medication_taken} onChange={e => { set('medication_taken', e.target.checked); if (e.target.checked) set('medication_missed', false) }} className="h-4 w-4 accent-tov-green" />
                    ✅ Took medication
                  </label>
                  <label className="flex items-center gap-2 text-sm text-stone-700">
                    <input type="checkbox" checked={form.medication_missed} onChange={e => { set('medication_missed', e.target.checked); if (e.target.checked) set('medication_taken', false) }} className="h-4 w-4 accent-tov-red" />
                    ❌ Missed a dose
                  </label>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-stone-800"><span>📝</span> Notes</div>
                <textarea rows="3" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="How are you feeling? What's on your mind?" className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-tov-blue focus:outline-none" />
              </div>

              <div className="space-y-2">
                <button
                  onClick={saveEntry}
                  disabled={saving || !activeProfile}
                  className="w-full rounded-2xl bg-tov-blue py-3 text-sm font-semibold text-white hover:bg-tov-blue-light disabled:opacity-50"
                >
                  {saving ? 'Saving…' : '💾 Save Entry'}
                </button>
                {selectedEntry && (
                  <button onClick={deleteEntry} className="w-full rounded-2xl border border-tov-red/30 bg-tov-red/5 py-3 text-sm font-semibold text-tov-red">
                    🗑️ Delete Entry
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {analyticsOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-0" onClick={() => setAnalyticsOpen(false)}>
          <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-stone-200" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-800">📊 Insights</h2>
              <button onClick={() => setAnalyticsOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500">✕</button>
            </div>

            {totalEntries === 0 ? (
              <div className="py-10 text-center">
                <span className="text-4xl">📊</span>
                <p className="mt-3 text-sm text-stone-500">No entries yet. Start tracking to see insights.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-tov-blue/10 p-4 text-center">
                    <p className="text-2xl font-bold text-tov-blue">{totalEntries ? (entries.reduce((s, e) => s + (e.craving || 0), 0) / totalEntries).toFixed(1) : '—'} / 10</p>
                    <p className="text-[10px] text-stone-500">Average Craving</p>
                  </div>
                  <div className="rounded-xl bg-tov-green/10 p-4 text-center">
                    <p className="text-2xl font-bold text-tov-green">
                      {entries.filter(e => e.sleep_hours).length ? (entries.filter(e => e.sleep_hours).reduce((s, e) => s + parseFloat(e.sleep_hours), 0) / entries.filter(e => e.sleep_hours).length).toFixed(1) : '—'}
                    </p>
                    <p className="text-[10px] text-stone-500">Avg Sleep (hrs)</p>
                  </div>
                  <div className="rounded-xl bg-tov-purple/10 p-4 text-center">
                    <p className="text-2xl font-bold text-tov-purple">
                      {entries.filter(e => e.medication_taken !== undefined).length
                        ? Math.round((entries.filter(e => e.medication_taken).length / entries.filter(e => e.medication_taken !== undefined).length) * 100)
                        : '—'}%
                    </p>
                    <p className="text-[10px] text-stone-500">Medication Adherence</p>
                  </div>
                  <div className="rounded-xl bg-tov-red/10 p-4 text-center">
                    <p className="text-2xl font-bold text-tov-red">{entries.filter(e => e.craving >= 7).length}</p>
                    <p className="text-[10px] text-stone-500">High-Craving Days (≥7)</p>
                  </div>
                </div>

                {(() => {
                  const triggerCounts = {}
                  const symptomCounts = {}
                  entries.forEach(e => (e.triggers || []).forEach(t => { triggerCounts[t] = (triggerCounts[t] || 0) + 1 }))
                  entries.forEach(e => (e.symptoms || []).forEach(s => { symptomCounts[s] = (symptomCounts[s] || 0) + 1 }))
                  const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0]
                  const topSymptom = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0]
                  return (
                    <>
                      {topTrigger && (
                        <div className="mt-3 rounded-xl bg-white p-4 shadow-sm">
                          <p className="text-xs text-stone-500">🎯 Most Common Trigger</p>
                          <p className="mt-1 font-semibold text-stone-800">{TRIGGER_LABELS[topTrigger[0]] || topTrigger[0]}</p>
                          <p className="text-xs text-stone-400">Reported {topTrigger[1]} time{topTrigger[1] > 1 ? 's' : ''}</p>
                        </div>
                      )}
                      {topSymptom && (
                        <div className="mt-3 rounded-xl bg-white p-4 shadow-sm">
                          <p className="text-xs text-stone-500">🩺 Most Common Symptom</p>
                          <p className="mt-1 font-semibold text-stone-800">{SYMPTOM_LABELS[topSymptom[0]] || topSymptom[0]}</p>
                          <p className="text-xs text-stone-400">Reported {topSymptom[1]} time{topSymptom[1] > 1 ? 's' : ''}</p>
                        </div>
                      )}
                    </>
                  )
                })()}

                <button onClick={exportReport} className="mt-4 w-full rounded-2xl border border-tov-blue bg-tov-blue-pale/50 py-3 text-sm font-semibold text-tov-blue">
                  📄 Export Clinical Report
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {panicOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPanicOpen(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl" onClick={e => e.stopPropagation()}>
            <span className="text-5xl">🆘</span>
            <h2 className="mt-3 text-lg font-bold text-stone-800">You are not alone</h2>
            <p className="mt-1 text-sm text-stone-500">If you're in crisis, reach out to someone who can help right now.</p>
            <div className="mt-4 space-y-2">
              <a href="tel:+2638001234" className="block rounded-2xl bg-tov-red p-4 text-sm font-semibold text-white">📞 +263 800 1234 — National Crisis Line</a>
              <a href="tel:+263712345678" className="block rounded-2xl border border-tov-red/30 bg-tov-red/5 p-4 text-sm font-semibold text-tov-red">📞 +263 71 234 5678 — 24/7 Support</a>
            </div>
            <button onClick={() => setPanicOpen(false)} className="mt-4 w-full rounded-2xl bg-stone-100 py-3 text-sm font-semibold text-stone-600">
              I'm safe for now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
