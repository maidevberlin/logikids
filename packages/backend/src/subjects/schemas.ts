import { z } from 'zod'

export const subjectsInputSchema = z.object({
  grade: z.number().int().min(1).max(13).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  language: z.string().min(2).max(5).optional(),
})

export type SubjectsInput = z.infer<typeof subjectsInputSchema>
