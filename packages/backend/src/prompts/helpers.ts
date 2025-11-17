/**
 * Template validation utilities
 *
 * We use a simple string replacement for template rendering.
 * This file provides validation helpers.
 */

import { ValidationError } from '../common/errors';

/**
 * Find all remaining placeholders in a template using [[ ]] delimiters
 * Used for validation after composition
 *
 * Note: {{ }} placeholders are intentionally preserved for LLM consumption
 */
export function findRemainingPlaceholders(template: string): string[] {
  const placeholderPattern = /\[\[([^\]]+)\]\]/g;
  const matches: string[] = [];
  let match;

  while ((match = placeholderPattern.exec(template)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}

/**
 * Validate that no [[ ]] placeholders remain in final template
 * Throws error with details if any found
 *
 * Note: {{ }} placeholders (like {{a1}}, {{x1}}) are intentionally preserved
 * for the LLM to use as examples in generated tasks
 */
export function validateNoPlaceholders(template: string, context: string): void {
  const remaining = findRemainingPlaceholders(template);

  if (remaining.length > 0) {
    throw new ValidationError(
      `Template validation failed in ${context}:\n` +
      `Found ${remaining.length} unreplaced placeholder(s): ${remaining.join(', ')}\n` +
      `This usually means a variable is used but not provided in the scope.`
    );
  }
}
