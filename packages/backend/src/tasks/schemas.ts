import { z } from 'zod'

export const getTaskInputSchema = z
  .object({
    subject: z.string(),
    concept: z.string().optional(),
    taskType: z.string().optional(),
    grade: z.number().min(1).max(13),
    age: z.number().min(6).max(20),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    language: z.string().min(2).max(5),
    gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say']).optional(),
  })
  .refine((data) => data.age >= data.grade + 5 && data.age <= data.grade + 8, {
    message: 'Age and grade are not aligned. Expected age to be roughly grade + 6 (±2 years).',
  })

export const getHintInputSchema = z.object({
  taskId: z.string(),
})
