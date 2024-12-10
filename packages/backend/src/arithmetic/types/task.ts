import { z } from 'zod';
import { baseTaskResponseSchema } from '../../shared/types/task';

export const arithmeticTaskResponseSchema = baseTaskResponseSchema.extend({
  type: z.literal('arithmetic')
});

export type ArithmeticTaskResponse = z.infer<typeof arithmeticTaskResponseSchema>; 