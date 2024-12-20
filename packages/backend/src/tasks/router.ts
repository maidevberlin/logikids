import { Router } from 'express';
import { createAIClient } from '../common/ai/factory';
import { TaskController } from './task.controller';

const router = Router();
const aiClient = await createAIClient();

router.get('/', (req, res) => new TaskController(aiClient).getTask(req, res));

export default router; 