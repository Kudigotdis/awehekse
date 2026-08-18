import { useState } from 'react'
import { Link } from 'react-router-dom'
import { memoryFlashcards } from '../../data/activity-games'

export default function MemoryGame() {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)

  const card = memoryFlashcards[index]

  const rate = (knew) => {
    if (knew) setKnown(k => k + 1)
    if (index < memoryFlashcards.length - 1) {
      setIndex(index + 1)
      setFlipped(false)
    } else {
      setIndex(-1)
    }
  }

  if (index === -1) {
    return (
      <div data-page="Memory_Game_Page" aria-label="Memory Game Page" className="space-y-4">
        <Link to="/activities" className="inline-block text-sm text-tov-green hover:underline">&larr; Activities</Link>
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <span className="text-5xl">🧠</span>
          <h1 className="mt-3 text-2xl font-bold text-stone-800">Done!</h1>
          <p className="mt-1 text-sm text-stone-500">You knew {known} of {memoryFlashcards.length} cards.</p>
          <button onClick={() => { setIndex(0); setKnown(0); setFlipped(false) }} className="mt-5 rounded-xl bg-tov-blue px-6 py-3 text-sm font-semibold text-white">Shuffle again</button>
        </div>
      </div>
    )
  }

  return (
    <div data-page="Memory_Game_Page" aria-label="Memory Game Page" className="space-y-4">
      <Link to="/activities" className="inline-block text-sm text-tov-green hover:underline">&larr; Activities</Link>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-800">🧩 Memory</h1>
        <span className="text-sm font-semibold text-tov-green">{index + 1} / {memoryFlashcards.length}</span>
      </div>

      <button
        onClick={() => setFlipped(f => !f)}
        className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-tov-purple to-purple-700 p-6 text-center text-white shadow-md active:scale-[0.99]"
      >
        <p className="text-2xl font-bold">{flipped ? card.back : card.front}</p>
      </button>

      <p className="text-center text-xs text-stone-400">Tap the card to flip</p>

      {flipped && (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => rate(true)} className="rounded-2xl bg-tov-green py-4 text-sm font-bold text-white active:scale-[0.97]">✓ I knew it</button>
          <button onClick={() => rate(false)} className="rounded-2xl bg-stone-200 py-4 text-sm font-bold text-stone-700 active:scale-[0.97]">✗ Still learning</button>
        </div>
      )}
    </div>
  )
}
