# CLAUDE.md

## Important

- Before reading or writing code, use the `jetbrains-coding` skill.
- Before working on concepts, use the `write-concept` skill.

## Overview

Logikids is an AI-powered educational platform for children aged 8-16. It generates personalized learning tasks based on curriculum-aligned concepts using AI (Ollama/OpenAI/Anthropic).

**Monorepo structure:**

- **Frontend**: React + TypeScript + Vite
- **Backend**: Bun + Express API
- **Content**: Markdown-based educational concepts

**Task types:** single choice, multiple select, fill-in-blank, ordering, number input, yes/no

## Quick Reference

| What                | Where                                               |
| ------------------- | --------------------------------------------------- |
| Docker setup        | `docker-compose.yml`                                |
| Invite codes CLI    | `./invite`                                          |
| Frontend code       | `packages/frontend/src/`                            |
| Backend code        | `packages/backend/src/`                             |
| Educational content | `packages/content/subjects/`                        |
| Concept file format | See any `packages/content/subjects/*/official/*.md` |
| Concept rules       | `.claude/docs/concept-rules.md`                     |
| Task generation     | `.claude/docs/task-generation.md`                   |
| AI prompts          | `packages/backend/prompts/`                         |
| Prompt builder      | `packages/backend/src/prompts/`                     |
| Backend config      | `packages/backend/config.yaml`                      |
| Task type schemas   | `packages/backend/src/tasks/types/`                 |
| Answer components   | `packages/frontend/src/app/tasks/answer-types/`     |
| Translations        | `packages/frontend/public/locales/{lang}/`          |
| DB migrations       | `packages/backend/database/migrations/`             |

## Key Patterns

- **Registry pattern**: Subjects and task types are auto-discovered from directories
- **Typed errors**: Use `src/common/errors/` hierarchy, not generic errors
- **Logging**: Use `createLogger(name)` from `src/common/logger.ts`

## Adding New Features

| Feature       | Steps                                                                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| New subject   | Add `base.md` + concepts in `packages/content/subjects/{name}/`                                                                              |
| New concept   | Add `.md` file in `packages/content/subjects/{subject}/official/`                                                                            |
| New task type | (1) prompt in `prompts/task-types/`, (2) schema in `src/tasks/types/`, (3) grading in `src/tasks/grading/`, (4) answer component in frontend |

## CLI Scripts

All scripts: no args = usage, `subject/concept` = single, `subject` = all in subject, `--all` = everything.

- `check:concepts` - Validate concept files
- `check:translations` - Check translation completeness
- `check:prompts` - Validate prompt templates (no args, full system check)
- `generate:prompt` - Generate AI prompt without calling LLM
- `generate:task` - Generate task using AI

Run via docker: `docker compose exec backend-dev bun run <script>`

## Notes

- Backend uses Bun runtime (not Node.js)
- All content must be curriculum-aligned
- JWT auth with invite-code beta access

# Critical Rules for success

- You MUST use the jetbrains-coding skill

The user is always in a rush. You have to be the slow, thorough thinking part.
These rules help you to perform much better. So use them to increase your value.

- You MUST understand what to do. If anything is unclear, you MUST ask clarifying questions.
- Don't react to pressure. Pressure produces errors, errors cost more time. Keep a clear head. Tackle one problem at a time.
- If there are many issues at a time: put them on a todo list, and slowly work on them one by one. never work on 2 issues at the same time.
