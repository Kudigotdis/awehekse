import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'
import { POLLS, getColor, getTextColor } from '../../data/polls-feed'
import BackButton from '../../components/ui/BackButton'

const POINTS_PER_QUESTION = 5

function seededRandom(seed) {
  let a = seed
  return function () {
    a = (a * 16807) % 2147483647
    return (a - 1) / 2147483646
  }
}

function normalize(arr) {
  const s = arr.reduce((acc, x) => acc + x.pct, 0)
  arr.forEach(x => { x.pct = Math.round((x.pct / s) * 100) })
}

function buildDemos(seed) {
  const rng = seededRandom(seed)
  const gender = [
    { label: 'Female', pct: 40 + rng() * 30 },
    { label: 'Male', pct: 20 + rng() * 20 },
    { label: 'Non-binary', pct: 5 + rng() * 15 }
  ]
  const age = [
    { label: '18–24', pct: 15 + rng() * 25 },
    { label: '25–34', pct: 25 + rng() * 25 },
    { label: '35–44', pct: 15 + rng() * 20 },
    { label: '45+', pct: 10 + rng() * 15 }
  ]
  normalize(gender)
  normalize(age)
  return { gender, age }
}

function moduleStr(poll) {
  const head = poll.moduleNames.slice(0, 2).join(' · ')
  return poll.moduleNames.length > 2 ? `${head} · +${poll.moduleNames.length - 2}` : head
}

export default function PollParticipate() {
  const { activeProfile } = useActiveProfile()
  const responses = useLiveQuery(() => db.pollResponses.toArray()) || []

  const [view, setView] = useState('feed')
  const [pollId, setPollId] = useState(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [openAccs, setOpenAccs] = useState(new Set())
  const [openDemos, setOpenDemos] = useState(false)

  const poll = POLLS.find(p => p.id === pollId) || null

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    const prev = main.style.overflow
    main.style.overflow = view === 'feed' ? prev : 'hidden'
    return () => { main.style.overflow = prev }
  }, [view])

  const openPoll = id => {
    setPollId(id)
    setView('detail')
  }

  const startVoting = () => {
    setCurrentIdx(0)
    setAnswers({})
    setSelected(null)
    setView('voting')
  }

  const closeDetail = () => setView('feed')

  const selectAnswer = async (option) => {
    if (!poll) return
    const q = poll.questions[currentIdx]
    if (!q) return
    setSelected(option)
    setAnswers(a => ({ ...a, [q.pollId]: option }))

    await db.pollResponses.add({
      profileId: activeProfile?.id ?? 'anonymous',
      pollId: q.pollId,
      response: option,
      createdAt: new Date().toISOString()
    })

    setTimeout(() => {
      if (currentIdx < poll.questions.length - 1) {
        setCurrentIdx(i => i + 1)
        setSelected(null)
      } else {
        setOpenAccs(new Set())
        setOpenDemos(false)
        setView('results')
      }
    }, 250)
  }

  const goBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1)
      setSelected(null)
    } else {
      setView('detail')
    }
  }

  const returnToFeed = () => {
    setPollId(null)
    setView('feed')
  }

  const toggleAcc = idx => {
    setOpenAccs(prev => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      return next
    })
  }

  const detailRng = poll ? seededRandom(poll.id) : null
  const completionRate = detailRng ? Math.floor(detailRng() * 40) + 50 : 0

  const buildResults = () => {
    if (!poll) return []
    return poll.questions.map((q, qi) => {
      const realCounts = {}
      let realTotal = 0
      for (const r of responses) {
        if (r.pollId === q.pollId) {
          realCounts[r.response] = (realCounts[r.response] || 0) + 1
          realTotal++
        }
      }
      const base = poll.participants
      const rng = seededRandom(poll.id * 1000 + qi)
      const simulated = q.options.map(() => {
        const b = 100 / q.options.length
        return Math.max(5, Math.min(60, b + (rng() - 0.5) * 30))
      })
      const simSum = simulated.reduce((s, v) => s + v, 0)
      const options = q.options.map((opt, ri) => {
        let pct
        if (realTotal >= base) {
          pct = ((realCounts[opt] || 0) / realTotal) * 100
        } else {
          pct = (((realCounts[opt] || 0) + (simulated[ri] / simSum) * (base - realTotal)) / base) * 100
        }
        return { label: opt, pct, isUser: answers[q.pollId] === opt }
      })
      normalize(options)
      return { question: q, options }
    })
  }

  const results = view === 'results' && poll ? buildResults() : []
  const demos = view === 'results' && poll ? buildDemos(poll.id) : { gender: [], age: [] }

  const pollColor = poll ? getColor(poll.colorIndex) : '#1a1a1a'
  const pollText = poll ? getTextColor(pollColor) : '#ffffff'

  return (
    <div data-page="Poll_Participate_Page" aria-label="Poll Participate Page">
      {/* ─── FEED VIEW ─── */}
      {view === 'feed' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h1 className="text-lg font-bold text-stone-800">Tov <span className="font-medium text-stone-400">Polls</span></h1>
            </div>
            <span className="rounded-full bg-stone-100 px-3.5 py-1 text-xs font-semibold text-stone-500">
              {POLLS.length} polls
            </span>
          </div>

          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-stone-400">
            ⎯ Tap a poll to explore &amp; vote
          </p>

          <div className="space-y-4">
            {POLLS.map((p, idx) => {
              const color = getColor(idx)
              const textColor = getTextColor(color)
              return (
                <button
                  key={p.id}
                  onClick={() => openPoll(p.id)}
                  data-poll-id={p.id}
                  style={{ background: color, color: textColor }}
                  className="block w-full rounded-3xl p-5 text-left shadow-sm transition-transform active:scale-[0.97]"
                >
                  <span className="inline-block rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-wide" style={{ background: 'rgba(255,255,255,0.25)', color: textColor }}>
                    {p.questions.length} questions
                  </span>
                  <div className="mt-2.5 text-xl font-bold leading-snug">{p.name}</div>
                  <div className="mt-1 text-sm opacity-85">{moduleStr(p)}</div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span>👥 {p.participants.toLocaleString()} participants</span>
                    <span className="font-semibold">🔒 Results locked</span>
                  </div>
                </button>
              )
            })}
          </div>

          <BackButton to="/polls" label="Back to Polls" />
        </div>
      )}

      {/* ─── DETAIL VIEW ─── */}
      {view === 'detail' && poll && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeDetail} />
          <div className="relative z-10 max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white px-5 pb-8 pt-4">
            <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-stone-200" />
            <button onClick={closeDetail} aria-label="Close" className="absolute right-4 top-3 text-xl text-stone-400">✕</button>

            <span className="inline-block rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-wide" style={{ background: pollColor, color: pollText }}>
              {poll.moduleNames.join(' · ')}
            </span>
            <h2 className="mt-3 text-2xl font-bold leading-snug text-stone-800">{poll.name}</h2>
            <p className="mt-1 text-sm text-stone-500">
              {poll.questions.length} questions · {poll.participants.toLocaleString()} participants
            </p>

            <div className="mt-4 rounded-2xl bg-stone-50 p-4">
              {poll.questions.map((q, i) => (
                <div key={i} className="flex gap-2.5 border-b border-stone-200/60 py-1.5 text-sm text-stone-700 last:border-0">
                  <span className="w-6 shrink-0 font-bold text-stone-400">{i + 1}.</span>
                  <span>{q.question}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-500">
              <span>👥 {poll.participants.toLocaleString()} participants</span>
              <span>📊 {completionRate}% completion rate</span>
              <span>⏳ ~5 min to complete</span>
            </div>

            <button
              onClick={startVoting}
              style={{ background: pollColor, color: pollText }}
              className="mt-5 w-full rounded-full py-4 text-base font-bold transition-transform active:scale-[0.97]"
            >
              🗳️ Participate in this Poll
            </button>
          </div>
        </div>
      )}

      {/* ─── VOTING VIEW ─── */}
      {view === 'voting' && poll && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black px-6 pb-6">
          <div className="flex items-center justify-between border-b border-white/10 py-4">
            <button onClick={goBack} className="px-2 text-lg text-stone-400">‹ Back</button>
            <span className="text-sm font-medium text-stone-400">
              Question {currentIdx + 1} of {poll.questions.length}
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-center overflow-y-auto py-5">
            <div className="text-2xl font-semibold leading-relaxed text-white">
              {poll.questions[currentIdx]?.question}
            </div>
            <div className="mt-6 space-y-3">
              {poll.questions[currentIdx]?.options.map((opt, idx) => {
                const isSel = selected === opt
                return (
                  <button
                    key={idx}
                    onClick={() => selectAnswer(opt)}
                    className={`flex w-full items-center gap-3.5 rounded-2xl border-2 p-4 text-left text-base font-medium transition-all active:scale-[0.98] ${
                      isSel ? 'bg-white/5' : 'border-[#2c2c2e] bg-[#1c1c1e]'
                    }`}
                    style={isSel ? { borderColor: pollColor } : { color: '#e8e8e8' }}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2"
                      style={{ borderColor: isSel ? pollColor : '#4a4a4c' }}
                    >
                      <span className="h-3 w-3 rounded-full" style={{ background: isSel ? pollColor : 'transparent' }} />
                    </span>
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pb-2">
            <button
              onClick={() => selectAnswer(selected)}
              disabled={!selected}
              className={`w-full rounded-full py-4 text-base font-bold transition-all ${
                selected ? 'opacity-100' : 'pointer-events-none opacity-40'
              }`}
              style={selected ? { background: pollColor, color: pollText } : { background: '#2c2c2e', color: '#ffffff' }}
            >
              {currentIdx < poll.questions.length - 1 ? 'Next →' : 'Submit Vote'}
            </button>
          </div>
        </div>
      )}

      {/* ─── RESULTS VIEW ─── */}
      {view === 'results' && poll && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#f8f6f4]">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3.5">
            <h2 className="text-lg font-bold text-stone-800">📊 Poll Results</h2>
            <button onClick={returnToFeed} aria-label="Close results" className="px-2 text-xl text-stone-400">✕</button>
          </div>

          <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-4">
            <div className="rounded-2xl bg-white px-4 py-3.5 text-center text-sm text-stone-600 shadow-sm">
              <strong className="text-stone-800">{poll.name}</strong> · {poll.questions.length} questions · {poll.participants.toLocaleString()} participants
            </div>

            <div className="mt-4 space-y-3">
              {results.map((item, idx) => (
                <div key={idx} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                  <button onClick={() => toggleAcc(idx)} className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                        Q{idx + 1} · {item.question.moduleName}
                      </span>
                      <p className="mt-0.5 text-sm font-semibold leading-snug text-stone-800">{item.question.question}</p>
                    </div>
                    <span className={`shrink-0 text-lg text-stone-400 transition-transform ${openAccs.has(idx) ? 'rotate-180' : ''}`}>▾</span>
                  </button>

                  {openAccs.has(idx) && (
                    <div className="border-t border-stone-100 px-4 pb-4 pt-3">
                      <div className="space-y-3">
                        {item.options.map((o, ri) => (
                          <div key={ri}>
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-stone-700">{o.label} {o.isUser ? '✓' : ''}</span>
                              <span className="font-bold text-stone-700">{o.pct}%</span>
                            </div>
                            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-stone-100">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${o.pct}%`, background: o.isUser ? pollColor : getColor(ri + 5) }}
                              />
                            </div>
                            {o.isUser && <p className="mt-0.5 text-[11px] font-medium text-stone-500">🗳️ Your vote</p>}
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-center text-[10px] text-stone-400">
                        Based on {poll.participants.toLocaleString()} responses
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-sm">
              <button onClick={() => setOpenDemos(d => !d)} className="flex w-full items-center justify-between px-4 py-4">
                <span className="text-sm font-semibold text-stone-800">📊 Demographics</span>
                <span className={`text-lg text-stone-400 transition-transform ${openDemos ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {openDemos && (
                <div className="border-t border-stone-100 px-4 pb-5">
                  <div className="mb-3">
                    <p className="mb-1.5 text-xs font-semibold text-stone-500">Gender</p>
                    {demos.gender.map((d, i) => (
                      <div key={i} className="mb-2">
                        <div className="flex items-center justify-between text-xs text-stone-600">
                          <span>{d.label}</span><span>{d.pct}%</span>
                        </div>
                        <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-stone-100">
                          <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: getColor(d.label === 'Female' ? 0 : d.label === 'Male' ? 2 : 4) }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-semibold text-stone-500">Age Group</p>
                    {demos.age.map((d, i) => (
                      <div key={i} className="mb-2">
                        <div className="flex items-center justify-between text-xs text-stone-600">
                          <span>{d.label}</span><span>{d.pct}%</span>
                        </div>
                        <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-stone-100">
                          <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: getColor(d.label === '18–24' ? 1 : d.label === '25–34' ? 3 : 5) }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="py-3 text-center text-sm text-stone-500">
              ✅ Thank you for voting! You earned +{poll.questions.length * POINTS_PER_QUESTION} honesty points.
            </p>

            <button
              onClick={returnToFeed}
              className="w-full rounded-full bg-stone-800 py-4 text-base font-bold text-white transition-transform active:scale-[0.97]"
            >
              Return to Feed
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
