import { Link } from 'react-router-dom'

const paperScenarios = [
  { scenario: 'Your friend offers you a cigarette at a party.', options: ['Refuse politely', 'Accept to fit in', 'Walk away without saying anything'], discussion: 'What are the long-term effects of tobacco? How does peer pressure influence decisions?' },
  { scenario: 'You feel stressed about exams and someone offers you something to "help you relax."', options: ['Ask for healthier coping strategies', 'Try it once to see what happens', 'Talk to a trusted adult'], discussion: 'Why do people turn to substances under stress? What are healthier alternatives?' },
  { scenario: 'You see a younger student being pressured to try something harmful.', options: ['Intervene and help', 'Report to a teacher', 'Ignore it and walk away'], discussion: 'What would you want someone to do if it were you? How can we support each other?' },
  { scenario: 'A family member is struggling with addiction and you want to help.', options: ['Learn about addiction first', 'Try to force them to stop', 'Pretend everything is fine'], discussion: 'How does addiction affect families? What support is available in Zimbabwe?' },
]

export default function KUPaper() {
  return (
    <div data-page="Kuenzanisa_Upenyu_Paper_Page" aria-label="Kuenzanisa Upenyu Paper Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/games/ku" className="text-sm text-tov-purple hover:underline">&larr; Back</Link>
        <span className="text-[10px] text-stone-400">Paper Mode</span>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-lg font-bold text-stone-800">KU Discussion Cards</h1>
        <p className="text-xs text-stone-500">Use these scenarios for group discussions. No screen needed.</p>
      </div>

      <div className="space-y-4">
        {paperScenarios.map((s, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tov-purple text-xs font-bold text-white">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-800">{s.scenario}</p>
                <div className="mt-2 space-y-1">
                  {s.options.map((opt, j) => (
                    <p key={j} className="text-xs text-stone-500">• {opt}</p>
                  ))}
                </div>
                <div className="mt-3 rounded-lg bg-purple-50 p-3">
                  <p className="text-[10px] font-medium text-purple-700">Discussion Prompt:</p>
                  <p className="text-xs text-purple-600">{s.discussion}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
