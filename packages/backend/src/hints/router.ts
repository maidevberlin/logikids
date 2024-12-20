import { Router } from 'express';
import { createAIClient } from '../common/ai/factory';
import { HintsController } from './hint.controller';

const router = Router();
const aiClient = await createAIClient();

router.post('/', (req, res) => new HintsController(aiClient).generateHint(req, res));

export default router;