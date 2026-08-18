import { useEffect, useMemo, useRef, useState } from 'react'
import quizData from '../../data/street-name-quiz.json'
import BackButton from '../../components/ui/BackButton'
import useRegionFilter from '../../hooks/useRegionFilter'

const TOTAL = 10
const TIME = 10000

const regionFlags = { ZW: '🇿🇼', ZA: '🇿🇦', GLOBAL: '🌍' }
const regionNames = { ZW: 'Zimbabwe', ZA: 'South Africa', GLOBAL: 'Global' }

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function drawRound(pool) {
  const shuffled = shuffle(pool)
  const round = shuffled.slice(0, TOTAL)
  return round.map(item => ({
    ...item,
    options: shuffle([item.clinical, ...shuffled.slice(TOTAL, TOTAL + 3).map(o => o.clinical)]),
  }))
}

export default function StreetNameQuiz() {
  const { region, filterByQuizRegion } = useRegionFilter()
  const filteredData = useMemo(() => filterByQuizRegion(quizData), [region])
  const [started, setStarted] = useState(false)
  const [round, setRound] = useState([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(TIME / 1000)
  const [feedback, setFeedback] = useState(null)
  const [missed, setMissed] = useState([])
  const [finished, setFinished] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!started || finished) return undefined
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 0.1))
    }, 100)
    return () => clearInterval(interval)
  }, [started, finished, feedback])

  useEffect(() => {
    if (timeLeft <= 0 && started && !finished && !feedback) handleTimeout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  useEffect(() => () => clearTimeout(timer.current), [])

  const start = () => {
    setRound(drawRound(filteredData))
    setIndex(0)
    setScore(0)
    setStreak(0)
    setLives(3)
    setTimeLeft(TIME / 1000)
    setMissed([])
    setFeedback(null)
    setFinished(false)
    setStarted(true)
  }

  const handleTimeout = () => {
    const item = round[index]
    if (!item) return
    const nextMissed = [...missed, item]
    const nextLives = lives - 1
    setMissed(nextMissed)
    setLives(nextLives)
    setFeedback({ correct: false, pick: null, item })
    if (nextLives <= 0) {
      clearTimeout(timer.current)
      setTimeout(() => setFinished(true), 1800)
    }
  }

  const pick = clinical => {
    if (feedback) return
    clearTimeout(timer.current)
    const item = round[index]
    const correct = clinical === item.clinical
    const nextStreak = correct ? streak + 1 : 0
    const points = correct ? 100 + streak * 25 : 0
    setScore(s => s + points)
    setStreak(nextStreak)
    if (!correct) {
      setLives(l => l - 1)
      setMissed(m => [...m, item])
    }
    setFeedback({ correct, pick: clinical, item })
    setTimeout(() => {
      if (correct || lives - 1 > 0) {
        if (index + 1 >= TOTAL) setFinished(true)
        else {
          setIndex(i => i + 1)
          setTimeLeft(TIME / 1000)
          setFeedback(null)
        }
      } else {
        setFinished(true)
      }
    }, 1500)
  }

  const item = round[index]

  const verdict = useMemo(() => {
    if (score >= 700) return { emoji: '🏆', title: 'Slang Street Legend', color: 'text-tov-gold' }
    if (score >= 450) return { emoji: '🌟', title: 'Street Knowledge Hero', color: 'text-tov-green' }
    if (score >= 250) return { emoji: '💪', title: 'Streetwise Apprentice', color: 'text-tov-blue-light' }
    return { emoji: '📚', title: 'Keep Learning', color: 'text-tov-purple' }
  }, [score])

  if (!started) {
    return (
      <div data-page="Street_Name_Quiz_Page" aria-label="Street Name Quiz Page" className="space-y-4">
        <h1 className="text-xl font-bold text-stone-800">Rapid-Fire Street Name Quiz</h1>
        <p className="text-sm text-stone-500">
          Slang terms from Zimbabwe, South Africa and the world — match each street name to its clinical term.
        </p>
        <div className="space-y-2 rounded-2xl bg-white p-4 text-sm text-stone-600 shadow-sm">
          <p>🎯 {TOTAL} rapid-fire questions</p>
          <p>⏱️ {TIME / 1000}s timer per question</p>
          <p>❤️ 3 lives — streak boosts your score</p>
          <p>🗺️ Terms come with region flags</p>
        </div>
        <button
          onClick={start}
          className="block w-full rounded-xl bg-tov-blue py-3 text-center text-sm font-semibold text-white active:scale-[0.99]"
        >
          Start Quiz
        </button>
        <BackButton to="/activities" label="← Back to Activities" />
      </div>
    )
  }

  if (finished) {
    return (
      <div data-page="Street_Name_Quiz_Page" aria-label="Street Name Quiz Page" className="space-y-4">
        <h1 className="text-xl font-bold text-stone-800">Street Name Quiz — Done!</h1>
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-4xl">{verdict.emoji}</p>
          <p className={`mt-2 text-lg font-bold ${verdict.color}`}>{verdict.title}</p>
          <p className="mt-1 text-sm text-stone-500">Score: {score} / {TOTAL * 100}</p>
          <p className="text-xs text-stone-400">Lives left: {lives}</p>
        </div>
        {missed.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-800">Missed terms</h3>
            {missed.map((m, i) => (
              <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-stone-800">
                  {m.slang} <span className="text-sm">{regionFlags[m.region] || ''}</span>
                </p>
                <p className="text-sm text-tov-blue">{m.clinical}</p>
                <p className="mt-1 text-xs text-stone-500">{m.explanation}</p>
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

  return (
    <div data-page="Street_Name_Quiz_Page" aria-label="Street Name Quiz Page" className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
        <span>Q {index + 1} / {TOTAL}</span>
        <span className={timeLeft < 4 ? 'text-tov-red' : ''}>⏱️ {Math.ceil(timeLeft)}s</span>
        <span>Score: {score}</span>
      </div>
      <div className="flex items-center justify-between text-xs font-semibold">
        <span>Streak: ×{streak}</span>
        <span className="tracking-wide">{"❤️".repeat(Math.max(0, lives))}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-tov-blue transition-all"
          style={{ width: `${(timeLeft / (TIME / 1000)) * 100}%` }}
        />
      </div>

      {item && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-center text-4xl">{regionFlags[item.region] || '🌍'}</p>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-tov-blue">{item.slang}</h2>
          <p className="mt-1 text-center text-xs text-stone-400">
            {regionNames[item.region] || 'Global'} street term
          </p>
          <div className="mt-4 grid gap-2">
            {item.options.map((opt, i) => {
              let cls = 'bg-tov-blue-pale text-tov-blue active:scale-[0.99]'
              if (feedback) {
                if (opt === item.clinical) cls = 'bg-tov-green text-white'
                else if (opt === feedback.pick) cls = 'bg-tov-red text-white'
                else cls = 'bg-stone-100 text-stone-400'
              }
              return (
                <button
                  key={i}
                  onClick={() => pick(opt)}
                  disabled={!!feedback}
                  className={`rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${cls}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {feedback && (
        <div
          className={`rounded-2xl p-4 text-sm shadow-sm ${
            feedback.correct ? 'bg-tov-green/10 text-tov-green' : 'bg-tov-red/10 text-tov-red'
          }`}
        >
          <p className="font-bold">{feedback.correct ? 'Correct!' : 'Not quite'}</p>
          {!feedback.correct && (
            <p className="mt-1">
              <span className="font-semibold">{feedback.item.slang}</span> ={' '}
              <span className="font-semibold">{feedback.item.clinical}</span>
            </p>
          )}
          <p className="mt-1 text-stone-600">{feedback.item.explanation}</p>
        </div>
      )}

      <BackButton to="/activities" label="← Back to Activities" />
    </div>
  )
}
