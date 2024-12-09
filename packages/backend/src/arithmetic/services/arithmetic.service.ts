import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { OllamaClient } from '../../services/ollama';
import { TaskResponse, taskResponseSchema } from '../../types/task';

interface ArithmeticPrompt {
  model: string;
  prompt: string;
}

export class ArithmeticService {
  private arithmeticPrompts: ArithmeticPrompt | null = null;
  private ollama: OllamaClient;

  constructor() {
    this.ollama = new OllamaClient();
  }

  private async loadPrompts() {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (!this.arithmeticPrompts || isDevelopment) {
      const promptsPath = path.join(process.cwd(), 'src', 'arithmetic', 'prompts', 'arithmetic.yaml');
      const content = await fs.readFile(promptsPath, 'utf-8');
      const prompt = yaml.load(content) as ArithmeticPrompt;
      this.arithmeticPrompts = prompt;
    }
    return this.arithmeticPrompts;
  }

  async generateTask(): Promise<TaskResponse> {
    const { prompt, model } = await this.loadPrompts();
    const response = await this.ollama.generate(model, prompt);
    
    const json = OllamaClient.extractJSON(response.response);
    if (!json) {
      throw new Error('Failed to parse JSON from model response');
    }

    return taskResponseSchema.parse(json);
  }
} 