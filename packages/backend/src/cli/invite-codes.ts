#!/usr/bin/env bun
/**
 * Invite Code Management CLI
 *
 * Usage:
 *   bun run src/cli/invite-codes.ts list
 *   bun run src/cli/invite-codes.ts create [note]
 *   bun run src/cli/invite-codes.ts remove <code>
 */

import { Database } from 'bun:sqlite'
import { randomBytes } from 'crypto'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

const DB_PATH = './data/invite-codes.db'

interface InviteCode {
  code: string
  created_at: number
  expires_at: number
  used_at: number | null
  note: string | null
}

// Initialize database
function initDB(): Database {
  // Ensure data directory exists
  const dbDir = dirname(DB_PATH)
  try {
    mkdirSync(dbDir, { recursive: true })
  } catch (err) {
    // Directory might already exist, ignore error
  }

  const db = new Database(DB_PATH)

  // Create table if not exists
  db.run(`
    CREATE TABLE IF NOT EXISTS invite_codes (
      code TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      used_at INTEGER,
      note TEXT
    )
  `)

  return db
}

// Generate random invite code (8 chars, alphanumeric, easy to type)
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No confusing chars (0, O, I, 1)
  let code = ''
  const bytes = randomBytes(8)

  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length]
  }

  // Format as XXXX-XXXX for readability
  return `${code.slice(0, 4)}-${code.slice(4)}`
}

// Create new invite code
function createCode(note?: string): InviteCode {
  const db = initDB()
  const code = generateCode()
  const now = Date.now()
  const expiresAt = now + (7 * 24 * 60 * 60 * 1000) // 7 days

  db.run(
    'INSERT INTO invite_codes (code, created_at, expires_at, note) VALUES (?, ?, ?, ?)',
    [code, now, expiresAt, note || null]
  )

  db.close()

  return {
    code,
    created_at: now,
    expires_at: expiresAt,
    used_at: null,
    note: note || null
  }
}

// List all invite codes
function listCodes(): InviteCode[] {
  const db = initDB()
  const codes = db.query('SELECT * FROM invite_codes ORDER BY created_at DESC').all() as InviteCode[]
  db.close()
  return codes
}

// Remove invite code
function removeCode(code: string): boolean {
  const db = initDB()
  const result = db.run('DELETE FROM invite_codes WHERE code = ?', [code])
  db.close()
  return result.changes > 0
}

// Remove all invite codes
function removeAllCodes(): number {
  const db = initDB()
  const result = db.run('DELETE FROM invite_codes')
  const deletedCount = result.changes
  db.close()
  return deletedCount
}

// Format timestamp for display
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Main CLI
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'list': {
    const codes = listCodes()

    if (codes.length === 0) {
      console.log('No invite codes found.')
      break
    }

    console.log('\n📋 Invite Codes:\n')
    console.log('Code          | Created           | Expires           | Status     | Note')
    console.log('─'.repeat(85))

    for (const code of codes) {
      const now = Date.now()
      const isExpired = code.expires_at < now

      let status = '✅ Valid'
      if (isExpired) status = '❌ Expired'

      console.log(
        `${code.code.padEnd(13)} | ${formatDate(code.created_at).padEnd(17)} | ${formatDate(code.expires_at).padEnd(17)} | ${status.padEnd(10)} | ${code.note || '-'}`
      )
    }

    console.log('')
    break
  }

  case 'create': {
    const note = args.slice(1).join(' ') || undefined
    const code = createCode(note)

    console.log('\n✅ Invite code created!\n')
    console.log(`Code:    ${code.code}`)
    console.log(`Expires: ${formatDate(code.expires_at)}`)
    if (note) console.log(`Note:    ${note}`)
    console.log('')
    break
  }

  case 'remove': {
    const codeToRemove = args[1]

    if (!codeToRemove) {
      console.error('❌ Error: Please provide a code to remove')
      console.log('Usage: bun run src/cli/invite-codes.ts remove <code>')
      process.exit(1)
    }

    const removed = removeCode(codeToRemove)

    if (removed) {
      console.log(`\n✅ Removed invite code: ${codeToRemove}\n`)
    } else {
      console.error(`\n❌ Code not found: ${codeToRemove}\n`)
      process.exit(1)
    }
    break
  }

  case 'clear': {
    // Ask for confirmation
    console.log('\n⚠️  WARNING: This will delete ALL invite codes!')
    console.log('Type "yes" to confirm: ')

    // Simple synchronous confirmation (Bun supports readline)
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })

    readline.question('', (answer: string) => {
      readline.close()

      if (answer.toLowerCase() === 'yes') {
        const deletedCount = removeAllCodes()
        console.log(`\n✅ Deleted ${deletedCount} invite code(s)\n`)
      } else {
        console.log('\n❌ Cancelled\n')
        process.exit(1)
      }
    })
    break
  }

  default:
    console.log(`
📨 Invite Code Manager

Usage:
  bun run src/cli/invite-codes.ts list              - List all invite codes
  bun run src/cli/invite-codes.ts create [note]     - Create new invite code (optional note)
  bun run src/cli/invite-codes.ts remove <code>     - Remove invite code
  bun run src/cli/invite-codes.ts clear             - Delete ALL invite codes (with confirmation)

Examples:
  bun run src/cli/invite-codes.ts create "For Maria's family"
  bun run src/cli/invite-codes.ts remove ABCD-1234
  bun run src/cli/invite-codes.ts clear

Note: Used codes are automatically deleted after successful validation.
    `)
    process.exit(command ? 1 : 0)
}
