import { z } from 'zod';
import { arithmeticTaskResponseSchema } from '../arithmetic/tasks/task';
import { geometryTaskResponseSchema } from '../geometry/tasks/task';

export const taskResponseSchema = z.discriminatedUnion('type', [
  arithmeticTaskResponseSchema,
  geometryTaskResponseSchema,
]);

export type TaskResponse = z.infer<typeof taskResponseSchema>; 