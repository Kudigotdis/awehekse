import { Link } from 'react-router-dom'
import { useState } from 'react'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

export default function PostLessonReflection() {
  const { activeProfile } = useActiveProfile()
  const [reflection, setReflection] = useState('')
  const [rating, setRating] = useState(0)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    if (!reflection.trim()) return
    await db.journal.add({
      profileId: activeProfile.id,
      content: `[Lesson Reflection] ${reflection}`,
      type: 'reflection',
      rating,
      createdAt: new Date().toISOString()
    })
    setSaved(true)
  }

  if (saved) {
    return (
      <div data-page="Post_Lesson_Reflection_Page" aria-label="Post Lesson Reflection Page" className="space-y-6 py-8 text-center">
        <span className="text-6xl">📝</span>
        <h2 className="text-xl font-bold text-stone-800">Reflection saved!</h2>
        <Link to="/lessons" className="inline-block rounded-2xl bg-tov-green px-4 py-2.5 text-sm font-medium text-white">Back to Lessons</Link>
      </div>
    )
  }

  return (
    <div data-page="Post_Lesson_Reflection_Page" aria-label="Post Lesson Reflection Page" className="space-y-6">
      <Link to="/lessons" className="text-sm text-tov-green hover:underline">&larr; Back</Link>
      <h1 className="text-2xl font-bold text-stone-800">Post-Lesson Reflection</h1>

      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-medium text-stone-500">How would you rate this lesson?</label>
          <div className="mt-2 flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(n)}
                className={`h-10 w-10 rounded-xl text-lg transition-all ${
                  rating >= n ? 'bg-tov-green text-white' : 'bg-stone-100 text-stone-400'
                }`}>★</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-500">What did you learn?</label>
          <textarea value={reflection} onChange={e => setReflection(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-tov-green focus:outline-none"
            rows={5} placeholder="Write your thoughts..." />
        </div>
      </div>

      <button onClick={save} disabled={!reflection.trim()}
        className="w-full rounded-2xl bg-tov-green py-3 text-sm font-semibold text-white hover:bg-tov-green/80 disabled:opacity-50">
        Save Reflection
      </button>
    </div>
  )
}
