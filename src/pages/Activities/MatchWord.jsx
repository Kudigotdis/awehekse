import { useMemo, useState } from 'react'
import pairsData from '../../data/match-word-pairs.json'
import BackButton from '../../components/ui/BackButton'

const ROUNDS = 5
const ROUND_SIZE = 5

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRounds() {
  const rounds = []
  const pool = shuffle(pairsData)
  for (let r = 0; r < ROUNDS; r++) {
    const slice = pool.slice(r * ROUND_SIZE, r * ROUND_SIZE + ROUND_SIZE)
    if (slice.length < ROUND_SIZE) break
    rounds.push(slice)
  }
  return rounds
}

export default function MatchWord() {
  const [rounds, setRounds] = useState([])
  const [roundIdx, setRoundIdx] = useState(0)
  const [selectedSlang, setSelectedSlang] = useState(null)
  const [matched, setMatched] = useState(new Set())
  const [wrong, setWrong] = useState(null)
  const [summary, setSummary] = useState([])
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)

  const round = rounds[roundIdx] || []
  const roundDone = round.length > 0 && matched.size === round.length

  const slangList = useMemo(
    () => (rounds[roundIdx]?.length ? shuffle(rounds[roundIdx].map((p, i) => ({ ...p, i }))) : []),
    [rounds, roundIdx]
  )
  const clinicalList = useMemo(
    () => (rounds[roundIdx]?.length ? shuffle(rounds[roundIdx].map((p, i) => ({ ...p, i }))) : []),
    [rounds, roundIdx]
  )

  const start = () => {
    const rs = buildRounds()
    setRounds(rs)
    setRoundIdx(0)
    setMatched(new Set())
    setSelectedSlang(null)
    setSummary([])
    setFinished(false)
    setStarted(true)
  }

  const pickSlang = i => {
    if (matched.has(i)) return
    setWrong(null)
    setSelectedSlang(i)
  }

  const pickClinical = j => {
    if (!selectedSlang || matched.has(j)) return
    const s = round[selectedSlang]
    const c = round[j]
    if (s.slang === c.slang) {
      const next = new Set(matched)
      next.add(selectedSlang)
      next.add(j)
      setMatched(next)
      setSummary(prev => [...prev, c])
      setSelectedSlang(null)
    } else {
      setWrong(j)
      setSelectedSlang(null)
      setTimeout(() => setWrong(null), 700)
    }
  }

  const nextRound = () => {
    if (roundIdx + 1 >= rounds.length) setFinished(true)
    else {
      setRoundIdx(i => i + 1)
      setMatched(new Set())
      setSelectedSlang(null)
    }
  }

  const score = useMemo(() => {
    let total = 0
    for (const r of rounds) total += r.length
    return total
  }, [rounds])

  if (!started) {
    return (
      <div data-page="Match_Word_Page" aria-label="Match Word Page" className="space-y-4">
        <h1 className="text-xl font-bold text-stone-800">Slang to Clinical Match</h1>
        <p className="text-sm text-stone-500">
          Street names from Zimbabwe, South Africa and beyond — pair each slang term with its clinical meaning.
        </p>
        <div className="space-y-2 rounded-2xl bg-white p-4 text-sm text-stone-600 shadow-sm">
          <p>🎯 {ROUNDS} rounds of {ROUND_SIZE} pairs</p>
          <p>🔵 Tap a slang word, then its matching clinical term</p>
          <p>✅ Correct pairs lock in and reveal the meaning</p>
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
      <div data-page="Match_Word_Page" aria-label="Match Word Page" className="space-y-4">
        <h1 className="text-xl font-bold text-stone-800">Match Word — Done!</h1>
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-4xl">🎓</p>
          <p className="mt-2 text-lg font-bold text-tov-green">You matched {summary.length} of {score} terms</p>
          <p className="mt-1 text-sm text-stone-500">Great job staying streetwise and clinically clear.</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-stone-800">What you matched</h3>
          {summary.map((s, i) => (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="font-semibold text-stone-800">
                {s.slang} <span className="text-tov-blue">→ {s.clinical}</span>
              </p>
              <p className="mt-1 text-xs text-stone-500">{s.desc}</p>
            </div>
          ))}
        </div>
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

  return (
    <div data-page="Match_Word_Page" aria-label="Match Word Page" className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
        <span>Round {roundIdx + 1} / {rounds.length}</span>
        <span>{matched.size / 2} / {round.length} matched</span>
      </div>
      <h2 className="text-center text-lg font-bold text-stone-800">Tap the slang word, then its match</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-stone-400">Street name</h3>
          {slangList.map(p => (
            <button
              key={p.i}
              onClick={() => pickSlang(p.i)}
              disabled={matched.has(p.i)}
              className={`w-full rounded-xl px-3 py-3 text-sm font-semibold transition-all active:scale-[0.99] ${
                matched.has(p.i)
                  ? 'bg-tov-green/10 text-tov-green/60 line-through'
                  : selectedSlang === p.i
                    ? 'bg-tov-blue text-white'
                    : 'bg-tov-blue-pale text-tov-blue'
              }`}
            >
              {p.slang}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-stone-400">Clinical term</h3>
          {clinicalList.map(p => (
            <button
              key={p.i}
              onClick={() => pickClinical(p.i)}
              disabled={matched.has(p.i)}
              className={`w-full rounded-xl px-3 py-3 text-sm font-semibold transition-all active:scale-[0.99] ${
                matched.has(p.i)
                  ? 'bg-tov-green/10 text-tov-green/60 line-through'
                  : wrong === p.i
                    ? 'bg-tov-red text-white'
                    : 'bg-white text-tov-blue shadow-sm'
              }`}
            >
              {p.clinical}
            </button>
          ))}
        </div>
      </div>

      {roundDone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-6">
          <div className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-center text-3xl">✅</p>
            <h3 className="text-center text-lg font-bold text-tov-green">Round {roundIdx + 1} complete!</h3>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {summary.slice(-ROUND_SIZE).map((s, i) => (
                <div key={i} className="rounded-xl bg-tov-blue-pale p-3 text-sm">
                  <p className="font-semibold text-tov-blue">
                    {s.slang} → {s.clinical}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">{s.desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={nextRound}
              className="block w-full rounded-xl bg-tov-blue py-3 text-center text-sm font-semibold text-white active:scale-[0.99]"
            >
              {roundIdx + 1 >= rounds.length ? 'See Results' : 'Next Round'}
            </button>
          </div>
        </div>
      )}

      <BackButton to="/activities" label="← Back to Activities" />
    </div>
  )
}
