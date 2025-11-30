import { z } from 'zod'
import type { BaseTaskResponse } from '../tasks/types'

/**
 * Zod schema for task context stored in cache.
 * The taskResponse stores the full AI-generated task response,
 * which is already validated at generation time.
 */
export const taskContextSchema = z.object({
  taskId: z.string(),
  subject: z.string(),
  concept: z.string(),
  taskType: z.string(),
  grade: z.number(),
  difficulty: z.string(),
  language: z.string(),
  taskResponse: z.custom<BaseTaskResponse>(),
  hintsGenerated: z.array(z.string()),
  createdAt: z.number(),
})

// Inferred type replaces manual interface
export type TaskContext = z.infer<typeof taskContextSchema>

export class TaskCache {
  private cache = new Map<string, TaskContext>()
  private readonly TTL = 30 * 60 * 1000 // 30 minutes

  set(taskId: string, context: TaskContext): void {
    this.cache.set(taskId, context)
  }

  get(taskId: string): TaskContext | null {
    const context = this.cache.get(taskId)
    if (!context) return null

    // Check if expired
    const now = Date.now()
    if (now - context.createdAt > this.TTL) {
      this.cache.delete(taskId)
      return null
    }

    return context
  }

  cleanExpired(): void {
    const now = Date.now()
    for (const [taskId, context] of this.cache.entries()) {
      if (now - context.createdAt > this.TTL) {
        this.cache.delete(taskId)
      }
    }
  }
}

// Export singleton instance
export const taskCache = new TaskCache()
