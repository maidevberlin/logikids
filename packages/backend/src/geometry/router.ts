import { Router } from 'express';
import { GeometryTaskController } from './tasks/task.controller';
import { GeometryHintController } from './hints/hint.controller';

const router = Router();

// Initialize controller
GeometryTaskController.initializeService().catch(console.error);

router.get('/task/:operation?', (req, res) => new GeometryTaskController().getTask(req, res));
router.post('/hint', (req, res) => new GeometryHintController().generateHint(req, res));

export default router; 