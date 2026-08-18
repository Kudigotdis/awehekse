import { useState } from 'react'
import { Link } from 'react-router-dom'
import { bondingActivities, obstacleCourse } from '../../data/organise-activities'

export default function OrganiseActivities({ type }) {
  const list = type === 'obstacle-course' ? obstacleCourse : bondingActivities
  const [openId, setOpenId] = useState(null)
  const [done, setDone] = useState({})

  const meta = type === 'obstacle-course'
    ? { title: 'Obstacle Course', emoji: '🏅', desc: 'Team challenges that mirror real-life choices — trust, memory, refusal and carrying each other.' }
    : { title: 'Bonding Activities', emoji: '🤝', desc: 'Quick, fun exercises that build trust and connection before the serious conversations start.' }

  const toggleDone = (id) => setDone(d => ({ ...d, [id]: !d[id] }))

  return (
    <div data-page="Organise_Activities_Page" aria-label="Organise Activities Page" className="space-y-4">
      <Link to="/profile" className="inline-block text-sm text-tov-green hover:underline">&larr; Profile</Link>

      <div className="rounded-2xl bg-gradient-to-br from-tov-green to-tov-green-light p-6 text-white shadow-sm">
        <span className="text-3xl">{meta.emoji}</span>
        <h1 className="mt-2 text-2xl font-bold">{meta.title}</h1>
        <p className="mt-1 text-sm text-white/85">{meta.desc}</p>
      </div>

      <div className="space-y-3">
        {list.map((a, i) => (
          <div key={a.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <button
              onClick={() => setOpenId(openId === a.id ? null : a.id)}
              className="flex w-full items-center gap-3 text-left"
            >
              <span className="text-2xl">{a.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-stone-800">{i + 1}. {a.title}</p>
                <p className="text-xs text-stone-400">⏱ {a.time} • 👥 {a.people}</p>
              </div>
              <svg className={`h-5 w-5 text-stone-300 transition-transform ${openId === a.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {openId === a.id && (
              <div className="mt-3 space-y-3 border-t border-stone-100 pt-3 animate-slide-up">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-tov-green">Steps</h4>
                  <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-stone-700">
                    {a.steps.map((s, si) => <li key={si}>{s}</li>)}
                  </ol>
                </div>
                <div className="rounded-xl bg-tov-blue/5 p-3">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-tov-blue">Debrief</h4>
                  <p className="mt-1 text-sm text-stone-700">{a.debrief}</p>
                </div>
                <button
                  onClick={() => toggleDone(a.id)}
                  className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-colors ${done[a.id] ? 'bg-tov-green text-white' : 'bg-stone-100 text-stone-600'}`}
                >
                  {done[a.id] ? '✓ Completed' : 'Mark as completed'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
