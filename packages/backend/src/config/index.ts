import { z } from 'zod';
import yaml from 'js-yaml';
import { join } from 'path';
import { AIConfig, aiConfigSchema, defaultConfig as defaultAIConfig } from './ai';
import { defaultServerConfig, ServerConfig, serverConfigSchema } from './server';

export interface Config {
  ai: AIConfig;
  server: ServerConfig;
  // Add other configuration sections here as needed
}

const configSchema = z.object({
  ai: aiConfigSchema,
  server: serverConfigSchema,
  // Add other configuration sections here as neede
});

export type ConfigSchema = z.infer<typeof configSchema>;

const defaultConfig: Config = {
  ai: defaultAIConfig,
  server: defaultServerConfig,
};

let cachedConfig: Config | null = null;

export async function loadConfig(): Promise<Config> {
  // Return cached config if available
  if (cachedConfig) {
    return cachedConfig;
  }


  try {
    // Try to read the config file from project root (two levels up from this file)
    const configPath = join(process.cwd(), 'config.yaml');
    const file = Bun.file(configPath);
    
    // Check if file exists and is readable
    if (!(await file.exists())) {
      console.warn('No config.yaml found in project root, using default configuration');
      cachedConfig = defaultConfig;
      return defaultConfig;
    }
    
    // Read and parse the config file
    const content = await file.text();
    const parsedConfig = yaml.load(content) as unknown;
  
    // Validate the config
    const validated = configSchema.parse(parsedConfig);
    
    // Transform to our internal config format
    const config: Config = {
      ai: validated.ai,
      server: validated.server,
    };

    // Validate the AI provider-specific config is present
    if (config.ai.provider === 'ollama' && !config.ai.ollama) {
      throw new Error('Ollama configuration is required when using Ollama provider');
    }
    if (config.ai.provider === 'openai' && !config.ai.openai) {
      throw new Error('OpenAI configuration is required when using OpenAI provider');
    }

    // Cache the config
    cachedConfig = config;
    return config;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error loading config:', error.message);
    } else {
      console.error('Unknown error loading config');
    }
    console.warn('Using default configuration');
    
    cachedConfig = defaultConfig;
    return defaultConfig;
  }
}

// Helper function to get a specific section of the config
export async function getConfig<K extends keyof Config>(section: K): Promise<Config[K]> {
  const config = await loadConfig();
  return config[section];
} 