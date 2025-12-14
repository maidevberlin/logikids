#!/usr/bin/env bun
/**
 * Invite Code Management CLI
 *
 * Usage:
 *   bun run src/scripts/invite-codes.ts list
 *   bun run src/scripts/invite-codes.ts create [note]
 *   bun run src/scripts/invite-codes.ts remove <code>
 */

import { pool } from '../../database/db'
import { randomBytes } from 'crypto'
import type { InviteCode } from '../invites/types'

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
async function createCode(note?: string): Promise<InviteCode> {
  const code = generateCode()
  const now = Date.now()
  const expiresAt = now + 7 * 24 * 60 * 60 * 1000 // 7 days

  await pool.query(
    'INSERT INTO invite_codes (code, created_at, expires_at, note) VALUES ($1, $2, $3, $4)',
    [code, now, expiresAt, note || null]
  )

  return {
    code,
    created_at: now,
    expires_at: expiresAt,
    note: note || null,
    used_at: null,
    used_by: null,
  }
}

// List all invite codes
async function listCodes(): Promise<InviteCode[]> {
  const result = await pool.query<InviteCode>(
    'SELECT code, created_at, expires_at, used_by, used_at, note FROM invite_codes ORDER BY created_at DESC'
  )
  // PostgreSQL BIGINT comes back as string, convert to number
  return result.rows.map((row) => ({
    ...row,
    created_at: Number(row.created_at),
    expires_at: Number(row.expires_at),
    used_at: row.used_at ? Number(row.used_at) : null,
  }))
}

// Remove invite code
async function removeCode(code: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM invite_codes WHERE code = $1', [code])
  return result.rowCount !== null && result.rowCount > 0
}

// Remove all invite codes
async function removeAllCodes(): Promise<number> {
  const result = await pool.query('DELETE FROM invite_codes')
  return result.rowCount || 0
}

// Format timestamp for display
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Main CLI
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case 'list': {
      const codes = await listCodes()

      if (codes.length === 0) {
        console.log('No invite codes found.')
        break
      }

      console.log('\n📋 Invite Codes:\n')
      console.log(
        'Code          | Created           | Expires           | Used By                              | Used At           | Status     | Note'
      )
      console.log('─'.repeat(140))

      for (const code of codes) {
        const now = Date.now()
        const isExpired = code.expires_at < now
        const isUsed = code.used_at !== null

        let status = '✅ Valid'
        if (isUsed) status = '✔️  Used'
        else if (isExpired) status = '❌ Expired'

        const usedBy = code.used_by ? code.used_by.substring(0, 36) : '-'
        const usedAt = code.used_at ? formatDate(code.used_at) : '-'

        console.log(
          `${code.code.padEnd(13)} | ${formatDate(code.created_at).padEnd(17)} | ${formatDate(code.expires_at).padEnd(17)} | ${usedBy.padEnd(36)} | ${usedAt.padEnd(17)} | ${status.padEnd(10)} | ${code.note || '-'}`
        )
      }

      console.log('')
      break
    }

    case 'create': {
      const note = args.slice(1).join(' ') || undefined
      const code = await createCode(note)

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
        console.log('Usage: bun run src/scripts/invite-codes.ts remove <code>')
        process.exit(1)
      }

      const removed = await removeCode(codeToRemove)

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
        output: process.stdout,
      })

      readline.question('', async (answer: string) => {
        readline.close()

        if (answer.toLowerCase() === 'yes') {
          const deletedCount = await removeAllCodes()
          console.log(`\n✅ Deleted ${deletedCount} invite code(s)\n`)
        } else {
          console.log('\n❌ Cancelled\n')
          process.exit(1)
        }

        await pool.end()
      })
      break
    }

    default:
      console.log(`
📨 Invite Code Manager

Usage:
  bun run src/scripts/invite-codes.ts list              - List all invite codes
  bun run src/scripts/invite-codes.ts create [note]     - Create new invite code (optional note)
  bun run src/scripts/invite-codes.ts remove <code>     - Remove invite code
  bun run src/scripts/invite-codes.ts clear             - Delete ALL invite codes (with confirmation)

Examples:
  bun run src/scripts/invite-codes.ts create "For Maria's family"
  bun run src/scripts/invite-codes.ts remove ABCD-1234
  bun run src/scripts/invite-codes.ts clear

Note: Used codes are automatically deleted after successful validation.
      `)
      process.exit(command ? 1 : 0)
  }

  // Close pool for non-interactive commands
  if (command !== 'clear') {
    await pool.end()
  }
}

// Run main and handle errors
main().catch((error) => {
  console.error('❌ Error:', error.message)
  process.exit(1)
})
