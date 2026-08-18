import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

export default function PlanView() {
  const { activeProfile } = useActiveProfile()
  const plan = useLiveQuery(() => db.safetyPlan.get(activeProfile?.id), [activeProfile?.id])

  if (!plan) {
    return (
      <div data-page="Safety_Plan_View_Page" aria-label="Safety Plan View Page" className="py-8 text-center">
        <p className="text-stone-400">No safety plan found.</p>
        <Link to="/safety-plan/build" className="mt-4 inline-block text-tov-orange font-medium hover:underline">Create one now</Link>
      </div>
    )
  }

  const sections = [
    { key: 'warningSigns', title: 'Warning Signs', icon: '⚠️' },
    { key: 'copingStrategies', title: 'Coping Strategies', icon: '💪' },
    { key: 'socialSettings', title: 'People & Places That Help', icon: '👥' },
    { key: 'peopleToAsk', title: 'People I Can Ask For Help', icon: '📞' },
    { key: 'professionals', title: 'Professional Contacts', icon: '🏥' },
    { key: 'environment', title: 'Making My Space Safer', icon: '🏠' },
  ]

  return (
    <div data-page="Safety_Plan_View_Page" aria-label="Safety Plan View Page" className="space-y-6">
      <div>
        <Link to="/safety-plan" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-stone-800">My Safety Plan</h1>
        <p className="mt-1 text-xs text-stone-400">Last updated: {plan.updatedAt ? new Date(plan.updatedAt).toLocaleString() : 'Unknown'}</p>
      </div>

      <a href="tel:995" className="block rounded-2xl bg-tov-red py-4 text-center text-lg font-bold text-white hover:bg-tov-red/90">
        Emergency: Call 995
      </a>

      <div className="space-y-4">
        {sections.map(({ key, title, icon }) => plan[key] ? (
          <div key={key} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">{icon}</span>
              <h3 className="font-semibold text-stone-800">{title}</h3>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-stone-600">{plan[key]}</p>
          </div>
        ) : null)}
      </div>

      <Link to="/safety-plan/build" className="block rounded-2xl border border-dashed border-stone-300 p-4 text-center text-sm text-stone-500 hover:border-tov-orange hover:text-tov-orange">
        Edit my safety plan
      </Link>

      <p className="text-center text-xs text-stone-400">
        Your plan is encrypted on device. Only you can see it.
      </p>
    </div>
  )
}
