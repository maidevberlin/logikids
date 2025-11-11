/**
 * Simple template replacer that only replaces known variables.
 * Preserves unknown placeholders like {{a1}}, {{x1}} for LLM consumption.
 */

export type TemplateVariables = Record<string, string | number>;

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
    result = result.replaceAll(placeholder, replacement);
  }

  return result;
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
  const final = replaceVariables(composed, variableData, ['[[', ']]']);

  return final;
}
