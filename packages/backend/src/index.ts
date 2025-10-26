import express from 'express';
import cors from 'cors';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import taskRouter from './tasks/router';
import { createSyncRouter } from './sync/router';
import { errorHandler } from './common/middleware/errorHandler';
import { cacheCleanupService } from './tasks/cacheCleanup';
import { subjectRegistry } from './tasks/subject.registry';
import { taskTypeRegistry } from './tasks/types/registry';

// Load configuration
const configPath = path.join(__dirname, '../config.yaml');
const config = yaml.load(fs.readFileSync(configPath, 'utf8')) as Record<string, any>;

// Initialize registries before starting server
async function initializeRegistries() {
  console.log('Initializing registries...');
  await Promise.all([
    subjectRegistry.initialize(),
    taskTypeRegistry.initialize(),
  ]);
  console.log('Registries initialized successfully');
}

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/task', taskRouter);
app.use('/api/sync', createSyncRouter());

// Error handling
app.use(errorHandler);

// Start cache cleanup job
cacheCleanupService.start();

// Cleanup on shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, cleaning up...');
  cacheCleanupService.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, cleaning up...');
  cacheCleanupService.stop();
  process.exit(0);
});

// Start server if not imported as module
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = config.server?.port || 3000;

  // Initialize registries before starting server
  await initializeRegistries();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;