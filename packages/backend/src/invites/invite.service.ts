import { Database } from 'bun:sqlite'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

const DB_PATH = './data/invite-codes.db'

export interface InviteCode {
  code: string
  created_at: number
  expires_at: number
  used_at: number | null
  note: string | null
}

export class InviteService {
  private db: Database

  constructor() {
    // Ensure data directory exists
    const dbDir = dirname(DB_PATH)
    try {
      mkdirSync(dbDir, { recursive: true })
    } catch (err) {
      // Directory might already exist, ignore error
    }

    this.db = new Database(DB_PATH)
    this.initDB()
  }

  private initDB(): void {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS invite_codes (
        code TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        used_at INTEGER,
        note TEXT
      )
    `)
  }

  /**
   * Validate and delete invite code (one-time use)
   */
  async validateAndUse(code: string): Promise<{ valid: boolean; reason?: string }> {
    const normalizedCode = code.toUpperCase().trim()

    const invite = this.db
      .query('SELECT * FROM invite_codes WHERE code = ?')
      .get(normalizedCode) as InviteCode | null

    if (!invite) {
      return { valid: false, reason: 'Code not found' }
    }

    if (invite.used_at !== null) {
      return { valid: false, reason: 'Code already used' }
    }

    const now = Date.now()
    if (invite.expires_at < now) {
      return { valid: false, reason: 'Code expired' }
    }

    // Delete code immediately after successful validation (no data trash)
    this.db.run('DELETE FROM invite_codes WHERE code = ?', [normalizedCode])

    return { valid: true }
  }

  /**
   * Check if code is valid (without marking as used)
   */
  async check(code: string): Promise<{ valid: boolean; reason?: string }> {
    const normalizedCode = code.toUpperCase().trim()

    const invite = this.db
      .query('SELECT * FROM invite_codes WHERE code = ?')
      .get(normalizedCode) as InviteCode | null

    if (!invite) {
      return { valid: false, reason: 'Code not found' }
    }

    if (invite.used_at !== null) {
      return { valid: false, reason: 'Code already used' }
    }

    const now = Date.now()
    if (invite.expires_at < now) {
      return { valid: false, reason: 'Code expired' }
    }

    return { valid: true }
  }

  close(): void {
    this.db.close()
  }
}
