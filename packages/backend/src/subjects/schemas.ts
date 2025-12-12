import { z } from 'zod'
import { SUPPORTED_LANGUAGES } from '@content/schema'

export const subjectsInputSchema = z.object({
  grade: z.number().int().min(1).max(13).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  language: z.enum(SUPPORTED_LANGUAGES).optional(),
})

export type SubjectsInput = z.infer<typeof subjectsInputSchema>
