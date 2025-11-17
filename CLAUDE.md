# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Logikids is an AI-powered educational platform for children aged 8-16, built as a monorepo with three main packages:
- **Frontend**: React + TypeScript + Vite application
- **Backend**: Node.js + Bun + Express API service
- **Content**: Educational content organized by subject (math, physics, music, logic, etc.)

The platform uses AI to generate personalized learning tasks based on curriculum-aligned concepts, with support for multiple task types (single choice, multiple select, fill-in-blank, ordering, number input, yes/no).

## Development Commands

### Starting the Development Environment

All services run via Docker Compose. The system uses PostgreSQL for data persistence.

```bash
# Start frontend and backend in development mode
npm run dev
# Or explicitly:
docker compose up frontend-dev backend-dev

# Start only frontend (port 5153)
docker compose up frontend-dev

# Start only backend (port 5175)
docker compose up backend-dev

# View logs
docker compose logs -f frontend-dev
docker compose logs -f backend-dev

# Rebuild after dependency changes
docker compose build frontend-dev
docker compose build backend-dev

# Stop all services
docker compose down
```

### Production Mode

```bash
# Build and start production services
npm run prod
# Or explicitly:
docker compose up frontend-prod backend-prod --build
```

Production ports: Frontend (5154), Backend (5176)

### Database Management

```bash
# Run database migrations
docker compose exec backend-dev bun run migrate

# Access database via Adminer (web UI)
# Navigate to http://localhost:8080

# Connect to PostgreSQL directly
docker compose exec postgres psql -U logikids -d logikids
```

### Testing

```bash
# Run backend tests
docker compose run backend-test

# Run frontend tests
docker compose run frontend-dev npm test
```

### Invite Code Management

The platform uses invite codes for beta access:

```bash
# List all active codes
./invite list

# Create new invite code
./invite create "Optional note about recipient"

# Remove specific code
./invite remove ABCD-1234

# Delete all codes (with confirmation)
./invite clear
```

### TypeScript and Build

```bash
# Type check frontend
docker compose exec frontend-dev npm run build

# Type check backend
docker compose exec backend-dev bun run start
```

### Translation Management

```bash
# Check for missing translations
npm run check-translations
```

## Architecture

### Backend Architecture

The backend follows a service-oriented architecture with these key components:

**Registry System**: Two main registries manage runtime data:
- `SubjectRegistry` (`src/subjects/registry.ts`): Manages subjects and their concepts loaded from `/content/subjects/`
- `TaskTypeRegistry` (`src/tasks/types/registry.ts`): Manages available task types and their JSON schemas

Both registries extend `BaseRegistry` and support hot-reload in development mode.

**Task Generation Flow**:
1. `TaskController` receives request with subject, concept (optional), task type, grade, age, difficulty
2. `TaskService` (`src/tasks/task.service.ts`):
   - Selects concept (random if not specified, filtered by grade/age/difficulty)
   - Selects task type (random if not specified)
   - Uses `PromptService` to build AI prompt from templates
   - Calls AI provider (Ollama/OpenAI/Anthropic) via `AIClient`
   - Caches result in `TaskCache`
3. Response includes task data + metadata (subject, concept, task type, difficulty)

**AI Provider Configuration**:
- Config file: `packages/backend/config.yaml` (copy from `config.template.yaml`)
- Supports three providers: Ollama (local), OpenAI, Anthropic
- Provider selection affects both text generation and image generation
- Factory pattern in `src/common/ai/factory.ts` creates appropriate client

**Authentication & Sync**:
- JWT-based auth (`src/auth/`)
- User data sync system (`src/sync/`) for cross-device learning progress
- Invite-code system for beta access control

**Error Handling**:
- Structured error hierarchy in `src/common/errors/`
- Global error handler middleware in `src/common/middleware/errorHandler.ts`
- Each domain (auth, task, invite, etc.) has specific error types

### Frontend Architecture

React application using React Router v7 for routing, organized by feature:

**Key Contexts**:
- `AuthContext`: JWT authentication state
- `UserDataContext`: User profile and progress data
- `DataSyncContext`: Synchronization with backend
- All contexts wrapped in `Providers.tsx`

**Feature Areas** (in `src/app/`):
- `tasks/`: Task display, answer input, feedback, difficulty selection
- `subjects/`: Subject browsing and selection
- `concepts/`: Concept cards and exploration
- `stats/`: Learning statistics, achievements, progress tracking
- `account/`: Profile settings, data export/import, recovery kit (QR codes)
- `welcome/`: Landing page with personalized greetings
- `onboarding/`: New user setup flow

**Task Answer Types**: Each task type has a corresponding answer component in `src/app/tasks/answer-types/`:
- `SingleChoiceAnswer.tsx`
- `MultiSelectAnswer.tsx`
- `FillInBlankAnswer.tsx`
- `OrderingAnswer.tsx`
- `NumberInputAnswer.tsx`
- `YesNoAnswer.tsx`

**Styling**:
- TailwindCSS v4 with custom configuration
- Time-of-day theme system (morning/midday/evening/night) applied via `useTimeOfDay` hook
- Component library based on Radix UI primitives in `src/components/ui/`

**Data Flow**:
- React Query (`@tanstack/react-query`) for API calls and caching
- API client in `src/api/api.ts` with typed endpoints
- Zod schemas for runtime validation

### Content Architecture

Educational content is stored in `packages/content/subjects/` with this structure:

```
subjects/
├── math/
│   ├── base.md          # Subject metadata
│   └── official/        # Official curriculum concepts
│       ├── addition.md
│       ├── subtraction.md
│       └── ...
├── physics/
│   ├── base.md
│   └── official/
├── music/
└── ...
```

Each concept file (e.g., `addition.md`) contains:
- Frontmatter: `id`, `name`, `grade`, `ages`, `difficulty`, `description`
- Content: Markdown text explaining the concept

The `PromptLoader` (`src/prompts/loader.ts`) reads these files and the `SubjectRegistry` makes them available to the task generation system.

## Working with AI Prompts

Prompts are in `packages/backend/prompts/`:
- `base-prompt.md`: Core system prompt for task generation
- `task-types/*.md`: Specific prompts for each task type
- `variations/*.md`: Variation strategies to prevent repetitive tasks
- `hints/*.md`: Hint generation prompts

To test prompts:
```bash
docker compose exec backend-dev bun run test:prompt

# Validate prompt syntax
docker compose exec backend-dev bun run validate:prompts
```

## Key Development Patterns

1. **Registry Pattern**: When adding new subjects or task types, they're auto-discovered by scanning directories during initialization

2. **Error Handling**: Always throw typed errors from `src/common/errors/` rather than generic errors

3. **Logging**: Use `createLogger(name)` from `src/common/logger.ts` for consistent logging

4. **Hot Reload**: In development, both registries watch for file changes and reload automatically

5. **Caching**: Task generation results are cached by `TaskCache` to avoid duplicate AI calls

6. **Translation**: Use i18next keys in format `namespace:key`. Translations stored in `public/locales/{lang}/{namespace}.json`

## Environment Variables

Required environment variables (set in docker-compose.yml):

**Backend**:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing
- `NODE_ENV`: development | production | test

**AI Configuration** (in config.yaml, not env vars):
- Provider selection (ollama/openai/anthropic)
- API keys for cloud providers
- Model selection and parameters

## Database Schema

Key tables (see `packages/backend/database/migrations/`):
- `users`: User accounts and profiles
- `user_progress`: Learning progress tracking
- `sync_data`: Cross-device sync metadata
- `invite_codes`: Beta access codes
- `task_cache`: Cached AI-generated tasks

## Port Reference

- Frontend Dev: 5153
- Frontend Prod: 5154
- Backend Dev: 5175
- Backend Prod: 5176
- PostgreSQL: 5432
- Adminer (DB UI): 8080

## Notes

- Backend uses Bun runtime for performance (not Node.js)
- Frontend builds with Vite, not Create React App
- All content must be curriculum-aligned; use existing concepts as templates
- When adding task types, you must: (1) create prompt in `prompts/task-types/`, (2) create schema in `src/tasks/types/`, (3) add grading logic in `src/tasks/grading/`, (4) create answer component in frontend