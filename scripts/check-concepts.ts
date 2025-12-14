#!/usr/bin/env bun
/**
 * Concept Checker CLI
 *
 * Validates educational concept files.
 *
 * Usage:
 *   bun run scripts/check-concepts.ts                    # Show usage
 *   bun run scripts/check-concepts.ts math/grade5-fractions  # Single concept
 *   bun run scripts/check-concepts.ts math               # All in subject
 *   bun run scripts/check-concepts.ts --all              # All subjects
 */

import { readdirSync, existsSync } from 'fs'
import { basename, join } from 'path'
import {
  checkFilename,
  checkContent,
  checkStructure,
  checkTemplates,
  checkTranslations,
  checkWordCount,
  checkPrerequisites,
  parseAndValidateConcept,
} from './lib/validators'

// Path resolution
function getContentPath(): string {
  return join(import.meta.dir, '../packages/content/subjects')
}

function resolveConceptPath(input: string): string {
  const [subject, conceptName] = input.split('/')
  if (!subject || !conceptName) {
    throw new Error(`Invalid format: "${input}". Expected: subject/concept-name`)
  }
  const filename = conceptName.endsWith('.md') ? conceptName : `${conceptName}.md`
  return join(getContentPath(), subject, 'official', filename)
}

function resolveSubjectPath(subject: string): string {
  return join(getContentPath(), subject, 'official')
}

function extractSubject(path: string): string {
  const parts = path.split('/')
  const idx = parts.indexOf('subjects')
  return idx !== -1 ? parts[idx + 1] : ''
}

// Check single concept (detailed output)
function checkSingleConcept(input: string): number {
  const filePath = resolveConceptPath(input)
  const filename = basename(filePath)
  const subject = extractSubject(filePath)

  if (!existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`)
    return 1
  }

  if (filename === 'base.md') {
    console.log('⚠️ Skipping base.md file')
    return 0
  }

  console.log(`\n🔍 Checking concept: ${input}\n`)

  try {
    const parseResult = parseAndValidateConcept(filePath)

    if (!parseResult.success) {
      console.log('═'.repeat(60))
      console.log('SCHEMA VALIDATION')
      console.log('═'.repeat(60))
      console.log(`❌ FAIL - ${parseResult.schemaResult.issues.length} issue(s)\n`)
      parseResult.schemaResult.issues.forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue.message}`)
        console.log(`     Fix: ${issue.fix}\n`)
      })
      return 1
    }

    const { frontmatter, content } = parseResult.parsed

    const results = [
      { name: 'FILENAME', result: checkFilename(filename, frontmatter.grade) },
      { name: 'CONTENT (No Code)', result: checkContent(content) },
      { name: 'STRUCTURE', result: checkStructure(frontmatter) },
      { name: 'TEMPLATES', result: checkTemplates(content) },
      { name: 'WORD COUNT', result: checkWordCount(content) },
      { name: 'PREREQUISITES', result: checkPrerequisites(frontmatter) },
      { name: 'TRANSLATIONS', result: checkTranslations(frontmatter.id, subject) },
    ]

    let failures = 0
    let warnings = 0

    for (const { name, result } of results) {
      console.log('═'.repeat(60))
      console.log(name)
      console.log('═'.repeat(60))

      if (result.status === 'pass') {
        console.log('✅ PASS\n')
      } else if (result.status === 'warning') {
        console.log(`⚠️ WARNING - ${result.issues.length} issue(s)\n`)
        warnings += result.issues.length
        result.issues.forEach((issue, i) => {
          console.log(`  ${i + 1}. ${issue.message}`)
          console.log(`     Fix: ${issue.fix}\n`)
        })
      } else {
        console.log(`❌ FAIL - ${result.issues.length} issue(s)\n`)
        failures += result.issues.length
        result.issues.forEach((issue, i) => {
          const line = issue.line ? `Line ${issue.line}: ` : ''
          console.log(`  ${i + 1}. ${line}${issue.message}`)
          console.log(`     Fix: ${issue.fix}\n`)
        })
      }
    }

    console.log('═'.repeat(60))
    if (failures === 0 && warnings === 0) {
      console.log('✅ ALL CHECKS PASSED')
    } else if (failures === 0) {
      console.log(`⚠️ PASSED WITH ${warnings} WARNING(S)`)
    } else {
      console.log(`❌ FAILED - ${failures} issue(s), ${warnings} warning(s)`)
    }
    console.log('═'.repeat(60))

    return failures > 0 ? 1 : 0
  } catch (error) {
    console.error(`❌ Error processing file:`, error)
    return 1
  }
}

// Check all concepts in a subject (summary output)
function checkSubject(subject: string): { passed: number; failed: number } {
  const subjectPath = resolveSubjectPath(subject)

  if (!existsSync(subjectPath)) {
    console.error(`❌ Error: Subject directory not found: ${subjectPath}`)
    return { passed: 0, failed: 0 }
  }

  const files = readdirSync(subjectPath)
    .filter((f) => f.endsWith('.md') && f !== 'base.md')
    .sort()

  if (files.length === 0) {
    console.log(`⚠️ No concept files found in ${subject}`)
    return { passed: 0, failed: 0 }
  }

  console.log(`\n🔍 Checking ${files.length} concepts in ${subject}\n`)

  let passed = 0
  let failed = 0
  const failures: string[] = []

  for (const file of files) {
    const filePath = join(subjectPath, file)
    process.stdout.write(`  ${file}...`)

    try {
      const parseResult = parseAndValidateConcept(filePath)

      if (!parseResult.success) {
        console.log(' ❌')
        failed++
        failures.push(file)
        continue
      }

      const { frontmatter, content } = parseResult.parsed
      const results = [
        checkFilename(file, frontmatter.grade),
        checkContent(content),
        checkStructure(frontmatter),
        checkWordCount(content),
        checkTranslations(frontmatter.id, subject),
      ]

      const hasFailure = results.some((r) => r.status === 'fail')
      if (hasFailure) {
        console.log(' ❌')
        failed++
        failures.push(file)
      } else {
        console.log(' ✅')
        passed++
      }
    } catch {
      console.log(' ❌')
      failed++
      failures.push(file)
    }
  }

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`)
  if (failures.length > 0) {
    console.log(`\nFailed:`)
    failures.forEach((f) => console.log(`  • ${f}`))
  }
  console.log('═'.repeat(60))

  return { passed, failed }
}

// Check all subjects
function checkAllSubjects(): number {
  const contentPath = getContentPath()

  if (!existsSync(contentPath)) {
    console.error(`❌ Error: Content directory not found: ${contentPath}`)
    return 1
  }

  const subjects = readdirSync(contentPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  console.log(`\n🔍 Checking all concepts across ${subjects.length} subjects\n`)

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
🔍 Concept Checker

Usage:
  bun run scripts/check-concepts.ts <subject>/<concept>   Check single concept
  bun run scripts/check-concepts.ts <subject>             Check all in subject
  bun run scripts/check-concepts.ts --all                 Check all subjects

Examples:
  bun run scripts/check-concepts.ts math/grade5-fractions
  bun run scripts/check-concepts.ts math
  bun run scripts/check-concepts.ts --all
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
    process.exit(checkAllSubjects())
  }

  if (input.includes('/')) {
    process.exit(checkSingleConcept(input))
  }

  const { failed } = checkSubject(input)
  process.exit(failed > 0 ? 1 : 0)
}

void main()
