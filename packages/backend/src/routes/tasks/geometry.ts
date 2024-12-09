import { Router } from 'express';
import { GeometryController } from '../../geometry/controllers/geometry.controller';

const router = Router();

// GET /:operation?
router.get('/:operation?', GeometryController.getTask);

export default router; 