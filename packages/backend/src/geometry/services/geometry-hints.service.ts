import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { OllamaClient } from '../../services/ollama';

interface HintPrompt {
  model: string;
  prompt: string;
}

export class GeometryHintsService {
  private hintsPrompt: HintPrompt | null = null;
  private ollama: OllamaClient;

  constructor() {
    this.ollama = new OllamaClient();
  }

  private async loadPrompts() {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (!this.hintsPrompt || isDevelopment) {
      const promptsPath = path.join(process.cwd(), 'src', 'geometry', 'prompts', 'hints.yaml');
      const content = await fs.readFile(promptsPath, 'utf-8');
      const prompt = yaml.load(content) as HintPrompt;
      this.hintsPrompt = prompt;
    }
    return this.hintsPrompt;
  }

  async generateHint(task: string, solution: string, difficulty: string, age: string): Promise<{ hint: string }> {
    const { prompt, model } = await this.loadPrompts();
    
    // Replace placeholders in the prompt template
    const filledPrompt = prompt
      .replace('{{task}}', task)
      .replace('{{solution}}', solution)
      .replace('{{difficulty}}', difficulty)
      .replace('{{age}}', age);

    const response = await this.ollama.generate(model, filledPrompt);
    const json = OllamaClient.extractJSON(response.response);
    if (!json) {
      throw new Error('Failed to parse JSON from model response');
    }

    return json as { hint: string };
  }
} 