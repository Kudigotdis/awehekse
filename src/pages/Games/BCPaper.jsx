import { Link } from 'react-router-dom'

const quickQuestions = [
  { q: 'What does this symbol mean: 🚭?', a: 'No Smoking / Tobacco-free zone' },
  { q: 'What does this symbol mean: 🚫?', a: 'Prohibited / Not allowed' },
  { q: 'What does this symbol mean: ⚠️?', a: 'Warning / Be careful' },
  { q: 'What does this symbol mean: 🛡️?', a: 'Protection / Safety' },
  { q: 'What does this symbol mean: ✅?', a: 'Approved / Safe / Yes' },
  { q: 'What does this symbol mean: 📵?', a: 'No phones / No harmful substances' },
  { q: 'What does this symbol mean: 🏃?', a: 'Exercise / Physical activity' },
  { q: 'What does this symbol mean: 🏥?', a: 'Hospital / Medical help' },
]

export default function BCPaper() {
  return (
    <div data-page="Bata_Chiratidzo_Paper_Page" aria-label="Bata Chiratidzo Paper Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/games/bc" className="text-sm text-tov-orange hover:underline">&larr; Back</Link>
        <span className="text-[10px] text-stone-400">Paper Mode</span>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-lg font-bold text-stone-800">BC Quick-Fire Quiz</h1>
        <p className="text-xs text-stone-500">Read aloud and race to answer. No screen needed.</p>
      </div>

      <div className="space-y-2">
        {quickQuestions.map((q, i) => (
          <div key={i} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tov-orange text-xs font-bold text-white">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm text-stone-800">{q.q}</p>
                <p className="mt-1 text-[10px] text-stone-400">Answer: {q.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-orange-50 p-4 text-xs text-orange-700">
        <p className="font-medium">Facilitator tip:</p>
        <p className="mt-1">Show the emoji and ask: "What does this mean?" First person to answer correctly gets a point. Fastest wins!</p>
      </div>
    </div>
  )
}
