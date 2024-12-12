import { Router } from 'express';
import { ArithmeticTaskController } from './tasks/task.controller';
import { ArithmeticHintController } from './hints/hint.controller';

// Initialize controller
ArithmeticTaskController.initializeService().catch(console.error);

const router = Router();

router.get('/task/:operation?', (req, res) => new ArithmeticTaskController().getTask(req, res));
router.post('/hint', (req, res) => new ArithmeticHintController().generateHint(req, res));

export default router; 