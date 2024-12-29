import path from 'path';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import { AIClient } from '../common/ai/base';
import { Hint, HintParams, hintSchema } from './types';
import { Task } from '../tasks/types';

interface HintPrompt {
  prompt: string;
}

export class HintsService {
  private hintsPrompt: HintPrompt | null = null;
  protected promptPath = path.join(__dirname, '/prompts/prompt.yaml');

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

  async generateHint(hintParams: HintParams, language: string = 'en'): Promise<Hint> {
    const { prompt } = await this.loadPrompts();
    
    const filledPrompt = prompt
      .replace('{{task}}', hintParams.task.task)
      .replace('{{solution}}', hintParams.task.solution.toString())
      .replace('{{difficulty}}', hintParams.task.metadata.difficulty)
      .replace('{{age}}', `${hintParams.task.metadata.age}`)
      .replace('{{language}}', language)
      .replace('{{previousHints}}', hintParams.previousHints.map((hint: Hint) => hint.hint).join('\n'));

    const response = await this.aiClient.generate(filledPrompt);
    if (!response) {
      throw new Error('Failed to generate hint');
    }

    try {
      const jsonResponse = JSON.parse(response.response);
      const hint = hintSchema.parse(jsonResponse);
      return hint;
    } catch (error) {
      const hint = hintSchema.parse({
        hint: response.response.trim()
      });
      return hint;
    }
  }
} 