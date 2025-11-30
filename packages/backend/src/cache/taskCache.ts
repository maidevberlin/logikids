import { z } from 'zod';

// Zod schemas for each task type's solution format
const singleChoiceOptionSchema = z.object({
  text: z.string(),
  isCorrect: z.boolean()
});

const multiSelectOptionSchema = z.object({
  id: z.number(),
  text: z.string(),
  isCorrect: z.boolean()
});

const fillInBlankItemSchema = z.object({
  id: z.number(),
  acceptedAnswers: z.array(z.string()),
  caseSensitive: z.boolean()
});

// TaskSolution union schema matching the TypeScript type
const taskSolutionSchema = z.union([
  z.array(singleChoiceOptionSchema),  // single_choice
  z.array(multiSelectOptionSchema),   // multi_select
  z.boolean(),                        // yes_no
  z.number(),                         // number_input
  z.array(fillInBlankItemSchema),     // fill_in_blank
  z.array(z.string())                 // ordering
]);

/**
 * Zod schema for task context stored in cache
 * Replaces manual interface with type-safe schema
 */
export const taskContextSchema = z.object({
  taskId: z.string(),
  subject: z.string(),
  concept: z.string(),
  taskType: z.string(),
  grade: z.number(),
  difficulty: z.string(),
  language: z.string(),
  generatedTask: z.string(),
  solution: taskSolutionSchema,
  hintsGenerated: z.array(z.string()),
  createdAt: z.number()
});

// Inferred type replaces manual interface
export type TaskContext = z.infer<typeof taskContextSchema>;

export class TaskCache {
  private cache = new Map<string, TaskContext>();
  private readonly TTL = 30 * 60 * 1000; // 30 minutes

  set(taskId: string, context: TaskContext): void {
    this.cache.set(taskId, context);
  }

  get(taskId: string): TaskContext | null {
    const context = this.cache.get(taskId);
    if (!context) return null;

    // Check if expired
    const now = Date.now();
    if (now - context.createdAt > this.TTL) {
      this.cache.delete(taskId);
      return null;
    }

    return context;
  }

  cleanExpired(): void {
    const now = Date.now();
    for (const [taskId, context] of this.cache.entries()) {
      if (now - context.createdAt > this.TTL) {
        this.cache.delete(taskId);
      }
    }
  }
}

// Export singleton instance
export const taskCache = new TaskCache();
