# Frontend FDD Architecture (Feature-first Domain Design)

**Core principle:** Related code lives together. Organize by domain, not by technical layer.

## Rules

### 1. Domain Folders

Each domain is a folder under `app/`. Everything related to that domain lives inside - types, hooks, components, API calls, utilities.

```
app/tasks/
├── types.ts
├── TaskCard.tsx
├── useTask.ts
├── taskApi.ts
├── TaskPage.tsx
└── index.ts
```

### 2. Subfolders Only When Needed

Create a subfolder when:

- 3+ files are closely related AND form a coherent subgroup
- It's a true subdomain (e.g., `hints/` within `tasks/`)
- Domain folder exceeds ~10 files - look for natural groupings

Don't create subfolders for:

- Technical layers (`components/`, `hooks/`, `domain/`)
- Single files
- "Just in case"

### 3. Index Exports

Each domain has `index.ts` that exports only the public API:

**Rules:**

- Only export what other domains need
- No re-exports from subdirectories (each subdomain has its own index)
- Internal helpers stay private (not exported)

### 4. Imports

- Cross-domain: `import { useTask } from '@/app/tasks'` (use public API)
- Within domain: `import { useTask } from './useTask'` (direct imports fine)

### 5. Dependencies Flow Down

- Domains can import from `common/`
- Domains can import from other domains' public API
- `common/` never imports from domains
- Avoid circular dependencies between domains

### 6. File Naming

- **Types:** `types.ts` (or `userTypes.ts` if domain has multiple type groups)
- **Components:** PascalCase (`TaskCard.tsx`)
- **Hooks:** `use` prefix (`useTask.ts`)
- **Logic/Utils:** descriptive verb-noun (`calculateMastery.ts`, `formatGrade.ts`)
- **Never:** `utils.ts`, `helpers.ts`, `misc.ts`

### 7. What Goes in `common/`

Only truly domain-agnostic code:

- Generic UI components (buttons, modals, form elements)
- Generic hooks (`useDebounce`, `useLocalStorage`)
- Pure utilities (`cn`, `formatDate`)
- App-wide infrastructure (logger, error boundary)

**Test:** If it mentions a domain concept (task, user, subject), it doesn't belong in `common/`.

## Domain Checklist

When creating/modifying a domain, ask:

1. Does this file belong to this domain? (or another domain? or common?)
2. Should this be exported? (or stay internal?)
3. Is there a subfolder with 3+ related files? (if not, keep flat)
4. Are imports going through index.ts? (for cross-domain)

## Anti-Patterns

- `app/components/` - organize by domain, not by type
- `app/hooks/` - same
- `app/tasks/components/TaskCard.tsx` - unnecessary nesting
- `export * from './submodule'` - explicit exports only
- `import { x } from '@/app/tasks/internal/helper'` - use public API
