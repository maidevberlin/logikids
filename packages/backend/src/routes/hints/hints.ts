import { Router } from 'express';
import { ArithmeticHintController } from '../../arithmetic/controllers/hint.controller';
import { GeometryHintController } from '../../geometry/controllers/hint.controller';

const router = Router();

router.post('/arithmetic', (req, res) => new ArithmeticHintController().generateHint(req, res));
router.post('/geometry', (req, res) => new GeometryHintController().generateHint(req, res));

export default router; 