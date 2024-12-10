import { z } from 'zod';

export interface GeometryHintResponse {
  hint: string;
  type: 'geometry';
}

export const geometryHintResponseSchema = z.object({
  hint: z.string(),
  type: z.literal('geometry')
}); 