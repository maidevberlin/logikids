/**
 * Prerequisites validator - checks that prerequisite IDs reference existing concepts
 */

import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import type { CheckResult, CheckIssue } from '../types'
import type { ConceptFrontmatter } from '../../../content/schema'

function getContentPath(): string {
  return join(import.meta.dir, '../../../content/subjects')
}

interface ConceptIndex {
  conceptIds: Set<string>
  qualifiedIds: Set<string>
}

function getAllConceptIds(): ConceptIndex {
  const conceptIds = new Set<string>()
  const qualifiedIds = new Set<string>()
  const subjectsPath = getContentPath()

  if (!existsSync(subjectsPath)) {
    return { conceptIds, qualifiedIds }
  }

  const subjects = readdirSync(subjectsPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  for (const subject of subjects) {
    for (const subdir of ['official', 'custom']) {
      const conceptPath = join(subjectsPath, subject, subdir)
      if (!existsSync(conceptPath)) continue

      const files = readdirSync(conceptPath).filter((f) => f.endsWith('.md') && f !== 'base.md')

      for (const file of files) {
        const filePath = join(conceptPath, file)
        try {
          const content = readFileSync(filePath, 'utf-8')
          const { data } = matter(content)
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

  if (!prerequisites || prerequisites.length === 0) {
    return { status: 'pass', issues: [] }
  }

  const index = getAllConceptIds()
  const issues: CheckIssue[] = []

  for (const prereqId of prerequisites) {
    if (prereqId.includes('/')) {
      if (!index.qualifiedIds.has(prereqId)) {
        issues.push({
          message: `Prerequisite "${prereqId}" does not exist`,
          fix: `Check subject and concept ID`,
          reference: 'docs/concept-rules.md',
        })
      }
    } else {
      if (!index.conceptIds.has(prereqId)) {
        issues.push({
          message: `Prerequisite "${prereqId}" does not exist`,
          fix: `Use an existing concept ID or remove this prerequisite`,
        })
      }
    }
  }

  return {
    status: issues.length > 0 ? 'fail' : 'pass',
    issues,
  }
}
