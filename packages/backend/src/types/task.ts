import { z } from 'zod';
import { arithmeticTaskResponseSchema } from '../arithmetic/types/task';
import { geometryTaskResponseSchema } from '../geometry/types/task';

export const taskResponseSchema = z.discriminatedUnion('type', [
  arithmeticTaskResponseSchema,
  geometryTaskResponseSchema
]);

export type TaskResponse = z.infer<typeof taskResponseSchema>;
