/**
 * Simple template processor for replacing variables and merging prompts.
 * Variables are in the format {{variable}}
 */
export class TemplateProcessor {
  /**
   * Replace variables in a template with their values
   */
  static replace(template: string, variables: Record<string, string | number>): string {
    return Object.entries(variables).reduce(
      (result, [key, value]) => result.replace(
        new RegExp(`{{${key}}}`, 'g'),
        () => String(value) // Use replacer function to prevent $ special chars
      ),
      template
    );
  }

  /**
   * Merge multiple templates, replacing variables in the process
   */
  static merge(templates: string[], variables: Record<string, string | number>): string {
    return templates
      .map(template => this.replace(template, variables))
      .join('\n\n');
  }

  /**
   * Process template with scoped variables (only replaces provided variables)
   * Used before composition to ensure each template only accesses its scoped variables
   */
  static replaceScoped(
    template: string,
    scopedVariables: Record<string, string | number>
  ): string {
    return this.replace(template, scopedVariables);
  }

  /**
   * Find all remaining placeholders in a template
   * Used for validation after composition
   */
  static findRemainingPlaceholders(template: string): string[] {
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
  static validateNoPlaceholders(template: string, context: string): void {
    const remaining = this.findRemainingPlaceholders(template);

    if (remaining.length > 0) {
      throw new Error(
        `Template validation failed in ${context}:\n` +
        `Found ${remaining.length} unreplaced placeholder(s): ${remaining.join(', ')}\n` +
        `This usually means a variable is used but not provided in the scope.`
      );
    }
  }
} 