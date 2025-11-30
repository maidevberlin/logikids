import { router } from './trpc';
import { authRouter } from './auth/router';
import { subjectsRouter } from './subjects/router';
import { conceptsRouter } from './concepts/router';
import { tasksRouter } from './tasks/router';
import { syncRouter } from './sync/router';
import { invitesRouter } from './invites/router';

/**
 * Main application router
 * Organized by entity for cleaner, flatter API structure:
 * - subjects.getAll - list subjects
 * - concepts.get - get concepts (requires subject param)
 * - tasks.get - get task (requires subject, optional concept)
 * - tasks.getHint - get hint
 */
export const appRouter = router({
  auth: authRouter,
  subjects: subjectsRouter,
  concepts: conceptsRouter,
  tasks: tasksRouter,
  sync: syncRouter,
  invites: invitesRouter,
});

// Export type for use in frontend
export type AppRouter = typeof appRouter;
