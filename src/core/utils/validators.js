export const validateName = (name) => {
  if (!name || !name.trim()) return 'Name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  if (name.trim().length > 50) return 'Name must be 50 characters or less'
  return null
}

export const validateAge = (age) => {
  if (!age && age !== 0) return 'Age is required'
  const n = parseInt(age)
  if (isNaN(n) || n < 5) return 'Must be at least 5 years old'
  if (n > 120) return 'Invalid age'
  return null
}

export const validatePIN = (pin) => {
  if (!pin) return 'PIN is required'
  if (pin.length < 4) return 'PIN must be at least 4 digits'
  if (pin.length > 8) return 'PIN must be 8 digits or less'
  if (!/^\d+$/.test(pin)) return 'PIN must contain only numbers'
  return null
}

export const validateEmail = (email) => {
  if (!email) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format'
  return null
}

export const validatePollQuestion = (q) => {
  if (!q || !q.trim()) return 'Question is required'
  if (q.trim().length < 10) return 'Question must be at least 10 characters'
  if (q.trim().length > 200) return 'Question must be 200 characters or less'
  return null
}
