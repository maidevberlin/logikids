import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createAIClient } from '../common/ai/factory';
import { TaskController } from './task.controller';
import { HintController } from '../hints/hint.controller';
import { errorHandler } from '../common/middleware/errorHandler';
import { TaskService } from './task.service';
import { HintService } from '../hints/hint.service';
import { PromptService } from '../prompts/prompt.service';
import { requireAuth } from '../auth/auth.middleware';

export async function createTaskRouter(): Promise<Router> {
  const router = Router();
  const aiClient = await createAIClient();

  // Create and initialize PromptService
  const promptService = new PromptService();
  await promptService.initialize();

  // Pass promptService to TaskService
  const taskService = new TaskService(aiClient, promptService);

  const taskController = new TaskController(aiClient, taskService);

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
  router.get('/subjects', (req, res, next) =>
    taskController.getSubjects(req, res).catch(next)
  );

  // Public route - no auth required (get concepts for a specific subject)
  router.get('/subjects/:subjectId/concepts', (req, res, next) =>
    taskController.getSubjectConcepts(req, res).catch(next)
  );

  // Protected route - requires auth + rate limiting (AI cost)
  router.post('/:taskId/hint', requireAuth, hintRateLimiter, (req, res, next) =>
    hintController.getHint(req, res).catch(next)
  );

  // Protected route - requires auth + rate limiting (AI cost)
  router.get('/', requireAuth, taskRateLimiter, (req, res, next) =>
    taskController.getTask(req, res).catch(next)
  );

  router.use(errorHandler);

  return router;
}

export default await createTaskRouter(); 