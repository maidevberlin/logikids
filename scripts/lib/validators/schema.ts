/**
 * Schema validator for concept frontmatter
 */

import { conceptFrontmatterSchema, type ConceptFrontmatter } from '@logikids/content/schema'
import type { SchemaCheckResult, CheckIssue } from '../types'

export function checkSchema(
  frontmatter: Record<string, unknown>
): SchemaCheckResult<ConceptFrontmatter> {
  const result = conceptFrontmatterSchema.safeParse(frontmatter)

  if (result.success) {
    return { status: 'pass', issues: [], data: result.data }
  }

  const issues: CheckIssue[] = result.error.errors.map((err) => ({
    message: `Field '${err.path.join('.')}': ${err.message}`,
    fix: 'Fix the frontmatter field according to the schema requirements',
    reference: 'docs/concept-rules.md',
  }))

  return { status: 'fail', issues }
}
