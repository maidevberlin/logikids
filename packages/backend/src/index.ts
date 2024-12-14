import express from 'express';
import cors from 'cors';
import { getConfig } from './config';
import arithmeticRouter from './arithmetic/router';

const app = express();
const config = await getConfig('server');
const port = config.port;

app.use(cors());
app.use(express.json());

app.use('/api/arithmetic', arithmeticRouter);
// app.use('/api/geometry', geometryRouter);

// Initialize services
// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});

export default app;