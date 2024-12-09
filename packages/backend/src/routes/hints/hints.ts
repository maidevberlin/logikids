import { Router } from 'express';
import { ArithmeticHintsController } from '../../arithmetic/controllers/arithmetic-hints.controller';
import { GeometryHintsController } from '../../geometry/controllers/geometry-hints.controller';

const router = Router();

router.post('/arithmetic', ArithmeticHintsController.generateHint);
router.post('/geometry', GeometryHintsController.generateHint);

export default router; 