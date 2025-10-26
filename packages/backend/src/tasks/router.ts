import { Router } from 'express';
import { createAIClient } from '../common/ai/factory';
import { TaskController } from './task.controller';
import { HintController } from './hint.controller';
import { errorHandler } from '../common/middleware/errorHandler';
import { TaskService } from './task.service';

export async function createTaskRouter(): Promise<Router> {
  const router = Router();
  const aiClient = await createAIClient();
  const taskController = new TaskController(aiClient);
  const taskService = new TaskService(aiClient);
  await taskService.initialize(); // Load variations
  const hintController = new HintController(taskService);

  router.get('/', (req, res, next) =>
    taskController.getTask(req, res).catch(next)
  );

  router.get('/subjects', (req, res, next) =>
    taskController.getSubjects(req, res).catch(next)
  );

  router.post('/:taskId/hint', (req, res, next) =>
    hintController.getHint(req, res).catch(next)
  );

  router.use(errorHandler);

  return router;
}

export default await createTaskRouter(); 