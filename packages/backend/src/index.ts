import express from 'express';
import cors from 'cors';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import taskRouter from './tasks/router';
import { createSyncRouter } from './sync/router';
import { errorHandler } from './common/middleware/errorHandler';
import { cacheCleanupService } from './cache/cacheCleanup';
import { subjectRegistry } from './subjects/registry';
import { taskTypeRegistry } from './tasks/types/registry';
import { initializeDatabase, closeDatabase } from './sync/db';
import Mustache from 'mustache';

// Configure Mustache: disable HTML escaping since we generate plain text/markdown
Mustache.escape = (text) => text;

// Load configuration
const configPath = path.join(__dirname, '../config.yaml');
const config = yaml.load(fs.readFileSync(configPath, 'utf8')) as Record<string, any>;

// Initialize registries and database before starting server
async function initializeRegistries() {
  console.log('Initializing registries and database...');
  await Promise.all([
    subjectRegistry.initialize(),
    taskTypeRegistry.initialize(),
    initializeDatabase(),
  ]);
  console.log('All registries and database initialized');
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

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  cacheCleanupService.stop();
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  cacheCleanupService.stop();
  await closeDatabase();
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