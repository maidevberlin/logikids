/**
 * Centralized environment configuration with fail-fast validation.
 * 
 * In production: Required vars MUST be explicitly set or app fails to start.
 * In development: Uses secure defaults for local development.
 */

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// Development defaults - ONLY used in non-production
const DEV_DEFAULTS = {
  JWT_SECRET: 'logikids-dev-secret-do-not-use-in-production',
  POSTGRES_PASSWORD: 'development',
} as const;

function getRequired(name: string, devDefault?: string): string {
  const value = process.env[name];
  
  if (value) {
    return value;
  }
  
  if (isProduction) {
    console.error(`
╔══════════════════════════════════════════════════════════════════╗
║  FATAL: Missing required environment variable: ${name.padEnd(17)} ║
║                                                                  ║
║  Production requires explicit configuration.                     ║
║                                                                  ║
║  Run: ./setup.sh                                                 ║
║  Or manually set ${name} in your .env file              ║
╚══════════════════════════════════════════════════════════════════╝
`);
    process.exit(1);
  }
  
  if (devDefault !== undefined) {
    return devDefault;
  }
  
  throw new Error(`Missing required environment variable: ${name}`);
}

function getOptional(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}

/**
 * Validated environment configuration.
 * Access config values through this object, not process.env directly.
 */
export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  isProduction,
  isTest,
  isDevelopment: !isProduction && !isTest,
  
  // Authentication
  JWT_SECRET: getRequired('JWT_SECRET', isTest ? 'test-secret' : DEV_DEFAULTS.JWT_SECRET),
  
  // Database
  DATABASE_URL: getOptional(
    'DATABASE_URL',
    `postgresql://logikids:${DEV_DEFAULTS.POSTGRES_PASSWORD}@localhost:5432/logikids`
  ),
  
  // Server
  PORT: parseInt(getOptional('PORT', '3000'), 10),
} as const;

// Validate on import - fail fast
if (isProduction) {
  // Additional production checks
  if (env.JWT_SECRET.includes('dev') || env.JWT_SECRET.includes('test')) {
    console.error(`
╔══════════════════════════════════════════════════════════════════╗
║  FATAL: JWT_SECRET appears to be a development/test value       ║
║                                                                  ║
║  Production requires a secure, randomly generated secret.       ║
║                                                                  ║
║  Generate one with:                                              ║
║  openssl rand -base64 64 | tr -d "=+/" | cut -c1-64             ║
╚══════════════════════════════════════════════════════════════════╝
`);
    process.exit(1);
  }
}

export type Env = typeof env;
