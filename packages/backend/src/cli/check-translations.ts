#!/usr/bin/env bun
/**
 * Translation Checker CLI
 *
 * Validates translation completeness for educational concepts.
 * Can check a single subject, single concept, or all subjects.
 *
 * Usage:
 *   bun run check:translations                         # Show usage
 *   bun run check:translations math/grade5-fractions   # Check one concept
 *   bun run check:translations math                    # Check one subject
 *   bun run check:translations --all                   # Check all subjects
 */

import { readdirSync, readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import matter from 'gray-matter'
import {
  getSubjectsBasePath,
  resolveSubjectPath,
  resolveConceptPath,
  extractSubjectFromPath,
} from './lib/paths'
import { colors, symbols, printSeparator, printSummary, type SummaryItem } from './lib/output'

interface TranslationData {
  concepts?: Record<string, { name?: string; description?: string }>
}

interface CheckResult {
  missingTranslations: Array<{ conceptId: string; language: string; field?: string }>
  orphanedTranslations: Array<{ key: string; language: string }>
  crossLanguageInconsistencies: Array<{ key: string; inLang: string; missingFrom: string }>
}

const LANGUAGES = ['de', 'en']

type MissingTranslation = { conceptId: string; language: string; field?: string }

/**
 * Check translations for a single concept across all languages
 */
function checkConceptTranslationsForLanguages(
  conceptId: string,
  translations: Record<string, TranslationData | null>
): MissingTranslation[] {
  const missing: MissingTranslation[] = []

  for (const lang of LANGUAGES) {
    const langData = translations[lang]

    if (!langData) {
      missing.push({ conceptId, language: lang, field: 'file' })
      continue
    }

    const concept = langData.concepts?.[conceptId]
    if (!concept) {
      missing.push({ conceptId, language: lang })
    } else {
      if (!concept.name) {
        missing.push({ conceptId, language: lang, field: 'name' })
      }
      if (!concept.description) {
        missing.push({ conceptId, language: lang, field: 'description' })
      }
    }
  }

  return missing
}

/**
 * Get path to locales directory
 */
function getLocalesPath(): string {
  const dockerLocalesPath = '/frontend/public/locales'
  const localLocalesPath = resolve(process.cwd(), '../../packages/frontend/public/locales')
  return existsSync(dockerLocalesPath) ? dockerLocalesPath : localLocalesPath
}

/**
 * Load translation file for a subject and language
 */
function loadTranslations(subject: string, language: string): TranslationData | null {
  const localesPath = getLocalesPath()
  const translationPath = resolve(localesPath, language, 'subjects', `${subject}.json`)

  if (!existsSync(translationPath)) {
    return null
  }

  try {
    return JSON.parse(readFileSync(translationPath, 'utf-8'))
  } catch {
    return null
  }
}

/**
 * Get all concept IDs from a subject directory
 */
function getConceptIds(subject: string): string[] {
  const subjectPath = resolveSubjectPath(subject)

  if (!existsSync(subjectPath)) {
    return []
  }

  const files = readdirSync(subjectPath).filter((f) => f.endsWith('.md') && f !== 'base.md')

  const conceptIds: string[] = []

  for (const file of files) {
    try {
      const filePath = resolve(subjectPath, file)
      const content = readFileSync(filePath, 'utf-8')
      const { data: frontmatter } = matter(content)
      if (frontmatter.id) {
        conceptIds.push(frontmatter.id)
      }
    } catch {
      // Skip files that can't be parsed
    }
  }

  return conceptIds
}

/**
 * Get all available subjects
 */
function getAllSubjects(): string[] {
  const subjectsBase = getSubjectsBasePath()

  if (!existsSync(subjectsBase)) {
    return []
  }

  return readdirSync(subjectsBase, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

/**
 * Check translations for a single subject
 */
function checkSubjectTranslations(subject: string): CheckResult {
  const result: CheckResult = {
    missingTranslations: [],
    orphanedTranslations: [],
    crossLanguageInconsistencies: [],
  }

  // Load translations for all languages
  const translations: Record<string, TranslationData | null> = {}
  for (const lang of LANGUAGES) {
    translations[lang] = loadTranslations(subject, lang)
  }

  // Get all concept IDs from content files
  const conceptIds = getConceptIds(subject)

  // Check 1: All concepts have translations
  for (const conceptId of conceptIds) {
    result.missingTranslations.push(
      ...checkConceptTranslationsForLanguages(conceptId, translations)
    )
  }

  // Check 2: Find orphaned translations (keys that don't match any concept)
  const conceptIdSet = new Set(conceptIds)
  for (const lang of LANGUAGES) {
    const langData = translations[lang]
    if (!langData?.concepts) continue

    for (const key of Object.keys(langData.concepts)) {
      if (!conceptIdSet.has(key)) {
        result.orphanedTranslations.push({ key, language: lang })
      }
    }
  }

  // Check 3: Cross-language consistency
  const allTranslationKeys = new Set<string>()
  for (const lang of LANGUAGES) {
    const langData = translations[lang]
    if (langData?.concepts) {
      Object.keys(langData.concepts).forEach((k) => allTranslationKeys.add(k))
    }
  }

  for (const key of allTranslationKeys) {
    for (const lang of LANGUAGES) {
      const hasKey = translations[lang]?.concepts?.[key]
      if (!hasKey) {
        // Find which language has it
        const inLang = LANGUAGES.find((l) => translations[l]?.concepts?.[key])
        if (inLang) {
          result.crossLanguageInconsistencies.push({ key, inLang, missingFrom: lang })
        }
      }
    }
  }

  return result
}

/**
 * Check translations for a single concept
 */
function checkSingleConcept(conceptPath: string): CheckResult {
  const result: CheckResult = {
    missingTranslations: [],
    orphanedTranslations: [],
    crossLanguageInconsistencies: [],
  }

  try {
    const filePath = resolveConceptPath(conceptPath)
    const subject = extractSubjectFromPath(filePath)
    const content = readFileSync(filePath, 'utf-8')
    const { data: frontmatter } = matter(content)
    const conceptId = frontmatter.id

    if (!conceptId) {
      console.error(
        `${colors.red}${symbols.fail} Error: Concept has no 'id' in frontmatter${colors.reset}`
      )
      process.exit(1)
    }

    // Load translations for all languages
    const translations: Record<string, TranslationData | null> = {}
    for (const lang of LANGUAGES) {
      translations[lang] = loadTranslations(subject, lang)
    }

    result.missingTranslations.push(
      ...checkConceptTranslationsForLanguages(conceptId, translations)
    )
  } catch (error) {
    console.error(`${colors.red}${symbols.fail} Error: ${error}${colors.reset}`)
    process.exit(1)
  }

  return result
}

/**
 * Print results for a subject check
 */
function printSubjectResult(subject: string, result: CheckResult): boolean {
  const hasCriticalIssues = result.missingTranslations.length > 0
  const hasWarnings =
    result.orphanedTranslations.length > 0 || result.crossLanguageInconsistencies.length > 0

  if (!hasCriticalIssues && !hasWarnings) {
    return true
  }

  console.log(`\n${colors.cyan}Subject: ${subject}${colors.reset}`)

  if (result.missingTranslations.length > 0) {
    console.log(`\n  ${colors.red}Missing translations:${colors.reset}`)
    for (const item of result.missingTranslations) {
      const fieldInfo = item.field ? ` (${item.field})` : ''
      console.log(`    - ${item.language}: ${item.conceptId}${fieldInfo}`)
    }
  }

  if (result.orphanedTranslations.length > 0) {
    console.log(`\n  ${colors.yellow}Orphaned translations (no matching concept):${colors.reset}`)
    for (const item of result.orphanedTranslations) {
      console.log(`    - ${item.language}: ${item.key}`)
    }
  }

  if (result.crossLanguageInconsistencies.length > 0) {
    console.log(`\n  ${colors.yellow}Cross-language inconsistencies:${colors.reset}`)
    for (const item of result.crossLanguageInconsistencies) {
      console.log(
        `    - "${item.key}" exists in ${item.inLang} but missing from ${item.missingFrom}`
      )
    }
  }

  // Only fail on missing translations (critical), not on orphaned (warnings)
  return !hasCriticalIssues
}

/**
 * Print results for a single concept check (simpler output)
 */
function printConceptResult(result: CheckResult): boolean {
  const hasIssues = result.missingTranslations.length > 0

  printSeparator()
  console.log('TRANSLATION CHECK')
  printSeparator()

  if (!hasIssues) {
    console.log(`${colors.green}${symbols.pass} PASS${colors.reset}\n`)
    return true
  }

  console.log(
    `${colors.red}${symbols.fail} FAIL${colors.reset} - ${result.missingTranslations.length} issue(s)\n`
  )

  for (const item of result.missingTranslations) {
    const fieldInfo = item.field ? ` (missing ${item.field})` : ' (missing entry)'
    console.log(`  - ${item.language}: ${item.conceptId}${fieldInfo}`)
  }

  console.log()
  return false
}

function printUsage() {
  console.log(`
${colors.cyan}${symbols.info} Translation Checker${colors.reset}

Validates translation completeness for educational concepts.

${colors.cyan}Usage:${colors.reset}
  bun run check:translations <subject>/<concept>   Check a single concept
  bun run check:translations <subject>             Check all concepts in a subject
  bun run check:translations --all                 Check all subjects

${colors.cyan}Examples:${colors.reset}
  bun run check:translations math/grade5-fractions
  bun run check:translations math
  bun run check:translations --all

${colors.cyan}Checks:${colors.reset}
  • All concepts have translations (name + description)
  • Orphaned translations (keys with no matching concept file)
  • Cross-language consistency (same keys in de/en)
`)
}

async function main() {
  const args = process.argv.slice(2)

  // No arguments - show usage
  if (args.length === 0) {
    printUsage()
    process.exit(0)
  }

  const input = args[0]

  // --all: check all subjects
  if (input === '--all') {
    const subjects = getAllSubjects()

    if (subjects.length === 0) {
      console.error(`${colors.red}${symbols.fail} Error: No subjects found${colors.reset}`)
      process.exit(1)
    }

    console.log(
      `\n${colors.cyan}${symbols.info} Checking translations for ${subjects.length} subject(s)${colors.reset}`
    )

    const summaryItems: SummaryItem[] = []
    let totalMissing = 0
    let totalOrphaned = 0
    let totalInconsistent = 0

    for (const subject of subjects) {
      const result = checkSubjectTranslations(subject)
      const passed = printSubjectResult(subject, result)

      const issues = result.missingTranslations.length
      const warnings =
        result.orphanedTranslations.length + result.crossLanguageInconsistencies.length

      summaryItems.push({
        name: subject,
        passed,
        issues,
        warnings,
      })

      totalMissing += result.missingTranslations.length
      totalOrphaned += result.orphanedTranslations.length
      totalInconsistent += result.crossLanguageInconsistencies.length
    }

    // Print summary
    printSummary('TRANSLATION CHECK SUMMARY', summaryItems)

    // Additional stats
    console.log(`Details:`)
    console.log(`  Missing translations: ${totalMissing}`)
    console.log(`  Orphaned translations: ${totalOrphaned}`)
    console.log(`  Cross-language inconsistencies: ${totalInconsistent}`)
    console.log()

    // Exit with appropriate code
    const failed = summaryItems.filter((s) => !s.passed).length
    process.exit(failed > 0 ? 1 : 0)
  }

  // Contains / -> single concept (e.g., math/grade5-fractions)
  if (input.includes('/')) {
    console.log(
      `\n${colors.cyan}${symbols.info} Checking translations for concept: ${input}${colors.reset}\n`
    )
    const result = checkSingleConcept(input)
    const passed = printConceptResult(result)
    process.exit(passed ? 0 : 1)
  }

  // No / -> subject name (e.g., math)
  const subject = input
  console.log(
    `\n${colors.cyan}${symbols.info} Checking translations for subject: ${subject}${colors.reset}`
  )

  const result = checkSubjectTranslations(subject)
  const passed = printSubjectResult(subject, result)

  printSummary(`TRANSLATION CHECK - ${subject.toUpperCase()}`, [
    {
      name: subject,
      passed,
      issues: result.missingTranslations.length,
      warnings: result.orphanedTranslations.length + result.crossLanguageInconsistencies.length,
    },
  ])

  process.exit(passed ? 0 : 1)
}

void main()
