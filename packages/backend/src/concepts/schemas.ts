import { z } from 'zod'
import { subjectRegistry } from '../subjects/registry'

export const difficultyEnum = z.enum(['easy', 'medium', 'hard'])
export const sourceEnum = z.enum(['curriculum', 'custom'])

export const conceptsInputSchema = z.object({
  subject: z
    .string()
    .min(1, 'Subject is required')
    .refine((val) => subjectRegistry.get(val) !== undefined, {
      message: 'Invalid subject',
    }),
  grade: z.number().int().min(1).max(13).optional(),
  difficulty: difficultyEnum.optional(),
  source: sourceEnum.optional(),
})

export type ConceptsInput = z.infer<typeof conceptsInputSchema>
