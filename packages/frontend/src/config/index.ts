import { z } from 'zod';

// Get the current URL dynamically, preserving the actual IP if used
const currentUrl = new URL(window.location.href);
const defaultApiUrl = `${currentUrl.protocol}//${currentUrl.hostname}:5175`;

const envSchema = z.object({
  VITE_API_URL: z.string().default(defaultApiUrl),
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

const config: Config = {
  apiBaseUrl: `${env.VITE_API_URL}/api`,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
};

export default config;