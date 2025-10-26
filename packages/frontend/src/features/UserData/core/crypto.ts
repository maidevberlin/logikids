const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12 // 96 bits recommended for AES-GCM

/**
 * Generate a new AES-256-GCM encryption key
 */
export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: ALGORITHM, length: KEY_LENGTH },
    true, // extractable
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypt data with the given key
 */
export async function encrypt(key: CryptoKey, data: any): Promise<string> {
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))

  // Convert data to JSON then to bytes
  const encoder = new TextEncoder()
  const dataBytes = encoder.encode(JSON.stringify(data))

  // Encrypt
  const encryptedData = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    dataBytes
  )

  // Combine IV + encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encryptedData), iv.length)

  // Convert to base64
  return btoa(String.fromCharCode(...combined))
}

/**
 * Decrypt data with the given key
 */
export async function decrypt(key: CryptoKey, encryptedString: string): Promise<any> {
  // Decode base64
  const combined = Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0))

  // Extract IV and encrypted data
  const iv = combined.slice(0, IV_LENGTH)
  const encryptedData = combined.slice(IV_LENGTH)

  // Decrypt
  const decryptedData = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    encryptedData
  )

  // Convert bytes to JSON
  const decoder = new TextDecoder()
  const jsonString = decoder.decode(decryptedData)

  return JSON.parse(jsonString)
}

/**
 * Export key to JWK format for storage/transfer
 */
export async function exportKey(key: CryptoKey): Promise<JsonWebKey> {
  return crypto.subtle.exportKey('jwk', key)
}

/**
 * Import key from JWK format
 */
export async function importKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  )
}
