import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'
import BackButton from '../../components/ui/BackButton'

const assessmentQuestions = {
  'substance-risk': [
    { q: 'Have you ever tried alcohol, cannabis, or any other substance?', options: ['Never', 'Once or twice', 'Regularly', 'I\'d rather not say'], field: 'tried' },
    { q: 'Do you know someone at school or work who uses substances?', options: ['No', 'Yes, I think so', 'Yes, I know someone', 'Not sure'], field: 'knows_user' },
    { q: 'Has anyone ever offered you substances?', options: ['Never', 'Once', 'Several times', 'I\'d rather not say'], field: 'offered' },
    { q: 'Do you feel you could say no if offered?', options: ['Definitely yes', 'Probably yes', 'Not sure', 'Probably not'], field: 'refusal_confidence' },
    { q: 'Have you ever felt worried about your own or a friend\'s substance use?', options: ['Never', 'Once or twice', 'Often', 'I\'d rather not say'], field: 'worried' },
  ],
  'mental-health': [
    { q: 'Over the past 2 weeks, how often have you felt down, depressed, or hopeless?', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], field: 'depression' },
    { q: 'Over the past 2 weeks, how often have you felt anxious or worried?', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], field: 'anxiety' },
    { q: 'Do you know who to talk to if you\'re struggling?', options: ['Yes, I have someone', 'I think so', 'Not really', 'No one'], field: 'support' },
    { q: 'Over the past 2 weeks, how often have you had trouble sleeping?', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], field: 'sleep' },
    { q: 'Have you lost interest in activities you used to enjoy?', options: ['Not at all', 'A little', 'A lot', 'Completely'], field: 'interest' },
  ],
  'peer-pressure': [
    { q: 'How often do you feel pressured to do things you don\'t want to do?', options: ['Never', 'Rarely', 'Sometimes', 'Often'], field: 'pressure_frequency' },
    { q: 'When offered something you don\'t want, can you say no?', options: ['Always', 'Usually', 'Sometimes', 'Rarely'], field: 'saying_no' },
    { q: 'Do you change your behaviour to fit in with friends?', options: ['Never', 'Sometimes', 'Often', 'Always'], field: 'conformity' },
    { q: 'Have you ever done something you regret because of peer pressure?', options: ['Never', 'Once', 'A few times', 'Many times'], field: 'regret' },
  ],
  'stress': [
    { q: 'How would you rate your current stress level?', options: ['Low', 'Moderate', 'High', 'Very high'], field: 'level' },
    { q: 'What\'s the biggest source of stress in your life right now?', options: ['School/Work', 'Relationships', 'Family', 'Money/Finances', 'Health', 'Other'], field: 'source' },
    { q: 'Do you have healthy ways to manage stress?', options: ['Yes, several', 'A few', 'Not really', 'I don\'t know how'], field: 'coping' },
    { q: 'How often do you exercise or do physical activity?', options: ['Daily', 'A few times a week', 'Rarely', 'Never'], field: 'exercise' },
  ],
}

export default function QuestionFlow() {
  const { type } = useParams()
  const navigate = useNavigate()
  const { activeProfile } = useActiveProfile()
  const questions = assessmentQuestions[type] || []
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (!questions.length) {
    return (
      <div data-page="Risk_Checker_Questions_Page" aria-label="Risk Checker Questions Page" className="py-8 text-center">
        <p className="text-stone-400">Assessment type not found.</p>
        <div className="mt-4"><BackButton to="/check" /></div>
      </div>
    )
  }

  const question = questions[current]
  const progress = ((current + 1) / questions.length) * 100

  const selectAnswer = (option) => {
    setAnswers(a => ({ ...a, [question.field]: option }))
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
    } else {
      submitAssessment({ ...answers, [question.field]: option })
    }
  }

  const submitAssessment = async (finalAnswers) => {
    setSubmitting(true)
    const id = await db.assessments.add({
      profileId: activeProfile?.id,
      type,
      answers: finalAnswers,
      createdAt: new Date().toISOString()
    })
    navigate(`/check/results/${id}`)
  }

  return (
    <div data-page="Risk_Checker_Questions_Page" aria-label="Risk Checker Questions Page" className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-stone-500">Question {current + 1} of {questions.length}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-stone-100">
          <div className="h-2 rounded-full bg-tov-green transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-800">{question.q}</h2>
      </div>

      <div className="space-y-2">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => selectAnswer(option)}
            disabled={submitting}
            className="w-full rounded-2xl bg-white p-4 text-left text-sm font-medium text-stone-700 shadow-sm transition-all hover:shadow-md hover:border-tov-green border border-transparent active:scale-[0.98] disabled:opacity-50"
          >
            {option}
          </button>
        ))}
      </div>

      {current > 0 && (
        <button onClick={() => setCurrent(c => c - 1)} className="text-sm text-stone-400 hover:text-stone-600">
          &larr; Previous question
        </button>
      )}

      <div className="rounded-2xl bg-stone-50 p-3 text-center text-xs text-stone-400">
        Your answers are private and stay on this device only.
      </div>

      <BackButton to="/check" />
    </div>
  )
}
