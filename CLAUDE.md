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

- Frontend dev: http://localhost:5173
- Backend dev: http://localhost:5175
- Frontend prod: http://localhost:5174
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
   - `subjects/` - Subject definitions (math, logic, music, physics)
   - `types/` - Task type definitions (multiple choice, yes/no)
   - `subjects/base.ts` - BaseSubject class that all subjects extend
   - `types/base.ts` - BaseTaskType class with Zod validation
   - Both use singleton registries for automatic registration

2. **AI Integration** (`packages/backend/src/common/ai/`)
   - Factory pattern for swapping between Ollama/OpenAI
   - Configured via `packages/backend/config.yaml`
   - Text and image generation support

3. **API Routes**
   - `GET /api/task` - Generate a task with query params: subject, concept, taskType, age, difficulty
   - `GET /api/task/subjects` - List all available subjects and concepts
   - Accept-Language header determines response language

**Configuration**: Backend requires `packages/backend/config.yaml` (copy from `config.template.yaml`) with AI provider settings.

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

**Backend** (`packages/backend/src/tasks/subjects/`):

1. Create `newSubject.ts` extending `BaseSubject`
2. Define subject metadata (id, name, description, basePromptTemplate)
3. Define concepts with prompt templates
4. Export singleton instance
5. Add export to `subjects/index.ts`

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

**Backend** (`packages/backend/src/tasks/types/`):

1. Create `newType.ts` extending `BaseTaskType`
2. Define Zod response schema
3. Define prompt template for AI generation
4. Export singleton instance
5. Add export to `types/index.ts`

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
