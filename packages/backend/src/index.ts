import express from 'express';
import cors from 'cors';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import taskRouter from './tasks/router';
import { errorHandler } from './common/middleware/errorHandler';

// Load configuration
const configPath = path.join(__dirname, '../config.yaml');
const config = yaml.load(fs.readFileSync(configPath, 'utf8')) as Record<string, any>;

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/task', taskRouter);

// Error handling
app.use(errorHandler);

// Start server if not imported as module
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = config.server?.port || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;