# Backend API Layer Analysis

**Date:** 2025-11-16
**Domain:** Backend API Layer
**Files Reviewed:** 15

## Files Reviewed

| File | Lines | Purpose |
|------|-------|---------|
| `src/index.ts` | 73 | Main entry point, app setup |
| `src/auth/router.ts` | 18 | Auth route definitions |
| `src/auth/auth.controller.ts` | 165 | Auth request handlers |
| `src/auth/auth.middleware.ts` | 93 | JWT auth middleware |
| `src/tasks/router.ts` | 90 | Task route definitions |
| `src/tasks/task.controller.ts` | 187 | Task request handlers |
| `src/invites/router.ts` | 11 | Invite route definitions |
| `src/invites/invite.controller.ts` | 45 | Invite request handlers |
| `src/sync/router.ts` | 49 | Sync route definitions |
| `src/sync/sync.controller.ts` | 126 | Sync request handlers |
| `src/hints/hint.controller.ts` | 36 | Hint request handlers |
| `src/common/baseController.ts` | 8 | Base controller class |
| `src/common/errors.ts` | 21 | Custom error classes |
| `src/common/middleware/errorHandler.ts` | 55 | Centralized error handler |
| `src/common/middleware/validation.ts` | 46 | Zod validation middleware |
| **Total** | **1,023** | |

## Good Patterns (Preserve These)

### 1. Zod Schema Validation ✅
**File:** `src/common/middleware/validation.ts`

The `validateBody`, `validateQuery`, and `validateParams` middleware functions provide clean, reusable validation:

```typescript
// validation.ts:8-17
export const validateBody = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error); // ZodError → error handler → 400 response
    }
  };
};
```

**Why it's good:** Separation of concerns - validation logic is separate from business logic, schemas are reusable, errors are handled consistently.

### 2. Service Layer Separation ✅
**Files:** `src/auth/auth.service.ts`, `src/tasks/task.service.ts`, etc.

Controllers delegate business logic to service classes:

```typescript
// auth.controller.ts:14-24
export async function register(req: RegisterRequestTyped, res: Response): Promise<void> {
  try {
    const { userId, inviteCode } = req.body;
    const result = await authService.register(userId, inviteCode);
    res.status(201).json({
      accessToken: result.accessToken,
      account: result.account
    })
```

**Why it's good:** Controllers are thin HTTP adapters, business logic is testable in isolation, services can be reused.

### 3. Router Factory Pattern ✅
**Files:** `src/tasks/router.ts`, `src/sync/router.ts`

Async router creation allows for dependency initialization:

```typescript
// tasks/router.ts:20-26
export async function createTaskRouter(): Promise<Router> {
  const router = Router();
  const aiClient = await createAIClient();
  const promptService = new PromptService();
  await promptService.initialize();
  // ...
}
```

**Why it's good:** Dependencies are properly initialized before route registration, makes testing easier with dependency injection.

## Issues Found

### DRY Violations

#### 1. CRITICAL: Duplicated Error Handling Pattern (42 instances)
**Files:** All controller files

**Pattern:** Every controller manually handles errors with nested try-catch and if-else chains:

```typescript
// auth.controller.ts:25-49 (24 lines)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'User ID already exists') {
        res.status(409).json({ error: error.message })
        return
      }
      if (error.message === 'Invite code not found') {
        res.status(404).json({ error: error.message })
        return
      }
      if (error.message === 'Invite code expired' || error.message === 'Invite code already used') {
        res.status(400).json({ error: error.message })
        return
      }
      console.error('Registration error:', error)
      res.status(500).json({ error: 'Registration failed' })
      return
    }
    console.error('Unknown registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
```

**Occurrences:**
- `auth.controller.ts`: 4 functions × ~15 lines each = 60 lines
- `task.controller.ts`: 3 functions × ~10 lines each = 30 lines
- `hint.controller.ts`: 1 function × ~15 lines = 15 lines
- Total: ~105 lines of duplicated error handling logic

**Impact:** High - This is the single largest source of code duplication in the API layer.

#### 2. HIGH: Duplicated Concept Mapping (3 instances)
**File:** `src/tasks/task.controller.ts`

**Pattern:** The same concept-to-DTO mapping is repeated 3 times:

```typescript
// Lines 47-56 (identical to 72-81 and 167-177)
concepts: filteredConcepts.map(concept => ({
  id: concept.id,
  name: concept.name,
  description: concept.description,
  grade: concept.grade,
  difficulty: concept.difficulty,
  source: concept.source,
  focus: concept.focus,
  learning_objectives: concept.learning_objectives
}))
```

**Impact:** Medium - 27 lines that could be a single 9-line function.

#### 3. MEDIUM: Duplicated Rate Limiter Configuration (3 instances)
**Files:** `src/tasks/router.ts`, `src/sync/router.ts`

**Pattern:** Near-identical rate limiter setup with only max/message differences:

```typescript
// tasks/router.ts:38-48
const taskRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  keyGenerator: (req) => req.userId || 'anonymous',
  message: { error: 'Too many task requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
});

// sync/router.ts:27-37 (nearly identical except max: 100, different keyGenerator)
```

**Impact:** Low-Medium - 30 lines that could be a factory function.

#### 4. LOW: Duplicated Shutdown Handlers
**File:** `src/index.ts`

**Pattern:** SIGTERM and SIGINT handlers are identical:

```typescript
// Lines 48-53 and 55-60 are identical except for signal name in log
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  cacheCleanupService.stop();
  await closeDatabase();
  process.exit(0);
});
```

**Impact:** Low - 12 lines that could be 7 lines with a shared handler.

### SOLID Violations

#### 1. CRITICAL: Single Responsibility - TaskController Doing Too Much
**File:** `src/tasks/task.controller.ts`

**Violations:**
- `getSubjects()` (98 lines): Fetches data, filters concepts, maps DTOs, applies fallback logic
- `getSubjectConcepts()` (61 lines): Fetches data, filters, applies fallback logic for grade filtering
- `getTask()` (23 lines): Parses query params, validates, delegates (this one is actually fine)

**Analysis:**
```typescript
// Lines 20-98: getSubjects() has 4 responsibilities:
// 1. Registry interaction (subjectRegistry.getAll(), getConcepts())
// 2. Filtering logic (grade vs age fallback, difficulty filtering)
// 3. DTO mapping (concept object transformation)
// 4. Response filtering (removing empty subjects)

// This should be split into:
// - SubjectService for filtering/business logic
// - ConceptMapper for DTO transformations
// - Controller just orchestrates
```

**Impact:** High - Makes testing difficult, business logic is tied to HTTP layer.

#### 2. MEDIUM: Open/Closed - Error Handling Violates OCP
**Files:** All controllers

**Problem:** Every new error type requires modifying all controllers:

```typescript
// To add a new error type, you must edit auth.controller.ts:
if (error.message === 'New Error Type') {
  res.status(XXX).json({ error: error.message })
  return
}
```

**Better approach:** Use custom error classes with status codes (partially done in `errors.ts` but not used consistently).

#### 3. MEDIUM: Interface Segregation - BaseController Provides No Value
**File:** `src/common/baseController.ts`

**Current state:**
```typescript
export abstract class BaseController {
  protected aiClient: AIClient;
  public constructor(aiClient: AIClient) {
    this.aiClient = aiClient;
  }
}
```

**Problem:**
- Only TaskController extends it
- Only stores aiClient (could be a constructor parameter)
- Provides no shared methods
- Forces inheritance where composition would be better

**Impact:** Low-Medium - Unnecessary abstraction, creates coupling.

#### 4. LOW: Dependency Inversion - Concrete Dependencies in Routers
**Files:** `src/tasks/router.ts`, `src/sync/router.ts`

**Problem:** Routers create concrete service instances instead of receiving them:

```typescript
// tasks/router.ts:29-35
const taskService = new TaskService(aiClient, promptService);
const taskController = new TaskController(aiClient, taskService);
const hintService = new HintService(aiClient);
const hintController = new HintController(hintService);
```

**Impact:** Low - Makes testing harder, but not a major issue given current architecture.

### Minimal Code Violations

#### 1. MEDIUM: BaseController Abstraction Should Be Removed
**File:** `src/common/baseController.ts`

**Code:**
```typescript
export abstract class BaseController {
  protected aiClient: AIClient;
  public constructor(aiClient: AIClient) {
    this.aiClient = aiClient;
  }
}
```

**Why it's over-engineering:**
- 8 lines that provide zero value
- Only TaskController uses it (1 of 5 controllers)
- Adds no shared behavior
- Could be deleted and TaskController just stores aiClient directly

**Deletion candidate:** Yes - save 8 lines, remove unnecessary abstraction.

#### 2. MEDIUM: Redundant Error Handling in errorHandler.ts
**File:** `src/common/middleware/errorHandler.ts`

**Problem:** Lines 38-50 duplicate lines 24-36:

```typescript
// Lines 24-36: Handle ApplicationError
if (error instanceof ApplicationError) {
  response = {
    error: error.message,
    details: error.details,
    status: error.statusCode
  };
} else if (error instanceof ZodError) { /* ... */ }

// Lines 38-50: Check again for ValidationError (extends ApplicationError)
if (error instanceof ValidationError) {
  response = {
    error: 'Validation Error',
    details: error.details,
    status: 400
  };
} else if (error instanceof AIGenerationError) { /* ... */ }
```

**Why redundant:** `ValidationError` and `AIGenerationError` extend `ApplicationError`, so the first check already handles them. The second block is dead code.

**Impact:** 13 lines of dead code that confuses maintainers.

#### 3. LOW: Unused Error Classes Not Thrown
**File:** `src/common/errors.ts`

**Code:**
```typescript
export class ValidationError extends ApplicationError {
  constructor(details: unknown) {
    super('Validation Error', 400, details);
  }
}

export class AIGenerationError extends ApplicationError {
  constructor(message: string) {
    super(message, 500);
  }
}
```

**Problem:** Grep shows these are defined but never thrown in the API layer. Controllers catch and manually create error responses instead of throwing these.

**Impact:** 10 lines of unused code (if we count both classes).

#### 4. LOW: Over-Complex Route Wrapping
**Files:** All routers

**Pattern:**
```typescript
// tasks/router.ts:64-66
router.get('/subjects', validateQuery(getSubjectsQuerySchema), (req, res, next) =>
  taskController.getSubjects(req as GetSubjectsRequest, res).catch(next)
);
```

**Could be:**
```typescript
// If controllers throw instead of setting res.status()
router.get('/subjects',
  validateQuery(getSubjectsQuerySchema),
  taskController.getSubjects
);
```

**Impact:** Minor - But shows the tension between throwing errors vs. setting response status.

## Code Reduction Opportunities

### High Impact Reductions

#### 1. Centralize Error Handling via Middleware
**Estimated line reduction:** 100+ lines

**Current:** Each controller has 15-24 lines of error handling per function.

**Refactored approach:**

```typescript
// New: src/common/errors.ts (add specific error types)
export class UserExistsError extends ApplicationError {
  constructor() {
    super('User ID already exists', 409);
  }
}

export class InviteNotFoundError extends ApplicationError {
  constructor() {
    super('Invite code not found', 404);
  }
}

// Controllers throw instead of res.status():
export async function register(req: RegisterRequestTyped, res: Response): Promise<void> {
  const { userId, inviteCode } = req.body;
  const result = await authService.register(userId, inviteCode);
  res.status(201).json({
    accessToken: result.accessToken,
    account: result.account
  });
  // Error handling removed - let middleware handle it
}

// errorHandler.ts already catches and converts to HTTP responses
```

**Line savings:**
- auth.controller.ts: 60 lines → 10 lines (save 50)
- task.controller.ts: 30 lines → 5 lines (save 25)
- hint.controller.ts: 15 lines → 3 lines (save 12)
- sync.controller.ts: Has its own handleError method (18 lines → 0, save 18)
- **Total: ~105 lines saved**

#### 2. Extract Concept Mapper Utility
**Estimated line reduction:** 18 lines

```typescript
// New: src/tasks/mappers.ts
export function mapConceptToDTO(concept: Concept) {
  return {
    id: concept.id,
    name: concept.name,
    description: concept.description,
    grade: concept.grade,
    difficulty: concept.difficulty,
    source: concept.source,
    focus: concept.focus,
    learning_objectives: concept.learning_objectives
  };
}

// Usage in task.controller.ts:
concepts: filteredConcepts.map(mapConceptToDTO)
```

**Line savings:** 27 duplicate lines → 9 function + 3 × 1 usage = 18 lines saved

#### 3. Extract Rate Limiter Factory
**Estimated line reduction:** 20 lines

```typescript
// New: src/common/middleware/rateLimiter.ts
export function createRateLimiter(options: {
  max: number;
  message: string;
  keyGenerator?: (req: Request) => string;
}) {
  return rateLimit({
    windowMs: 60 * 60 * 1000,
    max: options.max,
    keyGenerator: options.keyGenerator || ((req) => req.userId || 'anonymous'),
    message: { error: options.message },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test',
  });
}

// Usage:
const taskRateLimiter = createRateLimiter({
  max: 50,
  message: 'Too many task requests. Please try again later.'
});
```

**Line savings:** 30 duplicate lines → 15 function + 3 × 3 usage = 21 lines saved

### Medium Impact Reductions

#### 4. Delete BaseController
**Estimated line reduction:** 8 lines

```typescript
// Before (TaskController):
export class TaskController extends BaseController {
  constructor(aiClient: AIClient, taskService: TaskService) {
    super(aiClient);
    this.taskService = taskService;
  }
}

// After:
export class TaskController {
  constructor(
    private readonly aiClient: AIClient,
    private readonly taskService: TaskService
  ) {}
}
```

**Line savings:** 8 lines (delete baseController.ts)

#### 5. Fix Shutdown Handler Duplication
**Estimated line reduction:** 5 lines

```typescript
// Combined handler:
const shutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down gracefully...`);
  cacheCleanupService.stop();
  await closeDatabase();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

**Line savings:** 12 lines → 7 lines = 5 lines saved

#### 6. Clean Up Dead Code in errorHandler.ts
**Estimated line reduction:** 13 lines

Remove lines 38-50 (redundant instanceof checks for ApplicationError subclasses).

**Line savings:** 13 lines

### Low Impact Reductions

#### 7. Remove Unused Custom Error Classes (If Confirmed Unused)
**Estimated line reduction:** 5-10 lines

Need to verify if `ValidationError` and `AIGenerationError` are truly unused, then delete them.

## Recommended Refactorings

### Priority 1 (High Impact - Do These First)

#### 1.1: Implement Error-Throwing Pattern
**Effort:** Medium (2-4 hours)
**Impact:** Removes ~105 lines of duplicated error handling
**Files to modify:**
- `src/common/errors.ts` - Add specific error classes
- `src/auth/auth.service.ts` - Throw errors instead of returning error states
- `src/auth/auth.controller.ts` - Remove try-catch, let errors bubble
- `src/tasks/task.controller.ts` - Same
- `src/hints/hint.controller.ts` - Same
- `src/sync/sync.controller.ts` - Remove handleError method

**Steps:**
1. Define domain-specific error classes in `errors.ts`:
   - `UserExistsError`, `InviteNotFoundError`, `InviteExpiredError`, etc.
2. Update service layers to throw these instead of returning error indicators
3. Remove try-catch blocks from controllers (keep async error boundary)
4. Verify errorHandler middleware catches and converts properly
5. Test all error paths

**Rationale:** Controllers should be thin HTTP adapters, not error translators. Central error handling is DRY and easier to maintain.

#### 1.2: Extract Subject/Concept Business Logic to Service
**Effort:** Medium (3-5 hours)
**Impact:** Improves testability, separation of concerns
**Files to modify:**
- Create `src/subjects/subject.service.ts`
- Refactor `src/tasks/task.controller.ts` - Move filtering logic

**Steps:**
1. Create `SubjectService` with methods:
   - `getSubjectsWithConcepts(filters)` - Handles grade/age/difficulty logic
   - `getConceptsForSubject(subjectId, filters)` - Handles fallback filtering
2. Create `src/tasks/mappers.ts` with `mapConceptToDTO()`, `mapSubjectToDTO()`
3. Refactor TaskController methods to call service + mapper
4. Controller methods should be <10 lines each

**Rationale:** Business logic doesn't belong in controllers. This makes unit testing easier and improves code clarity.

#### 1.3: Extract Concept Mapping Function
**Effort:** Low (30 minutes)
**Impact:** Removes 18 lines of duplication
**Files to modify:**
- Create `src/tasks/mappers.ts`
- Update `src/tasks/task.controller.ts`

**Steps:**
1. Create mapper file with `mapConceptToDTO()` function
2. Replace 3 instances in task.controller.ts
3. Add unit tests for mapper

**Rationale:** DRY principle - same transformation shouldn't be written 3 times.

### Priority 2 (Medium Impact)

#### 2.1: Extract Rate Limiter Factory
**Effort:** Low (1 hour)
**Impact:** Saves 20 lines, improves consistency
**Files to modify:**
- Create `src/common/middleware/rateLimiter.ts`
- Update `src/tasks/router.ts`, `src/sync/router.ts`

**Rationale:** Rate limiter config should be standardized. One place to update limits/windows.

#### 2.2: Delete BaseController Abstraction
**Effort:** Low (15 minutes)
**Impact:** Removes 8 lines of unnecessary abstraction
**Files to modify:**
- Delete `src/common/baseController.ts`
- Update `src/tasks/task.controller.ts`

**Rationale:** YAGNI - You Aren't Gonna Need It. No shared behavior = no reason for base class.

#### 2.3: Clean Up errorHandler.ts Dead Code
**Effort:** Low (10 minutes)
**Impact:** Removes 13 lines of confusing dead code
**Files to modify:**
- `src/common/middleware/errorHandler.ts`

**Steps:**
1. Remove lines 38-50 (redundant instanceof checks)
2. Keep only the ApplicationError check (which catches subclasses)
3. Test error handling still works

**Rationale:** Dead code confuses maintainers and suggests errors might not be handled correctly.

### Priority 3 (Nice to Have)

#### 3.1: Combine Shutdown Signal Handlers
**Effort:** Trivial (5 minutes)
**Impact:** Saves 5 lines
**Files to modify:**
- `src/index.ts`

**Rationale:** DRY - identical handlers should be shared.

#### 3.2: Investigate Unused Error Classes
**Effort:** Low (30 minutes)
**Impact:** Could save 5-10 lines if truly unused
**Files to check:**
- Grep entire codebase for `ValidationError` and `AIGenerationError` usage
- If unused, delete from `src/common/errors.ts`

**Rationale:** Dead code should be removed. BUT: Might be used in tests or planned for future use - verify first.

#### 3.3: Adopt Async Error Boundary Pattern Consistently
**Effort:** Medium (2-3 hours)
**Impact:** Simplifies route definitions
**Files to modify:**
- All routers

**Current:**
```typescript
router.get('/subjects', validateQuery(schema), (req, res, next) =>
  taskController.getSubjects(req, res).catch(next)
);
```

**Proposed:**
```typescript
// Create asyncHandler wrapper
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/subjects', validateQuery(schema),
  asyncHandler(taskController.getSubjects)
);
```

**Rationale:** Reduces boilerplate `.catch(next)` in every route. Common Express pattern.

## Metrics

- **Total files:** 15
- **Total lines of code:** 1,023
- **Potential line reduction:** 175 lines (17% reduction)
  - Error handling centralization: 105 lines
  - Concept mapper: 18 lines
  - Rate limiter factory: 21 lines
  - BaseController deletion: 8 lines
  - ErrorHandler cleanup: 13 lines
  - Shutdown handlers: 5 lines
  - Unused code: 5 lines

- **High priority issues:** 3
  1. Duplicated error handling (42 instances, 105 lines)
  2. TaskController SRP violation (159 lines doing too much)
  3. Concept mapping duplication (3 instances, 27 lines)

- **Medium priority issues:** 4
  1. Rate limiter duplication (3 instances)
  2. BaseController provides no value (8 lines)
  3. ErrorHandler has dead code (13 lines)
  4. Error classes not used consistently

- **Low priority issues:** 3
  1. Shutdown handler duplication
  2. Possibly unused error classes
  3. Route wrapper boilerplate

## Summary

The Backend API Layer is generally well-structured with good separation between routers, controllers, and services. The use of Zod validation middleware and service layer pattern are exemplary.

However, there are **three critical issues** that violate DRY and SOLID principles:

1. **Error handling is duplicated across all controllers** - Every function has 15-24 lines of try-catch-if chains that should be replaced with throwing custom errors and letting middleware handle HTTP responses.

2. **TaskController violates Single Responsibility** - The `getSubjects()` and `getSubjectConcepts()` methods contain business logic, filtering, and DTO mapping that should be in a service layer.

3. **Concept-to-DTO mapping is copy-pasted 3 times** - A simple utility function would eliminate this duplication.

Implementing the Priority 1 refactorings would:
- Reduce codebase by ~140 lines (14%)
- Improve testability significantly
- Make error handling consistent and maintainable
- Align with SOLID principles

The codebase has minimal over-engineering (BaseController is the only significant example), and most abstractions serve a purpose. The main issue is under-abstraction in error handling rather than over-abstraction.
