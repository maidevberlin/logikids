/**
 * Simple template replacer that only replaces known variables.
 * Preserves unknown placeholders like {{a1}}, {{x1}} for LLM consumption.
 */

import Handlebars from 'handlebars';
import {registerHandlebarsHelpers} from './handlebars-helpers';

export type TemplateVariables = Record<string, string | number>;

// Register helpers once at module load
registerHandlebarsHelpers();

/**
 * Replace variables in template using specified delimiters.
 * Only replaces variables that exist in the data object.
 *
 * @param template - Template string with placeholders
 * @param data - Variables to replace
 * @param delimiters - [opening, closing] delimiters (default: ['{{', '}}'])
 * @returns Template with known variables replaced
 */
export function replaceVariables(
  template: string,
  data: TemplateVariables,
  delimiters: [string, string] = ['{{', '}}']
): string {
  const [open, close] = delimiters;
  let result = template;

  // Replace each known variable
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `${open}${key}${close}`;
    const replacement = String(value);
    // Use function replacement to avoid special $ character interpretation
    // (e.g., $` means "insert text before match" in string replacements)
    result = result.replaceAll(placeholder, () => replacement);
  }

  return result;
}

/**
 * Compile a Handlebars template with the given data.
 * This allows for conditional logic and loops in templates.
 * Handlebars uses {{ }} syntax, but we need to preserve {{ }} for LLM placeholders.
 *
 * Solution: Use Handlebars only for concept templates (before composition),
 * so LLM placeholders in task type templates remain untouched.
 *
 * @param template - Handlebars template string
 * @param data - Variables to pass to template
 * @returns Compiled template
 */
export function compileHandlebars(
  template: string,
  data: TemplateVariables
): string {
  const compiledTemplate = Handlebars.compile(template, {
    noEscape: true, // Don't HTML-escape, we're generating markdown
    strict: false,  // Don't throw on missing variables
  });

  return compiledTemplate(data);
}

/**
 * Two-step template composition and variable replacement.
 * Step 1: Compose templates using <% %> delimiters
 * Step 2: Replace variables using [[ ]] delimiters (preserving {{ }} for LLM)
 *
 * @param baseTemplate - Main template with <%subtemplates%>
 * @param compositionData - Sub-templates to insert
 * @param variableData - Variables to replace
 * @returns Fully composed and replaced template
 */
export function composeAndReplace(
  baseTemplate: string,
  compositionData: TemplateVariables,
  variableData: TemplateVariables
): string {
  // Step 1: Compose templates using <% %>
  const composed = replaceVariables(baseTemplate, compositionData, ['<%', '%>']);

  // Step 2: Replace variables using [[ ]]
    return replaceVariables(composed, variableData, ['[[', ']]']);
}
