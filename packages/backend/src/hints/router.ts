import { Router } from 'express';
import { createAIClient } from '../common/ai/factory';
import { HintController } from './hint.controller';
import { errorHandler } from '../common/middleware/errorHandler';

export async function createHintRouter(): Promise<Router> {
  const router = Router();
  const aiClient = await createAIClient();
  const hintsController = new HintController(aiClient);

  router.post('/', (req, res, next) => 
    hintsController.generateHint(req, res).catch(next)
  );

  router.use(errorHandler);

  return router;
}

export default await createHintRouter();