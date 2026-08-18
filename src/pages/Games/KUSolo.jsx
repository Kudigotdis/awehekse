import { Link } from 'react-router-dom'
import { useState } from 'react'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const scenarios = [
  {
    prompt: "It's Friday after school. Your friends invite you to a party where you know there will be alcohol.",
    options: [
      { text: "Go to the party and try a drink", consequences: { health: -1, social: +1, mood: +1 }, next: 1 },
      { text: "Go but stay sober", consequences: { health: 0, social: 0, mood: 0 }, next: 1 },
      { text: "Suggest doing something else instead", consequences: { health: +1, social: -1, mood: +1 }, next: 2 },
    ]
  },
  {
    prompt: "Your exam results are poor. You feel stressed and overwhelmed.",
    options: [
      { text: "Talk to someone about how you feel", consequences: { health: +1, social: +1, mood: +1 }, next: 3 },
      { text: "Stay home and avoid everyone", consequences: { health: -1, social: -1, mood: -1 }, next: 3 },
      { text: "Use substances to cope with the stress", consequences: { health: -2, social: 0, mood: -1 }, next: 3 },
    ]
  },
  {
    prompt: "You said no to the party. Your friend is upset with you.",
    options: [
      { text: "Explain your reasons honestly", consequences: { health: +1, social: +1, mood: +1 }, next: 3 },
      { text: "Just ignore them for now", consequences: { health: 0, social: -1, mood: 0 }, next: 3 },
    ]
  },
  {
    prompt: "It's been a month. How are things going?",
    options: [
      { text: "I feel strong and proud of my choices", consequences: { health: +2, social: +1, mood: +2 }, next: null },
      { text: "It's been tough but I'm managing", consequences: { health: +1, social: 0, mood: 0 }, next: null },
      { text: "I've been struggling a lot", consequences: { health: -1, social: -1, mood: -1 }, next: null },
    ]
  },
]

export default function KUSolo() {
  const { activeProfile } = useActiveProfile()
  const [step, setStep] = useState(0)
  const [stats, setStats] = useState({ health: 50, social: 50, mood: 50 })
  const [finished, setFinished] = useState(false)

  const s = scenarios[step]

  const choose = (opt) => {
    setStats(prev => ({
      health: Math.max(0, Math.min(100, prev.health + (opt.consequences.health * 10))),
      social: Math.max(0, Math.min(100, prev.social + (opt.consequences.social * 10))),
      mood: Math.max(0, Math.min(100, prev.mood + (opt.consequences.mood * 10))),
    }))

    if (opt.next === null) {
      setFinished(true)
      db.gameScores.add({
        profileId: activeProfile.id,
        game: 'ku',
        mode: 'solo',
        score: stats.health + stats.social + stats.mood,
        total: 300,
        createdAt: new Date().toISOString()
      })
    } else {
      setStep(opt.next)
    }
  }

  const barColor = (val) => val >= 70 ? 'bg-green-400' : val >= 40 ? 'bg-amber-400' : 'bg-red-400'

  if (finished) {
    return (
      <div data-page="Kuenzanisa_Upenyu_Solo_Page" aria-label="Kuenzanisa Upenyu Solo Page" className="space-y-6 py-8 text-center">
        <span className="text-6xl">{stats.health + stats.social + stats.mood >= 200 ? '🌟' : '💪'}</span>
        <h2 className="text-xl font-bold text-stone-800">Your Journey Ends</h2>
        <div className="space-y-3 max-w-xs mx-auto">
          {[['Health', stats.health], ['Social', stats.social], ['Mood', stats.mood]].map(([label, val]) => (
            <div key={label} className="text-left">
              <div className="flex justify-between text-xs text-stone-500"><span>{label}</span><span>{val}%</span></div>
              <div className="mt-1 h-3 rounded-full bg-stone-100"><div className={`h-3 rounded-full ${barColor(val)}`} style={{ width: `${val}%` }} /></div>
            </div>
          ))}
        </div>
        <p className="text-sm text-stone-500">
          {(stats.health + stats.social + stats.mood) >= 200 ? 'Great choices! Keep building a healthy life.' : 'Every day is a new chance to make better choices.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setStep(0); setStats({ health: 50, social: 50, mood: 50 }); setFinished(false); }}
            className="rounded-2xl bg-tov-purple px-4 py-2.5 text-sm font-medium text-white">Play Again</button>
          <Link to="/games/ku" className="rounded-2xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600">Back</Link>
        </div>
      </div>
    )
  }

  return (
    <div data-page="Kuenzanisa_Upenyu_Solo_Page" aria-label="Kuenzanisa Upenyu Solo Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/games/ku" className="text-sm text-tov-purple hover:underline">&larr; Back</Link>
        <span className="text-xs text-stone-400">Step {step + 1}</span>
      </div>

      <div className="space-y-2">
        {[['Health', stats.health], ['Social', stats.social], ['Mood', stats.mood]].map(([label, val]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-12 text-[10px] text-stone-400">{label}</span>
            <div className="flex-1 h-2 rounded-full bg-stone-100"><div className={`h-2 rounded-full ${barColor(val)}`} style={{ width: `${val}%` }} /></div>
            <span className="w-8 text-right text-[10px] text-stone-400">{val}%</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-stone-800">{s.prompt}</p>
        <div className="mt-4 space-y-2">
          {s.options.map((opt, i) => (
            <button key={i} onClick={() => choose(opt)}
              className="w-full rounded-xl border border-stone-200 p-3 text-left text-sm text-stone-600 hover:border-tov-purple hover:bg-tov-purple/5">
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
