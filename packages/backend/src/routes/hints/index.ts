import { Router } from 'express';
import hintsRouter from './hints';
const router = Router();

router.use('/', hintsRouter);

export default router; 