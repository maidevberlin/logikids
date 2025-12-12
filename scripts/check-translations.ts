#!/usr/bin/env bun
/**
 * Translation Checker CLI
 *
 * Validates translation completeness for educational concepts.
 *
 * Usage:
 *   bun run scripts/check-translations.ts                    # Show usage
 *   bun run scripts/check-translations.ts math/grade5-fractions  # Single concept
 *   bun run scripts/check-translations.ts math               # All in subject
 *   bun run scripts/check-translations.ts --all              # All subjects
 */

import { readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { SUPPORTED_LANGUAGES } from '../content/schema'

// Path resolution
function getContentPath(): string {
  return join(import.meta.dir, '../content/subjects')
}

function getLocalesPath(): string {
  return join(import.meta.dir, '../packages/frontend/public/locales')
}

function resolveConceptPath(input: string): string {
  const [subject, conceptName] = input.split('/')
  if (!subject || !conceptName) {
    throw new Error(`Invalid format: "${input}". Expected: subject/concept-name`)
  }
  const filename = conceptName.endsWith('.md') ? conceptName : `${conceptName}.md`
  return join(getContentPath(), subject, 'official', filename)
}

function extractSubject(path: string): string {
  const parts = path.split('/')
  const idx = parts.indexOf('subjects')
  return idx !== -1 ? parts[idx + 1] : ''
}

interface TranslationResult {
  missing: Array<{ lang: string; field?: string }>
  orphaned: Array<{ lang: string; key: string }>
}

// Check translations for a concept
function checkConceptTranslations(conceptId: string, subject: string): TranslationResult {
  const localesPath = getLocalesPath()
  const result: TranslationResult = { missing: [], orphaned: [] }

  for (const lang of SUPPORTED_LANGUAGES) {
    const translationPath = join(localesPath, lang, 'subjects', `${subject}.json`)

    if (!existsSync(translationPath)) {
      result.missing.push({ lang, field: 'file' })
      continue
    }

    try {
      const translations = JSON.parse(readFileSync(translationPath, 'utf-8'))

      if (!translations.concepts || !translations.concepts[conceptId]) {
        result.missing.push({ lang })
        continue
      }

      const concept = translations.concepts[conceptId]
      if (!concept.name) {
        result.missing.push({ lang, field: 'name' })
      }
      if (!concept.description) {
        result.missing.push({ lang, field: 'description' })
      }
    } catch {
      result.missing.push({ lang, field: 'parse-error' })
    }
  }

  return result
}

// Get all concept IDs from a subject
function getConceptIds(subject: string): string[] {
  const subjectPath = join(getContentPath(), subject, 'official')

  if (!existsSync(subjectPath)) {
    return []
  }

  const files = readdirSync(subjectPath).filter((f) => f.endsWith('.md') && f !== 'base.md')
  const ids: string[] = []

  for (const file of files) {
    try {
      const content = readFileSync(join(subjectPath, file), 'utf-8')
      const { data } = matter(content)
      if (data.id) ids.push(data.id)
    } catch {
      // Skip
    }
  }

  return ids
}

// Check single concept
function checkSingle(input: string): number {
  const filePath = resolveConceptPath(input)
  const subject = extractSubject(filePath)

  if (!existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    return 1
  }

  try {
    const content = readFileSync(filePath, 'utf-8')
    const { data } = matter(content)
    const conceptId = data.id

    if (!conceptId) {
      console.error(`❌ Concept has no 'id' in frontmatter`)
      return 1
    }

    console.log(`\n🔍 Checking translations for: ${input}\n`)

    const result = checkConceptTranslations(conceptId, subject)

    if (result.missing.length === 0) {
      console.log('✅ All translations present')
      return 0
    }

    console.log(`❌ Missing translations:\n`)
    for (const m of result.missing) {
      const field = m.field ? ` (${m.field})` : ''
      console.log(`  • ${m.lang}: ${conceptId}${field}`)
    }

    return 1
  } catch (error) {
    console.error(`❌ Error:`, error)
    return 1
  }
}

// Check all concepts in subject
function checkSubject(subject: string): { passed: number; failed: number } {
  const conceptIds = getConceptIds(subject)

  if (conceptIds.length === 0) {
    console.log(`⚠️ No concepts found in ${subject}`)
    return { passed: 0, failed: 0 }
  }

  console.log(`\n🔍 Checking translations for ${conceptIds.length} concepts in ${subject}\n`)

  let passed = 0
  let failed = 0
  const failures: string[] = []

  for (const conceptId of conceptIds) {
    process.stdout.write(`  ${conceptId}...`)
    const result = checkConceptTranslations(conceptId, subject)

    if (result.missing.length === 0) {
      console.log(' ✅')
      passed++
    } else {
      console.log(' ❌')
      failed++
      failures.push(conceptId)
    }
  }

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`)
  if (failures.length > 0) {
    console.log(`\nMissing translations for:`)
    failures.forEach((f) => console.log(`  • ${f}`))
  }
  console.log('═'.repeat(60))

  return { passed, failed }
}

// Check language setup status
interface LangStatus {
  lang: string
  frontendDir: boolean
  backendDir: boolean
}

function checkLanguageSetup(): LangStatus[] {
  const frontendLocalesPath = getLocalesPath()
  const backendLocalesPath = join(import.meta.dir, '../packages/backend/locales')

  return SUPPORTED_LANGUAGES.map((lang) => ({
    lang,
    frontendDir: existsSync(join(frontendLocalesPath, lang)),
    backendDir: existsSync(join(backendLocalesPath, lang)),
  }))
}

// Check all subjects
function checkAll(): number {
  const contentPath = getContentPath()

  if (!existsSync(contentPath)) {
    console.error(`❌ Content directory not found: ${contentPath}`)
    return 1
  }

  // Check language setup
  const langStatuses = checkLanguageSetup()
  const incomplete = langStatuses.filter((s) => !s.frontendDir || !s.backendDir)

  if (incomplete.length > 0) {
    console.log(`\n${'═'.repeat(60)}`)
    console.log(`LANGUAGE SETUP STATUS`)
    console.log('═'.repeat(60))

    for (const status of langStatuses) {
      const frontendIcon = status.frontendDir ? '✅' : '❌'
      const backendIcon = status.backendDir ? '✅' : '❌'
      console.log(`\n  ${status.lang.toUpperCase()}:`)
      console.log(`    ${frontendIcon} Frontend: packages/frontend/public/locales/${status.lang}/`)
      console.log(`    ${backendIcon} Backend:  packages/backend/locales/${status.lang}/`)
    }

    // Show fix instructions only for what's missing
    const missingFrontend = langStatuses.filter((s) => !s.frontendDir)
    const missingBackend = langStatuses.filter((s) => !s.backendDir)

    if (missingFrontend.length > 0 || missingBackend.length > 0) {
      console.log(`\n${'─'.repeat(60)}`)
      console.log(`HOW TO FIX:`)
      console.log('─'.repeat(60))

      let step = 1

      if (missingFrontend.length > 0) {
        console.log(`\n${step}. Create frontend locale directories:`)
        for (const { lang } of missingFrontend) {
          console.log(`   mkdir -p packages/frontend/public/locales/${lang}/subjects`)
        }
        step++

        console.log(`\n${step}. Copy frontend templates and translate:`)
        for (const { lang } of missingFrontend) {
          console.log(
            `   cp packages/frontend/public/locales/en/*.json packages/frontend/public/locales/${lang}/`
          )
          console.log(
            `   cp packages/frontend/public/locales/en/subjects/*.json packages/frontend/public/locales/${lang}/subjects/`
          )
        }
        step++
      }

      if (missingBackend.length > 0) {
        console.log(`\n${step}. Create backend locale directories:`)
        for (const { lang } of missingBackend) {
          console.log(`   mkdir -p packages/backend/locales/${lang}`)
          console.log(`   cp packages/backend/locales/en/*.json packages/backend/locales/${lang}/`)
        }
        step++
      }

      console.log(`\n${step}. Add concept translations to subject files:`)
      console.log(`   Edit: packages/frontend/public/locales/{lang}/subjects/*.json`)
      console.log(`   Each concept needs: { "name": "...", "description": "..." }`)
      step++

      console.log(`\n${step}. Update TTS voice config (if TTS needed):`)
      console.log(`   packages/backend/src/tts/service.ts (voiceConfig)`)
    }

    console.log(`\n${'═'.repeat(60)}\n`)
    return 1
  }

  const subjects = readdirSync(contentPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  console.log(`\n🔍 Checking translations for ${subjects.length} subjects\n`)

  let totalPassed = 0
  let totalFailed = 0

  for (const subject of subjects) {
    const { passed, failed } = checkSubject(subject)
    totalPassed += passed
    totalFailed += failed
  }

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`TOTAL: ${totalPassed} passed, ${totalFailed} failed`)
  console.log('═'.repeat(60))

  return totalFailed > 0 ? 1 : 0
}

// Usage
function printUsage() {
  console.log(`
🔍 Translation Checker

Usage:
  bun run scripts/check-translations.ts <subject>/<concept>   Check single concept
  bun run scripts/check-translations.ts <subject>             Check all in subject
  bun run scripts/check-translations.ts --all                 Check all subjects

Examples:
  bun run scripts/check-translations.ts math/grade5-fractions
  bun run scripts/check-translations.ts math
  bun run scripts/check-translations.ts --all
`)
}

// Main
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    printUsage()
    process.exit(0)
  }

  const input = args[0]

  if (input === '--all') {
    process.exit(checkAll())
  }

  if (input.includes('/')) {
    process.exit(checkSingle(input))
  }

  const { failed } = checkSubject(input)
  process.exit(failed > 0 ? 1 : 0)
}

void main()
