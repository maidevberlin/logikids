/**
 * Schema validator for concept frontmatter
 */

import { conceptFrontmatterSchema, type ConceptFrontmatter } from '../../../packages/content/schema'
import type { SchemaCheckResult, CheckIssue } from '../types'

export function checkSchema(
  frontmatter: Record<string, unknown>
): SchemaCheckResult<ConceptFrontmatter> {
  const result = conceptFrontmatterSchema.safeParse(frontmatter)

  if (result.success) {
    return { status: 'pass', issues: [], data: result.data }
  }

  const issues: CheckIssue[] = result.error.errors.map((err) => ({
    message: `${err.path.join('.')}: ${err.message}`,
    fix: getFixSuggestion(err.path.join('.'), err.message),
    reference: 'docs/concept-rules.md',
  }))

  return { status: 'fail', issues }
}

function getFixSuggestion(path: string, message: string): string {
  // Provide specific fix suggestions based on the field
  if (path === 'id') return 'Add a unique concept ID (e.g., "fractions-basics")'
  if (path === 'name') return 'Add a descriptive concept name'
  if (path === 'description') return 'Add a brief description of the concept'
  if (path === 'grade') return 'Set grade as a number between 1 and 13'
  if (path === 'focus') return 'Add a focus string describing the main learning focus'
  if (path === 'difficulty') return 'Set difficulty to "easy", "medium", or "hard"'
  if (path === 'version') return 'Set version to a positive integer (e.g., 1)'

  if (path === 'learning_objectives') {
    if (message.includes('too_small')) return 'Add at least 3 learning objectives'
    if (message.includes('too_big')) return 'Reduce to maximum 7 learning objectives'
    return 'Add 3-7 learning objectives as an array of strings'
  }

  if (path === 'problem_types') {
    if (message.includes('too_small')) return 'Add at least 5 problem types'
    if (message.includes('too_big')) return 'Reduce to maximum 10 problem types'
    return 'Add 5-10 problem types as an array of strings'
  }

  if (path === 'real_world_context') {
    if (message.includes('too_small')) return 'Add at least 10 real-world context examples'
    if (message.includes('too_big')) return 'Reduce to maximum 15 real-world context examples'
    return 'Add 10-15 real-world context examples as an array of strings'
  }

  if (path === 'anti_patterns') {
    if (message.includes('too_small')) return 'Add at least 3 anti-patterns'
    if (message.includes('too_big')) return 'Reduce to maximum 5 anti-patterns'
    if (message.includes('80')) return 'Keep each anti-pattern under 80 characters'
    return 'Add 3-5 anti-patterns as an array of strings (max 80 chars each)'
  }

  if (path.startsWith('difficulty_guidelines')) {
    if (message.includes('too_small')) return 'Add at least 1 guideline for this difficulty'
    if (message.includes('too_big')) return 'Reduce to maximum 3 guidelines per difficulty'
    return 'Add 1-3 guidelines for each difficulty level'
  }

  return 'Fix the field according to the schema requirements'
}
