# Content Package Refactor Plan

## Situation

The project has a `/content` directory at the repository root that contains:

- `schema.ts` - Zod schemas and TypeScript types for concepts
- `languages.ts` - Language constants and types
- `subjects/` - Markdown content files (educational concepts)

This directory is shared across multiple packages:

- **Backend** imports `/content/schema` and `/content/languages` (absolute paths)
- **Frontend** imports `/content/languages` (absolute paths)
- **Scripts** imports `../content/schema` and `../content/languages` (relative paths)

In Docker containers, this is mounted as a volume at `/content` (absolute path), separate from `/app` where application code lives.

## The Real Problem

When trying to build TypeScript type declarations for the backend (needed for tRPC type safety in frontend), TypeScript fails with:

```
error TS6059: File '/content/schema.ts' is not under 'rootDir' '/app'.
'rootDir' is expected to contain all source files.
```

**Root cause:** TypeScript cannot emit type declarations for files outside the project's `rootDir`. The `/content` directory is outside `/app`, so even though the files exist and work at runtime, TypeScript's type emission fails.

This breaks the tRPC type-sharing between backend and frontend, which is essential for type-safe API calls.

## Solution

Convert `/content` into a proper workspace package at `packages/content/`. This allows:

- TypeScript to properly resolve and emit types
- Clean package dependencies (`@logikids/content`)
- Consistent project structure (all packages in `packages/`)

## Implementation Steps

### 1. Move content directory

```bash
mv content packages/content
```

### 2. Create packages/content/package.json

```json
{
  "name": "@logikids/content",
  "version": "0.1.0",
  "type": "module",
  "main": "schema.ts",
  "exports": {
    "./schema": "./schema.ts",
    "./languages": "./languages.ts"
  }
}
```

### 3. Create packages/content/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["*.ts"]
}
```

### 4. Add dependency to packages that need it

**packages/backend/package.json:**

```json
"dependencies": {
  "@logikids/content": "workspace:*",
  ...
}
```

**packages/frontend/package.json:**

```json
"dependencies": {
  "@logikids/content": "workspace:*",
  ...
}
```

**scripts/package.json:**

```json
"dependencies": {
  "@logikids/content": "workspace:*",
  ...
}
```

### 5. Update imports

**Backend** - change all occurrences:

- `/content/schema` → `@logikids/content/schema`
- `/content/languages` → `@logikids/content/languages`

Files to update:

- `packages/backend/src/prompts/schemas.ts`
- `packages/backend/src/prompts/builder.ts`
- `packages/backend/src/subjects/schemas.ts`
- `packages/backend/src/tts/service.ts`
- `packages/backend/src/tasks/schemas.ts`
- `packages/backend/src/tts/markdown-to-speech.ts`

**Frontend** - change all occurrences:

- `/content/languages` → `@logikids/content/languages`

Files to update:

- `packages/frontend/src/i18n.ts`
- `packages/frontend/src/app/onboarding/OnboardingPage.tsx`
- `packages/frontend/src/app/common/LanguageSelector.tsx`
- `packages/frontend/src/app/user/types.ts`
- `packages/frontend/src/app/user/ProfileSettings.tsx`
- `packages/frontend/src/app/tasks/types.ts`

**Scripts** - change all occurrences:

- `../content/schema` → `@logikids/content/schema`
- `../../content/schema` → `@logikids/content/schema`
- `../../../content/schema` → `@logikids/content/schema`

Files to update:

- `scripts/check-translations.ts`
- `scripts/lib/validators/prerequisites.ts`
- `scripts/lib/validators/schema.ts`
- `scripts/lib/validators/structure.ts`
- `scripts/lib/validators/parse-concept.ts`
- `scripts/lib/validators/translations.ts`

### 6. Update hardcoded content paths

Search for any code that reads files from `/content/subjects/` or similar paths and update to use the new location. These are runtime file reads, not imports.

Search patterns:

- `/content/subjects`
- `/content`
- `../content/subjects`

### 7. Update docker-compose.yml

Change volume mounts from `/content` to `packages/content`:

```yaml
# Old
- ./content:/content

# New
- ./packages/content:/app/packages/content
```

Update all services: frontend-dev, backend-dev, backend-test, scripts

### 8. Update Dockerfiles

**packages/frontend/Dockerfile.prod:**

```dockerfile
# Old
COPY content /content

# New
COPY packages/content packages/content
```

**packages/backend/Dockerfile.prod** (if exists):
Similar changes needed.

### 9. Run bun install

```bash
bun install
```

### 10. Test

1. Test dev containers start: `docker compose up frontend-dev backend-dev`
2. Test backend type build: `docker compose exec backend-dev bun run build:types`
3. Test frontend build: `docker compose exec frontend-dev bun run build`

## Files Changed Summary

- `content/` → `packages/content/` (move)
- `packages/content/package.json` (new)
- `packages/content/tsconfig.json` (new)
- `packages/backend/package.json` (add dependency)
- `packages/frontend/package.json` (add dependency)
- `scripts/package.json` (add dependency)
- `docker-compose.yml` (update mounts)
- `packages/frontend/Dockerfile.prod` (update paths)
- `packages/backend/Dockerfile.prod` (update paths if needed)
- Multiple .ts files (update imports)
- Any files with hardcoded `/content` paths (update paths)
