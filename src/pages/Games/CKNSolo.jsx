import { Link } from 'react-router-dom'
import { useState } from 'react'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const statements = [
  { text: 'Alcohol is not a drug because it is legal.', truth: false, explanation: 'Alcohol is a psychoactive drug. Legal status does not determine whether something is a drug.' },
  { text: 'Most people who try marijuana become addicted.', truth: false, explanation: 'Research shows about 9% of marijuana users develop dependence, lower than many other substances.' },
  { text: 'Tobacco kills half of all long-term users.', truth: true, explanation: 'Half of all long-term tobacco users die from smoking-related causes.' },
  { text: 'You can get addicted on the first use.', truth: false, explanation: 'While some substances can hook quickly, most addictions develop over repeated use.' },
  { text: 'Peer pressure is the biggest risk factor for teen substance use.', truth: true, explanation: 'Peer pressure and social environment are major factors in teen substance initiation.' },
  { text: 'Exercise can help reduce cravings.', truth: true, explanation: 'Physical activity releases endorphins and can help manage withdrawal symptoms.' },
  { text: 'Hookah is safer than cigarettes.', truth: false, explanation: 'Hookah smoking carries many of the same health risks as cigarette smoking.' },
  { text: 'Recovery means you never struggle again.', truth: false, explanation: 'Recovery is a journey. Setbacks can happen but do not mean failure.' },
  { text: 'Methamphetamine can be prescribed by a doctor.', truth: true, explanation: 'Methamphetamine (Desoxyn) is FDA-approved for ADHD and obesity in rare cases.' },
  { text: 'You cannot help someone who does not want help.', truth: true, explanation: 'Motivation is essential for recovery, but support and education can plant seeds.' },
]

export default function CKNSolo() {
  const { activeProfile } = useActiveProfile()
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedTruth, setSelectedTruth] = useState(null)
  const [finished, setFinished] = useState(false)

  const s = statements[current]

  const answer = (truth) => {
    setSelectedTruth(truth)
    setAnswered(true)
    if (truth === s.truth) setScore(sc => sc + 1)
  }

  const next = () => {
    if (current < statements.length - 1) {
      setCurrent(c => c + 1)
      setAnswered(false)
      setSelectedTruth(null)
    } else {
      setFinished(true)
      db.gameScores.add({
        profileId: activeProfile.id,
        game: 'ckn',
        mode: 'solo',
        score: score + (selectedTruth === s.truth ? 1 : 0),
        total: statements.length,
        createdAt: new Date().toISOString()
      })
    }
  }

  if (finished) {
    return (
      <div data-page="Chokwadi_Kana_Nhema_Solo_Page" aria-label="Chokwadi Kana Nhema Solo Page" className="space-y-6 py-8 text-center">
        <span className="text-6xl">{score >= 7 ? '🏆' : score >= 5 ? '👏' : '💪'}</span>
        <h2 className="text-xl font-bold text-stone-800">Game Over!</h2>
        <p className="text-3xl font-bold text-tov-blue">{score}/{statements.length}</p>
        <p className="text-sm text-stone-500">{score >= 7 ? 'Amazing! You really know your facts!' : score >= 5 ? 'Good job! Keep learning!' : 'Keep practicing — knowledge is power!'}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setCurrent(0); setScore(0); setAnswered(false); setSelectedTruth(null); setFinished(false); }}
            className="rounded-2xl bg-tov-blue px-4 py-2.5 text-sm font-medium text-white">Play Again</button>
          <Link to="/games/ckn" className="rounded-2xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600">Back</Link>
        </div>
      </div>
    )
  }

  return (
    <div data-page="Chokwadi_Kana_Nhema_Solo_Page" aria-label="Chokwadi Kana Nhema Solo Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/games/ckn" className="text-sm text-tov-blue hover:underline">&larr; Back</Link>
        <span className="text-sm font-medium text-tov-blue">{score}/{statements.length}</span>
      </div>
      <div className="h-2 rounded-full bg-stone-100">
        <div className="h-2 rounded-full bg-tov-blue transition-all" style={{ width: `${((current + 1) / statements.length) * 100}%` }} />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-center text-lg font-medium text-stone-800">"{s.text}"</p>
        {!answered ? (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button onClick={() => answer(true)}
              className="rounded-2xl border-2 border-green-300 bg-green-50 py-4 text-sm font-semibold text-green-700 hover:bg-green-100">TRUE</button>
            <button onClick={() => answer(false)}
              className="rounded-2xl border-2 border-red-300 bg-red-50 py-4 text-sm font-semibold text-red-700 hover:bg-red-100">FALSE</button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className={`rounded-xl p-3 text-center text-sm font-medium ${
              selectedTruth === s.truth ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {selectedTruth === s.truth ? '✓ Correct!' : '✗ Incorrect'}
            </div>
            <p className="text-xs text-stone-500">{s.explanation}</p>
            <button onClick={next}
              className="w-full rounded-2xl bg-tov-blue py-3 text-sm font-semibold text-white">
              {current < statements.length - 1 ? 'Next Statement' : 'See Results'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
