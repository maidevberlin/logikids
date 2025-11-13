# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Logikids is an AI-powered educational platform that helps children aged 8-16 develop logical thinking and problem-solving skills. The system generates personalized educational tasks across multiple subjects (logic, math, music, physics, English, German) using AI, with adaptive difficulty levels and intelligent hints.

**Architecture:** Monorepo with three main packages:
- `packages/frontend/` - React/TypeScript SPA with TailwindCSS
- `packages/backend/` - Node.js/TypeScript API using Bun runtime
- `packages/content/` - Educational content definitions (subjects, concepts, task types)

**Key Technologies:**
- **Runtime:** Bun (backend), Vite (frontend dev)
- **Database:** PostgreSQL (via Docker)
- **AI Providers:** OpenAI, Anthropic (Claude), or Ollama
- **Containerization:** Docker Compose for all services

## Development Commands

### Starting Services

Development environment (with hot reload):
```bash
# Start both frontend and backend
docker compose up frontend-dev backend-dev

# Start individually
docker compose up frontend-dev  # http://localhost:5153
docker compose up backend-dev   # http://localhost:5175
```

Production mode (local testing):
```bash
docker compose up frontend-prod backend-prod
# Frontend: http://localhost:5154
# Backend API: http://localhost:5176
```

### Database Operations

```bash
# Run migrations
cd packages/backend
bun run migrate

# Access database via Adminer (web UI)
docker compose up adminer
# Visit http://localhost:8080
```

### Backend Development

```bash
cd packages/backend

# Run backend directly (outside Docker)
bun run dev           # Development with watch mode
bun run start         # Production mode

# Run tests
docker compose run backend-test

# Validate prompt templates
bun run validate:prompts

# Test individual prompts
bun run test:prompt
```

### Frontend Development

```bash
cd packages/frontend

# Build for production
bun run build

# Preview production build
bun run preview
```

### Utility Scripts

```bash
# Check translation completeness across all content
bun run check-translations

# Manage invite codes (beta access)
./invite list                    # List all codes
./invite create "Note"           # Create new code
./invite remove ABCD-1234        # Remove code
```

### Logs and Debugging

```bash
# View logs
docker compose logs -f backend-dev
docker compose logs -f frontend-dev

# Rebuild specific service
docker compose build backend-dev
docker compose build frontend-dev

# Clean restart
docker compose down -v
docker compose up frontend-dev backend-dev
```

## Architecture and Code Organization

### Content-Driven Design

Educational content lives in `packages/content/subjects/`, organized by:
- **Subjects** (math, physics, logic, music, english, german)
- **Concepts** (specific topics within subjects, e.g., "planes-in-space", "light-propagation")
- **Official content** (`official/` subdirectories) contains curriculum-aligned material with metadata (difficulty, grade levels, learning objectives)

Content files are markdown with YAML frontmatter, parsed by the backend to generate contextually appropriate tasks.

### Backend Architecture

**Key Directories:**
- `src/tasks/` - Task generation engine, coordinates AI providers and content
- `src/prompts/` - AI prompt templates for task generation
  - `base-prompt.md` - Core instructions for AI
  - `task-types/` - Prompts for specific task formats (multiple-choice, fill-in-blank, etc.)
  - `variations.md` - Instructions for generating diverse question styles
- `src/auth/` - JWT-based authentication
- `src/invites/` - Invite code management (closed beta)
- `src/sync/` - Real-time content synchronization using file watchers
- `src/common/ai/` - AI provider abstractions (OpenAI, Anthropic, Ollama)
- `src/subjects/` - Subject registry and metadata
- `src/cache/` - Response caching with cleanup service
- `database/` - PostgreSQL schema and migrations

**Registry Pattern:** The backend uses registries (`subjectRegistry`, `taskTypeRegistry`) that are initialized at startup by scanning the content directory. When adding new subjects or task types, ensure they're properly registered.

**API Design:** RESTful endpoints use Express.js. Task generation happens via `GET /api/task` with query parameters (age, difficulty, subject, concept, language, gender). The endpoint returns a complete task object with question, options, hints, and solution.

### Frontend Architecture

**Key Directories:**
- `src/app/` - Page components (routes)
- `src/features/` - Feature-specific logic (authentication, task display, etc.)
- `src/components/` - Reusable UI components
- `src/api/` - API client and hooks (React Query)
- `src/hooks/` - Custom React hooks
- `src/i18n/` - Internationalization setup (i18next)
- `src/ui/` - Base UI components (shadcn/ui)
- `src/routes/` - React Router configuration

**State Management:** React Query for server state, React Context for global UI state. No Redux/Zustand.

**Styling:** TailwindCSS with custom configuration. Uses `cn()` utility from `lib/utils.ts` for conditional class merging.

**Rendering Special Content:**
- Math: KaTeX for LaTeX rendering (via `rehype-katex`)
- Markdown: react-markdown with remark-gfm, remark-math
- Diagrams: Mermaid for flowcharts/diagrams
- Code: react-syntax-highlighter

### AI Integration

The backend supports three AI providers, configured via `packages/backend/config.yaml`:

1. **OpenAI** - GPT-4 and newer models
2. **Anthropic** - Claude models (recommended for educational content)
3. **Ollama** - Local LLMs (development/privacy)

Provider abstraction in `src/common/ai/` allows swapping providers without changing task generation logic. Each provider implements a common interface for chat completions.

### Authentication and Authorization

- **Invite-only access:** Users must have valid invite codes to register
- **JWT tokens:** Stored client-side, sent via Authorization header
- **User data:** Minimal PII collected, privacy-first approach
- **Invite codes:** 7-day expiration, single-use, managed via `./invite` CLI

## Important Patterns and Conventions

### Content File Format

Subject content uses markdown with YAML frontmatter:

```markdown
---
difficulty: medium
grade: 8-9
concepts:
  - algebra
  - equations
learningObjectives:
  - Solve linear equations
  - Apply algebraic reasoning
---

# Topic Title

Content explanation...
```

### Task Generation Flow

1. Client requests task via `/api/task?subject=math&concept=algebra&difficulty=medium&language=de`
2. Backend validates parameters, checks cache
3. Loads relevant content from `packages/content/`
4. Constructs AI prompt from templates in `prompts/`
5. Sends to configured AI provider
6. Parses and validates response
7. Returns structured task object
8. Caches result for performance

### Adding New Subjects

1. Create directory in `packages/content/subjects/<subject-name>/`
2. Add `official/` subdirectory with curriculum content
3. Backend will auto-discover on next startup (via `subjectRegistry`)
4. Add translations in frontend `src/i18n/`

### Adding New Task Types

1. Create prompt template in `packages/backend/prompts/task-types/<type-name>.md`
2. Register in `src/tasks/types/registry.ts`
3. Update frontend task renderer to handle new type

### Database Migrations

Migrations are SQL files in `packages/backend/database/migrations/`, numbered sequentially (e.g., `001_initial.sql`). The migrate script runs all pending migrations in order.

## Configuration

### Backend Configuration (`packages/backend/config.yaml`)

Generated by `./configure.sh` during setup. Controls:
- Server port
- AI provider selection and API keys
- Model parameters (temperature, max tokens)
- Image generation settings

**Never commit this file** - contains secrets.

### Environment Variables (`.env` at root)

```bash
POSTGRES_PASSWORD=<generated>
JWT_SECRET=<generated>
```

Auto-generated by `./install.sh`. Used by docker-compose.yml.

### Frontend Environment

Uses `.env.development` and `.env.production` for API URLs. Vite loads these automatically.

## Testing

Backend tests use Jest/Supertest. Run via:
```bash
docker compose run backend-test
```

Frontend tests should use React Testing Library (infrastructure present in package.json but tests TBD).

## Deployment

See `DEPLOYMENT.md` for complete deployment guide. Key scripts:
- `./install.sh` - Full installation (Docker, secrets, config, build, start)
- `./configure.sh` - AI provider setup
- `./setup-nginx.sh` - SSL and reverse proxy
- `./update.sh` - Pull latest code and restart
- `./restart.sh` - Rebuild and restart services

Production runs on Docker with Nginx reverse proxy and Let's Encrypt SSL.

## Common Development Tasks

### Modifying Task Generation
- Edit prompts in `packages/backend/prompts/`
- Use `bun run test:prompt` to test changes
- Use `bun run validate:prompts` to check syntax

### Adding Educational Content

**When creating new concept files, Claude Code will automatically use the `generate-concept` skill.**

This project has a local skill (`.claude/skills/generate-concept/`)
**Manual checks:**
- Run `bun run validate:prompts` to check schema compliance
- Run `bun run check-translations` to ensure i18n coverage

### Debugging Task Generation
- Check `docker compose logs backend-dev` for AI responses
- Verify content loading in registry initialization logs
- Test specific concepts with curl: `curl "http://localhost:5175/api/task?subject=math&concept=<concept>&difficulty=easy"`

### Working with the Database
- Access via Adminer: `docker compose up adminer` → http://localhost:8080
- Connection: Server=postgres, User=logikids, Password=from `.env`
- Migrations are idempotent, safe to re-run

## Troubleshooting

**Backend won't start:** Check `config.yaml` exists and has valid AI credentials

**Tasks fail to generate:** Check AI provider API keys, verify content files exist for requested concept

**Frontend can't reach API:** Ensure backend-dev is running, check Vite proxy config in `vite.config.ts`

**Database connection errors:** Verify postgres container is healthy (`docker compose ps`), check `POSTGRES_PASSWORD` in `.env`

**Content not loading:** Check registry initialization logs, verify markdown frontmatter syntax
