import { Router } from 'express';
import { createAIClient } from '../common/ai/factory';
import { TaskController } from './task.controller';
import { errorHandler } from '../common/middleware/errorHandler';

export async function createTaskRouter(): Promise<Router> {
  const router = Router();
  const aiClient = await createAIClient();
  const taskController = new TaskController(aiClient);

  router.get('/', (req, res, next) => 
    taskController.getTask(req, res).catch(next)
  );

  router.get('/subjects', (req, res, next) =>
    taskController.getSubjects(req, res).catch(next)
  );

  router.use(errorHandler);

  return router;
}

export default await createTaskRouter(); 