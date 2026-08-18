import { Link } from 'react-router-dom'
import { useState } from 'react'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const sampleSurveys = [
  {
    id: 1, title: 'Student Wellbeing Check',
    questions: [
      { text: 'How are you feeling about school this term?', type: 'scale_1_5' },
      { text: 'Do you feel safe at school?', type: 'yes_no' },
      { text: 'Have you experienced peer pressure recently?', type: 'yes_no' },
      { text: 'What would help you most right now?', type: 'text' },
    ]
  },
  {
    id: 2, title: 'Campaign Feedback',
    questions: [
      { text: 'Did you learn something new from the Aweh Ekse! campaign?', type: 'yes_no' },
      { text: 'How would you rate the campaign? (1-5)', type: 'scale_1_5' },
      { text: 'Would you recommend it to a friend?', type: 'yes_no' },
    ]
  },
]

export default function SurveyTaker() {
  const { activeProfile } = useActiveProfile()
  const [selected, setSelected] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  const survey = selected !== null ? sampleSurveys[selected] : null

  const selectAnswer = (val) => {
    setAnswers(a => ({ ...a, [currentQ]: val }))
    setTimeout(() => {
      if (currentQ < survey.questions.length - 1) setCurrentQ(c => c + 1)
      else {
        db.surveys.add({
          profileId: activeProfile.id,
          surveyId: survey.id,
          answers,
          createdAt: new Date().toISOString()
        }).then(() => setDone(true))
      }
    }, 300)
  }

  if (done) {
    return (
      <div data-page="Survey_Taker_Page" aria-label="Survey Taker Page" className="space-y-6 py-8 text-center">
        <span className="text-6xl">✅</span>
        <h2 className="text-xl font-bold text-stone-800">Survey completed!</h2>
        <p className="text-sm text-stone-500">Your responses are anonymous and help improve the platform.</p>
        <Link to="/research" className="inline-block rounded-2xl bg-tov-purple px-4 py-2.5 text-sm font-medium text-white">Back to Research</Link>
      </div>
    )
  }

  if (!survey) {
    return (
      <div data-page="Survey_Taker_Page" aria-label="Survey Taker Page" className="space-y-6">
        <Link to="/research" className="text-sm text-tov-purple hover:underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-stone-800">Available Surveys</h1>
        <div className="space-y-3">
          {sampleSurveys.map((s, i) => (
            <button key={s.id} onClick={() => { setSelected(i); setCurrentQ(0); setAnswers({}) }}
              className="w-full rounded-2xl bg-white p-5 text-left shadow-sm hover:shadow-md">
              <p className="font-semibold text-stone-800">{s.title}</p>
              <p className="text-xs text-stone-400">{s.questions.length} questions • ~2 min</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const q = survey.questions[currentQ]

  return (
    <div data-page="Survey_Taker_Page" aria-label="Survey Taker Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => setSelected(null)} className="text-sm text-tov-purple hover:underline">&larr; Back</button>
        <span className="text-xs text-stone-400">{currentQ + 1} / {survey.questions.length}</span>
      </div>
      <div className="h-2 rounded-full bg-stone-100">
        <div className="h-2 rounded-full bg-tov-purple transition-all" style={{ width: `${((currentQ + 1) / survey.questions.length) * 100}%` }} />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-800">{q.text}</h2>
        <div className="mt-6 space-y-2">
          {q.type === 'yes_no' && ['Yes', 'No'].map(opt => (
            <button key={opt} onClick={() => selectAnswer(opt)}
              className="w-full rounded-xl border border-stone-200 p-3 text-sm font-medium text-stone-600 hover:border-tov-purple hover:bg-tov-purple/5">
              {opt}
            </button>
          ))}
          {q.type === 'scale_1_5' && [1,2,3,4,5].map(n => (
            <button key={n} onClick={() => selectAnswer(n)}
              className="w-full rounded-xl border border-stone-200 p-3 text-sm font-medium text-stone-600 hover:border-tov-purple hover:bg-tov-purple/5">
              {n}
            </button>
          ))}
          {q.type === 'text' && (
            <div className="space-y-3">
              <textarea onChange={e => setAnswers(a => ({ ...a, [currentQ]: e.target.value }))}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-tov-purple focus:outline-none"
                rows={3} placeholder="Type your answer..." />
              <button onClick={() => selectAnswer(answers[currentQ] || '')}
                className="w-full rounded-xl bg-tov-purple p-3 text-sm font-semibold text-white">Continue</button>
            </div>
          )}
        </div>
      </div>
      <p className="text-center text-[10px] text-stone-400">Your response is anonymous.</p>
    </div>
  )
}
