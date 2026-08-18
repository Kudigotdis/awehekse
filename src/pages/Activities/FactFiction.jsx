import { useMemo, useState } from 'react'
import cardsData from '../../data/fact-fiction.json'
import BackButton from '../../components/ui/BackButton'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const catLabels = { substance: 'Substances', mental: 'Mental Health', health: 'Health', legal: 'Legal' }

export default function FactFiction() {
  const [deck, setDeck] = useState([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(null)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const [wrong, setWrong] = useState([])

  const card = deck[index]

  const start = () => {
    setDeck(shuffle(cardsData))
    setIndex(0)
    setScore(0)
    setStreak(0)
    setRevealed(false)
    setCorrect(null)
    setFinished(false)
    setWrong([])
    setStarted(true)
  }

  const answer = isTrue => {
    if (revealed) return
    const right = isTrue === card.isTrue
    setCorrect(right)
    setRevealed(true)
    const gained = right ? 100 + streak * 20 : 0
    setScore(s => s + gained)
    setStreak(s => (right ? s + 1 : 0))
    if (!right) setWrong(w => [...w, card])
  }

  const next = () => {
    if (index + 1 >= deck.length) setFinished(true)
    else {
      setIndex(i => i + 1)
      setRevealed(false)
      setCorrect(null)
    }
  }

  const verdict = useMemo(() => {
    const pct = deck.length ? (deck.length - wrong.length) / deck.length : 0
    if (pct >= 0.8) return { emoji: '🏆', title: 'Truth Detective', color: 'text-tov-gold' }
    if (pct >= 0.5) return { emoji: '💪', title: 'Fact Checker', color: 'text-tov-green' }
    return { emoji: '📚', title: 'Truth Seeker', color: 'text-tov-purple' }
  }, [deck.length, wrong.length])

  if (!started) {
    return (
      <div data-page="Fact_Fiction_Page" aria-label="Fact Fiction Page" className="space-y-4">
        <h1 className="text-xl font-bold text-stone-800">Fact &amp; Fiction</h1>
        <p className="text-sm text-stone-500">
          {cardsData.length} claims about substances, mental health and the law. Separate fact from fiction.
        </p>
        <div className="space-y-2 rounded-2xl bg-white p-4 text-sm text-stone-600 shadow-sm">
          <p>🃏 Swipe through all {cardsData.length} cards</p>
          <p>🔥 Streak bonus: +20 pts per correct in a row</p>
          <p>💬 Every card teaches the real mechanism behind the claim</p>
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
      <div data-page="Fact_Fiction_Page" aria-label="Fact Fiction Page" className="space-y-4">
        <h1 className="text-xl font-bold text-stone-800">Fact &amp; Fiction — Done!</h1>
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-4xl">{verdict.emoji}</p>
          <p className={`mt-2 text-lg font-bold ${verdict.color}`}>{verdict.title}</p>
          <p className="mt-1 text-sm text-stone-500">
            {deck.length - wrong.length} / {deck.length} correct
          </p>
          <p className="text-xs text-stone-400">Score: {score}</p>
        </div>
        {wrong.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-800">What you missed</h3>
            {wrong.map((c, i) => (
              <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-stone-800">{c.claim}</p>
                <p className="mt-1 text-xs font-bold text-tov-green">{c.isTrue ? 'Fact' : 'Fiction'}</p>
                <p className="mt-1 text-xs text-stone-500">{c.explanation}</p>
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

  if (!card) return null

  return (
    <div data-page="Fact_Fiction_Page" aria-label="Fact Fiction Page" className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
        <span>Card {index + 1} / {deck.length}</span>
        <span>Streak: ×{streak}</span>
        <span>Score: {score}</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
        <div className="h-full rounded-full bg-tov-blue transition-all" style={{ width: `${((index + 1) / deck.length) * 100}%` }} />
      </div>

      <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wide text-tov-blue">
          {catLabels[card.category] || card.category}
        </span>
        <p className="mt-2 text-lg font-semibold text-stone-800">"{card.claim}"</p>
        <p className="mt-1 text-xs text-stone-400">{card.mechanism}</p>
      </div>

      {!revealed ? (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => answer(true)} className="rounded-2xl bg-tov-green py-5 text-lg font-bold text-white active:scale-[0.97]">Fact</button>
          <button onClick={() => answer(false)} className="rounded-2xl bg-tov-red py-5 text-lg font-bold text-white active:scale-[0.97]">Fiction</button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className={`rounded-2xl p-4 text-center ${correct ? 'bg-tov-green/10' : 'bg-tov-red/10'}`}>
            <p className={`text-lg font-bold ${correct ? 'text-tov-green' : 'text-tov-red'}`}>
              {correct ? '✓ Correct!' : '✗ Not quite'}
            </p>
          </div>
          <div className="rounded-2xl bg-tov-cream p-4">
            <p className="text-sm font-semibold text-stone-700">
              Answer: {card.isTrue ? 'Fact' : 'Fiction'}
            </p>
            <p className="mt-1 text-sm text-stone-600">{card.explanation}</p>
          </div>
          <button onClick={next} className="w-full rounded-xl bg-tov-blue py-3 text-sm font-semibold text-white active:scale-[0.99]">
            {index < deck.length - 1 ? 'Next card' : 'See results'}
          </button>
        </div>
      )}

      <BackButton to="/activities" label="← Back to Activities" />
    </div>
  )
}
