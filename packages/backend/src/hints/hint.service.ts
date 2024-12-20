import path from 'path';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import { AIClient } from '../common/ai/base';
import { Hint, hintSchema } from './types';
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

  async generateHint(task: Task, language: string = 'en'): Promise<Hint> {
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
      const hint = hintSchema.parse(jsonResponse);
      return {
        ...hint,
        language
      };
    } catch (error) {
      const hint = hintSchema.parse({
        hint: response.response.trim()
      });
      return {
        ...hint,
        language
      };
    }
  }
} 