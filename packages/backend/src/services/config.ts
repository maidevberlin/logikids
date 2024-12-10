import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { AIClient } from './ai/base';
import { OllamaClient } from './ai/ollama';
import { OpenAIClient } from './ai/openai';

interface AIConfig {
  provider: 'ollama' | 'openai';
  ollama?: {
    host: string;
    model: string;
    temperature: number;
    top_k: number;
    top_p: number;
  };
  openai?: {
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
    topP: number;
  };
}

interface Config {
  ai: AIConfig;
}

export class ConfigService {
  private static instance: ConfigService;
  private config: Config | null = null;

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  async loadConfig(): Promise<Config> {
    if (!this.config) {
      const configPath = path.join(process.cwd(), 'config.yaml');
      const content = await fs.readFile(configPath, 'utf-8');
      this.config = yaml.load(content) as Config;
    }
    return this.config;
  }

  async getAIConfig(): Promise<AIConfig> {
    const config = await this.loadConfig();
    return config.ai;
  }
}

export async function createAIClient(): Promise<AIClient> {
  const config = await ConfigService.getInstance().getAIConfig();
  
  switch (config.provider) {
    case 'ollama':
      if (!config.ollama) throw new Error('Ollama config missing');
      return new OllamaClient(config.ollama);
    case 'openai':
      if (!config.openai) throw new Error('OpenAI config missing');
      return new OpenAIClient(config.openai);
    default:
      throw new Error(`Unknown AI provider: ${config.provider}`);
  }
} 