# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Logikids is an AI-powered educational platform that helps children aged 8-16 develop logical thinking and problem-solving skills through interactive, personalized tasks. The platform uses AI (Ollama or OpenAI) to dynamically generate educational content across multiple subjects.

## Tech Stack

- **Runtime**: Bun (backend), Node.js compatible
- **Frontend**: React 18 + TypeScript, TailwindCSS, React Query, React Router, Vite
- **Backend**: Express + TypeScript running on Bun
- **Database**: PostgreSQL 16 Alpine (encrypted user data storage)
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

### Database Commands

```bash
# Access PostgreSQL
docker compose exec postgres psql -U logikids -d logikids

# View sync data
docker compose exec postgres psql -U logikids -d logikids -c "SELECT user_id, blob_size, last_accessed FROM user_sync_data;"

# Backup database
docker exec logikids-postgres pg_dump -U logikids logikids > backup-$(date +%Y%m%d).sql

# Restore database
cat backup.sql | docker exec -i logikids-postgres psql -U logikids logikids
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
   - `subject.registry.ts` - SubjectRegistry loads subjects from `/prompts/subjects/`
   - `types/registry.ts` - TaskTypeRegistry loads task types from `/prompts/task-types/`
   - `loader.ts` - PromptLoader parses markdown files with YAML frontmatter (using gray-matter)
   - `prompt.builder.ts` - Builds prompts by combining subject, concept, and task type templates
   - `schemas.ts` - Zod schemas for frontmatter validation
   - `task.service.ts` - Core task generation service
   - `task.controller.ts` - Task generation HTTP controller
   - `taskCache.ts` - In-memory cache for task context (30-min TTL)
   - `hint.controller.ts` - On-demand hint generation endpoint
   - `cacheCleanup.ts` - Periodic cache cleanup service
   - Registries auto-discover and load prompts on server startup
   - **Lazy Hint Generation**: Initial task generation excludes hints for 70-80% faster response. Hints generated on-demand when requested.

2. **AI Integration** (`packages/backend/src/common/ai/`)
   - Factory pattern for swapping between Ollama/OpenAI
   - Configured via `packages/backend/config.yaml`
   - Text and image generation support

3. **User Data Sync** (`packages/backend/src/sync/`)
   - `db.ts` - PostgreSQL connection pool and initialization
   - `storage.service.ts` - Storage layer with PostgreSQL backend
   - `sync.service.ts` - Business logic for encrypted data sync
   - `sync.controller.ts` - HTTP endpoints (PUT, GET, POST verify, DELETE)
   - `sync.schema.ts` - Zod validation schemas
   - `router.ts` - Express router configuration
   - `migrations/001_init.sql` - Database schema initialization
   - Zero-knowledge architecture: Server stores only encrypted blobs
   - Rate limiting: 100 requests per user per hour
   - GDPR compliance: Right to erasure, automatic cleanup of inactive accounts

4. **API Routes**
   - **Task Generation:**
     - `GET /api/task` - Generate a task (without hints) with query params: `subject`, `concept` (optional), `taskType` (optional), `grade`, `age`, `difficulty`, `language`, `gender` (optional)
     - `POST /api/task/:taskId/hint` - Generate a single hint on-demand for the specified task
     - `GET /api/task/subjects` - List all available subjects and concepts with optional `grade` and `difficulty` filters
     - **Client-driven architecture**: Frontend sends all user context (age, grade, language, difficulty) as query parameters
     - **Task Response**: Includes `taskId` (required), hints are generated on-demand and NOT included in initial response
   - **User Data Sync:**
     - `PUT /api/sync/:userId` - Upload encrypted user data
     - `GET /api/sync/:userId` - Download encrypted user data
     - `POST /api/sync/:userId/verify` - Check if user exists
     - `DELETE /api/sync/:userId` - Delete user data (GDPR right to erasure)

**Configuration**:
- Backend requires `packages/backend/config.yaml` (copy from `config.template.yaml`) with AI provider settings
- PostgreSQL connection via `DATABASE_URL` environment variable (configured in docker-compose.yml)
- Default PostgreSQL credentials: user `logikids`, password from `POSTGRES_PASSWORD` env var

### Prompt Management

Prompts for subjects and task types are stored in markdown files with YAML frontmatter, separated from code for easier editing:

**Structure:**
```
packages/content/
  subjects/
    {subject-id}/
      base.md                    # Subject metadata + base prompt + content guidelines
      official/{concept}.md      # Curriculum-aligned concepts
      custom/{concept}.md        # Custom/supplementary concepts
packages/backend/prompts/
  task-types/
    {task-type}.md     # Task type prompts
  hints/
    base.md           # Hint generation prompt
```

**Content Format:**
- All prompts instruct LLM to generate **Markdown** (not HTML)
- Math formulas: LaTeX syntax with $ (inline) and $$ (block)
- Code blocks: Fenced code blocks with language: ```python
- Diagrams: Mermaid syntax in ```mermaid blocks
- Tables: GitHub Flavored Markdown syntax
- SVG: Inline <svg> elements for custom graphics

**Subject-Specific Content Guidelines:**
Each subject's base.md includes guidelines for which content types to use:
- Math: LaTeX formulas, tables, SVG for geometry
- Logic: Mermaid diagrams, tables for truth tables
- Physics: LaTeX formulas, SVG diagrams, tables
- German/Music: Basic Markdown, tables, emphasis

**Adding a New Concept:**
1. Create `packages/content/subjects/{subject-id}/official/{concept-id}.md` or `custom/{concept-id}.md`
2. Add YAML frontmatter with required fields:
   - `id` (string) - Unique identifier for the concept
   - `name` (string) - Display name
   - `description` (string) - Brief description
   - `grade` (number 1-13) - Target grade level
   - `ages` (array [min, max]) - Age range, e.g., `[8, 16]`
   - `difficulty` (string) - One of: `easy`, `medium`, `hard`
   - `focus` (string) - Learning focus area
   - `learning_objectives` (array of strings) - What students will learn
   - Optional: `prerequisites`, `example_tasks`, `real_world_context`
3. Add Markdown-based prompt template
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
- Required fields for concepts: `id`, `name`, `description`, `grade`, `ages`, `difficulty`, `focus`, `learning_objectives`
- Ages must be a 2-element array `[min, max]` where min ≤ max

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

**Markdown Rendering:**
- MarkdownRenderer component handles all text content
- Supports LaTeX math (KaTeX), code highlighting, Mermaid diagrams, SVG
- Replaces all HTML-based rendering (no dangerouslySetInnerHTML)

**Internationalization**:
- i18next with HTTP backend
- Translation files: `public/locales/en/common.json` and `public/locales/de/common.json`
- Automatic cache busting via MD5 hash of translation files
- Both files must be updated together when adding translations

**Routing**: React Router v7 with HashRouter for client-side routing

## Adding New Features

### Adding a New Subject

**Backend** (`packages/content/subjects/`):

1. Create directory: `packages/content/subjects/new-subject/`
2. Create `base.md` with frontmatter and base prompt:
   ```markdown
   ---
   id: new-subject
   name: New Subject
   description: Description of the subject
   ---

   Base prompt template with {{placeholders}}
   ```
3. Create subdirectories: `official/` and/or `custom/`
4. Create concept files: `official/concept-name.md` or `custom/concept-name.md` with full frontmatter (see Adding a New Concept section)
5. Server auto-discovers new subjects on startup (no code changes needed)

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
7. **LaTeX syntax**: Math formulas require proper $ and $$ delimiters. Single $ for inline, $$ for block equations.
8. **PostgreSQL data persistence**: User sync data persists in Docker volume `postgres-data`. Use `docker compose down -v` to remove volumes and reset database.
9. **Database initialization**: PostgreSQL schema auto-creates on first startup via `/docker-entrypoint-initdb.d` volume mount. Delete volume to re-run migrations.

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

## UI Design System (Updated 2025-10-31)

**Design Philosophy:** Modern, minimalistic design using shadcn/ui components with no gradients and consistent styling.

### Component Architecture Rules

**IMPORTANT: Follow these rules for all frontend development:**

1. **No Gradients**: Use solid colors only. Never use `bg-gradient-to-*` classes.
2. **No Custom CSS Files**: Delete all `.css` and `styles.ts` files. Use Tailwind classes exclusively.
3. **Build from shadcn/ui**: Import components from `@/components/ui/` (Card, Button, Badge, etc.)
4. **No Inline Styles**: Exception only for CSS variables (e.g., subject accent colors)
5. **Component Location**: All new components go in `src/ui/` organized by feature

### Design Tokens

**Colors:**
- Subject accents defined in `tailwind.config.js` under `colors.subjects`
- Math: `#3b82f6` (blue-500)
- Logic: `#a855f7` (purple-500)
- Physics: `#10b981` (emerald-500)
- German: `#ef4444` (red-500)
- Music: `#ec4899` (pink-500)

**Shadows:** Use `shadow-sm`, `shadow-md`, `shadow-lg` - NO borders on primary cards

**Border Radius:**
- Buttons/Cards: `rounded-2xl` (16px)
- Inputs: `rounded-xl` (12px)

**Spacing:**
- Card padding: `p-8`
- Grid gaps: `gap-6`
- Container max-width: `max-w-6xl`

**Transitions:** Purposeful only - `transition-all duration-200` or `duration-300`

### Component Structure

```
src/ui/
  ├── common/          # PageLayout, Breadcrumb, NumberInput
  ├── subjects/        # SubjectCard, SubjectsPage
  ├── concepts/        # ConceptCard, ConceptsPage
  ├── tasks/           # TaskCard, HintSection (TODO: migrate from features/)
  ├── welcome/         # WelcomePage, NavigationCards
  ├── account/         # AccountPage
  └── onboarding/      # OnboardingPage, StudentInfoStep
```

**Legacy Code:** `src/features/` contains old components still being migrated. Prefer `src/ui/` for all new work.

### Migration Status

- ✅ Core layout components (PageLayout, navigation)
- ✅ Subject/Concept selection
- ✅ Welcome and onboarding flows
- ⏳ Task components (still in `src/features/Task/` - needs migration)

**See Full Design:** `docs/plans/2025-10-31-ui-redesign.md`
