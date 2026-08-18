import { useMemo, useState } from 'react'
import termsData from '../../data/term-builder.json'
import BackButton from '../../components/ui/BackButton'

const MAX_ROUNDS = 10

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const categories = ['all', 'substance', 'mental', 'legal']
const categoryLabels = { all: 'All', substance: 'Substances', mental: 'Mental Health', legal: 'Legal' }

export default function TermBuilder() {
  const [started, setStarted] = useState(false)
  const [rounds, setRounds] = useState([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [input, setInput] = useState('')
  const [usedHints, setUsedHints] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [wrong, setWrong] = useState(null)
  const [solved, setSolved] = useState([])
  const [finished, setFinished] = useState(false)
  const [category, setCategory] = useState('all')
  const [details, setDetails] = useState(null)

  const item = rounds[index]

  const shuffledLetters = useMemo(() => {
    if (!item) return []
    const letters = item.term.replace(/[^A-Z]/g, '').split('')
    return shuffle(letters)
  }, [item])

  const startFromCategory = c => {
    setCategory(c)
    const pool = c === 'all' ? termsData : termsData.filter(t => t.category === c)
    if (pool.length === 0) return
    const rs = shuffle(pool).slice(0, MAX_ROUNDS)
    setRounds(rs)
    setIndex(0)
    setScore(0)
    setStreak(0)
    setInput('')
    setUsedHints(0)
    setRevealed(false)
    setWrong(null)
    setSolved([])
    setFinished(false)
    setDetails(null)
    setStarted(true)
  }

  const giveHint = () => {
    if (!item || usedHints >= 2) return
    setUsedHints(h => h + 1)
    setScore(s => Math.max(0, s - 30))
  }

  const submit = () => {
    if (!item || revealed) return
    const guess = input.trim().toUpperCase()
    if (guess === item.term) {
      const gained = 100 + streak * 20
      setScore(s => s + gained)
      setStreak(s => s + 1)
      setSolved(s => [...s, item])
      setDetails({ ...item, gained })
    } else {
      setWrong(true)
      setScore(s => Math.max(0, s - 5))
      setTimeout(() => setWrong(null), 700)
    }
  }

  const next = () => {
    if (index + 1 >= rounds.length) setFinished(true)
    else {
      setIndex(i => i + 1)
      setInput('')
      setUsedHints(0)
      setRevealed(false)
      setWrong(null)
      setDetails(null)
    }
  }

  const reveal = () => {
    setRevealed(true)
    setStreak(0)
    setScore(s => Math.max(0, s - 50))
  }

  const verdict = useMemo(() => {
    const pct = rounds.length ? (solved.length / rounds.length) * 100 : 0
    if (pct >= 80) return { emoji: '🧠', title: 'Term Master', color: 'text-tov-gold' }
    if (pct >= 50) return { emoji: '📖', title: 'Vocabulary Builder', color: 'text-tov-green' }
    if (pct >= 25) return { emoji: '💪', title: 'Getting There', color: 'text-tov-blue-light' }
    return { emoji: '🌱', title: 'Fresh Learner', color: 'text-tov-purple' }
  }, [solved.length, rounds.length])

  if (!started) {
    return (
      <div data-page="Term_Builder_Page" aria-label="Term Builder Page" className="space-y-4">
        <h1 className="text-xl font-bold text-stone-800">Term Builder</h1>
        <p className="text-sm text-stone-500">
          Unscramble terms about substances, mental health and Zimbabwean law — then master the full definition.
        </p>
        <div className="space-y-2 rounded-2xl bg-white p-4 text-sm text-stone-600 shadow-sm">
          <p>🧩 Up to {MAX_ROUNDS} terms per game</p>
          <p>💡 2 hints per term (−30 pts each)</p>
          <p>🔥 Streak bonus: +20 pts per correct in a row</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => startFromCategory(c)}
              className="rounded-xl bg-tov-blue-pale px-4 py-3 text-sm font-semibold text-tov-blue active:scale-[0.99]"
            >
              {categoryLabels[c]}
            </button>
          ))}
        </div>
        <BackButton to="/activities" label="← Back to Activities" />
      </div>
    )
  }

  if (finished) {
    return (
      <div data-page="Term_Builder_Page" aria-label="Term Builder Page" className="space-y-4">
        <h1 className="text-xl font-bold text-stone-800">Term Builder — Done!</h1>
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-4xl">{verdict.emoji}</p>
          <p className={`mt-2 text-lg font-bold ${verdict.color}`}>{verdict.title}</p>
          <p className="mt-1 text-sm text-stone-500">
            {solved.length} / {rounds.length} terms mastered
          </p>
          <p className="text-xs text-stone-400">Score: {score}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-stone-800">Mastered terms</h3>
          {solved.map((s, i) => (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="font-semibold text-tov-blue">{s.term}</p>
              <p className="mt-1 text-xs text-stone-500">{s.definition}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => startFromCategory(category)}
          className="block w-full rounded-xl bg-tov-blue py-3 text-center text-sm font-semibold text-white active:scale-[0.99]"
        >
          Play Again
        </button>
        <BackButton to="/activities" label="← Back to Activities" />
      </div>
    )
  }

  if (!item) return null

  return (
    <div data-page="Term_Builder_Page" aria-label="Term Builder Page" className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
        <span>Term {index + 1} / {rounds.length}</span>
        <span>{categoryLabels[item.category]}</span>
        <span>Score: {score}</span>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-tov-gold">{item.zone}</p>
        <p className="mt-2 text-sm text-stone-600">{item.clue}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {shuffledLetters.map((letter, i) => (
            <span key={i} className="flex h-10 w-10 items-center justify-center rounded-lg bg-tov-blue-pale text-lg font-bold text-tov-blue">
              {letter}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <input
          value={input}
          onChange={e => {
            setInput(e.target.value)
            setWrong(null)
          }}
          placeholder="Type the term…"
          maxLength={30}
          className={`w-full rounded-xl border-2 px-4 py-3 text-center text-base font-bold uppercase tracking-widest outline-none ${
            wrong ? 'border-tov-red' : 'border-stone-200 focus:border-tov-blue'
          }`}
        />
        {revealed && (
          <p className="mt-2 text-center text-lg font-bold text-tov-blue">{item.term}</p>
        )}
        <div className="mt-3 flex gap-2">
          <button
            onClick={giveHint}
            disabled={usedHints >= 2}
            className="flex-1 rounded-xl bg-tov-gold/10 px-4 py-3 text-sm font-semibold text-tov-gold active:scale-[0.99] disabled:opacity-40"
          >
            💡 Hint (−30)
          </button>
          <button
            onClick={reveal}
            disabled={revealed}
            className="flex-1 rounded-xl bg-tov-red/10 px-4 py-3 text-sm font-semibold text-tov-red active:scale-[0.99] disabled:opacity-40"
          >
            Reveal (−50)
          </button>
        </div>
      </div>

      {details ? (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-center text-lg font-bold text-tov-green">
            +{details.gained} pts
          </p>
          <p className="mt-2 text-sm text-stone-700">{details.definition}</p>
          {details.streetNames && (
            <p className="mt-2 text-xs text-stone-500">
              <span className="font-bold">Street names:</span> {details.streetNames}
            </p>
          )}
          {details.legalFramework && (
            <p className="mt-1 text-xs text-stone-500">
              <span className="font-bold">Law:</span> {details.legalFramework}
            </p>
          )}
          {details.penalties && (
            <p className="mt-1 text-xs text-stone-500">
              <span className="font-bold">Penalties:</span> {details.penalties}
            </p>
          )}
          <button
            onClick={next}
            className="mt-4 block w-full rounded-xl bg-tov-blue py-3 text-center text-sm font-semibold text-white active:scale-[0.99]"
          >
            {index + 1 >= rounds.length ? 'See Results' : 'Next Term'}
          </button>
        </div>
      ) : (
        <button
          onClick={submit}
          className="block w-full rounded-xl bg-tov-blue py-3 text-center text-sm font-semibold text-white active:scale-[0.99]"
        >
          Submit
        </button>
      )}

      <BackButton to="/activities" label="← Back to Activities" />
    </div>
  )
}
