export async function hashPassword(password) {
  if (!password) return null
  const encoder = new TextEncoder()
  const data = encoder.encode('tov:' + password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
