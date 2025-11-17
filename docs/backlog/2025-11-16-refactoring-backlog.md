# Refactoring Backlog

**Created:** 2025-11-16
**Based on:** Consolidated Analysis of 10 Domains
**Total Work Items:** 35
**Estimated Total Effort:** ~100-115 hours

## Overview

This backlog contains prioritized refactoring tasks derived from comprehensive codebase analysis. Tasks are organized by priority (P0-P3) and sequenced to respect dependencies.

### Backlog Summary

| Priority | Description | Tasks | Estimated Effort | Line Reduction |
|----------|-------------|-------|------------------|----------------|
| **P0** | Critical - Do First | 10 | 30-40h | ~230 lines |
| **P1** | High - Do Next | 12 | 40-50h | ~500 lines |
| **P2** | Medium - If Time Permits | 8 | 20-30h | ~100 lines |
| **P3** | Low - Future | 5 | 10-15h | ~50 lines |
| **TOTAL** | | **35** | **100-115h** | **~880 lines** |

---

## P0: Critical Priority (Do First)

### Phase 1: Foundation (Week 1)

#### TASK-001: Create Backend Logger Infrastructure
**Priority:** P0
**Effort:** 4 hours
**Line Reduction:** ~20 lines (net positive after implementation)

**Description:**
Implement centralized logging infrastructure for backend to replace 66+ direct console calls.

**Domains Affected:**
- Backend Infrastructure
- Backend API Layer
- Backend Task Engine
- Backend Auth
- Backend Content

**Files to Create:**
- `packages/backend/src/common/logger.ts` - Logger implementation
- `packages/backend/src/common/logger.test.ts` - Unit tests

**Implementation Details:**
```typescript
// packages/backend/src/common/logger.ts
export class Logger {
  constructor(private context: string) {}

  debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${this.context}] ${message}`, meta)
    }
  }

  info(message: string, meta?: Record<string, unknown>): void {
    console.info(`[${this.context}] ${message}`, meta)
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(`[${this.context}] ${message}`, meta)
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    console.error(`[${this.context}] ${message}`, { error, ...meta })
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context)
}
```

**Acceptance Criteria:**
- [ ] Logger class implemented with 4 log levels (debug, info, warn, error)
- [ ] Debug logs only output in development mode
- [ ] Structured logging with context and metadata
- [ ] Factory function for creating logger instances
- [ ] Unit tests with 80%+ coverage
- [ ] Documentation with usage examples

**Dependencies:** None

**Blocking:** TASK-002, TASK-003, TASK-004

---

#### TASK-002: Create Frontend Logger Infrastructure
**Priority:** P0
**Effort:** 2 hours
**Line Reduction:** ~10 lines

**Description:**
Implement centralized logging infrastructure for frontend to replace 40+ direct console calls.

**Domains Affected:**
- Frontend Infrastructure
- Frontend App Shell
- Frontend Pages
- Frontend State
- Frontend UI Components

**Files to Create:**
- `packages/frontend/src/lib/logger.ts` - Logger implementation
- `packages/frontend/src/lib/logger.test.ts` - Unit tests

**Implementation Details:**
Similar to backend logger but with browser-specific considerations:
- Use browser console API
- Support for log aggregation services (future)
- Performance timing integration

**Acceptance Criteria:**
- [ ] Logger class implemented with 4 log levels
- [ ] Debug logs only in development
- [ ] Browser console integration
- [ ] Unit tests with 80%+ coverage

**Dependencies:** None

**Blocking:** TASK-003, TASK-004

---

#### TASK-003: Replace Backend Console Calls with Logger
**Priority:** P0
**Effort:** 4 hours
**Line Reduction:** ~30 lines

**Description:**
Replace all 66+ direct console calls in backend with centralized logger.

**Domains Affected:**
- Backend Infrastructure (26 calls)
- Backend Task Engine (18 calls)
- Backend API Layer (12 calls)
- Backend Content (6 calls)
- Backend Auth (4 calls)

**Files to Modify:**
- `packages/backend/src/common/ai/openai.ts`
- `packages/backend/src/common/ai/anthropic.ts`
- `packages/backend/src/common/ai/ollama.ts`
- `packages/backend/src/tasks/service.ts`
- `packages/backend/src/tasks/controller.ts`
- `packages/backend/src/auth/service.ts`
- `packages/backend/src/auth/controller.ts`
- `packages/backend/src/invites/service.ts`
- `packages/backend/src/sync/watcher.ts`
- `packages/backend/src/prompts/loader.ts`
- `packages/backend/src/subjects/registry.ts`
- ~10 more files

**Approach:**
1. Add logger import: `import { createLogger } from '../common/logger'`
2. Create logger instance: `const logger = createLogger('ComponentName')`
3. Replace console.log → logger.debug
4. Replace console.info → logger.info
5. Replace console.warn → logger.warn
6. Replace console.error → logger.error

**Acceptance Criteria:**
- [ ] All console.log/info/warn/error calls replaced
- [ ] No direct console usage remains (except logger implementation)
- [ ] Appropriate log levels used
- [ ] Context names follow convention (PascalCase)
- [ ] Metadata objects used where applicable

**Dependencies:** TASK-001

---

#### TASK-004: Replace Frontend Console Calls with Logger
**Priority:** P0
**Effort:** 3 hours
**Line Reduction:** ~20 lines

**Description:**
Replace all 40+ direct console calls in frontend with centralized logger.

**Domains Affected:**
- Frontend Infrastructure (15 calls)
- Frontend State (10 calls)
- Frontend App Shell (8 calls)
- Frontend Pages (5 calls)
- Frontend UI Components (2 calls)

**Files to Modify:**
- `packages/frontend/src/data/core/storage.ts`
- `packages/frontend/src/data/core/userData.ts`
- `packages/frontend/src/api/logikids.ts`
- `packages/frontend/src/hooks/useTask.ts`
- `packages/frontend/src/app/account/UserDataContext.tsx`
- ~10 more files

**Acceptance Criteria:**
- [ ] All console calls replaced with logger
- [ ] No direct console usage remains
- [ ] Appropriate log levels used
- [ ] Context names follow convention

**Dependencies:** TASK-002

---

#### TASK-005: Delete Duplicate cn() Utility
**Priority:** P0 (Quick Win)
**Effort:** 15 minutes
**Line Reduction:** 10 lines

**Description:**
Delete duplicate cn() utility and consolidate to single implementation.

**Domains Affected:**
- Frontend Infrastructure

**Files to Delete:**
- `packages/frontend/src/utils/cn.ts`
- `packages/frontend/src/utils/index.ts`

**Files to Modify:**
- All files importing from `utils/cn` → update to `lib/utils`

**Acceptance Criteria:**
- [ ] `/utils/` directory deleted
- [ ] All imports updated to use `lib/utils`
- [ ] No import errors
- [ ] Build succeeds

**Dependencies:** None

---

#### TASK-006: Remove Duplicate ErrorBoundary
**Priority:** P0 (Quick Win)
**Effort:** 30 minutes
**Line Reduction:** 55 lines

**Description:**
Remove duplicate ErrorBoundary implementation and consolidate to feature-rich version.

**Domains Affected:**
- Frontend App Shell
- Frontend UI Components

**Files to Delete:**
- `packages/frontend/src/app/common/ErrorBoundary.tsx`

**Files to Modify:**
- `packages/frontend/src/app/common/index.ts` - Re-export from ui/common
- All files importing from `app/common/ErrorBoundary` → verify imports

**Acceptance Criteria:**
- [ ] Simple ErrorBoundary deleted
- [ ] Re-export points to ui/common implementation
- [ ] All components use same ErrorBoundary
- [ ] No import errors
- [ ] Build succeeds

**Dependencies:** None

---

#### TASK-007: Delete BaseController
**Priority:** P0 (Quick Win)
**Effort:** 15 minutes
**Line Reduction:** 8 lines

**Description:**
Remove unnecessary BaseController abstraction.

**Domains Affected:**
- Backend API Layer

**Files to Delete:**
- `packages/backend/src/common/baseController.ts`

**Files to Modify:**
- `packages/backend/src/tasks/controller.ts` - Remove extends BaseController

**Acceptance Criteria:**
- [ ] BaseController deleted
- [ ] TaskController no longer extends BaseController
- [ ] Build succeeds
- [ ] Tests pass

**Dependencies:** None

---

#### TASK-008: Remove Dead Code in ErrorHandler
**Priority:** P0 (Quick Win)
**Effort:** 10 minutes
**Line Reduction:** 13 lines

**Description:**
Remove redundant instanceof checks in error handler middleware.

**Domains Affected:**
- Backend Infrastructure

**Files to Modify:**
- `packages/backend/src/common/middleware/errorHandler.ts` (lines 38-50)

**Acceptance Criteria:**
- [ ] Dead code removed
- [ ] Error handling still works
- [ ] Tests pass

**Dependencies:** None

---

#### TASK-009: Remove Unused Type Definitions
**Priority:** P0 (Quick Win)
**Effort:** 5 minutes
**Line Reduction:** 30 lines

**Description:**
Remove unused type definitions from API types.

**Domains Affected:**
- Frontend Infrastructure

**Files to Modify:**
- `packages/frontend/src/api/types.ts`

**Types to Remove:**
- `ApiResponse` (0 usages)
- `ApiError` (0 usages)
- `ApiErrorCode` (0 usages)

**Acceptance Criteria:**
- [ ] Unused types deleted
- [ ] No import errors
- [ ] Build succeeds

**Dependencies:** None

---

#### TASK-010: Remove Deprecated Invite Validation Code
**Priority:** P0 (Quick Win)
**Effort:** 30 minutes
**Line Reduction:** 15-20 lines

**Description:**
Remove deprecated validateAndUse method and /api/invite/validate endpoint.

**Domains Affected:**
- Backend Auth

**Files to Modify:**
- `packages/backend/src/invites/service.ts` - Remove validateAndUse method
- `packages/backend/src/invites/controller.ts` - Remove validate endpoint
- `packages/backend/src/invites/router.ts` - Remove route

**Acceptance Criteria:**
- [ ] Deprecated method removed
- [ ] Deprecated endpoint removed
- [ ] No references remain
- [ ] Tests updated

**Dependencies:** None

---

### Phase 2: Error Handling (Week 2-3)

#### TASK-011: Create Backend Error Class Hierarchy
**Priority:** P0
**Effort:** 3 hours
**Line Reduction:** 0 (foundation)

**Description:**
Create typed error classes for all domain errors in backend.

**Domains Affected:**
- Backend Infrastructure

**Files to Create:**
- `packages/backend/src/common/errors/index.ts` - Error hierarchy
- `packages/backend/src/common/errors/base.ts` - Base error classes
- `packages/backend/src/common/errors/auth.ts` - Auth errors
- `packages/backend/src/common/errors/task.ts` - Task errors
- `packages/backend/src/common/errors/invite.ts` - Invite errors

**Error Classes to Implement:**
```typescript
// Base classes
export abstract class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code?: string
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

// Domain errors
export class UserExistsError extends ApplicationError {
  constructor() {
    super('User ID already exists', 409, 'USER_EXISTS')
  }
}

export class InviteNotFoundError extends ApplicationError {
  constructor() {
    super('Invite code not found', 404, 'INVITE_NOT_FOUND')
  }
}

export class InvalidInviteError extends ApplicationError {
  constructor(reason: string) {
    super(`Invalid invite: ${reason}`, 400, 'INVALID_INVITE')
  }
}

export class TaskGenerationError extends ApplicationError {
  constructor(message: string) {
    super(message, 500, 'TASK_GENERATION_FAILED')
  }
}

// ... more errors
```

**Acceptance Criteria:**
- [ ] Base ApplicationError class with statusCode and code
- [ ] All domain errors extend ApplicationError
- [ ] Each error has appropriate HTTP status code
- [ ] Error codes follow convention (UPPER_SNAKE_CASE)
- [ ] Unit tests for error instantiation
- [ ] Documentation with all error types

**Dependencies:** None

**Blocking:** TASK-012, TASK-013

---

#### TASK-012: Update Backend Services to Throw Typed Errors
**Priority:** P0
**Effort:** 4 hours
**Line Reduction:** 0 (changes error types)

**Description:**
Update all backend services to throw typed errors instead of generic Error.

**Domains Affected:**
- Backend Auth
- Backend Task Engine
- Backend API Layer

**Files to Modify:**
- `packages/backend/src/auth/service.ts`
- `packages/backend/src/invites/service.ts`
- `packages/backend/src/tasks/service.ts`
- `packages/backend/src/prompts/loader.ts`

**Approach:**
1. Import error classes from common/errors
2. Replace `throw new Error('message')` with typed errors
3. Remove string-based error messaging

**Example:**
```typescript
// Before
throw new Error('User ID already exists')

// After
throw new UserExistsError()
```

**Acceptance Criteria:**
- [ ] All services throw typed errors
- [ ] No generic Error throws with string matching
- [ ] Error messages consistent
- [ ] Tests updated to expect typed errors

**Dependencies:** TASK-011

**Blocking:** TASK-013

---

#### TASK-013: Update Backend Controllers to Remove Error Handling
**Priority:** P0
**Effort:** 5 hours
**Line Reduction:** ~105 lines

**Description:**
Remove try-catch blocks from controllers and let errors propagate to error handler middleware.

**Domains Affected:**
- Backend API Layer
- Backend Auth

**Files to Modify:**
- `packages/backend/src/auth/controller.ts` (remove 40 lines)
- `packages/backend/src/tasks/controller.ts` (remove 45 lines)
- `packages/backend/src/invites/controller.ts` (remove 20 lines)

**Approach:**
1. Remove try-catch blocks
2. Remove string matching logic (if error.message === ...)
3. Let typed errors propagate
4. Error handler middleware maps ApplicationError → HTTP response

**Example:**
```typescript
// Before (45 lines with error handling)
async getTask(req: Request, res: Response) {
  try {
    const task = await this.taskService.generateTask(params)
    res.json(task)
  } catch (error) {
    if (error.message === 'No tasks found') {
      return res.status(404).json({ error: error.message })
    }
    if (error.message === 'Invalid parameters') {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}

// After (5 lines, error handling in middleware)
async getTask(req: Request, res: Response) {
  const task = await this.taskService.generateTask(params)
  res.json(task)
}
```

**Acceptance Criteria:**
- [ ] All controller try-catch blocks removed
- [ ] No string matching logic remains
- [ ] Controllers only contain business logic
- [ ] Error handler middleware handles all errors
- [ ] Tests pass with new error flow

**Dependencies:** TASK-011, TASK-012

---

#### TASK-014: Update Frontend Error Handling in API Client
**Priority:** P0
**Effort:** 3 hours
**Line Reduction:** ~40 lines

**Description:**
Consolidate error handling in frontend API client, remove duplication.

**Domains Affected:**
- Frontend State

**Files to Modify:**
- `packages/frontend/src/api/logikids.ts` - Remove duplicate error handling
- `packages/frontend/src/api/client.ts` - Keep only interceptor error handling

**Approach:**
1. Remove error handling from individual API methods in logikids.ts
2. Trust axios interceptor to transform errors
3. Use single LogikidsApiError type throughout

**Acceptance Criteria:**
- [ ] Only one layer of error transformation (interceptor)
- [ ] No duplicate error handling in API methods
- [ ] Consistent error types across frontend
- [ ] Tests updated

**Dependencies:** None

---

#### TASK-015: Consolidate OPTION_COLORS
**Priority:** P0 (Quick Win)
**Effort:** 1 hour
**Line Reduction:** 15-20 lines

**Description:**
Extract OPTION_COLORS to shared constant file.

**Domains Affected:**
- Frontend UI Components

**Files to Create:**
- `packages/frontend/src/constants/colors.ts`

**Files to Modify:**
- `packages/frontend/src/ui/answer-types/SingleChoiceAnswer.tsx`
- `packages/frontend/src/ui/answer-types/MultiSelectAnswer.tsx`
- Any other files with OPTION_COLORS

**Acceptance Criteria:**
- [ ] Single OPTION_COLORS constant
- [ ] All components import from constants/colors
- [ ] Colors consistent across all components
- [ ] No duplicate arrays

**Dependencies:** None

---

## P1: High Priority (Do Next)

### Phase 3: Major Duplications (Week 4-5)

#### TASK-016: Consolidate IndexedDB Storage Operations
**Priority:** P1
**Effort:** 2 hours
**Line Reduction:** ~120 lines

**Description:**
Create generic storage functions to eliminate IndexedDB operation duplication.

**Domains Affected:**
- Frontend Infrastructure

**Files to Modify:**
- `packages/frontend/src/data/core/storage.ts`

**Implementation:**
```typescript
// Generic storage operations
async function storeValue<T>(key: string, value: T): Promise<void> {
  const db = await openDB()
  return wrapRequest(
    db.transaction([STORE_NAME], 'readwrite')
      .objectStore(STORE_NAME)
      .put(value, key),
    db,
    `Failed to store ${key}`
  )
}

async function getValue<T>(key: string): Promise<T | null> {
  const db = await openDB()
  return wrapRequest(
    db.transaction([STORE_NAME], 'readonly')
      .objectStore(STORE_NAME)
      .get(key),
    db,
    `Failed to load ${key}`
  )
}

// Helper to wrap IDBRequest in Promise
function wrapRequest<T>(
  request: IDBRequest<T>,
  db: IDBDatabase,
  errorMessage: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onerror = () => {
      db.close()
      reject(request.error || new Error(errorMessage))
    }
    request.onsuccess = () => {
      db.close()
      resolve(request.result)
    }
  })
}

// Public API becomes one-liners
export const storeKey = (key: CryptoKey) => storeValue(KEY_ID, key)
export const loadKey = () => getValue<CryptoKey>(KEY_ID)
export const storeUserId = (userId: string) => storeValue(USER_ID, userId)
export const getUserId = () => getValue<string>(USER_ID)
// ... etc
```

**Acceptance Criteria:**
- [ ] Generic storeValue/getValue functions implemented
- [ ] All 6 storage operations use generic functions
- [ ] ~120 lines of duplication removed
- [ ] Tests updated and passing
- [ ] No functional changes (same behavior)

**Dependencies:** None

---

#### TASK-017: Extract ConceptsPage Tab Content Component
**Priority:** P1
**Effort:** 2 hours
**Line Reduction:** ~115 lines

**Description:**
Create reusable ConceptsTabContent component to eliminate tab duplication.

**Domains Affected:**
- Frontend Pages

**Files to Create:**
- `packages/frontend/src/app/concepts/ConceptsTabContent.tsx`

**Files to Modify:**
- `packages/frontend/src/app/concepts/ConceptsPage.tsx`

**Implementation:**
```typescript
// ConceptsTabContent.tsx
interface ConceptsTabContentProps {
  concepts: Concept[]
  isLoading: boolean
  showAll: boolean
  groupedByGrade: Map<string, Concept[]>
  subjectId: string
  onToggleShowAll: () => void
}

export function ConceptsTabContent({
  concepts,
  isLoading,
  showAll,
  groupedByGrade,
  subjectId,
  onToggleShowAll
}: ConceptsTabContentProps) {
  // All 115 lines of rendering logic here (once)
}

// ConceptsPage.tsx
<TabsContent value="school">
  <ConceptsTabContent
    concepts={schoolConcepts}
    isLoading={isLoading}
    showAll={showAllSchool}
    groupedByGrade={groupedSchoolByGrade}
    subjectId={subjectId}
    onToggleShowAll={toggleShowAllSchool}
  />
</TabsContent>
<TabsContent value="fun">
  <ConceptsTabContent
    concepts={funConcepts}
    isLoading={isLoading}
    showAll={showAllFun}
    groupedByGrade={groupedFunByGrade}
    subjectId={subjectId}
    onToggleShowAll={toggleShowAllFun}
  />
</TabsContent>
```

**Acceptance Criteria:**
- [ ] ConceptsTabContent component created
- [ ] Both tabs use same component
- [ ] 115 lines of duplication removed
- [ ] Visual appearance unchanged
- [ ] Tests added for new component

**Dependencies:** None

---

#### TASK-018: Extract Base Registry Class
**Priority:** P1
**Effort:** 4 hours
**Line Reduction:** ~60 lines

**Description:**
Create abstract BaseRegistry class to eliminate registry duplication.

**Domains Affected:**
- Backend Content

**Files to Create:**
- `packages/backend/src/common/registry/BaseRegistry.ts`

**Files to Modify:**
- `packages/backend/src/subjects/registry.ts`
- `packages/backend/src/tasks/types/registry.ts`

**Implementation:**
```typescript
// BaseRegistry.ts
export abstract class BaseRegistry<T, TId = string> {
  protected items = new Map<string, T>()

  async initialize(): Promise<void> {
    const ids = await this.getItemIds()
    const logger = this.getLogger()

    logger.info(`Initializing registry with ${ids.length} items`)

    for (const id of ids) {
      try {
        const item = await this.loadItem(id)
        const key = this.getItemKey(item)
        this.items.set(key, item)
        logger.debug(`Loaded item: ${key}`)
      } catch (error) {
        logger.error(`Failed to load item: ${id}`, error)
      }
    }

    logger.info(`Registry initialized with ${this.items.size} items`)
  }

  has(key: string): boolean {
    return this.items.has(key)
  }

  get(key: string): T | undefined {
    return this.items.get(key)
  }

  getAll(): T[] {
    return Array.from(this.items.values())
  }

  protected abstract getItemIds(): Promise<TId[]>
  protected abstract loadItem(id: TId): Promise<T>
  protected abstract getItemKey(item: T): string
  protected abstract getLogger(): Logger
}

// SubjectRegistry.ts
export class SubjectRegistry extends BaseRegistry<Subject> {
  protected async getItemIds(): Promise<string[]> {
    // Subject-specific logic
  }

  protected async loadItem(id: string): Promise<Subject> {
    // Subject-specific logic
  }

  protected getItemKey(subject: Subject): string {
    return subject.id
  }

  protected getLogger(): Logger {
    return createLogger('SubjectRegistry')
  }
}
```

**Acceptance Criteria:**
- [ ] BaseRegistry abstract class implemented
- [ ] SubjectRegistry extends BaseRegistry
- [ ] TaskTypeRegistry extends BaseRegistry
- [ ] ~60 lines of duplication removed
- [ ] All registry methods work
- [ ] Tests pass

**Dependencies:** TASK-001 (Logger)

---

#### TASK-019: Consolidate AI Client Error Handling
**Priority:** P1
**Effort:** 3 hours
**Line Reduction:** ~40 lines

**Description:**
Extract common error handling logic from AI provider implementations.

**Domains Affected:**
- Backend Infrastructure

**Files to Create:**
- `packages/backend/src/common/ai/errorHandler.ts`

**Files to Modify:**
- `packages/backend/src/common/ai/openai.ts`
- `packages/backend/src/common/ai/anthropic.ts`
- `packages/backend/src/common/ai/ollama.ts`

**Implementation:**
```typescript
// errorHandler.ts
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string,
  logger: Logger
): Promise<T> {
  const startTime = Date.now()
  try {
    return await operation()
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error(
      `${context} failed after ${duration}ms`,
      error instanceof Error ? error : new Error('Unknown error'),
      { context, duration }
    )
    throw error
  }
}

// Usage in providers
const response = await withErrorHandling(
  () => this.client.chat.completions.create(params),
  'OpenAI chat completion',
  this.logger
)
```

**Acceptance Criteria:**
- [ ] Common error handler implemented
- [ ] All three providers use common handler
- [ ] ~40 lines of duplication removed
- [ ] Error logging consistent
- [ ] Tests pass

**Dependencies:** TASK-001 (Logger)

---

### Phase 4: Dependency Injection (Week 6-7)

#### TASK-020: Implement Backend Dependency Injection - PromptService
**Priority:** P1
**Effort:** 4 hours
**Line Reduction:** 0 (improves testability)

**Description:**
Refactor PromptService to receive dependencies via constructor.

**Domains Affected:**
- Backend Task Engine

**Files to Modify:**
- `packages/backend/src/prompts/service.ts`
- `packages/backend/src/tasks/router.ts`

**Before:**
```typescript
export class PromptService {
  private promptLoader: PromptLoader
  private variationLoader: VariationLoader

  constructor() {
    this.promptLoader = new PromptLoader()
    this.variationLoader = new VariationLoader()
  }
}
```

**After:**
```typescript
export class PromptService {
  constructor(
    private promptLoader: PromptLoader,
    private variationLoader: VariationLoader
  ) {}
}

// In router.ts
const promptLoader = new PromptLoader()
const variationLoader = new VariationLoader()
const promptService = new PromptService(promptLoader, variationLoader)
```

**Acceptance Criteria:**
- [ ] PromptService receives dependencies
- [ ] Dependencies created in router/index
- [ ] Can mock dependencies in tests
- [ ] Tests updated with mocks

**Dependencies:** None

---

#### TASK-021: Implement Backend Dependency Injection - TaskService
**Priority:** P1
**Effort:** 4 hours
**Line Reduction:** 0

**Description:**
Refactor TaskService to receive dependencies via constructor.

**Domains Affected:**
- Backend Task Engine

**Files to Modify:**
- `packages/backend/src/tasks/service.ts`
- `packages/backend/src/tasks/router.ts`

**Acceptance Criteria:**
- [ ] TaskService receives all dependencies
- [ ] Singletons created in router
- [ ] Tests use mocked dependencies

**Dependencies:** TASK-020

---

#### TASK-022: Implement Backend Dependency Injection - AuthService
**Priority:** P1
**Effort:** 3 hours
**Line Reduction:** 0

**Description:**
Create singleton AuthService instance instead of multiple instances.

**Domains Affected:**
- Backend Auth

**Files to Modify:**
- `packages/backend/src/auth/controller.ts`
- `packages/backend/src/auth/middleware.ts`
- `packages/backend/src/auth/router.ts`

**Before:**
```typescript
// Multiple instances created
const authService = new AuthService() // controller
const authService = new AuthService() // middleware
```

**After:**
```typescript
// Single instance in router
const authService = new AuthService()
const authController = new AuthController(authService)
const authMiddleware = createAuthMiddleware(authService)
```

**Acceptance Criteria:**
- [ ] Single AuthService instance
- [ ] Passed to controller and middleware
- [ ] Tests use mocked service

**Dependencies:** None

---

#### TASK-023: Refactor Frontend useTask Hook - Extract Data Fetching
**Priority:** P1
**Effort:** 3 hours
**Line Reduction:** 0 (improves composability)

**Description:**
Split useTask god hook into composable hooks, starting with data fetching.

**Domains Affected:**
- Frontend State

**Files to Create:**
- `packages/frontend/src/hooks/useTaskData.ts`

**Files to Modify:**
- `packages/frontend/src/hooks/useTask.ts`

**Implementation:**
```typescript
// useTaskData.ts - Pure data fetching
export function useTaskData(params: TaskParams) {
  return useQuery({
    queryKey: ['task', params],
    queryFn: () => logikidsApi.getTask(params)
  })
}

// useTask.ts - Composition
export function useTask(params: TaskParams) {
  const taskQuery = useTaskData(params)
  const answer = useTaskAnswer(taskQuery.data)
  const hints = useHint(taskQuery.data?.taskId)

  return {
    ...taskQuery,
    answer,
    hints
  }
}
```

**Acceptance Criteria:**
- [ ] useTaskData hook created
- [ ] Only handles data fetching
- [ ] useTask composes useTaskData
- [ ] Can use useTaskData independently
- [ ] Tests for both hooks

**Dependencies:** None

---

#### TASK-024: Refactor Frontend useTask Hook - Extract Answer Management
**Priority:** P1
**Effort:** 3 hours
**Line Reduction:** 0

**Description:**
Extract answer management from useTask into standalone hook.

**Domains Affected:**
- Frontend State

**Files to Modify:**
- `packages/frontend/src/hooks/useTaskAnswer.ts`
- `packages/frontend/src/hooks/useTask.ts`

**Acceptance Criteria:**
- [ ] useTaskAnswer is standalone
- [ ] useTask composes it
- [ ] Can be used independently
- [ ] Tests updated

**Dependencies:** TASK-023

---

#### TASK-025: Refactor Frontend useTask Hook - Extract Hint Management
**Priority:** P1
**Effort:** 2 hours
**Line Reduction:** 0

**Description:**
Extract hint management from useTask into standalone hook.

**Domains Affected:**
- Frontend State

**Files to Modify:**
- `packages/frontend/src/hooks/useHint.ts`
- `packages/frontend/src/hooks/useTask.ts`

**Acceptance Criteria:**
- [ ] useHint is standalone
- [ ] useTask composes it
- [ ] Can be used independently
- [ ] Tests updated

**Dependencies:** TASK-024

---

### Phase 5: God Object Refactoring (Week 8-9)

#### TASK-026: Split UserDataContext - Extract AuthContext
**Priority:** P1
**Effort:** 8 hours
**Line Reduction:** 0 (improves SRP)

**Description:**
Extract authentication logic from UserDataContext into separate AuthContext.

**Domains Affected:**
- Frontend App Shell

**Files to Create:**
- `packages/frontend/src/app/account/AuthContext.tsx`

**Files to Modify:**
- `packages/frontend/src/app/account/UserDataContext.tsx`

**AuthContext Responsibilities:**
- register()
- login()
- logout()
- isAuthenticated
- currentUser

**Acceptance Criteria:**
- [ ] AuthContext created with auth logic
- [ ] UserDataContext uses AuthContext
- [ ] Components can import either context
- [ ] Tests for both contexts

**Dependencies:** None

---

#### TASK-027: Split UserDataContext - Extract DataSyncContext
**Priority:** P1
**Effort:** 8 hours
**Line Reduction:** 0

**Description:**
Extract data sync logic into separate DataSyncContext.

**Domains Affected:**
- Frontend App Shell

**Files to Create:**
- `packages/frontend/src/app/account/DataSyncContext.tsx`

**DataSyncContext Responsibilities:**
- syncData()
- exportData()
- importData()
- lastSync
- syncStatus

**Acceptance Criteria:**
- [ ] DataSyncContext created
- [ ] Logic moved from UserDataContext
- [ ] Tests updated

**Dependencies:** TASK-026

---

#### TASK-028: Split TaskCard - Extract Sub-components
**Priority:** P1
**Effort:** 8 hours
**Line Reduction:** 0

**Description:**
Split 379-line TaskCard into focused sub-components.

**Domains Affected:**
- Frontend Pages

**Files to Create:**
- `packages/frontend/src/app/tasks/TaskHeader.tsx`
- `packages/frontend/src/app/tasks/TaskAnswerRenderer.tsx`
- `packages/frontend/src/app/tasks/TaskFeedback.tsx`
- `packages/frontend/src/app/tasks/TaskActions.tsx`

**Files to Modify:**
- `packages/frontend/src/app/tasks/TaskCard.tsx`

**Sub-component Responsibilities:**
- TaskHeader: Title, metadata, difficulty badge
- TaskAnswerRenderer: Delegates to answer type components
- TaskFeedback: Shows feedback after submission
- TaskActions: Buttons (submit, next, hint, etc.)

**Acceptance Criteria:**
- [ ] 4 sub-components created
- [ ] TaskCard composes sub-components
- [ ] Each component has single responsibility
- [ ] TaskCard.tsx reduced to ~100 lines
- [ ] Tests for each component

**Dependencies:** None

---

## P2: Medium Priority (If Time Permits)

#### TASK-029: Consolidate Provider Validation
**Priority:** P2
**Effort:** 2 hours
**Line Reduction:** ~20 lines

**Description:**
Remove duplicate provider validation logic using Zod refinements.

**Domains Affected:**
- Backend Infrastructure

**Files to Modify:**
- `packages/backend/src/config/index.ts`
- `packages/backend/src/common/ai/factory.ts`

**Implementation:**
Use Zod schema with refinements for single source of truth.

**Acceptance Criteria:**
- [ ] Single validation in Zod schema
- [ ] factory.ts trusts validated config
- [ ] ~20 lines removed
- [ ] Tests pass

**Dependencies:** None

---

#### TASK-030: Convert Config to Zod-First
**Priority:** P2
**Effort:** 3 hours
**Line Reduction:** ~30 lines

**Description:**
Remove duplicate interface definitions, use z.infer<> for types.

**Domains Affected:**
- Backend Infrastructure

**Files to Modify:**
- `packages/backend/src/config/schema.ts`

**Before:**
```typescript
export interface OllamaConfig {
  baseURL: string
  model: string
}

export const ollamaSchema = z.object({
  baseURL: z.string(),
  model: z.string()
})
```

**After:**
```typescript
export const ollamaSchema = z.object({
  baseURL: z.string(),
  model: z.string()
})

export type OllamaConfig = z.infer<typeof ollamaSchema>
```

**Acceptance Criteria:**
- [ ] All interfaces removed
- [ ] Use z.infer<> for types
- [ ] No duplicate definitions
- [ ] Tests pass

**Dependencies:** None

---

#### TASK-031: Create Generic Validation Middleware Factory
**Priority:** P2
**Effort:** 2 hours
**Line Reduction:** ~40 lines

**Description:**
Create factory function for validation middleware to eliminate duplication.

**Domains Affected:**
- Backend Infrastructure

**Files to Modify:**
- `packages/backend/src/common/middleware/validate.ts`

**Implementation:**
```typescript
type RequestProperty = 'body' | 'query' | 'params'

function createValidator(property: RequestProperty) {
  return (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req[property])
      if (!result.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: result.error.errors
        })
      }
      req[property] = result.data
      next()
    }
  }
}

export const validateBody = createValidator('body')
export const validateQuery = createValidator('query')
export const validateParams = createValidator('params')
```

**Acceptance Criteria:**
- [ ] Factory function created
- [ ] All three validators use factory
- [ ] ~40 lines removed
- [ ] Tests pass

**Dependencies:** None

---

#### TASK-032: Extract Selector Component Pattern
**Priority:** P2
**Effort:** 3 hours
**Line Reduction:** ~120 lines

**Description:**
Create reusable SelectorButton component to eliminate duplication.

**Domains Affected:**
- Frontend UI Components

**Files to Create:**
- `packages/frontend/src/ui/common/SelectorButton.tsx`

**Files to Modify:**
- `packages/frontend/src/ui/selectors/SubjectSelector.tsx`
- `packages/frontend/src/ui/selectors/DifficultySelector.tsx`
- `packages/frontend/src/ui/selectors/GradeSelector.tsx`

**Acceptance Criteria:**
- [ ] Generic SelectorButton component
- [ ] All selectors use SelectorButton
- [ ] ~120 lines removed
- [ ] Visual appearance unchanged

**Dependencies:** None

---

#### TASK-033: Standardize API Fetch Patterns
**Priority:** P2
**Effort:** 4 hours
**Line Reduction:** ~30 lines

**Description:**
Consolidate API fetch patterns across frontend.

**Domains Affected:**
- Frontend Pages

**Files to Modify:**
- Multiple page components with custom fetch logic

**Acceptance Criteria:**
- [ ] Consistent pattern for data fetching
- [ ] Use React Query everywhere
- [ ] No raw fetch/axios in components
- [ ] Loading states consistent

**Dependencies:** None

---

#### TASK-034: Standardize Loading Skeletons
**Priority:** P2
**Effort:** 3 hours
**Line Reduction:** ~20 lines

**Description:**
Create reusable skeleton components for consistent loading states.

**Domains Affected:**
- Frontend UI Components

**Files to Create:**
- `packages/frontend/src/ui/common/LoadingSkeleton.tsx`

**Acceptance Criteria:**
- [ ] Reusable skeleton components
- [ ] Consistent loading UI
- [ ] Used across all pages

**Dependencies:** None

---

#### TASK-035: Extract Grade Range Formatting
**Priority:** P2
**Effort:** 2 hours
**Line Reduction:** ~15 lines

**Description:**
Extract grade range formatting logic to utility function.

**Domains Affected:**
- Frontend Infrastructure

**Files to Create:**
- `packages/frontend/src/lib/formatGrade.ts`

**Acceptance Criteria:**
- [ ] Utility function for grade formatting
- [ ] Used across all components
- [ ] Consistent formatting

**Dependencies:** None

---

#### TASK-036: Split PromptLoader Responsibilities
**Priority:** P2
**Effort:** 8 hours
**Line Reduction:** 0 (improves SRP)

**Description:**
Split 463-line PromptLoader into focused classes.

**Domains Affected:**
- Backend Content

**Files to Create:**
- `packages/backend/src/prompts/FileSystemLoader.ts`
- `packages/backend/src/prompts/PromptCache.ts`
- `packages/backend/src/prompts/HotReloadWatcher.ts`

**Files to Modify:**
- `packages/backend/src/prompts/loader.ts`

**New Responsibilities:**
- FileSystemLoader: Read files from disk
- PromptCache: Cache management
- HotReloadWatcher: File watching for hot reload
- PromptLoader: Orchestration only

**Acceptance Criteria:**
- [ ] 3 focused classes created
- [ ] PromptLoader orchestrates
- [ ] Each class has single responsibility
- [ ] Tests for each class

**Dependencies:** TASK-020

---

## P3: Low Priority (Future)

#### TASK-037: Add Comprehensive Unit Tests for Auth
**Priority:** P3
**Effort:** 8 hours
**Line Reduction:** 0

**Description:**
Add unit tests for auth service (currently no tests for security-critical code).

**Domains Affected:**
- Backend Auth

**Files to Create:**
- `packages/backend/src/auth/service.test.ts`
- `packages/backend/src/auth/middleware.test.ts`

**Acceptance Criteria:**
- [ ] 80%+ code coverage for auth
- [ ] Tests for all auth flows
- [ ] Security edge cases tested

**Dependencies:** TASK-022

---

#### TASK-038: Add Documentation for Common Patterns
**Priority:** P3
**Effort:** 4 hours
**Line Reduction:** 0

**Description:**
Document common patterns and conventions.

**Files to Create:**
- `docs/patterns/error-handling.md`
- `docs/patterns/dependency-injection.md`
- `docs/patterns/logging.md`

**Acceptance Criteria:**
- [ ] Pattern documentation created
- [ ] Code examples included
- [ ] Referenced in CLAUDE.md

**Dependencies:** P0, P1 tasks completed

---

#### TASK-039: Performance Optimization Review
**Priority:** P3
**Effort:** 6 hours
**Line Reduction:** 0

**Description:**
Review and optimize performance bottlenecks.

**Domains Affected:**
- All

**Acceptance Criteria:**
- [ ] Performance profiling complete
- [ ] Bottlenecks identified
- [ ] Optimization plan created

**Dependencies:** None

---

#### TASK-040: Code Style Consistency Review
**Priority:** P3
**Effort:** 3 hours
**Line Reduction:** 0

**Description:**
Review and standardize code style across codebase.

**Acceptance Criteria:**
- [ ] ESLint rules reviewed
- [ ] Prettier config updated
- [ ] Inconsistencies fixed

**Dependencies:** None

---

#### TASK-041: Dependency Audit and Updates
**Priority:** P3
**Effort:** 4 hours
**Line Reduction:** 0

**Description:**
Audit npm dependencies for security and updates.

**Acceptance Criteria:**
- [ ] All dependencies reviewed
- [ ] Security vulnerabilities addressed
- [ ] Outdated packages updated

**Dependencies:** None

---

## Execution Strategy

### Recommended Sequence

**Week 1: Foundation + Quick Wins**
- TASK-001 through TASK-010
- Total: ~20 hours
- Line reduction: ~175 lines
- **Goal:** Establish logging, remove dead code

**Week 2-3: Error Handling**
- TASK-011 through TASK-015
- Total: ~16 hours
- Line reduction: ~160 lines
- **Goal:** Consistent error handling

**Week 4-5: Major Duplications**
- TASK-016 through TASK-019
- Total: ~11 hours
- Line reduction: ~335 lines
- **Goal:** Eliminate massive duplications

**Week 6-7: Dependency Injection**
- TASK-020 through TASK-025
- Total: ~19 hours
- Line reduction: 0 (testability improvement)
- **Goal:** Enable unit testing

**Week 8-9: God Objects**
- TASK-026 through TASK-028
- Total: ~24 hours
- Line reduction: 0 (complexity reduction)
- **Goal:** Single Responsibility Principle

**Week 10+: Medium/Low Priority**
- TASK-029 through TASK-041
- Total: ~47 hours
- Line reduction: ~210 lines
- **Goal:** Polish and optimize

### Success Metrics

**After P0 (Week 1-3):**
- ✅ Centralized logging (100+ console calls eliminated)
- ✅ Consistent error handling
- ✅ ~335 lines removed
- ✅ Health score: 6.6 → 7.5/10

**After P1 (Week 4-9):**
- ✅ Major duplications eliminated (~500 lines)
- ✅ Dependency injection enabled
- ✅ God objects refactored
- ✅ Health score: 7.5 → 8.5/10

**After P2 (Week 10+):**
- ✅ Validation consolidated
- ✅ Patterns standardized
- ✅ Health score: 8.5 → 9.0/10

---

## Notes

- **Line reduction is conservative** - Actual reduction may be higher
- **Effort estimates include** implementation + testing + documentation
- **Dependencies must be respected** - Don't start dependent tasks early
- **Each task should be a separate PR** for easier review
- **Tests are mandatory** for all refactorings
- **Update this backlog** as tasks are completed or priorities change
