import { z } from 'zod'
import { SUPPORTED_LANGUAGES } from '@logikids/content/schema'

export const getTaskInputSchema = z.object({
  subject: z.string(),
  concept: z.string().optional(),
  taskType: z.string().optional(),
  grade: z.number().min(1).max(13),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  language: z.enum(SUPPORTED_LANGUAGES),
})

export type GetTaskInput = z.infer<typeof getTaskInputSchema>

export const getHintInputSchema = z.object({
  taskId: z.string(),
})

export type GetHintInput = z.infer<typeof getHintInputSchema>
