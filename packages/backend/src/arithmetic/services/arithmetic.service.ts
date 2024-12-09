import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { TaskResponse, taskResponseSchema } from '../../types/task';
import { getConfig } from '../../config';
import { AIClientFactory } from '../../services/ai/factory';
import { AIClient } from '../../services/ai/base';

interface ArithmeticPrompt {
  prompt: string;
}

export class ArithmeticService {
  private arithmeticPrompts: ArithmeticPrompt | null = null;
  private aiClient: AIClient | null = null;

  private async getAIClient(): Promise<AIClient> {
    if (!this.aiClient) {
      const config = await getConfig('ai');
      this.aiClient = AIClientFactory.create(config);
    }
    return this.aiClient;
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
    const [{ prompt }, aiClient] = await Promise.all([
      this.loadPrompts(),
      this.getAIClient(),
    ]);

    const response = await aiClient.generate(prompt);
    
    const json = AIClient.extractJSON(response.response);
    if (!json) {
      throw new Error('Failed to parse JSON from model response');
    }

    return taskResponseSchema.parse(json);
  }
} 