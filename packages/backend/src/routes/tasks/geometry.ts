import { Router } from 'express';
import { GeometryTaskController } from '../../geometry/controllers/task.controller';

const router = Router();

// Initialize controller
GeometryTaskController.initializeService().catch(console.error);

router.get('/:operation?', (req, res) => new GeometryTaskController().getTask(req, res));

export default router; 