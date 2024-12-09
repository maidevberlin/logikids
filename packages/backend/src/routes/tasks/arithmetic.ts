import { Router } from 'express';
import { ArithmeticController } from '../../controllers/tasks/arithmetic.controller';

const router = Router();

router.get('/', ArithmeticController.getTask);

export default router; 