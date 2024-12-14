interface Config {
  apiBaseUrl: string;
}

const isDevelopment = import.meta.env.DEV;

const config: Config = {
  apiBaseUrl: isDevelopment 
    ? 'http://localhost:5175/api'
    : '/api',
};

export default config;

export const taskDefaults = {
  age: 12,
  difficulty: 'medium' as const
} as const 