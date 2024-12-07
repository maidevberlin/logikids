export const AI_MODELS = {
  arithmetic: 'llama3.2',
  // Add more task-specific models here as needed
  // geometry: 'other-model',
} as const;

export const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://host.docker.internal:11434'; 