import { z } from 'zod';

export interface ArithmeticHintResponse {
  hint: string;
  type: 'arithmetic';
}

export const arithmeticHintResponseSchema = z.object({
  hint: z.string(),
  type: z.literal('arithmetic')
}); 