import { z } from 'zod'

export const getTaskInputSchema = z.object({
  subject: z.string(),
  concept: z.string().optional(),
  taskType: z.string().optional(),
  grade: z.number().min(1).max(13),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  language: z.string().min(2).max(5),
})

export type GetTaskInput = z.infer<typeof getTaskInputSchema>

export const getHintInputSchema = z.object({
  taskId: z.string(),
})

export type GetHintInput = z.infer<typeof getHintInputSchema>
