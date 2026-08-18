import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

export default function SafetyPlanHome() {
  const { activeProfile } = useActiveProfile()
  const plan = useLiveQuery(() => db.safetyPlan.get(activeProfile?.id), [activeProfile?.id])

  return (
    <div data-page="Safety_Plan_Page" aria-label="Safety Plan Page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Safety Plan</h1>
        <p className="mt-1 text-sm text-stone-500">Your personal crisis plan. Built during calm, used in distress.</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-tov-orange to-red-600 p-6 text-white">
        <h2 className="text-lg font-bold">Tap for immediate help</h2>
        <p className="mt-1 text-sm text-white/80">Access your safety plan with one tap</p>
        {plan ? (
          <Link to="/safety-plan/view" className="mt-4 block rounded-2xl bg-white/20 py-3 text-center font-semibold backdrop-blur hover:bg-white/30">
            Open My Safety Plan
          </Link>
        ) : (
          <Link to="/safety-plan/build" className="mt-4 block rounded-2xl bg-white py-3 text-center font-semibold text-tov-orange hover:bg-white/90">
            Create My Safety Plan
          </Link>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-stone-500 uppercase">What's in a safety plan?</h3>
        {[
          { section: 'Warning Signs', desc: 'How you know you need help', icon: '⚠️' },
          { section: 'Coping Strategies', desc: 'Things you can do on your own', icon: '💪' },
          { section: 'Trusted People', desc: 'Friends and family who can help', icon: '👥' },
          { section: 'Professional Contacts', desc: 'Counsellors and helplines', icon: '📞' },
          { section: 'Safe Environment', desc: 'Steps to make your space safer', icon: '🏠' },
        ].map(({ section, desc, icon }) => (
          <div key={section} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="font-medium text-stone-800">{section}</p>
              <p className="text-xs text-stone-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-stone-400">
        Your safety plan is encrypted and stays on your device only.
      </p>
    </div>
  )
}
