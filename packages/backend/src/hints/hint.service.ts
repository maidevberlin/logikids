import { BaseService } from '../common/baseService';
import { Hint, HintParams, hintSchema } from './types';
import { AIClient } from '../common/ai/base';

export class HintService extends BaseService {
  constructor(aiClient: AIClient) {
    super(aiClient, __dirname);
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
    return this.generateFromPrompt(
      'prompt',
      {
        task: params.task.task,
        solution: params.task.solution.toString(),
        difficulty: params.task.metadata.difficulty,
        age: params.task.metadata.age.toString(),
        language,
        previousHints: params.previousHints.map(hint => hint.hint).join('\n')
      },
      this.createHint
    );
  }
} 