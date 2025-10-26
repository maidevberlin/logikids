export interface TaskContext {
  taskId: string;
  subject: string;
  concept: string;
  taskType: string;
  grade: number;
  difficulty: string;
  language: string;
  generatedTask: string;
  solution: any;
  hintsGenerated: string[];
  createdAt: number;
}

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
