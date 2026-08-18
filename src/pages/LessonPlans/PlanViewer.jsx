import { useParams } from 'react-router-dom'
import BackButton from '../../components/ui/BackButton'

const lessonData = {
  1: {
    title: 'Understanding Substance Abuse',
    pillar: 'Knowledge',
    grade: 'Form 1-2',
    duration: '45 min',
    objectives: [
      'Define substance abuse and distinguish between use, misuse, and abuse',
      'Identify common substances of abuse in Zimbabwe',
      'Explain short-term and long-term effects on health',
    ],
    materials: ['Whiteboard and markers', 'Printed Myth-Fact cards', 'Student worksheet'],
    activities: [
      { time: '5 min', activity: 'Warm-up: Ask "What do you know about drugs?" — write responses on board' },
      { time: '10 min', activity: 'Mini-lecture: Types of substances and how they affect the brain' },
      { time: '15 min', activity: 'Group work: Sort Myth-Fact cards into true and false' },
      { time: '10 min', activity: 'Discussion: Why do people start using substances?' },
      { time: '5 min', activity: 'Reflection: Students write one thing they learned' },
    ],
    assessment: 'Worksheet completion + class discussion participation',
  },
  2: {
    title: 'Peer Pressure Skills',
    pillar: 'Life Skills',
    grade: 'Form 2-4',
    duration: '60 min',
    objectives: [
      'Recognise different forms of peer pressure',
      'Practice assertive refusal techniques',
      'Develop personal strategies for resisting pressure',
    ],
    materials: ['Scenario cards', 'Role-play props', 'Student journal'],
    activities: [
      { time: '10 min', activity: 'Ice-breaker: "Never have I ever" (non-substance version)' },
      { time: '15 min', activity: 'Scenario reading: Students read aloud different peer pressure situations' },
      { time: '20 min', activity: 'Role-play: Practice saying NO in pairs using the STOP technique' },
      { time: '10 min', activity: 'Strategy building: Create personal refusal scripts' },
      { time: '5 min', activity: 'Journal reflection: Write about a time you faced pressure and how you handled it' },
    ],
    assessment: 'Role-play demonstration + journal entry',
  },
}

const fallback = {
  title: 'Lesson Plan',
  pillar: 'General',
  grade: 'All',
  duration: '45 min',
  objectives: ['Understand the topic', 'Apply knowledge to real life', 'Share with peers'],
  materials: ['Whiteboard', 'Worksheets'],
  activities: [
    { time: '10 min', activity: 'Introduction and warm-up' },
    { time: '20 min', activity: 'Main activity and discussion' },
    { time: '15 min', activity: 'Reflection and assessment' },
  ],
  assessment: 'Class discussion and worksheet',
}

export default function PlanViewer() {
  const { id } = useParams()
  const lesson = lessonData[id] || fallback

  return (
    <div data-page="Lesson_Plan_Viewer_Page" aria-label="Lesson Plan Viewer Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-tov-green/10 px-2 py-0.5 text-[10px] font-medium text-tov-green">{lesson.pillar}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-stone-800">{lesson.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-xs text-stone-500">
          <span>{lesson.grade}</span>
          <span>•</span>
          <span>{lesson.duration}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-stone-800">Learning Objectives</h2>
        <ul className="mt-2 space-y-1">
          {lesson.objectives.map((o, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
              <span className="mt-1 text-tov-green">✓</span>
              {o}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-stone-800">Materials Needed</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {lesson.materials.map((m, i) => (
            <span key={i} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">{m}</span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-stone-800">Lesson Activities</h2>
        <div className="mt-3 space-y-3">
          {lesson.activities.map((a, i) => (
            <div key={i} className="flex gap-3">
              <span className="shrink-0 rounded-lg bg-tov-green/10 px-2 py-1 text-[10px] font-medium text-tov-green">{a.time}</span>
              <p className="text-sm text-stone-600">{a.activity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-tov-green/5 border border-tov-green/20 p-4">
        <p className="text-xs font-medium text-tov-green">Assessment:</p>
        <p className="mt-1 text-sm text-stone-600">{lesson.assessment}</p>
      </div>

      <BackButton to="/lessons" />
    </div>
  )
}
