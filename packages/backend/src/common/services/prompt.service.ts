import path from 'path';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import { AIGenerationError } from '../errors';

export interface BasePrompt {
  prompt: string;
}

export class PromptService {
  private static cache = new Map<string, BasePrompt>();
  private readonly promptPath: string;

  constructor(domainPath: string) {
    this.promptPath = path.join(domainPath, '/prompts');
  }

  async getPrompt(name: string): Promise<BasePrompt> {
    const cacheKey = `${this.promptPath}/${name}`;
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    if (!isDevelopment && PromptService.cache.has(cacheKey)) {
      return PromptService.cache.get(cacheKey)!;
    }

    try {
      const content = await fs.readFile(
        path.join(this.promptPath, `${name}.yaml`), 
        'utf-8'
      );
      const prompt = yaml.load(content) as BasePrompt;
      
      if (!isDevelopment) {
        PromptService.cache.set(cacheKey, prompt);
      }
      
      return prompt;
    } catch (error) {
      throw new AIGenerationError(`Failed to load prompt: ${name}`);
    }
  }
} 