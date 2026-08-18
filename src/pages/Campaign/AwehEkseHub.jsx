import { Link } from 'react-router-dom'
import { useState } from 'react'

const weeks = [
  { week: 1, theme: 'What Are Addictive Substances?', desc: 'Definition, types, and why they matter' },
  { week: 2, theme: 'How Addiction Starts', desc: 'The science of tolerance and dependence' },
  { week: 3, theme: 'Peer Pressure & Social Triggers', desc: 'Saying no when everyone says yes' },
  { week: 4, theme: 'Mental Health Connection', desc: 'Why we self-medicate' },
  { week: 5, theme: 'Family & Community Impact', desc: 'How addiction ripples outward' },
  { week: 6, theme: 'Conditioning & Habits', desc: 'How habits form and how to break them' },
  { week: 7, theme: 'Digital & Behavioural Addiction', desc: 'Screens, gambling, and more' },
  { week: 8, theme: 'Recovery Is Possible', desc: 'Stories of hope and healing' },
  { week: 9, theme: 'Being an Agent of Change', desc: 'How you can help your community' },
  { week: 10, theme: 'Celebration & Commitment', desc: 'Pledges, achievements, and next steps' },
]

const podcastEpisodes = [
  { title: 'Episode 1: The Truth About Substances', duration: '22 min' },
  { title: 'Episode 2: Real Stories from Zimbabwe', duration: '18 min' },
  { title: 'Episode 3: How to Talk to Your Parents', duration: '15 min' },
  { title: 'Episode 4: Mental Health Matters', duration: '20 min' },
  { title: 'Episode 5: Recovery Journeys', duration: '25 min' },
]

export default function AwehEkseHub() {
  const [expandedWeek, setExpandedWeek] = useState(null)

  return (
    <div data-page="Aweh_Ekse_Hub_Page" aria-label="Aweh Ekse Hub Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/campaign" className="text-sm text-tov-green hover:underline">&larr; Back</Link>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-tov-blue to-indigo-800 p-6 text-white">
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Flagship Campaign</span>
        <h1 className="mt-3 text-2xl font-bold">Aweh Ekse!</h1>
        <p className="mt-1 text-sm text-white/80">An Addictive Substances & Conditioning Contents Campaign</p>
        <p className="mt-3 text-xs text-white/60">10-week school activation program • Podcast series • Field Kit</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-stone-500 uppercase">10-Week Theme Matrix</h2>
        {weeks.map(w => (
          <div key={w.week} className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedWeek(expandedWeek === w.week ? null : w.week)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tov-green text-xs font-bold text-white">
                {w.week}
              </span>
              <div className="flex-1">
                <p className="font-medium text-stone-800">{w.theme}</p>
                <p className="text-xs text-stone-400">{w.desc}</p>
              </div>
              <svg className={`h-4 w-4 text-stone-400 transition-transform ${expandedWeek === w.week ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {expandedWeek === w.week && (
              <div className="border-t border-stone-100 p-4">
                <div className="space-y-2">
                  <p className="text-xs text-stone-500">Week {w.week} content includes:</p>
                  <ul className="space-y-1 text-sm text-stone-600">
                    <li className="flex items-center gap-2"><span className="text-tov-green">✓</span> Lesson plan for educators</li>
                    <li className="flex items-center gap-2"><span className="text-tov-green">✓</span> Student worksheet</li>
                    <li className="flex items-center gap-2"><span className="text-tov-green">✓</span> Discussion prompts</li>
                    <li className="flex items-center gap-2"><span className="text-tov-green">✓</span> Community poll</li>
                    <li className="flex items-center gap-2"><span className="text-tov-green">✓</span> Podcast episode guide</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-stone-500 uppercase">Podcast Episodes</h2>
        {podcastEpisodes.map((ep, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
            <span className="text-2xl">🎙️</span>
            <div className="flex-1">
              <p className="font-medium text-stone-800">{ep.title}</p>
              <p className="text-xs text-stone-400">{ep.duration}</p>
            </div>
            <span className="rounded-full bg-tov-green/10 px-2 py-0.5 text-[10px] font-medium text-tov-green">Guide Available</span>
          </div>
        ))}
      </div>
    </div>
  )
}
