import htmlPollsQuestions from './html-polls-questions'
import pollQuestions from './poll-questions.json'

const COLOR_PALETTE = [
  '#e8575a', '#4a9e6a', '#d4b84a', '#4a8ec4', '#7ec8e3',
  '#8ac94a', '#3a9e8e', '#e88a4a', '#e8603a', '#b87ac4',
  '#6a4a8a', '#d46a8a', '#3a8a9e', '#c47a3a', '#8a6ec4'
]

export function getColor(index) {
  return COLOR_PALETTE[index % COLOR_PALETTE.length]
}

export function getTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 160 ? '#1a1a1a' : '#ffffff'
}

function randParticipants() {
  return Math.floor(Math.random() * 1400) + 200
}

function groupQuestions(questions, groupSize = 10) {
  const groups = []
  for (let i = 0; i < questions.length; i += groupSize) {
    const chunk = questions.slice(i, i + groupSize)
    const moduleNames = [...new Set(chunk.map(q => q.moduleName))]
    const name = moduleNames.length === 1 ? moduleNames[0] : moduleNames.join(' · ')
    groups.push({
      id: groups.length + 1,
      name,
      moduleNames,
      questions: chunk,
      participants: randParticipants()
    })
  }
  return groups
}

const txtQuestions = []
for (const section of pollQuestions) {
  for (const q of section.questions) {
    txtQuestions.push({
      id: q.num,
      moduleName: section.title,
      question: q.question,
      options: q.options
    })
  }
}

export function pollIdFor(question) {
  return question.module ? 1000 + question.id : question.id
}

function buildPolls() {
  const htmlPolls = groupQuestions(htmlPollsQuestions)
  const txtPolls = groupQuestions(txtQuestions)
  const combined = [...htmlPolls, ...txtPolls]
  combined.forEach((poll, idx) => {
    poll.colorIndex = idx
    poll.questions.forEach(q => {
      q.pollId = pollIdFor(q)
      q.colorIndex = (q.id - 1) % COLOR_PALETTE.length
    })
  })
  return combined
}

export const POLLS = buildPolls()
