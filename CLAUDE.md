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

- Frontend dev: http://localhost:5153 (proxies `/api` to backend-dev)
- Backend dev: http://localhost:5175
- Frontend prod: http://localhost:5154 (proxies `/api` to backend-prod)
- Backend prod: http://localhost:5176

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

3. **Database** (`packages/backend/database/`)
   - `db.ts` - PostgreSQL connection pool
   - `migrate.ts` - Migration runner CLI
   - `migrations/` - SQL migration files (numbered, idempotent)
   - Run migrations: `docker compose exec backend-dev bun run migrate`

4. **Authentication** (`packages/backend/src/auth/`)
   - JWT tokens: Access (1 hour)
   - Invite code system for registration
   - Database tables: `user_accounts`, `invite_codes`

5. **User Data Sync** (`packages/backend/src/sync/`)
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

**Progress Tracking** (`packages/frontend/src/data/progress/`):
- Concept-level tracking (per-concept stats, not just subject+difficulty)
- Per-attempt history with timestamps
- Time tracking (from task load to submission)
- Auto-prunes data older than 1 year
- Key files: `types.ts`, `hooks.ts` (useProgress), `aggregation.ts`
- Practice mode: `packages/frontend/src/features/Practice/` - Smart recommendations based on weak concepts

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

### Time-Based Theming

**Overview**: The app uses automatic time-based themes that change throughout the day based on local time. There are 5 distinct time modes with unique color palettes designed to match the time of day.

**Time Modes and Ranges**:

| Mode | Time Range | Description | Palette |
|------|------------|-------------|---------|
| **Morning** | 6:00-10:00 | Soft, warm awakening | Peach/cream with warm browns |
| **Midday** | 10:00-14:00 | Bright, clear, focused | White/blue with sharp contrast |
| **Afternoon** | 14:00-18:00 | Warm, golden, comfortable | Amber/golden with warm tones |
| **Evening** | 18:00-22:00 | Cooling down, relaxing | Lavender/purple with soft contrast |
| **Night** | 22:00-6:00 | Dark mode, minimal eye strain | Dark blue-black backgrounds |

**Implementation**:
- Hook: `packages/frontend/src/hooks/useTimeOfDay.ts`
- Styles: `packages/frontend/src/styles/time-themes.css`
- Applied in: `packages/frontend/src/App.tsx`
- Updates: Every 60 seconds, transitions automatically on hour boundaries

**Using Semantic Tailwind Classes**:

Always use semantic color classes instead of hardcoded colors:

```tsx
// CORRECT - Uses semantic classes that adapt to time of day
<div className="bg-card text-card-foreground border border-border">
  <h1 className="text-foreground">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>

// INCORRECT - Hardcoded colors that won't adapt
<div className="bg-white text-gray-900 border border-gray-200">
  <h1 className="text-black">Title</h1>
  <p className="text-gray-500">Description</p>
</div>
```

**Available Semantic Classes**:

| Class | Purpose | When to Use |
|-------|---------|-------------|
| `bg-background` | Page/app background | Root containers, main layouts |
| `bg-card` | Card/panel backgrounds | Content cards, dialogs, panels |
| `bg-muted` | Subtle backgrounds | Secondary sections, hover states |
| `bg-primary` | Primary accent color | CTAs, active states, highlights |
| `text-foreground` | Primary text color | Headlines, body text |
| `text-card-foreground` | Text on cards | Text inside card components |
| `text-muted-foreground` | Secondary text | Labels, captions, subtle text |
| `text-primary-foreground` | Text on primary bg | Text on buttons, badges |
| `border-border` | Border colors | All borders, dividers |

**Adaptive vs. Fixed Colors**:

**Adaptive** (use semantic classes):
- All backgrounds (page, card, muted)
- All foreground text colors
- All borders
- Primary accent colors

**Fixed** (keep explicit color classes):
- Answer option buttons (`bg-green-500`, `bg-red-500`, etc.)
- Achievement badges and medals
- Success/error/warning indicators (`bg-green-100`, `text-red-600`, etc.)
- Subject-specific colors
- Charts and data visualizations

**Testing Different Time Modes**:

To test different time modes during development, temporarily modify `useTimeOfDay.ts`:

```typescript
// At the top of the file
const TEST_TIME_OVERRIDE: TimeOfDay | null = 'night'; // Set to desired mode

function getTimeOfDay(): TimeOfDay {
  if (TEST_TIME_OVERRIDE) return TEST_TIME_OVERRIDE;

  const hour = new Date().getHours();
  // ... rest of function
}
```

Test values: `'morning'`, `'midday'`, `'afternoon'`, `'evening'`, `'night'`

**IMPORTANT**: Remove `TEST_TIME_OVERRIDE` before committing production code.

**Common Patterns**:

```tsx
// Page layout
<div className="min-h-screen bg-background text-foreground">
  {/* content */}
</div>

// Card component
<div className="bg-card text-card-foreground rounded-2xl border border-border p-8">
  <h2 className="text-foreground">Card Title</h2>
  <p className="text-muted-foreground">Card description</p>
</div>

// Button (semantic primary)
<button className="bg-primary text-primary-foreground rounded-xl px-6 py-3">
  Submit
</button>

// Button (fixed color - answer option)
<button className="bg-green-500 text-white rounded-xl px-6 py-3">
  Option A
</button>

// Input field
<input className="bg-card text-foreground border border-border rounded-xl" />

// Muted section
<div className="bg-muted text-muted-foreground rounded-xl p-4">
  Supplementary info
</div>
```

**Migration Checklist**:

When refactoring components to use time-based theming:

1. Replace `bg-white` → `bg-background` or `bg-card`
2. Replace `bg-gray-*` / `bg-slate-*` → `bg-card` or `bg-muted`
3. Replace `text-black` / `text-gray-900` → `text-foreground`
4. Replace `text-gray-*` → `text-muted-foreground`
5. Replace `border-gray-*` → `border-border`
6. Keep colorful elements (green, red, blue, etc.) unchanged
7. Test in all 5 time modes for readability
8. Ensure 4.5:1 contrast ratio for accessibility

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
