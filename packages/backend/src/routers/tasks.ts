import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { createAIClient } from '../common/ai/factory';
import { TaskService } from '../tasks/task.service';
import { HintService } from '../hints/hint.service';
import { PromptService } from '../prompts/prompt.service';
import { PromptLoader } from '../prompts/loader';
import { VariationLoader } from '../variations/loader';
import { subjectRegistry } from '../subjects/registry';
import { taskTypeRegistry } from '../tasks/types/registry';
import { taskCache } from '../cache/taskCache';
import { taskRequestSchema } from '../tasks/types';

// Initialize services
const aiClient = await createAIClient();
const promptLoader = new PromptLoader();
const variationLoader = new VariationLoader();

const promptService = new PromptService(promptLoader, variationLoader);
await promptService.initialize();

const taskService = new TaskService(aiClient, promptService, subjectRegistry, taskTypeRegistry, taskCache);

const hintService = new HintService(aiClient);
await hintService.initialize();

/**
 * Tasks router - task generation and hints
 */
export const tasksRouter = router({
  /**
   * Generate a new task
   */
  get: protectedProcedure.input(taskRequestSchema).query(async ({ input, ctx }) => {
    const task = await taskService.generateTask(input, ctx.userId);
    return task;
  }),

  /**
   * Get hint for a task
   */
  getHint: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await hintService.generateHint(input.taskId);
      return result;
    }),
});
