import { z } from 'zod';
import { baseTaskResponseSchema } from '../../types/baseTask';

export const geometryTaskResponseSchema = baseTaskResponseSchema.extend({
  type: z.literal('geometry')
});

export type GeometryTaskResponse = z.infer<typeof geometryTaskResponseSchema>; 