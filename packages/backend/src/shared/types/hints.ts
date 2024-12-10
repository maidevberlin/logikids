import { z } from 'zod';
import { arithmeticHintResponseSchema } from '../../arithmetic/types/hint';
import { geometryHintResponseSchema } from '../../geometry/types/hint';

export const hintResponseSchema = z.discriminatedUnion('type', [
  arithmeticHintResponseSchema,
  geometryHintResponseSchema
]);

export type HintResponse = z.infer<typeof hintResponseSchema>; 