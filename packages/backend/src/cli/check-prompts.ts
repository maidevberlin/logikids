#!/usr/bin/env bun
/**
 * Prompt System Checker - Comprehensive safety net validation
 *
 * Validates prompt system (registries, templates) and ALL concepts across ALL subjects.
 * This is the comprehensive check for CI/CD and pre-deployment validation.
 *
 * Usage:
 *   bun run src/cli/check-prompts.ts
 */

import { readdirSync, readFileSync, existsSync } from 'fs'
import { basename, join } from 'path'
import matter from 'gray-matter'
import { getSubjectsBasePath } from './lib/paths'
import {
  validatePrompts,
  checkSchema,
  checkFilename,
  checkContent,
  checkStructure,
  checkTemplates,
  checkTranslations,
  checkWordCount,
} from './lib/validators'
import {
  colors,
  symbols,
  printSection,
  printProgress,
  printResult,
  printSummary,
  type SummaryItem,
} from './lib/output'

interface ConceptCheckResult {
  name: string
  passed: boolean
  issues: number
  warnings: number
}

function checkConcept(conceptPath: string, subject: string): ConceptCheckResult | null {
  const filename = basename(conceptPath)

  // Skip base.md files
  if (filename === 'base.md') {
    return null
  }

  try {
    // Parse file
    const fileContent = readFileSync(conceptPath, 'utf-8')
    const { data: frontmatter, content } = matter(fileContent)

    // Run all checks
    const schemaResult = checkSchema(frontmatter)

    // If schema fails, count as critical failure
    if (schemaResult.status === 'fail') {
      return {
        name: `${subject}/${filename}`,
        passed: false,
        issues: schemaResult.issues.length,
        warnings: 0,
      }
    }

    // Use validated frontmatter data for type-safe access
    const validatedFrontmatter = schemaResult.data!

    // Run remaining checks
    const results = [
      checkFilename(filename, validatedFrontmatter.grade),
      checkContent(content),
      checkStructure(validatedFrontmatter),
      checkTemplates(content),
      checkWordCount(content),
      checkTranslations(validatedFrontmatter.id, subject),
    ]

    const criticalFailures = results.filter((r) => r.status === 'fail').length
    const warnings = results.filter((r) => r.status === 'warning').length
    const totalIssues = results
      .filter((r) => r.status === 'fail')
      .reduce((sum, r) => sum + r.issues.length, 0)

    return {
      name: `${subject}/${filename}`,
      passed: criticalFailures === 0,
      issues: totalIssues,
      warnings,
    }
  } catch (error) {
    // Parsing error counts as failure
    return {
      name: `${subject}/${filename}`,
      passed: false,
      issues: 1,
      warnings: 0,
    }
  }
}

async function main() {
  console.log(
    `\n${colors.cyan}${symbols.info} Prompt System Check - Comprehensive Validation${colors.reset}\n`
  )

  // Step 1: Validate prompt system
  console.log(`${colors.cyan}Validating prompt system...${colors.reset}\n`)

  const promptResult = await validatePrompts()
  printSection('PROMPT SYSTEM VALIDATION', promptResult)

  if (promptResult.status === 'fail') {
    console.log(
      `${colors.red}${symbols.fail} Prompt system validation failed. Fix these issues before checking concepts.${colors.reset}\n`
    )
    process.exit(1)
  }

  // Step 2: Check all concepts across all subjects
  console.log(`${colors.cyan}Checking all concepts across all subjects...${colors.reset}\n`)

  const subjectsBasePath = getSubjectsBasePath()

  if (!existsSync(subjectsBasePath)) {
    console.error(`${colors.red}${symbols.fail} Error: Subjects directory not found${colors.reset}`)
    console.error(`  Path: ${subjectsBasePath}\n`)
    process.exit(1)
  }

  // Get all subjects
  const subjects = readdirSync(subjectsBasePath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort()

  const allResults: ConceptCheckResult[] = []
  let totalChecked = 0

  // Check each subject
  for (const subject of subjects) {
    const subjectPath = join(subjectsBasePath, subject, 'official')

    if (!existsSync(subjectPath)) {
      continue
    }

    // Get all concept files
    const files = readdirSync(subjectPath)
      .filter((f) => f.endsWith('.md') && f !== 'base.md')
      .sort()

    if (files.length === 0) {
      continue
    }

    console.log(`\n${colors.cyan}[${subject}]${colors.reset} ${files.length} concepts`)

    // Check each concept
    for (const file of files) {
      const conceptPath = join(subjectPath, file)
      totalChecked++

      printProgress(files.indexOf(file) + 1, files.length, file)

      const result = checkConcept(conceptPath, subject)

      if (result) {
        allResults.push(result)
        printResult(result.passed, result.warnings, result.issues)
      }
    }
  }

  // Convert to summary format
  const summaryItems: SummaryItem[] = allResults

  // Print comprehensive summary
  console.log(
    `\n${colors.cyan}Checked ${totalChecked} concepts across ${subjects.length} subjects${colors.reset}`
  )
  printSummary('COMPREHENSIVE SUMMARY', summaryItems)

  // Exit with appropriate code
  const failed = allResults.filter((r) => !r.passed).length
  process.exit(failed > 0 ? 1 : 0)
}

void main()
