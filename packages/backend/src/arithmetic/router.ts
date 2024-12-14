import { Router } from 'express';
import { ArithmeticTaskController } from './tasks/task.controller';
import { ArithmeticHintController } from './hints/hint.controller';
import { createAIClient } from '../common/ai/factory';

const router = Router();
const aiClient = await createAIClient();

router.get('/task/:operation?', (req, res) => new ArithmeticTaskController(aiClient).getTask(req, res));
router.post('/hint', (req, res) => new ArithmeticHintController(aiClient).generateHint(req, res));

export default router; 