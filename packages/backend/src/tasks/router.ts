import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createAIClient } from '../common/ai/factory';
import { TaskController } from './task.controller';
import { HintController } from '../hints/hint.controller';
import { errorHandler } from '../common/middleware/errorHandler';
import { asyncHandler } from '../common/middleware/asyncHandler';
import { TaskService } from './task.service';
import { HintService } from '../hints/hint.service';
import { PromptService } from '../prompts/prompt.service';
import { PromptLoader } from '../prompts/loader';
import { VariationLoader } from '../variations/loader';
import { subjectRegistry } from '../subjects/registry';
import { taskTypeRegistry } from './types/registry';
import { taskCache } from '../cache/taskCache';
import { requireAuth } from '../auth/auth.middleware';
import { validateQuery, validateParams } from '../common/middleware/validation';
import {
  getSubjectsQuerySchema,
  getConceptsQuerySchema,
  subjectParamSchema,
  GetSubjectsRequest,
  GetConceptsRequest
} from './task.schema';

export async function createTaskRouter(): Promise<Router> {
  const router = Router();
  const aiClient = await createAIClient();

  // Note: Registries are initialized in index.ts before router creation
  // They are singletons, so we just use the already-initialized instances

  // Create loaders
  const promptLoader = new PromptLoader();
  const variationLoader = new VariationLoader();

  // Create and initialize PromptService with injected dependencies
  const promptService = new PromptService(promptLoader, variationLoader);
  await promptService.initialize();

  // Create TaskService with all dependencies injected
  const taskService = new TaskService(
    aiClient,
    promptService,
    subjectRegistry,
    taskTypeRegistry,
    taskCache
  );

  // Create TaskController with injected dependencies
  const taskController = new TaskController(taskService, subjectRegistry);

  const hintService = new HintService(aiClient);
  await hintService.initialize(); // Load variations
  const hintController = new HintController(hintService);

  // Rate limiters for cost protection
  const taskRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 tasks per user per hour
    keyGenerator: (req) => req.userId || 'anonymous',
    message: {
      error: 'Too many task requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test',
  });

  const hintRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 hints per user per hour (4 hints × 25 tasks)
    keyGenerator: (req) => req.userId || 'anonymous',
    message: {
      error: 'Too many hint requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test',
  });

  // More specific routes must come before generic routes
  // Public route - no auth required (just metadata)
  router.get('/subjects', validateQuery(getSubjectsQuerySchema), asyncHandler((req, res) =>
    taskController.getSubjects(req as GetSubjectsRequest, res)
  ));

  // Public route - no auth required (get concepts for a specific subject)
  router.get('/subjects/:subjectId/concepts',
    validateParams(subjectParamSchema),
    validateQuery(getConceptsQuerySchema),
    asyncHandler((req, res) =>
      taskController.getSubjectConcepts(req as unknown as GetConceptsRequest, res)
    )
  );

  // Protected route - requires auth + rate limiting (AI cost)
  router.post('/:taskId/hint', requireAuth, hintRateLimiter, asyncHandler((req, res) =>
    hintController.getHint(req, res)
  ));

  // Protected route - requires auth + rate limiting (AI cost)
  router.get('/', requireAuth, taskRateLimiter, asyncHandler((req, res) =>
    taskController.getTask(req, res)
  ));

  router.use(errorHandler);

  return router;
}

export default await createTaskRouter(); 