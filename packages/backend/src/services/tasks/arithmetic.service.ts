import fs from 'fs/promises';
import path from 'path';
import { OllamaService } from '../ollama';
import { ArithmeticOperation } from '../../types/task';

export class ArithmeticService {
  private arithmeticPrompts: Record<string, { prompt: string; model: string }> | null = null;

  private async loadPrompts() {
    if (!this.arithmeticPrompts) {
      const promptsPath = path.join(process.cwd(), 'src', 'prompts', 'tasks', 'arithmetic', 'prompts.json');
      const content = await fs.readFile(promptsPath, 'utf-8');
      this.arithmeticPrompts = JSON.parse(content) as Record<string, { prompt: string; model: string }>;
    }
    return this.arithmeticPrompts;
  }

  async generateTask(requestedOperation?: ArithmeticOperation) {
    const prompts = await this.loadPrompts();
    const operations = Object.keys(prompts) as ArithmeticOperation[];
    
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