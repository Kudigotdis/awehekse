async function deriveKey(pin, salt) {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(pin), 'PBKDF2', false, ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function hashPin(pin) {
  const salt = crypto.randomUUID()
  const key = await deriveKey(pin, salt)
  const exported = await crypto.subtle.exportKey('raw', key)
  const hash = btoa(String.fromCharCode(...new Uint8Array(exported)))
  return `${salt}:${hash}`
}

export async function verifyPin(pin, stored) {
  const [salt, hash] = stored.split(':')
  const key = await deriveKey(pin, salt)
  const exported = await crypto.subtle.exportKey('raw', key)
  const testHash = btoa(String.fromCharCode(...new Uint8Array(exported)))
  return hash === testHash
}

export async function encryptData(data, pin) {
  const encoder = new TextEncoder()
  const key = await deriveKey(pin, 'tov-native-encryption')
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(JSON.stringify(data))
  )
  return {
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
  }
}

export async function decryptData(encryptedObj, pin) {
  const key = await deriveKey(pin, 'tov-native-encryption')
  const iv = new Uint8Array(atob(encryptedObj.iv).split('').map(c => c.charCodeAt(0)))
  const data = new Uint8Array(atob(encryptedObj.data).split('').map(c => c.charCodeAt(0)))
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return JSON.parse(new TextDecoder().decode(decrypted))
}
