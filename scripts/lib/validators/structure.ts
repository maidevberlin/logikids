/**
 * Structure validator - checks learning_objectives, problem_types, etc.
 */

import type { CheckResult, CheckIssue } from '../types'
import type { ConceptFrontmatter } from '../../../content/schema'

export function checkStructure(frontmatter: ConceptFrontmatter): CheckResult {
  const issues: CheckIssue[] = []

  // Check problem_types count
  const count = frontmatter.problem_types.length

  if (count < 5) {
    issues.push({
      message: `Found ${count} problem types, required 5-10`,
      fix: `Add ${5 - count} more problem type descriptions`,
      reference: 'docs/concept-rules.md',
    })
  }

  if (count > 10) {
    issues.push({
      message: `Found ${count} problem types, recommended maximum is 10`,
      fix: 'Consider consolidating similar problem types',
    })
  }

  // Check learning_objectives count
  const objectiveCount = frontmatter.learning_objectives.length

  if (objectiveCount < 3) {
    issues.push({
      message: `Found ${objectiveCount} learning objectives, required 3-7`,
      fix: `Add ${3 - objectiveCount} more learning objectives`,
    })
  }

  if (objectiveCount > 7) {
    issues.push({
      message: `Found ${objectiveCount} learning objectives, recommended maximum is 7`,
      fix: 'Consider consolidating similar objectives',
    })
  }

  // Check difficulty_guidelines - max 3 bullets per difficulty level
  for (const [level, guidelines] of Object.entries(frontmatter.difficulty_guidelines)) {
    if (guidelines.length > 3) {
      issues.push({
        message: `difficulty_guidelines[${level}] has ${guidelines.length} items (max 3)`,
        fix: 'Reduce to 3 most important guidelines',
      })
    }
  }

  // Check real_world_context count
  const contextCount = frontmatter.real_world_context.length

  if (contextCount < 3) {
    issues.push({
      message: `Found ${contextCount} real_world_context items, required 3-5`,
      fix: `Add ${3 - contextCount} more real-world context examples`,
    })
  }

  if (contextCount > 5) {
    issues.push({
      message: `Found ${contextCount} real_world_context items, maximum is 5`,
      fix: 'Reduce to 5 most relevant real-world contexts',
    })
  }

  if (issues.length === 0) {
    return { status: 'pass', issues: [] }
  }

  return { status: 'warning', issues }
}
