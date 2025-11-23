/**
 * Schema validator for concept frontmatter
 */

import { conceptFrontmatterSchema } from '../../../prompts/schemas';
import type { CheckResult, CheckIssue } from '../types';

export function checkSchema(frontmatter: any): CheckResult {
  const result = conceptFrontmatterSchema.safeParse(frontmatter);

  if (result.success) {
    return { status: 'pass', issues: [] };
  }

  const issues: CheckIssue[] = result.error.errors.map(err => ({
    message: `Field '${err.path.join('.')}': ${err.message}`,
    fix: 'Fix the frontmatter field according to the schema requirements',
    reference: 'src/prompts/schemas.ts:conceptFrontmatterSchema',
  }));

  return { status: 'fail', issues };
}
