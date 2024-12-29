import { AIClient } from '../common/ai/base';
import { Hint, HintParams, hintSchema } from './types';
import { AIGenerationError, ValidationError } from '../common/errors';
import { PromptService } from '../common/services/prompt.service';
import { z } from 'zod';

export class HintService {
  private readonly promptService: PromptService;

  constructor(private readonly aiClient: AIClient) {
    this.promptService = new PromptService(__dirname);
  }

  private createHint(response: string): Hint {
    try {
      const parsedResponse = JSON.parse(response);
      return hintSchema.parse(parsedResponse);
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Fallback for non-JSON responses
        return hintSchema.parse({ hint: response.trim() });
      }
      throw error;
    }
  }

  async generateHint(params: HintParams, language = 'en'): Promise<Hint> {
    const prompt = await this.promptService.getPrompt('prompt');
    
    const filledPrompt = prompt.prompt
      .replace(/\{\{task\}\}/g, params.task.task)
      .replace(/\{\{solution\}\}/g, params.task.solution.toString())
      .replace(/\{\{difficulty\}\}/g, params.task.metadata.difficulty)
      .replace(/\{\{age\}\}/g, params.task.metadata.age.toString())
      .replace(/\{\{language\}\}/g, language)
      .replace(/\{\{previousHints\}\}/g, params.previousHints.map(hint => hint.hint).join('\n'));

    const response = await this.aiClient.generate(filledPrompt);
    
    if (!response?.response) {
      throw new AIGenerationError('Failed to generate hint');
    }

    try {
      return this.createHint(response.response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(error.errors);
      }
      throw error;
    }
  }
} 