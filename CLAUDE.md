# CLAUDE.md

## Skills (load before working)

- **Code changes**: Use `jetbrains-coding` skill before reading or writing code
- **Concepts**: Use `write-concept` skill before working on educational concepts

## Overview

Logikids is an AI-powered educational platform for children (ages 8-19) that generates personalized learning tasks from curriculum-aligned concepts using AI.

**Monorepo:** Frontend (React/Vite) · Backend (Bun/tRPC) · Content (Markdown concepts)

**Task types:** single choice, multiple select, fill-in-blank, ordering, number input, yes/no

## Architecture (read when needed)

| Area     | Doc                                 | When to read                               |
| -------- | ----------------------------------- | ------------------------------------------ |
| Frontend | `docs/frontend-fdd-architecture.md` | Refactoring, adding features, code reviews |
| Backend  | `docs/backend-fdd-architecture.md`  | Refactoring, adding features, code reviews |

## Quick Reference

| What            | Where                                      |
| --------------- | ------------------------------------------ |
| Docker setup    | `docker-compose.yml`                       |
| Invite codes    | `./invite`                                 |
| Frontend        | `packages/frontend/src/`                   |
| Backend         | `packages/backend/src/`                    |
| Content         | `content/subjects/`                        |
| Concept schema  | `content/schema.ts`                        |
| Concept rules   | `docs/concept-rules.md`                    |
| Task generation | `docs/task-generation.md`                  |
| AI prompts      | `packages/backend/prompts/`                |
| Translations    | `packages/frontend/public/locales/{lang}/` |
| DB migrations   | `packages/backend/database/migrations/`    |

## CLI Scripts

All scripts: no args = usage, `subject/concept` = single, `subject` = all in subject, `--all` = everything.

**Root scripts** (run from host):

- `bun run check:concepts` - Validate concept files
- `bun run check:translations` - Check translation completeness

**Backend scripts** (run via docker):

- `check:prompts` - Validate prompt templates (no args, full system check)
- `generate:prompt` - Generate AI prompt without calling LLM
- `generate:task` - Generate task using AI

Run backend scripts via docker: `docker compose exec backend-dev bun run <script>`

## Git Workflow

- Protected branches: `main` and `dev` (no direct push)
- Feature work: branch from `dev` → PR to `dev`
- Hotfixes: `hotfix/*` branch from `main` → PR to `main`

## Critical Rules

1. **Use skills first** - Load `jetbrains-coding` before code work
2. **Understand before acting** - Ask clarifying questions if unclear
3. **One problem at a time** - Use todo lists for multiple issues
4. **No rushing** - Pressure causes errors; stay methodical
