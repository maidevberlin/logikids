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
        String(value)
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
} 