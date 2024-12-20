import { z } from 'zod';

export interface Hint {
  hint: string;
  language: string;
}

export const hintSchema = z.object({
  hint: z.string()
});