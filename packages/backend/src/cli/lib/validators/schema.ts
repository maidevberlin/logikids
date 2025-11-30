/**
 * Schema validator for concept frontmatter
 * Returns validated data on success for type-safe downstream usage
 */

import { conceptFrontmatterSchema, type ConceptFrontmatter } from '../../../prompts/schemas'
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
    reference: 'src/prompts/schemas.ts:conceptFrontmatterSchema',
  }))

  return { status: 'fail', issues }
}
