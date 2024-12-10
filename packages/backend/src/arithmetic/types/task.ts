import { z } from 'zod';
import { baseTaskResponseSchema } from '../../shared/types/baseTask';

export const arithmeticTaskResponseSchema = baseTaskResponseSchema.extend({
  type: z.literal('arithmetic'),
  // Add other arithmetic-specific fields here
});

export type ArithmeticTaskResponse = z.infer<typeof arithmeticTaskResponseSchema>; 