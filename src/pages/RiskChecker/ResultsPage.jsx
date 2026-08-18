import { useParams, Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'

const scoreInterpretations = {
  'substance-risk': {
    low: { label: 'Low Risk', color: 'text-green-600', msg: 'You seem to have a healthy relationship with substances. Keep making good choices.' },
    moderate: { label: 'Moderate Risk', color: 'text-amber-600', msg: 'There may be some areas to be cautious about. Consider reading our Information Hub for more facts.' },
    high: { label: 'Higher Risk', color: 'text-orange-600', msg: 'You may be at risk. Consider talking to a trusted adult or calling a helpline.' },
  },
  'mental-health': {
    low: { label: 'Looking Good', color: 'text-green-600', msg: 'Your mental wellbeing looks stable. Keep up healthy habits.' },
    moderate: { label: 'Some Concerns', color: 'text-amber-600', msg: 'You may be experiencing some stress or worry. Our coping guides can help.' },
    high: { label: 'Needs Attention', color: 'text-orange-600', msg: 'Your answers suggest you may benefit from talking to someone. Help is available.' },
  },
}

function calculateRisk(answers, type) {
  const riskScore = Object.values(answers).filter(a =>
    ['More than half the days', 'Nearly every day', 'Often', 'Always', 'Probably not', 'Not sure', 'A lot', 'Completely', 'Many times', 'Rarely', 'Very high', 'I don\'t know how', 'No one', 'I\'d rather not say'].includes(a)
  ).length
  const total = Object.keys(answers).length || 1
  const ratio = riskScore / total
  if (ratio < 0.3) return 'low'
  if (ratio < 0.6) return 'moderate'
  return 'high'
}

export default function ResultsPage() {
  const { id } = useParams()
  const result = useLiveQuery(() => db.assessments.get(Number(id)), [id])

  if (!result) {
    return (
      <div data-page="Risk_Checker_Results_Page" aria-label="Risk Checker Results Page" className="py-8 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-tov-green border-t-transparent" />
        <p className="mt-4 text-sm text-stone-400">Loading results...</p>
      </div>
    )
  }

  const risk = calculateRisk(result.answers || {}, result.type)
  const interp = scoreInterpretations[result.type]?.[risk] || { label: 'Results', color: 'text-stone-600', msg: 'Review your answers.' }

  return (
    <div data-page="Risk_Checker_Results_Page" aria-label="Risk Checker Results Page" className="space-y-6">
      <div>
        <Link to="/check" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-stone-800">Your Results</h1>
        <p className="mt-1 text-sm text-stone-500">{result.type.replace(/-/g, ' ')} — {new Date(result.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-center">
        <p className={`text-lg font-bold ${interp.color}`}>{interp.label}</p>
        <p className="mt-2 text-sm text-stone-600">{interp.msg}</p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-stone-800">Your Answers</h3>
        <div className="space-y-2">
          {Object.entries(result.answers || {}).map(([key, value]) => (
            <div key={key} className="flex items-start gap-2 text-sm">
              <span className="shrink-0 text-stone-400">•</span>
              <span className="text-stone-600">{key.replace(/_/g, ' ')}: <strong>{value}</strong></span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-stone-500 uppercase">What you can do</h3>
        <Link to="/hub" className="block rounded-2xl bg-tov-green/5 border border-tov-green/20 p-4 text-sm text-tov-green font-medium">
          Read articles in the Information Hub →
        </Link>
        <Link to="/help/hotlines" className="block rounded-2xl bg-tov-red/5 border border-tov-red/20 p-4 text-sm text-tov-red font-medium">
          Call a helpline →
        </Link>
        <Link to="/safety-plan" className="block rounded-2xl bg-tov-orange/5 border border-tov-orange/20 p-4 text-sm text-tov-orange font-medium">
          Set up your Safety Plan →
        </Link>
      </div>

      <p className="text-center text-xs text-stone-400">
        This is a self-awareness tool, not a medical diagnosis. If you need help, please reach out.
      </p>
    </div>
  )
}
