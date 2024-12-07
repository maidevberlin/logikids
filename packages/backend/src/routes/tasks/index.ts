import { Router } from 'express';
import arithmeticRouter from './arithmetic';
import geometryRouter from './geometry';

const router = Router();

router.use('/arithmetic', arithmeticRouter);
router.use('/geometry', geometryRouter);

export default router; 