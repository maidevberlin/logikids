import { z } from 'zod';

export type Type = 'conceptual' | 'procedural' | 'strategic';

export interface HintResponse {
    hint: string;
    metadata: {
      type: Type;  // type of hint provided
    };
  }

export const hintResponseSchema = z.object({
    hint: z.string(),
    metadata: z.object({
      relevanceScore: z.number().min(0).max(1),
      type: z.enum(['conceptual', 'procedural', 'strategic']),
    }),
  });