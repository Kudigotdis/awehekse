import { useState } from 'react'
import { Link } from 'react-router-dom'
import { musicMatchBoard } from '../../data/activity-games'

const ICONS = { 1: '🎵', 2: '🎤', 3: '🎸', 4: '🥁', 5: '🎹', 6: '🎷' }

export default function MusicMatch() {
  const [board, setBoard] = useState(() => musicMatchBoard.map((c, i) => ({ ...c, id: i })))
  const [open, setOpen] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)

  const flip = (id) => {
    if (open.length === 2 || open.includes(id) || matched.includes(id)) return
    const next = [...open, id]
    setOpen(next)
    if (next.length === 2) {
      setMoves(m => m + 1)
      const [a, b] = next
      const cardA = board.find(c => c.id === a)
      const cardB = board.find(c => c.id === b)
      if (cardA.key === cardB.key) {
        setMatched(m => [...m, a, b])
        setOpen([])
      } else {
        setTimeout(() => setOpen([]), 600)
      }
    }
  }

  const done = matched.length === board.length

  return (
    <div data-page="Music_Match_Page" aria-label="Music Match Page" className="space-y-4">
      <Link to="/activities" className="inline-block text-sm text-tov-green hover:underline">&larr; Activities</Link>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-800">🎵 Music Match</h1>
        <span className="text-sm font-semibold text-tov-green">Moves: {moves}</span>
      </div>

      {done ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <span className="text-5xl">🏆</span>
          <h2 className="mt-3 text-xl font-bold text-stone-800">Perfect harmony!</h2>
          <p className="mt-1 text-sm text-stone-500">You matched the whole board in {moves} moves.</p>
          <button
            onClick={() => { setBoard(musicMatchBoard.map((c, i) => ({ ...c, id: i }))); setMatched([]); setOpen([]); setMoves(0) }}
            className="mt-5 rounded-xl bg-tov-blue px-6 py-3 text-sm font-semibold text-white"
          >
            Play again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {board.map(card => {
            const isOpen = open.includes(card.id) || matched.includes(card.id)
            return (
              <button
                key={card.id}
                onClick={() => flip(card.id)}
                className={`aspect-square rounded-xl text-3xl shadow-sm active:scale-[0.95] ${
                  isOpen ? 'bg-white' : 'bg-gradient-to-br from-tov-purple to-purple-700'
                } ${matched.includes(card.id) ? 'opacity-40' : ''}`}
              >
                {isOpen ? ICONS[card.key] : ''}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
