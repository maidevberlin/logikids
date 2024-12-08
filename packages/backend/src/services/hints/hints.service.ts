import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { OllamaService } from '../ollama';
import { TaskResponse } from '../../types/task';
import Mustache from 'mustache';
import { DEFAULT_TYPE, Type, TYPE_VALUES } from '../../types/hints';

interface HintPrompt {
  prompt: string;
  model: string;
}

export class HintsService {
  private hintsPrompts: Record<string, HintPrompt> | null = null;

  private async loadPrompts() {
    if (!this.hintsPrompts) {
      const promptPath = path.join(process.cwd(), 'src', 'prompts', 'hints', 'hints.yaml');
      const content = await fs.readFile(promptPath, 'utf-8');
      this.hintsPrompts = yaml.load(content) as Record<string, HintPrompt>;
    }
    return this.hintsPrompts;
  }

  async generateHint(task: TaskResponse, requestedType?: Type) {
    try {
      const prompts = await this.loadPrompts();
      if (!prompts) {
        throw new Error('Failed to load hint prompts');
      }

      if (requestedType && !TYPE_VALUES.includes(requestedType)) {
        throw new Error(`Invalid hint type. Available types: ${TYPE_VALUES.join(', ')}`);
      }

      const type = requestedType || DEFAULT_TYPE;
      const { prompt, model } = prompts[type];

      const view = {
        task: task.task,
        solution: task.solution,
        difficulty: task.metadata.difficulty,
        age: task.metadata.age
      };
      
      // Combine the general prompt with the specific hint prompt
      const fullPrompt = `${prompts.general.prompt}\n\n${Mustache.render(prompt, view)}`;
      const hint = await OllamaService.generateHint(model, fullPrompt);
      
      return hint;
    } catch (error) {
      console.error('Error generating hint:', error);
      throw new Error('Failed to generate hint');
    }
  }
} 