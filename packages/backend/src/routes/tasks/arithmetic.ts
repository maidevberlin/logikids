import { Router } from 'express';
import { ArithmeticController } from '../../controllers/tasks/arithmetic.controller';

const router = Router();

// GET /:operation?
router.get('/:operation?', ArithmeticController.getTask);

export default router; 