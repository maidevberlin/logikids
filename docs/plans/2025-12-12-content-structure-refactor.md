# Content Structure Refactor

## Problem

The current monorepo structure has friction points:

1. `packages/content/` is a "package" but contains only markdown files - no code
2. Validation scripts (`check:concepts`, `check:translations`) live in backend but validate cross-cutting concerns
3. Backend has awkward imports to reach `../content/...`
4. Running content validation requires going through backend container

## Decision

Restructure the repository to reflect true ownership and simplify tooling.

## Final Structure

```
/
├── content/                        # NOT a package - just content
│   └── subjects/
│       ├── biology/
│       ├── english/
│       ├── german/
│       ├── logic/
│       ├── math/
│       ├── music/
│       └── physics/
│
├── scripts/                        # Root scripts (run from host with Bun)
│   ├── check-concepts.ts
│   └── check-translations.ts
│
├── packages/
│   ├── backend/
│   │   ├── prompts/
│   │   └── src/
│   │       └── scripts/            # Renamed from src/cli/
│   │           ├── check-prompts.ts
│   │           ├── generate-prompt.ts
│   │           └── generate-task.ts
│   └── frontend/
│       └── public/locales/
│
└── package.json
```

## Key Changes

### 1. Content demoted from package to folder

- `packages/content/` -> `/content/`
- Remove `packages/content/package.json`
- Content is not code, shouldn't pretend to be a package

### 2. Cross-cutting validation scripts move to root

- `check-concepts.ts` -> `/scripts/`
- `check-translations.ts` -> `/scripts/`
- Run from host with Bun (no Docker needed)

### 3. Backend scripts renamed

- `src/cli/` -> `src/scripts/`
- Consistent naming across repo

### 4. Environment variable for content path

- Backend uses `CONTENT_PATH` env var
- Docker mounts content to `/app/content`
- Root scripts use fallback: `process.env.CONTENT_PATH || join(import.meta.dir, '../content/subjects')`

## Script Ownership

| Script               | Validates                             | Location               | Runs       |
| -------------------- | ------------------------------------- | ---------------------- | ---------- |
| `check-concepts`     | Content files + translation existence | `/scripts/`            | Host (Bun) |
| `check-translations` | Translation completeness              | `/scripts/`            | Host (Bun) |
| `check-prompts`      | Backend prompt system + comprehensive | `backend/src/scripts/` | Docker     |
| `generate-prompt`    | N/A (generates)                       | `backend/src/scripts/` | Docker     |
| `generate-task`      | N/A (generates)                       | `backend/src/scripts/` | Docker     |

## Root package.json Scripts

```json
{
  "scripts": {
    "check:concepts": "bun scripts/check-concepts.ts",
    "check:translations": "bun scripts/check-translations.ts",
    "check:prompts": "docker compose exec backend-dev bun run check:prompts",
    "generate:prompt": "docker compose exec backend-dev bun run generate:prompt",
    "generate:task": "docker compose exec backend-dev bun run generate:task"
  }
}
```

## Docker Compose Changes

```yaml
backend-dev:
  volumes:
    - ./content:/app/content:ro # Changed from ./packages/content:/content
    - ./packages/frontend/public/locales:/app/locales:ro
  environment:
    - CONTENT_PATH=/app/content/subjects
```

## Migration Steps

1. Move `packages/content/subjects/` to `/content/subjects/`
2. Delete `packages/content/package.json`
3. Move `check-concepts.ts` and `check-translations.ts` to `/scripts/`
4. Rename `packages/backend/src/cli/` to `packages/backend/src/scripts/`
5. Update all imports and paths in moved scripts
6. Add `CONTENT_PATH` environment variable handling
7. Update `docker-compose.yml` volume mounts
8. Update root `package.json` scripts
9. Update backend `package.json` script references
10. Update `CLAUDE.md` documentation
11. Update `.claude/` agent files (skills, commands) with new paths
