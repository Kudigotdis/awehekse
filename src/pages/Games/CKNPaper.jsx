import { Link } from 'react-router-dom'

const paperQuestions = [
  { num: 1, question: 'Alcohol is a depressant, not a stimulant.', answer: 'TRUE' },
  { num: 2, question: 'Methamphetamine causes permanent brain damage.', answer: 'TRUE' },
  { num: 3, question: 'Cannabis is physically addictive for most users.', answer: 'FALSE' },
  { num: 4, question: 'Peer pressure mainly affects younger teens.', answer: 'FALSE' },
  { num: 5, question: 'Exercise can reduce substance cravings.', answer: 'TRUE' },
  { num: 6, question: 'Hookah is a safe alternative to smoking.', answer: 'FALSE' },
  { num: 7, question: 'Recovery typically requires multiple attempts.', answer: 'TRUE' },
  { num: 8, question: 'You can smoke marijuana without damaging your lungs.', answer: 'FALSE' },
  { num: 9, question: 'Tobacco contains over 70 known carcinogens.', answer: 'TRUE' },
  { num: 10, question: 'Substance use disorder is a choice, not a disease.', answer: 'FALSE' },
]

export default function CKNPaper() {
  return (
    <div data-page="Chokwadi_Kana_Nhema_Paper_Page" aria-label="Chokwadi Kana Nhema Paper Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/games/ckn" className="text-sm text-tov-blue hover:underline">&larr; Back</Link>
        <span className="text-[10px] text-stone-400">Paper Mode</span>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-lg font-bold text-stone-800">CKN Paper Mode</h1>
        <p className="text-xs text-stone-500">Read aloud. No screen needed. Great for group activities.</p>
      </div>

      <div className="space-y-2">
        {paperQuestions.map(q => (
          <div key={q.num} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tov-blue text-xs font-bold text-white">
                {q.num}
              </span>
              <div className="flex-1">
                <p className="text-sm text-stone-800">{q.question}</p>
                <p className="mt-1 text-[10px] text-stone-400">Answer: {q.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-blue-50 p-4 text-xs text-blue-700">
        <p className="font-medium">Facilitator tip:</p>
        <p className="mt-1">Read each statement aloud. Have participants vote TRUE or FALSE using hand signals. Reveal the answer and discuss.</p>
      </div>
    </div>
  )
}
