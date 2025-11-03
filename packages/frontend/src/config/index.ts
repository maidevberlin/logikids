import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().optional().default(''),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Validate environment variables
const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.MODE,
});

interface Config {
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

// Use relative URL if VITE_API_URL is not set (default for all environments)
// In dev: Vite proxy handles /api → backend-dev:3000
// In prod: Nginx proxy handles /api → backend:3000
const apiBaseUrl = env.VITE_API_URL
  ? `${env.VITE_API_URL}/api`
  : '/api';

const config: Config = {
  apiBaseUrl,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
};

export default config;