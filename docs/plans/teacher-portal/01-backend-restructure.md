# Phase 1: Backend Restructure

## Goal

Reorganize the backend from flat structure to `core/student/teacher` structure, preparing for teacher-specific features.

## Current Structure

```
packages/backend/src/
├── auth/               → core/auth
├── tasks/              → student/tasks
├── sync/               → student/sync (extract crypto to core/crypto)
├── tts/                → student/tts
├── prompts/            → core/ai/prompts
├── ai/                 → core/ai
├── subjects/           → core/subjects
├── errors/             → core/errors
├── utils/              → core/utils
├── container.ts
├── router.ts
└── trpc.ts
```

## Target Structure

```
packages/backend/src/
├── core/
│   ├── auth/
│   │   ├── router.ts
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── schemas.ts
│   │   └── types.ts
│   ├── ai/
│   │   ├── client.ts
│   │   ├── prompts/
│   │   │   ├── builder.ts
│   │   │   ├── loader.ts
│   │   │   └── variations/
│   │   └── types.ts
│   ├── subjects/
│   │   ├── registry.ts
│   │   └── types.ts
│   ├── crypto/
│   │   ├── service.ts       # Extracted from sync
│   │   └── types.ts
│   ├── database/
│   │   └── client.ts
│   ├── errors/
│   │   └── factory.ts
│   └── utils/
│       └── index.ts
│
├── student/
│   ├── tasks/
│   │   ├── router.ts
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── schemas.ts
│   │   └── types.ts
│   ├── sync/
│   │   ├── router.ts
│   │   ├── controller.ts
│   │   ├── service.ts        # Uses core/crypto
│   │   ├── schemas.ts
│   │   └── types.ts
│   ├── tts/
│   │   ├── router.ts
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── schemas.ts
│   │   └── types.ts
│   └── router.ts              # Combines student routers
│
├── teacher/
│   └── router.ts              # Empty placeholder for now
│
├── container.ts               # Updated DI registrations
├── router.ts                  # { auth, student, teacher }
└── trpc.ts                    # No changes needed yet
```

## Implementation Steps

### Step 1: Create directory structure

```bash
mkdir -p packages/backend/src/core/{auth,ai,subjects,crypto,database,errors,utils}
mkdir -p packages/backend/src/student/{tasks,sync,tts}
mkdir -p packages/backend/src/teacher
```

### Step 2: Move core modules

1. Move `auth/` → `core/auth/`
2. Move `ai/` → `core/ai/`
3. Move `prompts/` → `core/ai/prompts/`
4. Move `subjects/` → `core/subjects/`
5. Move `errors/` → `core/errors/`
6. Move `utils/` → `core/utils/`
7. Move database client to `core/database/`

### Step 3: Extract crypto from sync

Create `core/crypto/service.ts` with encryption utilities currently embedded in sync service.

### Step 4: Move student modules

1. Move `tasks/` → `student/tasks/`
2. Move `sync/` → `student/sync/` (update imports to use core/crypto)
3. Move `tts/` → `student/tts/`

### Step 5: Create combined routers

**student/router.ts:**

```typescript
import { router } from '../trpc'
import { tasksRouter } from './tasks/router'
import { syncRouter } from './sync/router'
import { ttsRouter } from './tts/router'

export const studentRouter = router({
  tasks: tasksRouter,
  sync: syncRouter,
  tts: ttsRouter,
})
```

**teacher/router.ts:**

```typescript
import { router } from '../trpc'

export const teacherRouter = router({
  // Placeholder - features added in later phases
})
```

**router.ts (main):**

```typescript
import { router } from './trpc'
import { authRouter } from './core/auth/router'
import { studentRouter } from './student/router'
import { teacherRouter } from './teacher/router'

export const appRouter = router({
  auth: authRouter,
  student: studentRouter,
  teacher: teacherRouter,
})
```

### Step 6: Update container.ts

Update all DI registrations with new import paths.

### Step 7: Update all imports

Fix all import statements throughout the codebase to use new paths.

### Step 8: Update frontend tRPC client

The API paths will change:

- `trpc.tasks.get` → `trpc.student.tasks.get`
- `trpc.sync.upload` → `trpc.student.sync.upload`
- etc.

Update all tRPC calls in frontend.

## Breaking Changes

**API namespace changes:**
| Old | New |
|-----|-----|
| `tasks.*` | `student.tasks.*` |
| `sync.*` | `student.sync.*` |
| `tts.*` | `student.tts.*` |
| `auth.*` | `auth.*` (unchanged) |

## Testing

1. Run existing backend tests - all should pass
2. Run existing frontend tests - all should pass
3. Manual test: login, generate task, sync data, TTS
4. Verify no regressions

## Rollback Plan

This is a pure refactor with no database changes. Rollback = revert commits.
