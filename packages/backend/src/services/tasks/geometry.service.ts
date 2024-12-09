import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { OllamaClient } from '../ollama';
import { TaskResponse, taskResponseSchema } from '../../types/task';

interface GeometryPrompt {
  model: string;
  prompt: string;
}

export class GeometryService {
  private geometryPrompts: GeometryPrompt | null = null;
  private ollama: OllamaClient;

  constructor() {
    this.ollama = new OllamaClient();
  }

  private async loadPrompts() {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (!this.geometryPrompts || isDevelopment) {
      const promptsPath = path.join(process.cwd(), 'src', 'prompts', 'geometry.yaml');
      const content = await fs.readFile(promptsPath, 'utf-8');
      const prompt = yaml.load(content) as GeometryPrompt;
      this.geometryPrompts = prompt;
    }
    return this.geometryPrompts;
  }

  async generateTask(): Promise<TaskResponse> {
    const prompts = await this.loadPrompts();
    if (!prompts) {
      throw new Error('Failed to load geometry prompts');
    }

    const response = await this.ollama.generate(prompts.model, prompts.prompt);
    const json = OllamaClient.extractJSON(response.response);
    if (!json) {
      throw new Error('Failed to parse JSON from model response');
    }

    return taskResponseSchema.parse(json);
  }
} 