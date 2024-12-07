import fs from 'fs/promises';
import path from 'path';
import { OllamaService } from '../ollama';
import { GeometryOperation } from '../../types/task';

export class GeometryService {
  private geometryPrompts: Record<string, { prompt: string; model: string }> | null = null;

  private async loadPrompts() {
    if (!this.geometryPrompts) {
      const promptsPath = path.join(process.cwd(), 'src', 'prompts', 'tasks', 'geometry', 'prompts.json');
      const content = await fs.readFile(promptsPath, 'utf-8');
      this.geometryPrompts = JSON.parse(content) as Record<string, { prompt: string; model: string }>;
    }
    return this.geometryPrompts;
  }

  async generateTask(requestedOperation?: GeometryOperation) {
    const prompts = await this.loadPrompts();
    const operations = Object.keys(prompts) as GeometryOperation[];
    
    if (requestedOperation && !operations.includes(requestedOperation)) {
      throw new Error(`Invalid operation. Available operations: ${operations.join(', ')}`);
    }

    const operation = requestedOperation || operations[Math.floor(Math.random() * operations.length)];
    const { prompt, model } = prompts[operation];

    const task = await OllamaService.generateTask(model, prompt);
    return {
      operation,
      ...task
    };
  }
} 