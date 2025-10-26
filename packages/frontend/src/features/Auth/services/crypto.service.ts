/**
 * Cryptography service for end-to-end encryption
 * Uses Web Crypto API (AES-256-GCM) for secure encryption
 *
 * SECURITY GUARANTEE:
 * - All encryption/decryption happens client-side
 * - Keys never leave the user's device (except during pairing)
 * - Server cannot decrypt user data
 */

export interface EncryptedPayload {
  encryptedBlob: string // Base64-encoded ciphertext
  iv: string // Base64-encoded initialization vector (12 bytes)
  timestamp: number // Unix timestamp in milliseconds
  checksum: string // SHA-256 hash (hex string)
}

export interface QRPairingData {
  version: number
  type: 'logikids-pairing'
  userId: string
  key: string // Base64-encoded encryption key
  createdAt: number
}

class CryptoService {
  private readonly algorithm = 'AES-GCM'
  private readonly keyLength = 256
  private readonly ivLength = 12 // 12 bytes for GCM

  /**
   * Generate a new 256-bit encryption key
   */
  async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength,
      },
      true, // extractable (needed for export/QR)
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Encrypt data with AES-256-GCM
   */
  async encrypt(key: CryptoKey, data: any): Promise<EncryptedPayload> {
    // Serialize data to JSON
    const plaintext = JSON.stringify(data)
    const plaintextBuffer = new TextEncoder().encode(plaintext)

    // Generate random IV (12 bytes for GCM)
    const iv = crypto.getRandomValues(new Uint8Array(this.ivLength))

    // Encrypt with AES-256-GCM
    const ciphertextBuffer = await crypto.subtle.encrypt(
      { name: this.algorithm, iv },
      key,
      plaintextBuffer
    )

    // Convert to base64
    const encryptedBlob = this.arrayBufferToBase64(ciphertextBuffer)
    const ivBase64 = this.arrayBufferToBase64(iv)

    // Calculate checksum
    const checksum = await this.calculateChecksum(new Uint8Array(ciphertextBuffer))

    return {
      encryptedBlob,
      iv: ivBase64,
      timestamp: Date.now(),
      checksum,
    }
  }

  /**
   * Decrypt data with AES-256-GCM
   */
  async decrypt(key: CryptoKey, payload: EncryptedPayload): Promise<any> {
    // Verify checksum
    const ciphertextBuffer = this.base64ToArrayBuffer(payload.encryptedBlob)
    const calculatedChecksum = await this.calculateChecksum(new Uint8Array(ciphertextBuffer))

    if (calculatedChecksum !== payload.checksum) {
      throw new Error('Data integrity check failed - checksum mismatch')
    }

    // Decrypt
    const iv = this.base64ToArrayBuffer(payload.iv)

    try {
      const plaintextBuffer = await crypto.subtle.decrypt(
        { name: this.algorithm, iv },
        key,
        ciphertextBuffer
      )

      // Parse JSON
      const plaintext = new TextDecoder().decode(plaintextBuffer)
      return JSON.parse(plaintext)
    } catch (error) {
      throw new Error('Decryption failed - wrong key or corrupted data')
    }
  }

  /**
   * Export key for QR code or recovery kit
   */
  async exportKeyForQR(key: CryptoKey, userId: string): Promise<QRPairingData> {
    const rawKey = await crypto.subtle.exportKey('raw', key)
    const keyBase64 = this.arrayBufferToBase64(rawKey)

    return {
      version: 1,
      type: 'logikids-pairing',
      userId,
      key: keyBase64,
      createdAt: Date.now(),
    }
  }

  /**
   * Import key from QR code or recovery kit
   */
  async importKeyFromQR(qrData: QRPairingData | string): Promise<{ key: CryptoKey; userId: string }> {
    // Parse if string
    const parsed: QRPairingData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData

    // Validate format
    if (parsed.type !== 'logikids-pairing' || !parsed.userId || !parsed.key) {
      throw new Error('Invalid QR code format')
    }

    // Import key
    const keyBuffer = this.base64ToArrayBuffer(parsed.key)
    const key = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: this.algorithm },
      true,
      ['encrypt', 'decrypt']
    )

    return { key, userId: parsed.userId }
  }

  /**
   * Generate QR code data as JSON string
   */
  async generateQRString(key: CryptoKey, userId: string): Promise<string> {
    const qrData = await this.exportKeyForQR(key, userId)
    return JSON.stringify(qrData)
  }

  /**
   * Parse QR code string
   */
  async parseQRString(qrString: string): Promise<{ key: CryptoKey; userId: string }> {
    return this.importKeyFromQR(qrString)
  }

  /**
   * Calculate SHA-256 checksum
   */
  private async calculateChecksum(data: Uint8Array): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  /**
   * Convert base64 string to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }
}

// Export singleton instance
export const cryptoService = new CryptoService()
