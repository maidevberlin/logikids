import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { AIClient } from '../ai/base';
import { TaskResponse } from '../../types/task';
import { HintResponse, hintResponseSchema } from '../../types/hint';

interface HintPrompt {
  prompt: string;
}

export abstract class BaseHintsService {
  private hintsPrompt: HintPrompt | null = null;
  protected abstract promptPath: string;

  constructor(protected aiClient: AIClient) {}

  protected async loadPrompts() {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (!this.hintsPrompt || isDevelopment) {
      const content = await fs.readFile(this.promptPath, 'utf-8');
      const prompt = yaml.load(content) as HintPrompt;
      this.hintsPrompt = prompt;
    }
    return this.hintsPrompt;
  }

  async generateHint(task: TaskResponse): Promise<HintResponse> {
    const { prompt } = await this.loadPrompts();
    
    const filledPrompt = prompt
      .replace('{{task}}', task.task)
      .replace('{{solution}}', task.solution.toString())
      .replace('{{difficulty}}', task.metadata.difficulty)
      .replace('{{age}}', `${task.metadata.age.min}-${task.metadata.age.max}`);

    const response = await this.aiClient.generate(filledPrompt);
    if (!response) {
      throw new Error('Failed to generate hint');
    }

    try {
      const jsonResponse = JSON.parse(response.response);
      return hintResponseSchema.parse(jsonResponse);
    } catch (error) {
      return hintResponseSchema.parse({
        hint: response.response.trim(),
        metadata: {
          type: task.type
        }
      });
    }
  }
} 