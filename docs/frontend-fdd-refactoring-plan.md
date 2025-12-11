# Frontend FDD Refactoring Plan

Transform current structure to FDD (Feature-first Domain Design).

## Core Principle

Related code lives together. Organize by domain, not technical layer.

## Target Domains

| Domain          | Scope                                           |
| --------------- | ----------------------------------------------- |
| `app/user/`     | Profile, settings, encryption, storage, sync    |
| `app/progress/` | Attempts, mastery, difficulty adjustment        |
| `app/subjects/` | Curriculum, concepts, theming, search           |
| `app/tasks/`    | Generation, display, answering, hints, TTS      |
| `app/stats/`    | XP, levels, achievements, metrics (UI-focused)  |
| `app/common/`   | Generic UI, hooks, utils (domain-agnostic only) |

Feature pages (`welcome/`, `onboarding/`, `practice/`, etc.) stay as-is.

---

## Phase 1: Create `app/user/`

**Rename:**

- `app/account/` → `app/user/`

**Move core user logic:**

| From                     | To                         |
| ------------------------ | -------------------------- |
| `data/core/userData.ts`  | `app/user/localStorage.ts` |
| `data/core/storage.ts`   | `app/user/storage.ts`      |
| `data/core/crypto.ts`    | `app/user/encryption.ts`   |
| `data/core/types.ts`     | `app/user/types.ts`        |
| `data/core/merge.ts`     | `app/user/mergeData.ts`    |
| `data/plugins/export.ts` | `app/user/exportData.ts`   |
| `data/plugins/qr.ts`     | `app/user/qrHelpers.ts`    |

**Note:** Merge `data/core/types.ts` into existing `app/user/types.ts` if conflicts arise.

**Update imports, verify build.**

---

## Phase 2: Create `app/progress/`

Extract from `data/progress/` as new domain:

| From                                  | To                                  |
| ------------------------------------- | ----------------------------------- |
| `data/progress/types.ts`              | `app/progress/types.ts`             |
| `data/progress/hooks.ts`              | `app/progress/useProgress.ts`       |
| `data/progress/aggregation.ts`        | `app/progress/aggregateProgress.ts` |
| `data/progress/progressUpdater.ts`    | `app/progress/addAttempt.ts`        |
| `data/progress/mastery.ts`            | `app/progress/calculateStars.ts`    |
| `data/progress/difficultyAdjuster.ts` | `app/progress/adjustDifficulty.ts`  |
| `data/progress/index.ts`              | `app/progress/index.ts`             |

**Note:** `progressUpdater.ts` may contain game stats logic - extract that to `app/stats/` in Phase 3.

**Update imports, verify build.**

---

## Phase 3: Refactor `app/stats/`

Keep `app/stats/` focused on UI and presentation.

**Extract business logic to `app/progress/`:**

- If `progressUpdater.ts` updates game stats, move that logic to `app/progress/updateGameStats.ts`

**Move difficulty tracking:**

| From                             | To                                      |
| -------------------------------- | --------------------------------------- |
| `hooks/useDifficultyTracking.ts` | `app/progress/useDifficultyTracking.ts` |

**`app/stats/` keeps:**

- UI components (pages, cards, badges, dialogs)
- UI data helpers (`levels.ts`, `gameTypes.ts`, `achievements.ts`)
- Presentation logic only

**Update imports, verify build.**

---

## Phase 4: Consolidate `app/subjects/`

Move subject-related code from other locations:

| From                         | To                                 |
| ---------------------------- | ---------------------------------- |
| `app/common/subjectTheme.ts` | `app/subjects/subjectTheme.ts`     |
| `hooks/useConceptSearch.ts`  | `app/subjects/useConceptSearch.ts` |

**`app/subjects/` owns:**

- Subject metadata, theming, icons
- Concept search and discovery
- All subject domain logic

**Update imports, verify build.**

---

## Phase 5: Organize `app/tasks/`

Move task-related hooks:

| From                                 | To                                       |
| ------------------------------------ | ---------------------------------------- |
| `hooks/useTaskData.ts`               | `app/tasks/useTaskData.ts`               |
| `hooks/useTaskLoadingCalibration.ts` | `app/tasks/useTaskLoadingCalibration.ts` |
| `hooks/useTTS.ts`                    | `app/tasks/useTTS.ts`                    |

**Create subdomain `app/tasks/hints/` (3+ related files):**

| From                        | To                                |
| --------------------------- | --------------------------------- |
| `app/tasks/useHint.ts`      | `app/tasks/hints/useHint.ts`      |
| `app/tasks/HintSection.tsx` | `app/tasks/hints/HintSection.tsx` |
| Backend hint types if any   | `app/tasks/hints/types.ts`        |

Create `app/tasks/hints/index.ts` for public exports.

**Keep `app/tasks/answer-types/` as-is** (already a proper subdomain).

**Consolidate types:**

- Review `api/types.ts` - if task-related, merge into `app/tasks/types.ts`

**Update imports, verify build.**

---

## Phase 6: Clean up `app/common/`

Move generic utilities:

| From                    | To                           |
| ----------------------- | ---------------------------- |
| `lib/utils.ts`          | `app/common/cn.ts`           |
| `lib/formatGrade.ts`    | `app/common/formatGrade.ts`  |
| `lib/logger.ts`         | `app/common/logger.ts`       |
| `hooks/useDebounce.ts`  | `app/common/useDebounce.ts`  |
| `hooks/useTimeOfDay.ts` | `app/common/useTimeOfDay.ts` |

**Move subject-agnostic content:**

| From                    | To                            |
| ----------------------- | ----------------------------- |
| `data/loadingContent/*` | `app/common/loadingContent/*` |

**Test:** Every file in `app/common/` must be domain-agnostic. If it mentions user, task, subject, progress - move it to correct domain.

**Update imports, verify build.**

---

## Phase 7: Clean up root folders

**Delete empty folders:**

- `src/hooks/`
- `src/data/`
- `src/lib/`

**Root-level files to keep:**

- `src/main.tsx`
- `src/App.tsx`
- `src/config.ts`
- `src/i18n.ts`
- `src/vite-env.d.ts`

**Move if needed:**

| From           | To                   | Condition                    |
| -------------- | -------------------- | ---------------------------- |
| `api/trpc.ts`  | `app/common/trpc.ts` | If generic API client        |
| `api/types.ts` | `app/tasks/types.ts` | If task-specific, else merge |

**Update imports, verify build.**

---

## Phase 8: Create proper index.ts exports

For each domain, create/update `index.ts` with **only public exports**:

**Domain indexes:**

- `app/user/index.ts`
- `app/progress/index.ts`
- `app/subjects/index.ts`
- `app/tasks/index.ts`
- `app/tasks/hints/index.ts` (subdomain)
- `app/stats/index.ts`
- `app/common/index.ts`

**Export rules:**

- Only export what other domains need
- Internal helpers stay private
- No `export *` - explicit exports only

---

## Verification After Each Phase

1. Run `bun run typecheck`
2. Fix import errors
3. Run dev server: `bun run dev`
4. Smoke test critical flows

## Final Verification

1. **No internal imports:** Search for `@/app/{domain}/internal` - should be zero
2. **No circular deps:** Check import chains
3. **Common is generic:** Nothing in `app/common/` mentions domain concepts
4. **Subdomains justified:** Each subfolder has 3+ related files

## Success Criteria

- All imports use domain public API (`@/app/tasks`, not `@/app/tasks/internal/helper`)
- No technical layer folders (`hooks/`, `utils/`, `domain/`)
- Related code lives together
- Build passes with zero TypeScript errors
