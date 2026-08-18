export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-ZW', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('en-ZW', {
    hour: '2-digit', minute: '2-digit'
  })
}

export const formatDateTime = (date) => {
  if (!date) return ''
  return `${formatDate(date)} ${formatTime(date)}`
}

export const getRelativeTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const d = new Date(date)
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

export const getWeekKey = (date) => {
  const d = date ? new Date(date) : new Date()
  const start = new Date(d)
  start.setDate(d.getDate() - d.getDay() + 1)
  return start.toISOString().split('T')[0]
}

export const isToday = (dateStr) => {
  return dateStr === new Date().toISOString().split('T')[0]
}
