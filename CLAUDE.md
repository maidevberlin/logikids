# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Logikids is an AI-powered educational platform that helps children aged 8-16 develop logical thinking and problem-solving skills through interactive, personalized tasks. The platform uses AI (Ollama or OpenAI) to dynamically generate educational content across multiple subjects.

## Tech Stack

- **Runtime**: Bun (backend), Node.js compatible
- **Frontend**: React 18 + TypeScript, TailwindCSS, React Query, React Router, Vite
- **Backend**: Express + TypeScript running on Bun
- **Testing**: Jest, React Testing Library, Supertest
- **Validation**: Zod schemas throughout
- **Deployment**: Docker Compose with separate dev/prod containers
- **AI**: Ollama (local) or OpenAI for task generation

## Development Commands

**Important**: All commands run inside Docker containers. Use `docker compose exec` for running commands in active containers.

### Starting Services

```bash
# Development mode (with hot reload)
docker compose up frontend-dev backend-dev

# Production mode
docker compose up frontend-prod backend-prod --build

# Individual services
docker compose up frontend-dev
docker compose up backend-dev
```

- Frontend dev: http://localhost:5153
- Backend dev: http://localhost:5175
- Frontend prod: http://localhost:5154
- Backend prod: http://localhost:5176

### Testing

```bash
# Backend tests (watch mode)
docker compose run backend-test

# Frontend tests (inside running container)
docker compose exec frontend-dev npm test

# Single test run
docker compose exec backend-dev bun test
```

### Running Commands in Containers

```bash
# Backend commands
docker compose exec backend-dev bun install <package>
docker compose exec backend-dev bun run <script>

# Frontend commands
docker compose exec frontend-dev npm install <package>
docker compose exec frontend-dev npm run <script>
```

### Rebuilding & Cleanup

```bash
# Rebuild specific service
docker compose build frontend-dev
docker compose build backend-dev

# Stop all services
docker compose down

# Remove containers and volumes
docker compose down -v
```

## Architecture

### Monorepo Structure

```
packages/
├── frontend/     # React SPA
└── backend/      # Express API on Bun
```

### Backend Architecture

**Domain-Driven Design**: Code is organized by domain (tasks, subjects, types) rather than technical layers.

**Key Components**:

1. **Task Generation System** (`packages/backend/src/tasks/`)
   - `subjects/registry.ts` - SubjectRegistry loads subjects from `/prompts/subjects/`
   - `types/registry.ts` - TaskTypeRegistry loads task types from `/prompts/task-types/`
   - `loader.ts` - PromptLoader parses markdown files with YAML frontmatter (using gray-matter)
   - `schemas.ts` - Zod schemas for frontmatter validation
   - `taskCache.ts` - In-memory cache for task context (30-min TTL)
   - `hint.controller.ts` - On-demand hint generation endpoint
   - `cacheCleanup.ts` - Periodic cache cleanup service
   - Registries auto-discover and load prompts on server startup
   - **Lazy Hint Generation**: Initial task generation excludes hints for 70-80% faster response. Hints generated on-demand when requested.

2. **AI Integration** (`packages/backend/src/common/ai/`)
   - Factory pattern for swapping between Ollama/OpenAI
   - Configured via `packages/backend/config.yaml`
   - Text and image generation support

3. **API Routes**
   - `GET /api/task` - Generate a task (without hints) with query params: subject, concept, taskType, age, difficulty
   - `POST /api/task/:taskId/hint` - Generate a single hint on-demand for the specified task
   - `GET /api/task/subjects` - List all available subjects and concepts
   - Accept-Language header determines response language
   - **Task Response**: Includes `taskId` (required), `hints` field is optional (only in legacy responses)

**Configuration**: Backend requires `packages/backend/config.yaml` (copy from `config.template.yaml`) with AI provider settings.

### Prompt Management

Prompts for subjects and task types are stored in markdown files with YAML frontmatter, separated from code for easier editing:

**Structure:**
```
/prompts/
  subjects/
    {subject-id}/
      base.md          # Subject metadata + base prompt
      {concept}.md     # Each concept's prompt
  task-types/
    {task-type}.md     # Task type prompts
```

**Adding a New Concept:**
1. Create `/prompts/subjects/{subject-id}/{concept-id}.md`
2. Add YAML frontmatter:
   ```yaml
   ---
   id: concept-id
   name: Concept Name
   description: Brief description
   ---
   ```
3. Add prompt template below frontmatter
4. Changes apply immediately in development (hot-reload)
5. No code changes needed

**Editing Prompts:**
- Edit markdown files directly in `/prompts/` directory
- No code changes or TypeScript knowledge required
- Changes apply immediately in development (hot-reload via chokidar)
- Production requires server restart

**Hot-Reload Limitation:**
- Hot-reload uses chokidar to watch for file changes
- On macOS with Docker volumes, file system events may not propagate reliably from host to container
- If hot-reload doesn't work, restart the backend container: `docker compose restart backend-dev`
- This is a known limitation of Docker Desktop on macOS

**Validation:**
- Frontmatter validated on startup with Zod schemas
- Server fails fast if any prompt is invalid
- Clear error messages show exactly what's wrong
- Required fields: `id`, `name`, `description`

### Frontend Architecture

**Feature-Based Structure**: Each feature is self-contained in `packages/frontend/src/features/`

**Key Features**:
- `Task/` - Task display, interaction, and evaluation
- `Subject/` - Subject and concept selection
- `Stats/` - Progress tracking and analytics
- `Account/` - User account management
- `Welcome/` - Onboarding flow

**State Management**:
- React Query for server state (task fetching, caching)
- React Context for global UI state (in `features/base/`)
- Local state for component-specific UI

**Internationalization**:
- i18next with HTTP backend
- Translation files: `public/locales/en/common.json` and `public/locales/de/common.json`
- Automatic cache busting via MD5 hash of translation files
- Both files must be updated together when adding translations

**Routing**: React Router v7 with HashRouter for client-side routing

## Adding New Features

### Adding a New Subject

**Backend** (`prompts/subjects/`):

1. Create directory: `prompts/subjects/new-subject/`
2. Create `base.md` with frontmatter and base prompt:
   ```markdown
   ---
   id: new-subject
   name: New Subject
   description: Description of the subject
   ---

   Base prompt template with {{placeholders}}
   ```
3. Create concept files: `prompts/subjects/new-subject/concept-name.md`
4. Server auto-discovers new subjects on startup (no code changes needed)

**Frontend**:

1. Add translations to BOTH `public/locales/en/common.json` and `public/locales/de/common.json`:
   ```json
   "subjects": {
     "newSubject": {
       "label": "Subject Name",
       "concepts": {
         "concept1": "Concept 1"
       }
     }
   }
   ```
2. Create WebP background image at `packages/frontend/src/assets/newSubject.webp`
3. Import and add to backgrounds in `packages/frontend/src/features/Task/TaskPage/TaskPage.tsx`

See `packages/backend/docs/tasks.md` and `packages/frontend/docs/tasks.md` for detailed examples.

### Adding a New Task Type

**Backend**:

1. Create prompt file: `prompts/task-types/new-type.md`
   ```markdown
   ---
   id: newType
   name: New Type
   description: Description of task type
   ---

   Task creation instructions and prompt template
   ```
2. Add JSON schema to `packages/backend/src/tasks/types/newType.ts`
3. Register schema in `TaskTypeRegistry` schemas map
4. Server auto-discovers task type on startup

See `packages/backend/docs/tasks.md` for detailed examples.

## Important Coding Practices

From `.cursorrules`:

1. **Always use Docker**: Run commands via `docker compose exec` not directly on host
2. **Read documentation first**: Check component README, task docs before making changes
3. **Domain-driven structure**: Organize by domain (Task, User, etc) not by technical layer
4. **Keep code DRY**: Reuse functions and components
5. **Find root causes**: Never apply quick fixes, understand the underlying issue
6. **Maintain consistency**: Updates must be consistent across the entire codebase
7. **Clean up**: Remove unused files when refactoring

## AI Configuration Notes

- Backend config file (`config.yaml`) is NOT committed (in .gitignore)
- Template at `config.template.yaml` shows required structure
- Ollama default host uses `host.docker.internal:11434` to reach host from container
- Can switch between Ollama and OpenAI per provider (text/image)

## Common Gotchas

1. **Translation cache**: Browser caches translations. Hard refresh (Ctrl/Cmd+Shift+R) may be needed during development
2. **Missing translations**: Always update BOTH English and German translation files or content will appear untranslated
3. **Docker volumes**: Frontend/backend mount source code as volumes for hot reload in dev mode
4. **Port conflicts**: Dev services on 5173/5175, prod on 5174/5176
5. **Bun runtime**: Backend uses Bun, not Node. Use `bun` commands not `npm`
6. **Task cache expiration**: Task context expires after 30 minutes. Requesting hints for expired tasks returns 404.

## Lazy Hint Generation

**Optimization implemented 2025-10-25** - Reduces initial task load time by 70-80%.

### How It Works

**Initial Task Request:**
1. `GET /api/task` generates task + solution (no hints)
2. Backend stores task context in memory cache (30-min TTL)
3. Returns response with `taskId` and no `hints` field
4. User sees task immediately (~2-3s vs. 8-10s previously)

**Hint Request Flow:**
1. User clicks "Get Hint" button
2. Frontend calls `POST /api/task/:taskId/hint`
3. Backend retrieves task context from cache
4. Generates single contextual hint using LLM (~1-2s)
5. Stores hint in cache, returns to frontend
6. Repeat up to 4 times per task

**Cache Structure:**
```typescript
TaskContext {
  taskId: string          // UUID for task identification
  subject: string         // e.g., "math"
  concept: string         // e.g., "arithmetic"
  age: number            // Student age
  difficulty: string     // Task difficulty level
  language: string       // Response language
  generatedTask: string  // Full task HTML
  solution: any          // Complete solution data
  hintsGenerated: []     // Previously generated hints
  createdAt: number      // For TTL calculation
}
```

**Benefits:**
- Initial load: 70-80% faster (hints are ~40% of response tokens)
- Cost efficient: Only generate hints users actually request
- Better UX: Task available immediately, hints during thinking time

**Design Doc:** See `docs/plans/2025-10-25-lazy-hint-generation-design.md` for full architecture
