/**
 * Path resolution helpers for CLI commands
 */

import { resolve } from 'path'
import { existsSync } from 'fs'

/**
 * Convert short format (subject/concept) to full filesystem path
 * @example resolveConceptPath("math/grade5-fractions")
 *   -> "/path/to/packages/content/subjects/math/official/grade5-fractions.md"
 */
export function resolveConceptPath(input: string): string {
  const [subject, conceptName] = input.split('/')

  if (!subject || !conceptName) {
    throw new Error(
      `Invalid concept path format: "${input}". Expected format: subject/concept-name`
    )
  }

  // Auto-add .md extension if not present
  const filename = conceptName.endsWith('.md') ? conceptName : `${conceptName}.md`

  // Auto-detect content path (docker vs local)
  // In docker: /content/subjects (mounted volume)
  // In development: ../../packages/content/subjects (relative)
  const dockerContentPath = '/app/packages/content/subjects'
  const localContentPath = resolve(process.cwd(), '../../packages/content/subjects')

  const contentBase = existsSync(dockerContentPath) ? dockerContentPath : localContentPath

  return resolve(contentBase, subject, 'official', filename)
}

/**
 * Convert subject name to directory path
 * @example resolveSubjectPath("math")
 *   -> "/path/to/packages/content/subjects/math/official"
 */
export function resolveSubjectPath(subject: string): string {
  if (!subject) {
    throw new Error('Subject name is required')
  }

  // Auto-detect content path (docker vs local)
  const dockerContentPath = '/app/packages/content/subjects'
  const localContentPath = resolve(process.cwd(), '../../packages/content/subjects')
  const contentBase = existsSync(dockerContentPath) ? dockerContentPath : localContentPath

  return resolve(contentBase, subject, 'official')
}

/**
 * Extract subject name from full filesystem path
 * @example extractSubjectFromPath("/path/to/subjects/math/official/grade5-fractions.md")
 *   -> "math"
 */
export function extractSubjectFromPath(conceptPath: string): string {
  const parts = conceptPath.split('/')
  const subjectIdx = parts.indexOf('subjects')

  if (subjectIdx === -1 || subjectIdx + 1 >= parts.length) {
    throw new Error(`Cannot extract subject from path: ${conceptPath}`)
  }

  return parts[subjectIdx + 1]
}

/**
 * Get all subjects directory path
 * @returns "/path/to/packages/content/subjects"
 */
export function getSubjectsBasePath(): string {
  // Auto-detect content path (docker vs local)
  const dockerContentPath = '/app/packages/content/subjects'
  const localContentPath = resolve(process.cwd(), '../../packages/content/subjects')
  return existsSync(dockerContentPath) ? dockerContentPath : localContentPath
}
