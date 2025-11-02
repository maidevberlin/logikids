# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Logikids is an AI-powered educational platform for children aged 8-16 that generates personalized tasks across multiple subjects using Ollama or OpenAI.

## Tech Stack

- **Runtime**: Bun (frontend and backend)
- **Frontend**: React 18 + TypeScript, Tailwind CSS v4, React Query, React Router
- **Backend**: Express + TypeScript on Bun
- **Database**: PostgreSQL 16
- **Deployment**: Docker Compose with dev/prod containers
- **AI**: Ollama (local) or OpenAI

## Development

**All commands run inside Docker containers using `docker compose exec`**

### Starting Services

```bash
docker compose up frontend-dev backend-dev
```

- Frontend dev: http://localhost:5153
- Backend dev: http://localhost:5175

### Running Commands

```bash
# Backend
docker compose exec backend-dev bun <command>

# Frontend
docker compose exec frontend-dev bun <command>
```

## Architecture

### Monorepo Structure

```
packages/
├── frontend/     # React SPA
└── backend/      # Express API
```

### Backend Architecture

**Domain-Driven Design**: Code organized by domain (tasks, subjects, types), not layers.

**Key Systems**:

1. **Task Generation** (`packages/backend/src/tasks/`)
   - `subject.registry.ts` - Loads subjects from `/prompts/subjects/`
   - `types/registry.ts` - Loads task types from `/prompts/task-types/`
   - `loader.ts` - Parses markdown files with YAML frontmatter
   - `prompt.builder.ts` - Combines subject, concept, and task type templates
   - `task.service.ts` - Core task generation
   - `taskCache.ts` - In-memory cache (30-min TTL)
   - `hint.controller.ts` - On-demand hint generation

2. **AI Integration** (`packages/backend/src/common/ai/`)
   - Factory pattern for Ollama/OpenAI
   - Configured via `packages/backend/config.yaml`

3. **Authentication** (`packages/backend/src/auth/`)
   - JWT tokens: Access (1 hour) + Refresh (1 year)
   - Invite code system for registration
   - Database tables: `user_accounts`, `invite_codes`, `refresh_tokens`

4. **User Data Sync** (`packages/backend/src/sync/`)
   - Zero-knowledge encrypted blob storage
   - PostgreSQL backend

**API Routes**:
- **Auth**: `/api/auth/register`, `/login`, `/refresh`, `/verify`, `/logout`
- **Tasks**:
  - `GET /api/task?subject&grade&difficulty&language` - Generate task
  - `POST /api/task/:taskId/hint` - Generate hint
  - `GET /api/task/subjects` - List subjects/concepts
- **Sync**: `/api/sync/:userId` (PUT, GET, DELETE)

**Configuration**:
- Backend: `packages/backend/config.yaml` (copy from template)
- Database: `DATABASE_URL` environment variable
- Auth: `JWT_SECRET` environment variable

### Prompt Management

Prompts stored in markdown with YAML frontmatter:

```
packages/content/subjects/{subject-id}/
  base.md                    # Subject metadata + base prompt
  official/{concept}.md      # Curriculum-aligned concepts
  custom/{concept}.md        # Custom concepts
packages/backend/prompts/task-types/{type}.md
```

**Content Format**:
- All prompts generate **Markdown** (not HTML)
- Math: LaTeX with $ (inline) and $$ (block)
- Diagrams: Mermaid in ```mermaid blocks
- Code: Fenced code blocks

**Adding a Concept**:
1. Create `packages/content/subjects/{subject}/official/{concept}.md`
2. Required frontmatter: `id`, `name`, `description`, `grade`, `ages`, `difficulty`, `focus`, `learning_objectives`
3. Hot-reload in dev (may need `docker compose restart backend-dev` on macOS)

### Frontend Architecture

**Feature-Based Structure**: `packages/frontend/src/features/`

**Key Features**:
- `Task/` - Task display and interaction
- `Subject/` - Subject/concept selection
- `Stats/` - Progress tracking
- `Account/` - User management
- `Welcome/` - Onboarding

**State Management**:
- React Query for server state
- React Context for global UI state

**Data Storage** (`packages/frontend/src/data/`):
- Client-side encryption (AES-256-GCM)
- IndexedDB: encryption keys + JWT tokens
- localStorage: encrypted user data
- Zero-knowledge: server never sees keys or plain text

**Internationalization**:
- i18next with translations in `public/locales/en/` and `public/locales/de/`
- Always update BOTH language files

## UI Design System

**Design Philosophy**: Modern, minimalistic using shadcn/ui components

**Rules**:
1. No gradients - solid colors only
2. No custom CSS files - Tailwind only
3. Use shadcn/ui components from `@/components/ui/`
4. No inline styles except CSS variables
5. New components go in `src/ui/`

**Design Tokens**:
- Border radius: `rounded-2xl` (cards), `rounded-xl` (inputs)
- Shadows: `shadow-sm`, `shadow-md`, `shadow-lg`
- Spacing: `p-8` (cards), `gap-6` (grids)

## Important Practices

1. **Always use Docker**: Run commands via `docker compose exec`
2. **Domain-driven structure**: Organize by domain, not technical layer
3. **Find root causes**: Never apply quick fixes
4. **Update both translation files**: English AND German

## Common Gotchas

1. **Bun runtime**: Use `bun` commands, not `npm`
2. **Translation cache**: Hard refresh may be needed
3. **Hot-reload on macOS**: May need `docker compose restart backend-dev`
4. **JWT tokens**: Access tokens expire after 1 hour
5. **Task cache**: Expires after 30 minutes
6. **IndexedDB**: Clearing browser data loses encrypted user data permanently
