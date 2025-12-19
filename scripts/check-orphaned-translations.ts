#!/usr/bin/env bun
/**
 * Orphaned Translation Checker CLI
 *
 * Finds translations for concepts that no longer exist.
 *
 * Usage:
 *   bun run scripts/check-orphaned-translations.ts           # Show usage
 *   bun run scripts/check-orphaned-translations.ts german    # Single subject
 *   bun run scripts/check-orphaned-translations.ts --all     # All subjects
 *   bun run scripts/check-orphaned-translations.ts --fix     # Remove orphans (all subjects)
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { SUPPORTED_LANGUAGES } from '../packages/content/schema'

// Path resolution
function getContentPath(): string {
  return join(import.meta.dir, '../packages/content/subjects')
}

function getLocalesPath(): string {
  return join(import.meta.dir, '../packages/frontend/public/locales')
}

// Get all concept IDs from concept files in a subject
function getConceptIdsFromFiles(subject: string): Set<string> {
  const subjectPath = join(getContentPath(), subject, 'official')
  const ids = new Set<string>()

  if (!existsSync(subjectPath)) {
    return ids
  }

  const files = readdirSync(subjectPath).filter((f) => f.endsWith('.md') && f !== 'base.md')

  for (const file of files) {
    try {
      const content = readFileSync(join(subjectPath, file), 'utf-8')
      const { data } = matter(content)
      if (data.id) {
        ids.add(data.id)
      }
    } catch {
      // Skip files that can't be parsed
    }
  }

  return ids
}

// Get all concept IDs from translation file
function getConceptIdsFromTranslation(lang: string, subject: string): Set<string> {
  const translationPath = join(getLocalesPath(), lang, 'subjects', `${subject}.json`)
  const ids = new Set<string>()

  if (!existsSync(translationPath)) {
    return ids
  }

  try {
    const translations = JSON.parse(readFileSync(translationPath, 'utf-8'))
    if (translations.concepts) {
      for (const id of Object.keys(translations.concepts)) {
        ids.add(id)
      }
    }
  } catch {
    // Skip files that can't be parsed
  }

  return ids
}

interface OrphanedResult {
  subject: string
  lang: string
  orphanedIds: string[]
}

// Find orphaned translations for a subject
function findOrphanedInSubject(subject: string): OrphanedResult[] {
  const conceptIds = getConceptIdsFromFiles(subject)
  const results: OrphanedResult[] = []

  for (const lang of SUPPORTED_LANGUAGES) {
    const translationIds = getConceptIdsFromTranslation(lang, subject)
    const orphanedIds: string[] = []

    for (const id of translationIds) {
      if (!conceptIds.has(id)) {
        orphanedIds.push(id)
      }
    }

    if (orphanedIds.length > 0) {
      results.push({
        subject,
        lang,
        orphanedIds: orphanedIds.sort(),
      })
    }
  }

  return results
}

// Remove orphaned translations from a file
function removeOrphanedFromFile(lang: string, subject: string, orphanedIds: string[]): boolean {
  const translationPath = join(getLocalesPath(), lang, 'subjects', `${subject}.json`)

  if (!existsSync(translationPath)) {
    return false
  }

  try {
    const translations = JSON.parse(readFileSync(translationPath, 'utf-8'))

    if (!translations.concepts) {
      return false
    }

    let removed = 0
    for (const id of orphanedIds) {
      if (translations.concepts[id]) {
        delete translations.concepts[id]
        removed++
      }
    }

    if (removed > 0) {
      writeFileSync(translationPath, JSON.stringify(translations, null, 2) + '\n')
      return true
    }
  } catch {
    return false
  }

  return false
}

// Check single subject
function checkSubject(subject: string): OrphanedResult[] {
  const results = findOrphanedInSubject(subject)

  if (results.length === 0) {
    console.log(`  ${subject}: ✅ No orphaned translations`)
    return []
  }

  for (const result of results) {
    console.log(`  ${subject} (${result.lang}): ❌ ${result.orphanedIds.length} orphaned`)
    for (const id of result.orphanedIds) {
      console.log(`    • ${id}`)
    }
  }

  return results
}

// Get all subjects
function getAllSubjects(): string[] {
  const contentPath = getContentPath()

  if (!existsSync(contentPath)) {
    return []
  }

  return readdirSync(contentPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
}

// Check all subjects
function checkAll(): OrphanedResult[] {
  const subjects = getAllSubjects()
  console.log(`\n🔍 Checking for orphaned translations in ${subjects.length} subjects\n`)

  const allResults: OrphanedResult[] = []

  for (const subject of subjects) {
    const results = checkSubject(subject)
    allResults.push(...results)
  }

  return allResults
}

// Fix mode - remove orphaned translations
function fixAll(): number {
  const subjects = getAllSubjects()
  console.log(`\n🔧 Finding and removing orphaned translations\n`)

  let totalRemoved = 0

  for (const subject of subjects) {
    const results = findOrphanedInSubject(subject)

    for (const result of results) {
      const success = removeOrphanedFromFile(result.lang, result.subject, result.orphanedIds)
      if (success) {
        console.log(
          `  ✅ Removed ${result.orphanedIds.length} from ${result.lang}/${result.subject}.json:`
        )
        for (const id of result.orphanedIds) {
          console.log(`     • ${id}`)
        }
        totalRemoved += result.orphanedIds.length
      }
    }
  }

  if (totalRemoved === 0) {
    console.log(`  No orphaned translations found.`)
  } else {
    console.log(`\n${'═'.repeat(60)}`)
    console.log(`TOTAL: Removed ${totalRemoved} orphaned translations`)
    console.log('═'.repeat(60))
  }

  return 0
}

// Usage
function printUsage() {
  console.log(`
🔍 Orphaned Translation Checker

Finds translations for concepts that no longer exist in the codebase.

Usage:
  bun run scripts/check-orphaned-translations.ts <subject>   Check single subject
  bun run scripts/check-orphaned-translations.ts --all       Check all subjects
  bun run scripts/check-orphaned-translations.ts --fix       Remove orphaned translations

Examples:
  bun run scripts/check-orphaned-translations.ts german
  bun run scripts/check-orphaned-translations.ts math
  bun run scripts/check-orphaned-translations.ts --all
  bun run scripts/check-orphaned-translations.ts --fix
`)
}

// Print summary
function printSummary(results: OrphanedResult[]): number {
  if (results.length === 0) {
    console.log(`\n${'═'.repeat(60)}`)
    console.log(`✅ No orphaned translations found`)
    console.log('═'.repeat(60))
    return 0
  }

  const totalOrphaned = results.reduce((sum, r) => sum + r.orphanedIds.length, 0)

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`❌ Found ${totalOrphaned} orphaned translations in ${results.length} file(s)`)
  console.log(`\nRun with --fix to remove them:`)
  console.log(`  bun run scripts/check-orphaned-translations.ts --fix`)
  console.log('═'.repeat(60))

  return 1
}

// Main
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    printUsage()
    process.exit(0)
  }

  const input = args[0]

  if (input === '--fix') {
    process.exit(fixAll())
  }

  if (input === '--all') {
    const results = checkAll()
    process.exit(printSummary(results))
  }

  // Single subject
  const subjects = getAllSubjects()
  if (!subjects.includes(input)) {
    console.error(`❌ Subject not found: ${input}`)
    console.error(`Available subjects: ${subjects.join(', ')}`)
    process.exit(1)
  }

  console.log(`\n🔍 Checking for orphaned translations in ${input}\n`)
  const results = checkSubject(input)
  process.exit(printSummary(results))
}

void main()
