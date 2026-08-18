import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import pollQuestions from '../../data/poll-questions.json'
import htmlPollsQuestions from '../../data/html-polls-questions'

const questionBank = {}
for (const section of pollQuestions) {
  for (const q of section.questions) {
    questionBank[q.num] = { question: q.question, category: section.title }
  }
}
for (const q of htmlPollsQuestions) {
  questionBank[1000 + q.id] = { question: q.question, category: q.moduleName }
}

export default function PollResults() {
  const responses = useLiveQuery(() => db.pollResponses.toArray()) || []

  const grouped = {}
  for (const r of responses) {
    if (!grouped[r.pollId]) grouped[r.pollId] = {}
    grouped[r.pollId][r.response] = (grouped[r.pollId][r.response] || 0) + 1
  }

  const results = Object.entries(grouped)
    .map(([pollId, options]) => ({
      pollId: Number(pollId),
      question: questionBank[pollId]?.question || `Poll #${pollId}`,
      category: questionBank[pollId]?.category || 'Community',
      options
    }))
    .sort((a, b) => {
      const ta = Object.values(a.options).reduce((s, v) => s + v, 0)
      const tb = Object.values(b.options).reduce((s, v) => s + v, 0)
      return tb - ta
    })

  return (
    <div data-page="Poll_Results_Page" aria-label="Poll Results Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/polls" className="text-sm text-tov-blue hover:underline">&larr; Back</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">Community Results</h1>
      <p className="text-sm text-stone-500">Anonymous aggregated responses from your community.</p>

      {results.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <span className="text-5xl">📭</span>
          <h3 className="mt-3 font-semibold text-stone-800">No responses yet</h3>
          <p className="mt-1 text-sm text-stone-500">Take a poll to unlock the community results.</p>
          <Link to="/polls/participate" className="mt-4 inline-block rounded-xl bg-tov-blue px-5 py-2.5 text-sm font-semibold text-white">
            Take a Poll
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((r, i) => {
            const total = Object.values(r.options).reduce((s, v) => s + v, 0)
            return (
              <div key={i} className="rounded-2xl bg-white p-5 shadow-sm">
                <span className="rounded-full bg-tov-blue/10 px-2 py-0.5 text-[10px] font-medium text-tov-blue">{r.category}</span>
                <h3 className="mt-2 font-semibold text-stone-800">{r.question}</h3>
                <div className="mt-3 space-y-2">
                  {Object.entries(r.options).map(([opt, count]) => (
                    <div key={opt}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600">{opt}</span>
                        <span className="font-medium text-stone-500">{Math.round((count / total) * 100)}%</span>
                      </div>
                      <div className="mt-1 h-2.5 rounded-full bg-stone-100">
                        <div className="h-2.5 rounded-full bg-tov-blue" style={{ width: `${(count / total) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-stone-400">n={total} anonymous responses</p>
              </div>
            )
          })}
        </div>
      )}

      <div className="rounded-2xl bg-tov-blue/5 border border-tov-blue/20 p-4 text-xs text-tov-blue">
        Results are aggregated locally. No individual responses are ever identified.
      </div>
    </div>
  )
}
