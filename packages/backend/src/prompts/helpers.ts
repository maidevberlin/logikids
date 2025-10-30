/**
 * Template validation utilities
 *
 * We use Mustache directly for template rendering.
 * This file only provides validation helpers.
 */

/**
 * Find all remaining placeholders in a template
 * Used for validation after composition
 */
export function findRemainingPlaceholders(template: string): string[] {
  const placeholderPattern = /\{\{([^}]+)\}\}/g;
  const matches: string[] = [];
  let match;

  while ((match = placeholderPattern.exec(template)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}

/**
 * Validate that no placeholders remain in final template
 * Throws error with details if any found
 */
export function validateNoPlaceholders(template: string, context: string): void {
  const remaining = findRemainingPlaceholders(template);

  if (remaining.length > 0) {
    throw new Error(
      `Template validation failed in ${context}:\n` +
      `Found ${remaining.length} unreplaced placeholder(s): ${remaining.join(', ')}\n` +
      `This usually means a variable is used but not provided in the scope.`
    );
  }
}
