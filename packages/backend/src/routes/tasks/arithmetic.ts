import { Router } from 'express';
import { ArithmeticTaskController } from '../../arithmetic/controllers/task.controller';

const router = Router();

// Initialize controller
ArithmeticTaskController.initializeService().catch(console.error);

router.get('/', (req, res) => new ArithmeticTaskController().getTask(req, res));

export default router; 