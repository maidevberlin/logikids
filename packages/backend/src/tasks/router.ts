import { Router } from 'express';
import { createAIClient } from '../common/ai/factory';
import { TaskController } from './task.controller';
import { errorHandler } from '../common/middleware/errorHandler';
import { initializeTaskTypes } from './taskTypes';

export async function createTaskRouter(): Promise<Router> {
  const router = Router();
  const aiClient = await createAIClient();
  const taskController = new TaskController(aiClient);

  // Initialize task types
  initializeTaskTypes();

  router.get('/', (req, res, next) => 
    taskController.getTask(req, res).catch(next)
  );

  router.use(errorHandler);

  return router;
}

export default await createTaskRouter(); 