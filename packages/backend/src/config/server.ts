import { z } from 'zod';

export interface ServerConfig {
  port: number;
}

export const defaultServerConfig: ServerConfig = {
  port: 3000,
};

export const serverConfigSchema = z.object({
  port: z.number(),
});
