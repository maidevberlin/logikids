/**
 * Template validator - DEPRECATED
 * Template variables are no longer required in prompt content
 * (difficulty guidelines moved to frontmatter)
 */

import type { CheckResult } from '../types'

export function checkTemplates(_content: string): CheckResult {
  // No longer validating {{grade}} or {{difficulty}} in prompt content
  // These are now handled via frontmatter fields
  return { status: 'pass', issues: [] }
}
