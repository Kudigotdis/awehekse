import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

const signs = [
  { symbol: '🚭', label: 'No Smoking', correct: true },
  { symbol: '🍺', label: 'Alcohol', correct: false },
  { symbol: '🚫', label: 'Prohibited', correct: true },
  { symbol: '💊', label: 'Medicine', correct: false },
  { symbol: '⚠️', label: 'Warning', correct: true },
  { symbol: '🏥', label: 'Hospital', correct: false },
  { symbol: '🛡️', label: 'Protection', correct: true },
  { symbol: '🧪', label: 'Drugs', correct: false },
  { symbol: '✅', label: 'Safe', correct: true },
  { symbol: '📵', label: 'No Drugs', correct: true },
  { symbol: '💉', label: 'Needle', correct: false },
  { symbol: '🏃', label: 'Exercise', correct: true },
]

export default function BCSolo() {
  const { activeProfile } = useActiveProfile()
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [currentSigns, setCurrentSigns] = useState([])
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started || finished) return
    if (timeLeft <= 0) {
      setFinished(true)
      db.gameScores.add({
        profileId: activeProfile.id,
        game: 'bc',
        mode: 'solo',
        score,
        total: round,
        createdAt: new Date().toISOString()
      })
      return
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, started, finished])

  useEffect(() => {
    if (started && !finished) generateSigns()
  }, [round, started])

  const generateSigns = () => {
    const shuffled = [...signs].sort(() => Math.random() - 0.5)
    setCurrentSigns(shuffled.slice(0, 4))
  }

  const tap = (sign) => {
    if (sign.correct) setScore(s => s + 1)
    setRound(r => r + 1)
  }

  if (!started) {
    return (
      <div data-page="Bata_Chiratidzo_Solo_Page" aria-label="Bata Chiratidzo Solo Page" className="space-y-6">
        <Link to="/games/bc" className="text-sm text-tov-orange hover:underline">&larr; Back</Link>
        <div className="rounded-2xl bg-gradient-to-br from-tov-orange to-orange-700 p-8 text-center text-white">
          <span className="text-5xl">🎯</span>
          <h1 className="mt-4 text-2xl font-bold">Bata Chiratidzo</h1>
          <p className="mt-2 text-sm text-white/70">Tap the HEALTH symbols. Avoid the harmful ones!</p>
          <button onClick={() => setStarted(true)}
            className="mt-6 rounded-2xl bg-white px-8 py-3 text-sm font-bold text-tov-orange hover:bg-white/90">
            Start Game
          </button>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm text-xs text-stone-500">
          <p>• Tap GREEN/positive symbols to score</p>
          <p>• Avoid harmful/negative symbols</p>
          <p>• You have 30 seconds</p>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div data-page="Bata_Chiratidzo_Solo_Page" aria-label="Bata Chiratidzo Solo Page" className="space-y-6 py-8 text-center">
        <span className="text-6xl">{score >= 8 ? '🏆' : score >= 5 ? '👏' : '💪'}</span>
        <h2 className="text-xl font-bold text-stone-800">Time's Up!</h2>
        <p className="text-3xl font-bold text-tov-orange">{score}/{round}</p>
        <p className="text-sm text-stone-500">You spotted {score} health signs in 30 seconds!</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setScore(0); setRound(0); setTimeLeft(30); setFinished(false); setStarted(false); }}
            className="rounded-2xl bg-tov-orange px-4 py-2.5 text-sm font-medium text-white">Play Again</button>
          <Link to="/games/bc" className="rounded-2xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600">Back</Link>
        </div>
      </div>
    )
  }

  return (
    <div data-page="Bata_Chiratidzo_Solo_Page" aria-label="Bata Chiratidzo Solo Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/games/bc" className="text-sm text-tov-orange hover:underline">&larr; Back</Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-tov-orange">{score}</span>
          <span className="text-sm font-mono text-stone-500">{timeLeft}s</span>
        </div>
      </div>

      <p className="text-center text-sm text-stone-500">Tap the HEALTH symbols!</p>

      <div className="grid grid-cols-2 gap-3">
        {currentSigns.map((sign, i) => (
          <button key={`${round}-${i}`} onClick={() => tap(sign)}
            className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm active:scale-95 transition-transform hover:shadow-md">
            <span className="text-5xl">{sign.symbol}</span>
            <span className="mt-2 text-xs text-stone-400">{sign.label}</span>
          </button>
        ))}
      </div>

      <div className="h-2 rounded-full bg-stone-100">
        <div className="h-2 rounded-full bg-tov-orange transition-all" style={{ width: `${(timeLeft / 30) * 100}%` }} />
      </div>
    </div>
  )
}
