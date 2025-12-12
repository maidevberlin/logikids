#!/usr/bin/env bun
/**
 * Prompt System Checker
 *
 * Validates the backend prompt system (registries, templates, task types).
 * For concept validation, use `bun run scripts/check-concepts.ts` from repo root.
 *
 * Usage:
 *   bun run src/cli/check-prompts.ts
 */

import { validatePrompts } from './lib/validators'

async function main() {
  console.log('\n🔍 Validating prompt system...\n')

  const result = await validatePrompts()

  console.log('═'.repeat(60))
  console.log('PROMPT SYSTEM VALIDATION')
  console.log('═'.repeat(60))

  if (result.status === 'pass') {
    console.log('✅ PASS - All prompt system checks passed\n')
    process.exit(0)
  }

  console.log(`❌ FAIL - ${result.issues.length} issue(s)\n`)

  result.issues.forEach((issue, i) => {
    console.log(`  ${i + 1}. ${issue.message}`)
    console.log(`     Fix: ${issue.fix}\n`)
  })

  console.log('═'.repeat(60))
  process.exit(1)
}

void main()
