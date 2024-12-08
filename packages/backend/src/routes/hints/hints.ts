import { Router } from 'express';
import { HintsController } from '../../controllers/hints/hints.controller';

const router = Router();

router.post('/:type?', HintsController.generateHint);

export default router; 