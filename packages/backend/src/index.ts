import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks/index';
import hintsRouter from './routes/hints/index';
import { getConfig } from './config';

const app = express();
const config = await getConfig('server');
const port = config.port;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.use('/api/hints', hintsRouter);

// Initialize services
// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});

export default app;