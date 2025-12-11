import 'reflect-metadata'
import { injectable } from 'tsyringe'
import { pool } from '../../database/db'
import { createHash } from 'crypto'

@injectable()
export class TTSCache {
  /**
   * Generate cache key from text and language using SHA256
   */
  private generateHash(text: string, language: string): string {
    const data = `${text}|${language}`
    return createHash('sha256').update(data).digest('hex')
  }

  /**
   * Get cached audio by text and language
   * Returns audio buffer if found, null if cache miss
   */
  async get(text: string, language: string): Promise<Buffer | null> {
    const hash = this.generateHash(text, language)

    try {
      const result = await pool.query<{ audio: Buffer }>(
        'SELECT audio FROM tts_cache WHERE text_hash = $1',
        [hash]
      )

      if (result.rows.length === 0) {
        return null
      }

      return result.rows[0].audio
    } catch (error) {
      // Return null on error to fall back to API call
      return null
    }
  }

  /**
   * Store audio in cache with text hash
   */
  async set(text: string, language: string, audio: Buffer): Promise<void> {
    const hash = this.generateHash(text, language)

    try {
      await pool.query(
        'INSERT INTO tts_cache (text_hash, language, audio) VALUES ($1, $2, $3) ON CONFLICT (text_hash) DO NOTHING',
        [hash, language, audio]
      )
    } catch (error) {
      // Don't throw - caching is optional, API call succeeded
    }
  }
}
