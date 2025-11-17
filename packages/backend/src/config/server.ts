import { z } from 'zod';

export const serverConfigSchema = z.object({
  port: z.number(),
});

// Infer type from schema (single source of truth)
export type ServerConfig = z.infer<typeof serverConfigSchema>;

export const defaultServerConfig: ServerConfig = {
  port: 3000,
};
