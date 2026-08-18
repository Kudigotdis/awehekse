import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import professionalsStatic from '../../data/professionals.json'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'
import useRegionFilter from '../../hooks/useRegionFilter'
import BackButton from '../../components/ui/BackButton'

const regionCities = {
  ZW: [
    { id: 'Harare', label: 'Harare' },
    { id: 'Bulawayo', label: 'Bulawayo' },
    { id: 'Mutare', label: 'Mutare' },
    { id: 'Gweru', label: 'Gweru' },
  ],
  ZA: [
    { id: 'Johannesburg', label: 'Johannesburg' },
    { id: 'Cape Town', label: 'Cape Town' },
    { id: 'Durban', label: 'Durban' },
    { id: 'Pretoria', label: 'Pretoria' },
  ],
  BW: [
    { id: 'Gaborone', label: 'Gaborone' },
    { id: 'Francistown', label: 'Francistown' },
    { id: 'Maun', label: 'Maun' },
    { id: 'Serowe', label: 'Serowe' },
    { id: 'Kanye', label: 'Kanye' },
    { id: 'Molepolole', label: 'Molepolole' },
    { id: 'Mahalapye', label: 'Mahalapye' },
    { id: 'Lobatse', label: 'Lobatse' },
  ],
  ZM: [
    { id: 'Lusaka', label: 'Lusaka' },
    { id: 'Kitwe', label: 'Kitwe' },
  ],
  MW: [
    { id: 'Lilongwe', label: 'Lilongwe' },
    { id: 'Blantyre', label: 'Blantyre' },
  ],
}

const fallbackCities = regionCities.ZW

const steps = [
  {
    id: 'who',
    title: 'Who needs help?',
    options: [
      { id: 'me', label: 'Me' },
      { id: 'friend', label: 'A friend' },
      { id: 'family', label: 'A family member' },
      { id: 'school', label: 'Someone at school' },
    ],
  },
  {
    id: 'what',
    title: 'What kind of help?',
    options: [
      { id: 'counsellor', label: 'Counselling', type: 'counsellor' },
      { id: 'rehab', label: 'Rehab', type: 'rehab' },
      { id: 'medical', label: 'Medical / Doctor', type: 'medical' },
      { id: 'legal', label: 'Legal help', type: 'legal' },
      { id: 'police', label: 'Police / Safety', type: 'police' },
      { id: 'religious', label: 'Pastor / Spiritual', type: 'religious' },
    ],
  },
  {
    id: 'where',
    title: 'Where are they?',
    options: [
      { id: 'Harare', label: 'Harare' },
      { id: 'Bulawayo', label: 'Bulawayo' },
      { id: 'Mutare', label: 'Mutare' },
      { id: 'Gweru', label: 'Gweru' },
      { id: 'Other', label: 'Somewhere else' },
    ],
  },
  {
    id: 'when',
    title: 'How urgent is it?',
    options: [
      { id: 'now', label: 'Right now' },
      { id: 'today', label: 'Today' },
      { id: 'week', label: 'This week' },
      { id: 'looking', label: 'Just looking' },
    ],
  },
  {
    id: 'how',
    title: 'How should they be contacted?',
    options: [
      { id: 'call', label: 'Phone call' },
      { id: 'sms', label: 'SMS / WhatsApp' },
      { id: 'inperson', label: 'In person' },
    ],
  },
]

export default function HelpWizard() {
  const { activeProfile } = useActiveProfile()
  const { region, current: regionCurrent, isFallback } = useRegionFilter()
  const professionals = useLiveQuery(() => db.professionals.toArray(), []) || professionalsStatic
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [booked, setBooked] = useState(null)

  const cities = regionCities[region] || fallbackCities
  const currentSteps = steps.map(s => s.id === 'where' ? { ...s, options: [...cities, { id: 'Other', label: 'Somewhere else' }] } : s)
  const current = currentSteps[step]

  const choose = async (option) => {
    const next = { ...answers, [current.id]: option }
    setAnswers(next)
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      const matches = professionals.filter(p =>
        p.type === next.what.type &&
        (next.where.id === 'Other' || p.location === next.where.id)
      )
      const result = matches.length > 0 ? matches : professionals.filter(p => p.type === next.what.type)

      if (activeProfile) {
        for (const pro of result.slice(0, 1)) {
          await db.bookings.add({
            profileId: activeProfile.id,
            professionalId: pro.id,
            who: next.who.id,
            where: next.where.id,
            when: next.when.id,
            how: next.how.id,
            date: new Date().toISOString().slice(0, 10),
            createdAt: new Date().toISOString(),
          })
        }
      }
      setBooked({ answers: next, matches: result })
    }
  }

  const progress = ((step) / (steps.length - 1)) * 100

  if (booked) {
    const { matches } = booked
    return (
      <div data-page="Help_Wizard_Results_Page" aria-label="Help Wizard Results Page" className="space-y-4">
        <div className="rounded-2xl bg-tov-green/5 border border-tov-green/20 p-5 text-center">
          <h1 className="text-xl font-bold text-stone-800">Here is who can help</h1>
          <p className="mt-1 text-xs text-stone-500">Based on your answers. Reach out — you are not alone.</p>
        </div>

        <div className="space-y-2">
          {matches.map(pro => (
            <div key={pro.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-stone-800">{pro.name}</p>
                  <p className="text-xs text-tov-green">{pro.role} · {pro.org}</p>
                </div>
                <span className="rounded-full bg-tov-cream px-2 py-0.5 text-xs text-stone-600">★ {pro.rating}</span>
              </div>
              <p className="mt-2 text-sm text-stone-600">{pro.bio}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
                <span>{pro.location} · {pro.price}</span>
              </div>
              <a href={`tel:${pro.phone.replace(/\s/g, '')}`} className="mt-3 block rounded-xl bg-tov-blue py-2.5 text-center text-sm font-semibold text-white">
                Call {pro.phone}
              </a>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-tov-orange/5 border border-tov-orange/20 p-4 text-center">
          <p className="text-xs text-stone-600">
            {activeProfile
              ? 'Your request has been saved. You can find your bookings in your profile.'
              : 'Sign in to save this request and track your help journey.'}
          </p>
        </div>

        <button
          onClick={() => { setBooked(null); setStep(0); setAnswers({}) }}
          className="w-full rounded-xl bg-stone-100 py-3 text-sm font-semibold text-stone-600"
        >
          Start over
        </button>
        <BackButton to="/aweh/help" />
      </div>
    )
  }

  return (
    <div data-page="Help_Wizard_Page" aria-label="Help Wizard Page" className="space-y-4">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
        <div className="h-full rounded-full bg-tov-red transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-center text-xs text-stone-400">Step {step + 1} of {steps.length}</p>

      <h1 className="text-center text-2xl font-bold text-stone-800">{current.title}</h1>

      <div className="space-y-2">
        {current.options.map(option => (
          <button
            key={option.id}
            onClick={() => choose(option)}
            className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 shadow-sm active:scale-[0.99]"
          >
            <span className="font-semibold text-stone-800">{option.label}</span>
          </button>
        ))}
      </div>

      <BackButton to="/aweh/help" />
    </div>
  )
}
