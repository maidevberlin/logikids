import { z } from 'zod';

export const TYPE_VALUES = ['conceptual', 'procedural', 'strategic'] as const;
export type Type = typeof TYPE_VALUES[number];
export const DEFAULT_TYPE: Type = 'procedural';

export interface HintResponse {
    hint: string;
    metadata: {
      type: Type;  // type of hint provided
    };
  }

export const hintResponseSchema = z.object({
    hint: z.string(),
    metadata: z.object({
      type: z.enum(TYPE_VALUES),
    }),
  });