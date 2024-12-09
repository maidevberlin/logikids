import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { OllamaClient } from '../ollama';
import { TaskResponse } from '../../types/task';
import { HintResponse, hintResponseSchema } from '../../types/hints';

interface HintPrompt {
  model: string;
  prompt: string;
}

interface PromptVariables {
  task: string;
  solution: string;
  difficulty: string;
  age: string;
}

export class HintsService {
  private hintsPrompts: HintPrompt | null = null;
  private ollama: OllamaClient;

  constructor() {
    this.ollama = new OllamaClient();
  }

  private async loadPrompts() {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (!this.hintsPrompts || isDevelopment) {
      const promptsPath = path.join(process.cwd(), 'src', 'prompts', 'hints.yaml');
      const content = await fs.readFile(promptsPath, 'utf-8');
      const prompt = yaml.load(content) as HintPrompt;
      this.hintsPrompts = prompt;
    }
    return this.hintsPrompts;
  }

  private replacePromptVariables(prompt: string, task: TaskResponse): string {
    const variables: PromptVariables = {
      task: task.task,
      solution: task.solution.toString(),
      difficulty: task.metadata.difficulty,
      age: `${task.metadata.age.min}-${task.metadata.age.max}`
    };

    return prompt.replace(
      /\{\{(\w+)\}\}/g,
      (match, key) => variables[key as keyof PromptVariables] || match
    );
  }

  async generateHint(task: TaskResponse): Promise<HintResponse> {
    const prompts = await this.loadPrompts();
    if (!prompts) {
      throw new Error('Failed to load hint prompts');
    }

    const processedPrompt = this.replacePromptVariables(prompts.prompt, task);
    const response = await this.ollama.generate(prompts.model, processedPrompt);
    
    // Try to parse JSON first
    const json = OllamaClient.extractJSON(response.response);
    if (json) {
      return hintResponseSchema.parse(json);
    }

    // If no valid JSON found, create a structured response from the raw text
    return hintResponseSchema.parse({
      hint: response.response.trim(),
      metadata: {
        type: 'conceptual'
      }
    });
  }
} 