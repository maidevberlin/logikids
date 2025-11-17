import { ApplicationError } from './base';

/**
 * Thrown when prompt template file is missing or cannot be loaded
 *
 * @example
 * ```typescript
 * if (!fs.existsSync(templatePath)) {
 *   throw new PromptTemplateError('Base prompt not found');
 * }
 * ```
 */
export class PromptTemplateError extends ApplicationError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message, 500, 'PROMPT_TEMPLATE_ERROR');
  }
}

/**
 * Thrown when hint prompt template is not initialized
 *
 * @example
 * ```typescript
 * if (!this.hintPrompt) {
 *   throw new HintPromptNotLoadedError();
 * }
 * ```
 */
export class HintPromptNotLoadedError extends ApplicationError {
  constructor() {
    super(
      'Hint prompt template not loaded. Please initialize PromptBuilder with a hint prompt.',
      500,
      'HINT_PROMPT_NOT_LOADED'
    );
  }
}
