import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { OllamaService } from '../ollama';
import { TaskResponse } from '../../types/task';
import Mustache from 'mustache';

interface HintPrompt {
  prompt: string;
  model: string;
}

export class HintsService {
  private hintsPrompt: HintPrompt | null = null;

  private async loadPrompt() {
    if (!this.hintsPrompt) {
      const promptPath = path.join(process.cwd(), 'src', 'prompts', 'hints', 'generate.yaml');
      const content = await fs.readFile(promptPath, 'utf-8');
      this.hintsPrompt = yaml.load(content) as HintPrompt;
    }
    return this.hintsPrompt;
  }

  async generateHint(task: TaskResponse) {
    try {
      const promptTemplate = await this.loadPrompt();
      if (!promptTemplate) {
        throw new Error('Failed to load hint prompt template');
      }

      const view = {
        task: task.task,
        solution: task.solution,
        difficulty: task.metadata.difficulty,
        age: task.metadata.age
      };
      
      const prompt = Mustache.render(promptTemplate.prompt, view);
      const hint = await OllamaService.generateHint(promptTemplate.model, prompt);
      return {
        hint
      };
    } catch (error) {
      console.error('Error generating hint:', error);
      throw new Error('Failed to generate hint');
    }
  }
} 