import { Router } from 'express';
import { GeometryController } from '../../controllers/tasks/geometry.controller';

const router = Router();

// GET /:operation?
router.get('/:operation?', GeometryController.getTask);

export default router; 