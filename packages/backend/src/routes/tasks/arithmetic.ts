import { Router } from 'express';
import { ArithmeticController } from '../../arithmetic/controllers/arithmetic.controller';

const router = Router();

router.get('/', ArithmeticController.getTask);

export default router; 