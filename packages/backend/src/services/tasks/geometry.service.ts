import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { OllamaService } from '../ollama';
import { GeometryOperation } from '../../types/task';

export class GeometryService {
  private geometryPrompts: Record<string, { prompt: string; model: string }> | null = null;

  private async loadPrompts() {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (!this.geometryPrompts || isDevelopment) {
      const promptsPath = path.join(process.cwd(), 'src', 'prompts', 'tasks', 'geometry', 'prompts.yaml');
      const content = await fs.readFile(promptsPath, 'utf-8');
      this.geometryPrompts = yaml.load(content) as Record<string, { prompt: string; model: string }>;
    }
    return this.geometryPrompts;
  }

  async generateTask(requestedOperation?: GeometryOperation) {
    const prompts = await this.loadPrompts();
    const operations = Object.keys(prompts).filter(op => op !== 'general') as GeometryOperation[];
    
    if (requestedOperation && !operations.includes(requestedOperation)) {
      throw new Error(`Invalid operation. Available operations: ${operations.join(', ')}`);
    }

    const operation = requestedOperation || operations[Math.floor(Math.random() * operations.length)];
    const { prompt, model } = prompts[operation];

    // Combine the general prompt with the specific task prompt
    const fullPrompt = `${prompts.general.prompt}\n\nNow, please ${prompt}`;
    const task = await OllamaService.generateTask(model, fullPrompt);
    
    return {
      operation,
      ...task
    };
  }
} 