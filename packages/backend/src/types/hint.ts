import { z } from 'zod';

export interface HintResponse {
  hint: string;
}

export const hintResponseSchema = z.object({
  hint: z.string()
});