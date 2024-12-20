import path from 'path';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import { AIClient } from '../common/ai/base';
import { HintResponse, hintResponseSchema } from './types';
import { Task } from '../tasks/types';

interface HintPrompt {
  prompt: string;
}

export class HintsService {
  private hintsPrompt: HintPrompt | null = null;
  protected promptPath = path.join(__dirname, '/prompt.yaml');

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

  async generateHint(task: Task, language: string = 'en'): Promise<HintResponse> {
    const { prompt } = await this.loadPrompts();
    
    const filledPrompt = prompt
      .replace('{{task}}', task.task)
      .replace('{{solution}}', task.solution.toString())
      .replace('{{difficulty}}', task.metadata.difficulty)
      .replace('{{age}}', `${task.metadata.age}`)
      .replace('{{language}}', language);

    const response = await this.aiClient.generate(filledPrompt);
    if (!response) {
      throw new Error('Failed to generate hint');
    }

    try {
      const jsonResponse = JSON.parse(response.response);
      return hintResponseSchema.parse(jsonResponse);
    } catch (error) {
      return hintResponseSchema.parse({
        hint: response.response.trim()
      });
    }
  }
} 