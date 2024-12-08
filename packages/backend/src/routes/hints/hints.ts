import { Router } from 'express';
import { ArithmeticController } from '../../controllers/tasks/arithmetic.controller';
import { HintsController } from '../../controllers/hints/hints.controller';

const router = Router();

// GET /:operation?
router.post('/:type?', HintsController.generateHint);

export default router; 