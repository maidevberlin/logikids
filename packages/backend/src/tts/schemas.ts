import { z } from 'zod'

export const synthesizeInputSchema = z.object({
  taskId: z.string().min(1),
  field: z.string().min(1),
})

export type SynthesizeInput = z.infer<typeof synthesizeInputSchema>
