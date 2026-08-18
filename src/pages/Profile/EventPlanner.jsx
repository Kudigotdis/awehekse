import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { jsPDF } from 'jspdf'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const SMART_GUIDE = [
  { letter: 'S', word: 'Specific', tip: 'State exactly what you will do. "Host an awareness talk at the school hall."' },
  { letter: 'M', word: 'Measurable', tip: 'How will you know it worked? "Reach 50 learners, collect 40 feedback forms."' },
  { letter: 'A', word: 'Achievable', tip: 'Is it realistic with your people, budget and time?' },
  { letter: 'R', word: 'Relevant', tip: 'Does it serve your mission — protecting under-25s?' },
  { letter: 'T', word: 'Time-bound', tip: 'Give it a deadline. "By the last Friday of the term."' },
]

function emptyGoal() {
  return { specific: '', measurable: '', achievable: '', relevant: '', timebound: '' }
}

export default function EventPlanner() {
  const { activeProfile } = useActiveProfile()
  const events = useLiveQuery(() =>
    activeProfile
      ? db.plannerEvents.where('profileId').equals(activeProfile.id).reverse().sortBy('createdAt')
      : [],
    [activeProfile]
  ) || []

  const [draft, setDraft] = useState({
    title: '', date: '', venue: '', description: '',
    goals: [emptyGoal()],
    tasks: [],
  })
  const [taskText, setTaskText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [saved, setSaved] = useState(false)

  const set = (key, value) => setDraft(d => ({ ...d, [key]: value }))

  const updateGoal = (i, key, value) => {
    setDraft(d => {
      const goals = d.goals.map((g, idx) => (idx === i ? { ...g, [key]: value } : g))
      return { ...d, goals }
    })
  }

  const addGoal = () => setDraft(d => ({ ...d, goals: [...d.goals, emptyGoal()] }))
  const removeGoal = (i) => setDraft(d => ({ ...d, goals: d.goals.filter((_, idx) => idx !== i) }))

  const addTask = () => {
    if (!taskText.trim()) return
    setDraft(d => ({ ...d, tasks: [...d.tasks, { id: Date.now(), text: taskText.trim(), done: false }] }))
    setTaskText('')
  }

  const toggleTask = (id) => {
    setDraft(d => ({ ...d, tasks: d.tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)) }))
  }

  const removeTask = (id) => {
    setDraft(d => ({ ...d, tasks: d.tasks.filter(t => t.id !== id) }))
  }

  const saveEvent = async () => {
    if (!draft.title || !activeProfile) return
    const record = {
      ...draft,
      goals: draft.goals.filter(g => g.specific.trim()),
      profileId: activeProfile.id,
      createdAt: new Date().toISOString(),
    }
    if (editingId) {
      await db.plannerEvents.update(editingId, record)
    } else {
      await db.plannerEvents.add(record)
    }
    setDraft({ title: '', date: '', venue: '', description: '', goals: [emptyGoal()], tasks: [] })
    setEditingId(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const editEvent = (ev) => {
    setDraft({
      title: ev.title, date: ev.date || '', venue: ev.venue || '',
      description: ev.description || '', goals: ev.goals?.length ? ev.goals : [emptyGoal()],
      tasks: ev.tasks || [],
    })
    setEditingId(ev.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteEvent = async (id) => {
    await db.plannerEvents.delete(id)
    if (editingId === id) {
      setEditingId(null)
      setDraft({ title: '', date: '', venue: '', description: '', goals: [emptyGoal()], tasks: [] })
    }
  }

  const exportPdf = (ev) => {
    const doc = new jsPDF()
    let y = 20
    doc.setFontSize(18)
    doc.setTextColor(15, 138, 95)
    doc.text('Event Plan', 105, y, { align: 'center' })
    y += 10
    doc.setTextColor(40, 40, 40)
    doc.setFontSize(14)
    doc.text(ev.title, 15, y)
    y += 8
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    if (ev.date) { doc.text('Date: ' + ev.date, 15, y); y += 6 }
    if (ev.venue) { doc.text('Venue: ' + ev.venue, 15, y); y += 6 }
    if (ev.description) {
      const lines = doc.splitTextToSize(ev.description, 180)
      doc.text(lines, 15, y)
      y += lines.length * 5 + 4
    }
    y += 4

    if (ev.goals?.length) {
      doc.setFontSize(12)
      doc.setTextColor(15, 138, 95)
      doc.text('SMART Goals', 15, y)
      y += 6
      doc.setTextColor(40, 40, 40)
      doc.setFontSize(10)
      ev.goals.forEach((g, i) => {
        if (!g.specific) return
        doc.text(`${i + 1}. Specific: ${g.specific}`, 15, y); y += 5
        if (g.measurable) { doc.text(`   Measurable: ${g.measurable}`, 15, y); y += 5 }
        if (g.achievable) { doc.text(`   Achievable: ${g.achievable}`, 15, y); y += 5 }
        if (g.relevant) { doc.text(`   Relevant: ${g.relevant}`, 15, y); y += 5 }
        if (g.timebound) { doc.text(`   Time-bound: ${g.timebound}`, 15, y); y += 5 }
        y += 3
      })
      y += 4
    }

    if (ev.tasks?.length) {
      doc.setFontSize(12)
      doc.setTextColor(15, 138, 95)
      doc.text('Tasks', 15, y)
      y += 6
      doc.setTextColor(40, 40, 40)
      doc.setFontSize(10)
      ev.tasks.forEach(t => {
        doc.text(`${t.done ? '[x]' : '[ ]'} ${t.text}`, 15, y)
        y += 5
      })
    }

    const filename = (ev.title || 'event-plan').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    doc.save(`${filename}-plan.pdf`)
  }

  const inputCls = 'w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:border-tov-green focus:outline-none'

  return (
    <div data-page="Event_Planner_Page" aria-label="Event Planner Page" className="space-y-4">
      <Link to="/profile" className="inline-block text-sm text-tov-green hover:underline">&larr; Profile</Link>

      <div className="rounded-2xl bg-gradient-to-br from-tov-blue to-tov-blue-light p-6 text-white shadow-sm">
        <span className="text-3xl">📅</span>
        <h1 className="mt-2 text-2xl font-bold">Event Planner</h1>
        <p className="mt-1 text-sm text-white/85">Plan awareness events with SMART goals and a printable PDF.</p>
      </div>

      <div className="rounded-2xl bg-tov-gold/10 border border-tov-gold/30 p-4">
        <h3 className="text-sm font-bold text-stone-800">SMART goals</h3>
        <div className="mt-2 grid grid-cols-5 gap-2 text-center">
          {SMART_GUIDE.map(g => (
            <div key={g.letter} title={g.tip}>
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-tov-gold text-sm font-black text-white">{g.letter}</div>
              <p className="mt-1 text-[10px] font-semibold text-stone-600">{g.word}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-stone-500">{SMART_GUIDE[0].tip}</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-stone-800">{editingId ? 'Edit event' : 'New event'}</h2>
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500">Event title *</label>
              <input value={draft.title} onChange={e => set('title', e.target.value)} className={inputCls} placeholder="Anti-drug talk" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500">Date</label>
              <input type="date" value={draft.date} onChange={e => set('date', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">Venue</label>
            <input value={draft.venue} onChange={e => set('venue', e.target.value)} className={inputCls} placeholder="School hall, community centre" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">Description</label>
            <textarea value={draft.description} onChange={e => set('description', e.target.value)} rows={2} className={inputCls} placeholder="What is this event about?" />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-stone-500">SMART Goals</label>
              <button type="button" onClick={addGoal} className="text-xs font-semibold text-tov-green hover:underline">+ Add goal</button>
            </div>
            <div className="mt-2 space-y-2">
              {draft.goals.map((g, i) => (
                <div key={i} className="rounded-xl bg-stone-50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-stone-600">Goal {i + 1}</p>
                    {draft.goals.length > 1 && (
                      <button type="button" onClick={() => removeGoal(i)} className="text-xs text-tov-red hover:underline">Remove</button>
                    )}
                  </div>
                  <div className="mt-2 space-y-2">
                    <input value={g.specific} onChange={e => updateGoal(i, 'specific', e.target.value)} className={inputCls} placeholder="S — Specific: what exactly?" />
                    <input value={g.measurable} onChange={e => updateGoal(i, 'measurable', e.target.value)} className={inputCls} placeholder="M — Measurable: how will you know?" />
                    <input value={g.achievable} onChange={e => updateGoal(i, 'achievable', e.target.value)} className={inputCls} placeholder="A — Achievable: resources needed?" />
                    <input value={g.relevant} onChange={e => updateGoal(i, 'relevant', e.target.value)} className={inputCls} placeholder="R — Relevant: why it matters?" />
                    <input value={g.timebound} onChange={e => updateGoal(i, 'timebound', e.target.value)} className={inputCls} placeholder="T — Time-bound: deadline?" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">Tasks</label>
            <div className="flex gap-2">
              <input
                value={taskText}
                onChange={e => setTaskText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTask() } }}
                className={inputCls}
                placeholder="e.g. Book the hall"
              />
              <button type="button" onClick={addTask} className="shrink-0 rounded-xl bg-tov-blue px-4 text-sm font-semibold text-white">Add</button>
            </div>
            {draft.tasks.length > 0 && (
              <div className="mt-2 space-y-1">
                {draft.tasks.map(t => (
                  <div key={t.id} className="flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2">
                    <button type="button" onClick={() => toggleTask(t.id)} className="text-sm">
                      {t.done ? '✅' : '⬜'}
                    </button>
                    <span className={`flex-1 text-sm ${t.done ? 'text-stone-400 line-through' : 'text-stone-700'}`}>{t.text}</span>
                    <button type="button" onClick={() => removeTask(t.id)} className="text-xs text-tov-red">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={saveEvent}
              disabled={!draft.title || !activeProfile}
              className="flex-1 rounded-xl bg-tov-green py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saved ? '✓ Saved' : editingId ? 'Update event' : 'Save event'}
            </button>
            {!activeProfile && <p className="text-xs text-stone-400 self-center">Sign in to save</p>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-stone-800">My events</h2>
        {events.length === 0 ? (
          <p className="mt-3 py-6 text-center text-sm text-stone-400">No events planned yet. Create your first one above.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {events.map(ev => (
              <div key={ev.id} className="rounded-xl border border-stone-100 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-stone-800">{ev.title}</p>
                  <span className="text-xs text-stone-400">{ev.date || 'No date'}</span>
                </div>
                {ev.venue && <p className="text-xs text-stone-500">{ev.venue}</p>}
                {ev.goals?.length > 0 && (
                  <p className="mt-1 text-xs text-tov-blue">{ev.goals.filter(g => g.specific).length} SMART goal{ev.goals.filter(g => g.specific).length === 1 ? '' : 's'}</p>
                )}
                <div className="mt-2 flex gap-2">
                  <button onClick={() => editEvent(ev)} className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600">Edit</button>
                  <button onClick={() => exportPdf(ev)} className="rounded-lg bg-tov-green/10 px-3 py-1.5 text-xs font-semibold text-tov-green">Export PDF</button>
                  <button onClick={() => deleteEvent(ev.id)} className="rounded-lg bg-tov-red/10 px-3 py-1.5 text-xs font-semibold text-tov-red">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
