import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks/index';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
}); 