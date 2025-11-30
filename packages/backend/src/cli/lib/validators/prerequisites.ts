/**
 * Prerequisites validator - checks that prerequisite IDs reference existing concepts
 *
 * Supports two formats:
 * - "concept-id" - matches any concept with that ID across all subjects
 * - "subject/concept-id" - matches specific concept in specific subject
 */

import { existsSync, readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'
import matter from 'gray-matter'
import type { CheckResult, CheckIssue } from '../types'
import { getSubjectsBasePath } from '../paths'
import type { ConceptFrontmatter } from '../../../prompts/concept-schema'

interface ConceptIndex {
  // Set of all concept IDs (without subject prefix)
  conceptIds: Set<string>
  // Set of all qualified IDs (subject/concept-id)
  qualifiedIds: Set<string>
}

/**
 * Get all existing concept IDs across all subjects (official and custom)
 * Uses the `id` field from frontmatter, not filenames
 */
function getAllConceptIds(): ConceptIndex {
  const conceptIds = new Set<string>()
  const qualifiedIds = new Set<string>()
  const subjectsPath = getSubjectsBasePath()

  if (!existsSync(subjectsPath)) {
    return { conceptIds, qualifiedIds }
  }

  const subjects = readdirSync(subjectsPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  for (const subject of subjects) {
    // Check both official and custom directories
    for (const subdir of ['official', 'custom']) {
      const conceptPath = resolve(subjectsPath, subject, subdir)
      if (!existsSync(conceptPath)) continue

      const files = readdirSync(conceptPath).filter((f) => f.endsWith('.md') && f !== 'base.md')

      for (const file of files) {
        const filePath = resolve(conceptPath, file)
        try {
          const content = readFileSync(filePath, 'utf-8')
          const { data } = matter(content)
          // Use the id field from frontmatter
          if (data.id && typeof data.id === 'string') {
            conceptIds.add(data.id)
            qualifiedIds.add(`${subject}/${data.id}`)
          }
        } catch {
          // Skip files that can't be parsed
        }
      }
    }
  }

  return { conceptIds, qualifiedIds }
}

export function checkPrerequisites(frontmatter: ConceptFrontmatter): CheckResult {
  const prerequisites = frontmatter.prerequisites

  // No prerequisites is valid
  if (!prerequisites || prerequisites.length === 0) {
    return { status: 'pass', issues: [] }
  }

  const index = getAllConceptIds()
  const issues: CheckIssue[] = []

  for (const prereqId of prerequisites) {
    // Check if it's a qualified ID (subject/concept-id) or just concept-id
    if (prereqId.includes('/')) {
      // Qualified format: must match exactly
      if (!index.qualifiedIds.has(prereqId)) {
        issues.push({
          message: `Prerequisite "${prereqId}" does not exist`,
          fix: `Check subject and concept ID. Available subjects: ${[...new Set([...index.qualifiedIds].map((q) => q.split('/')[0]))].join(', ')}`,
          reference: 'concept-rules.md - prerequisites',
        })
      }
    } else {
      // Simple format: concept-id only, matches any subject
      if (!index.conceptIds.has(prereqId)) {
        issues.push({
          message: `Prerequisite "${prereqId}" does not exist`,
          fix: `Use an existing concept ID or remove this prerequisite`,
          reference: 'concept-rules.md - prerequisites',
        })
      }
    }
  }

  if (issues.length === 0) {
    return { status: 'pass', issues: [] }
  }

  // Non-existent prerequisites are errors (not warnings)
  return { status: 'fail', issues }
}
