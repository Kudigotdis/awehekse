import { useState } from 'react'
import scenariosData from '../../data/the-verdict.json'
import BackButton from '../../components/ui/BackButton'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function TheVerdict() {
  const [deck, setDeck] = useState([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [pick, setPick] = useState(null)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const [wrong, setWrong] = useState([])

  const scene = deck[index]

  const start = () => {
    setDeck(shuffle(scenariosData))
    setIndex(0)
    setScore(0)
    setStreak(0)
    setRevealed(false)
    setPick(null)
    setFinished(false)
    setWrong([])
    setStarted(true)
  }

  const judge = opt => {
    if (revealed) return
    const right = opt === scene.correct
    setPick(opt)
    setRevealed(true)
    const gained = right ? 100 + streak * 20 : 0
    setScore(s => s + gained)
    setStreak(s => (right ? s + 1 : 0))
    if (!right) setWrong(w => [...w, scene])
  }

  const next = () => {
    if (index + 1 >= deck.length) setFinished(true)
    else {
      setIndex(i => i + 1)
      setRevealed(false)
      setPick(null)
    }
  }

  if (!started) {
    return (
      <div data-page="The_Verdict_Page" aria-label="The Verdict Page" className="space-y-4">
        <h1 className="text-xl font-bold text-stone-800">The Verdict</h1>
        <p className="text-sm text-stone-500">
          Realistic scenarios — pass judgement using Zimbabwean law. {scenariosData.length} cases to rule on.
        </p>
        <div className="space-y-2 rounded-2xl bg-white p-4 text-sm text-stone-600 shadow-sm">
          <p>⚖️ {scenariosData.length} legal scenarios</p>
          <p>🔥 Streak bonus: +20 pts per correct ruling</p>
          <p>📜 Learn the statute, penalty and takeaway for each case</p>
        </div>
        <button
          onClick={start}
          className="block w-full rounded-xl bg-tov-blue py-3 text-center text-sm font-semibold text-white active:scale-[0.99]"
        >
          Start Game
        </button>
        <BackButton to="/activities" label="← Back to Activities" />
      </div>
    )
  }

  if (finished) {
    return (
      <div data-page="The_Verdict_Page" aria-label="The Verdict Page" className="space-y-4">
        <h1 className="text-xl font-bold text-stone-800">The Verdict — Done!</h1>
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-4xl">{score >= deck.length * 80 ? '⚖️' : '🎓'}</p>
          <p className={`mt-2 text-lg font-bold ${score >= deck.length * 80 ? 'text-tov-gold' : 'text-tov-green'}`}>
            {score >= deck.length * 80 ? 'Legal Eagle' : 'Courtroom Scholar'}
          </p>
          <p className="mt-1 text-sm text-stone-500">
            {deck.length - wrong.length} / {deck.length} correct rulings
          </p>
          <p className="text-xs text-stone-400">Score: {score}</p>
        </div>
        {wrong.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-800">Rulings to review</h3>
            {wrong.map((s, i) => (
              <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-stone-800">{s.title}</p>
                <p className="mt-1 text-xs font-bold text-tov-blue">{s.statute}</p>
                <p className="mt-1 text-xs text-stone-500">{s.takeaway}</p>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={start}
          className="block w-full rounded-xl bg-tov-blue py-3 text-center text-sm font-semibold text-white active:scale-[0.99]"
        >
          Play Again
        </button>
        <BackButton to="/activities" label="← Back to Activities" />
      </div>
    )
  }

  if (!scene) return null

  return (
    <div data-page="The_Verdict_Page" aria-label="The Verdict Page" className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
        <span>Case {index + 1} / {deck.length}</span>
        <span>Streak: ×{streak}</span>
        <span>Score: {score}</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
        <div className="h-full rounded-full bg-tov-blue transition-all" style={{ width: `${((index + 1) / deck.length) * 100}%` }} />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-tov-blue">{scene.title}</h2>
        <div
          className="mt-2 text-sm text-stone-600"
          dangerouslySetInnerHTML={{ __html: scene.description }}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold text-stone-800">What is the correct sentence?</h3>
        {scene.options.map((opt, i) => {
          let cls = 'bg-white text-stone-700 shadow-sm'
          if (revealed) {
            if (i === scene.correct) cls = 'bg-tov-green text-white'
            else if (i === pick) cls = 'bg-tov-red text-white'
            else cls = 'bg-stone-100 text-stone-400'
          }
          return (
            <button
              key={i}
              onClick={() => judge(i)}
              disabled={revealed}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all active:scale-[0.99] ${cls}`}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className="space-y-3">
          <div className={`rounded-2xl p-4 text-center ${pick === scene.correct ? 'bg-tov-green/10' : 'bg-tov-red/10'}`}>
            <p className={`text-lg font-bold ${pick === scene.correct ? 'text-tov-green' : 'text-tov-red'}`}>
              {pick === scene.correct ? '✓ Correct verdict!' : '✗ The court disagreed'}
            </p>
            <p className="mt-1 text-sm text-stone-600">
              Correct: {String.fromCharCode(65 + scene.correct)}. {scene.options[scene.correct]}
            </p>
          </div>
          <div className="rounded-2xl bg-tov-cream p-4 text-sm text-stone-700">
            <p>
              <span className="font-bold">Penalty:</span> {scene.penalty}
            </p>
            <p className="mt-1">
              <span className="font-bold">Statute:</span> {scene.statute}
            </p>
            <p className="mt-1">
              <span className="font-bold">Takeaway:</span> {scene.takeaway}
            </p>
          </div>
          <button onClick={next} className="w-full rounded-xl bg-tov-blue py-3 text-sm font-semibold text-white active:scale-[0.99]">
            {index < deck.length - 1 ? 'Next case' : 'See results'}
          </button>
        </div>
      )}

      <BackButton to="/activities" label="← Back to Activities" />
    </div>
  )
}
