import { Link } from 'react-router-dom'
import { useState } from 'react'

const lessonPlans = [
  { id: 1, title: 'Understanding Substance Abuse', pillar: 'Knowledge', grade: 'Form 1-2', duration: '45 min', desc: 'Introduction to types of substances and their effects on the body and mind.' },
  { id: 2, title: 'Peer Pressure Skills', pillar: 'Life Skills', grade: 'Form 2-4', duration: '60 min', desc: 'Role-playing scenarios to build refusal skills and assertiveness.' },
  { id: 3, title: 'My Mental Health Matters', pillar: 'Wellbeing', grade: 'Form 1-4', duration: '45 min', desc: 'Recognising emotions, stress management, and when to seek help.' },
  { id: 4, title: 'Building Healthy Habits', pillar: 'Habits', grade: 'Form 1-3', duration: '40 min', desc: 'How habits form and strategies for building positive routines.' },
  { id: 5, title: 'Community Support Networks', pillar: 'Community', grade: 'Form 3-4', duration: '50 min', desc: 'Identifying trusted adults and professional resources.' },
  { id: 6, title: 'Digital Wellness', pillar: 'Knowledge', grade: 'Form 2-4', duration: '45 min', desc: 'Screen time, social media, and digital addiction awareness.' },
]

const pillars = ['All', 'Knowledge', 'Life Skills', 'Wellbeing', 'Habits', 'Community']

export default function PlanLibrary() {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? lessonPlans : lessonPlans.filter(p => p.pillar === filter)

  return (
    <div data-page="Lesson_Plan_Library_Page" aria-label="Lesson Plan Library Page" className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-800">Lesson Plans</h1>
      <p className="text-sm text-stone-500">Ready-to-use plans for educators and facilitators.</p>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {pillars.map(p => (
          <button key={p} onClick={() => setFilter(p)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              filter === p ? 'bg-tov-green text-white' : 'bg-stone-100 text-stone-600'
            }`}>{p}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(plan => (
          <Link key={plan.id} to={`/lessons/${plan.id}`}
            className="block rounded-2xl bg-white p-5 shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="rounded-full bg-tov-green/10 px-2 py-0.5 text-[10px] font-medium text-tov-green">{plan.pillar}</span>
                <h3 className="mt-2 font-semibold text-stone-800">{plan.title}</h3>
                <p className="mt-1 text-xs text-stone-500">{plan.desc}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-[10px] text-stone-400">
              <span>{plan.grade}</span>
              <span>{plan.duration}</span>
            </div>
          </Link>
        ))}
      </div>

      <Link to="/lessons/dashboard" className="block rounded-2xl border border-dashed border-stone-300 p-4 text-center text-sm text-stone-500 hover:border-tov-green hover:text-tov-green">
        Educator Dashboard
      </Link>
    </div>
  )
}
