# Zod Validation Migration Design

**Date:** 2025-11-15
**Status:** Approved
**Goal:** Replace manual validation with Zod schemas to reduce code, improve type safety, and establish single source of truth for validation and types

---

## Executive Summary

The backend currently uses a mix of Zod schemas (for task requests, sync, config) and manual validation (for auth, query parameters, invites). This design establishes Zod as the **single source of truth** for all API validation and TypeScript types, eliminating ~130 lines of repetitive validation code while strengthening type safety.

**Key Changes:**
- Create reusable validation middleware (`validateBody`, `validateQuery`, `validateParams`)
- Define comprehensive Zod schemas colocated with controllers
- Infer TypeScript types from Zod schemas (eliminate duplicate interfaces)
- Remove all manual validation code from controllers
- Maintain existing JSON schemas for AI providers (no changes needed)

---

## Current State Analysis

### Already Using Zod ✅
- Task requests (`src/tasks/types.ts:taskRequestSchema`)
- Sync data (`src/sync/sync.schema.ts`)
- Configuration (`src/config/ai.ts`, `src/config/server.ts`)
- Content validation (`src/prompts/schemas.ts`)

### Manual Validation ⚠️
1. **Auth Controller** (`src/auth/auth.controller.ts`)
   - UUID regex validation: `Lines 23-27`
   - String type checks: `Lines 13-21, 121-131, 169-179`
   - ~50 lines of manual validation

2. **Task Controller** (`src/tasks/task.controller.ts`)
   - Grade/age/difficulty filters in `getSubjects()`: `Lines 22-42`
   - Similar validation in `getSubjectConcepts()`: `Lines 147-174`
   - ~40 lines of manual validation

3. **Invite Controller** (`src/invites/invite.controller.ts`)
   - String type checks: `Lines 10-32`
   - ~10 lines of manual validation

4. **Weak Typing**
   - `TaskContext.solution: any` in `src/cache/taskCache.ts`

---

## Architecture Design

### Schema Organization

**Decision:** Colocate schemas with controllers

```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.schema.ts       ← NEW
│   ├── auth.service.ts
│   └── auth.middleware.ts
├── tasks/
│   ├── task.controller.ts
│   ├── task.schema.ts       ← NEW
│   └── types.ts (existing)
├── invites/
│   ├── invite.controller.ts
│   └── invite.schema.ts     ← NEW
├── sync/
│   └── sync.schema.ts (exists)
└── common/
    └── middleware/
        └── validation.ts    ← NEW
```

### Validation Flow

```
Request
  ↓
Validation Middleware (validateBody/Query/Params)
  ↓
Zod Schema.parse()
  ↓ (success)
Controller (strongly-typed, validated data)
  ↓
Business Logic

  ↓ (ZodError)
Error Handler Middleware (already exists)
  ↓
400 Response with structured errors
```

### Type Inference Strategy

**Principle:** Define once, infer everywhere

```typescript
// Define Zod schema
export const registerSchema = z.object({
  userId: z.string().uuid(),
  inviteCode: z.string().regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/i)
});

// Infer TypeScript type (replaces manual interface)
export type RegisterRequest = z.infer<typeof registerSchema>;

// Use in controller (typed automatically)
async register(req: Request, res: Response) {
  const { userId, inviteCode } = req.body; // TypeScript knows these types
}
```

---

## Detailed Component Design

### 1. Validation Middleware

**File:** `src/common/middleware/validation.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Validates request body against a Zod schema
 * Throws ZodError on validation failure (caught by error handler)
 */
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

/**
 * Validates query parameters against a Zod schema
 * Handles string-to-number coercion automatically
 */
export const validateQuery = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validates URL parameters against a Zod schema
 */
export const validateParams = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
};
```

**Benefits:**
- Reusable across all routes
- Consistent error handling
- Type-safe validation
- Zero boilerplate in controllers

### 2. Auth Schemas

**File:** `src/auth/auth.schema.ts`

```typescript
import { z } from 'zod';

// Request body schemas
export const registerSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
  inviteCode: z.string().regex(
    /^[A-Z0-9]{4}-[A-Z0-9]{4}$/i,
    'Invalid invite code format'
  )
});

export const loginSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID')
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

// URL parameter schemas
export const userIdParamSchema = z.object({
  userId: z.string().uuid()
});

// Inferred types (replace manual interfaces)
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RefreshRequest = z.infer<typeof refreshSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
```

**Replaces:**
- UUID regex validation (Lines 23-27 in auth.controller.ts)
- Manual type checks (Lines 13-21, 121-131, 169-179)
- Manual TypeScript interfaces

### 3. Task Schemas

**File:** `src/tasks/task.schema.ts`

```typescript
import { z } from 'zod';
import { subjectRegistry } from '../subjects/subjectRegistry';
import { taskTypeRegistry } from './types/registry';

// Shared filter schema for reuse across endpoints
const taskFilterSchema = z.object({
  grade: z.coerce.number().int().min(1).max(13).optional(),
  age: z.coerce.number().int().min(1).max(100).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  language: z.string().min(2).max(5).optional()
});

// GET /subjects query params
export const getSubjectsQuerySchema = taskFilterSchema;

// GET /subjects/:subject/concepts query params
export const getConceptsQuerySchema = taskFilterSchema.extend({
  source: z.enum(['official', 'community', 'all']).default('all')
});

// URL parameter schemas
export const subjectParamSchema = z.object({
  subject: z.string().refine(
    val => subjectRegistry.get(val) !== undefined,
    'Invalid subject'
  )
});

// Inferred types
export type TaskFilterQuery = z.infer<typeof taskFilterSchema>;
export type GetSubjectsQuery = z.infer<typeof getSubjectsQuerySchema>;
export type GetConceptsQuery = z.infer<typeof getConceptsQuerySchema>;
export type SubjectParam = z.infer<typeof subjectParamSchema>;
```

**Key Features:**
- `z.coerce.number()` handles string→number conversion for query params
- Schema composition (`.extend()`) for code reuse
- Registry validation integrated into schemas
- Enum validation prevents typos

**Replaces:**
- Manual grade/age/difficulty validation (Lines 22-42, 147-174 in task.controller.ts)
- `parseInt()` and `isNaN()` checks
- Manual enum validation

### 4. Invite Schemas

**File:** `src/invites/invite.schema.ts`

```typescript
import { z } from 'zod';

export const validateInviteSchema = z.object({
  code: z.string().regex(
    /^[A-Z0-9]{4}-[A-Z0-9]{4}$/i,
    'Invalid invite code format'
  )
});

// Inferred type
export type ValidateInviteRequest = z.infer<typeof validateInviteSchema>;
```

**Replaces:**
- Manual type checks (Lines 10-32 in invite.controller.ts)

### 5. Cache Type Enhancement

**File:** `src/cache/taskCache.ts`

```typescript
import { z } from 'zod';

// Define TaskContext as Zod schema
export const taskContextSchema = z.object({
  taskId: z.string(),
  subject: z.string(),
  concept: z.string(),
  taskType: z.string(),
  grade: z.number(),
  difficulty: z.string(),
  language: z.string(),
  generatedTask: z.string(),
  solution: z.unknown(), // Can be made more specific based on task type
  hintsGenerated: z.array(z.string()),
  createdAt: z.number()
});

// Replace manual interface with inferred type
export type TaskContext = z.infer<typeof taskContextSchema>;
```

**Benefits:**
- Eliminates `solution: any` weak typing
- Runtime validation option for cache data if needed
- Single source of truth for cache structure

---

## Route Integration

### Before
```typescript
// src/auth/auth.routes.ts
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
```

### After
```typescript
// src/auth/auth.routes.ts
import { validateBody, validateParams } from '../common/middleware/validation';
import { registerSchema, loginSchema, refreshSchema, userIdParamSchema } from './auth.schema';

router.post('/register',
  validateBody(registerSchema),
  authController.register
);

router.post('/login',
  validateBody(loginSchema),
  authController.login
);

router.post('/refresh',
  validateBody(refreshSchema),
  authController.refresh
);

// Protected routes with params
router.get('/sync/:userId',
  requireAuth,
  validateParams(userIdParamSchema),
  requireOwnUserId,
  syncController.get
);
```

---

## Controller Simplification

### Before: Auth Controller
```typescript
async register(req: Request, res: Response) {
  const { userId, inviteCode } = req.body;

  // 15+ lines of manual validation
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  if (!inviteCode || typeof inviteCode !== 'string') {
    return res.status(400).json({ error: 'Invalid inviteCode format' });
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    return res.status(400).json({ error: 'userId must be a valid UUID' });
  }

  // ... actual business logic
}
```

### After: Auth Controller
```typescript
async register(req: Request, res: Response) {
  const { userId, inviteCode } = req.body; // Already validated & typed

  // 0 lines of validation - just business logic
  try {
    const tokens = await authService.registerUser(userId, inviteCode);
    res.status(201).json(tokens);
  } catch (error) {
    // Error handling
  }
}
```

**Code Reduction:** ~15 lines removed per endpoint × 3 auth endpoints = ~45 lines

---

## Error Handling

The existing error handler (`src/common/middleware/errorHandler.ts`) already catches ZodError and returns structured responses:

```typescript
if (error instanceof ZodError) {
  response = {
    error: 'Validation Error',
    details: error.errors,
    status: 400
  };
}
```

**Example Error Response:**
```json
{
  "error": "Validation Error",
  "details": [
    {
      "code": "invalid_string",
      "message": "userId must be a valid UUID",
      "path": ["userId"],
      "validation": "uuid"
    }
  ]
}
```

**No changes needed** - existing error handler is already Zod-aware.

---

## Migration Plan

### Phase 1: Create Validation Middleware
**File:** `src/common/middleware/validation.ts`

Create reusable middleware functions that will be used across all routes.

**Effort:** 30 minutes
**Risk:** Low (isolated utility)

---

### Phase 2: Invites (Lowest Risk)
**Files:**
- Create: `src/invites/invite.schema.ts`
- Modify: `src/invites/invite.routes.ts` (add validation middleware)
- Modify: `src/invites/invite.controller.ts` (remove manual validation)

**Changes:**
1. Define `validateInviteSchema`
2. Add `validateBody(validateInviteSchema)` to `/validate` route
3. Remove type checks from controller

**Effort:** 30 minutes
**Risk:** Low (simple schema, low traffic endpoint)

---

### Phase 3: Task Query Parameters
**Files:**
- Create: `src/tasks/task.schema.ts`
- Modify: `src/tasks/task.routes.ts` (add validation middleware)
- Modify: `src/tasks/task.controller.ts` (remove manual validation)

**Changes:**
1. Define `getSubjectsQuerySchema`, `getConceptsQuerySchema`, `subjectParamSchema`
2. Add `validateQuery()` and `validateParams()` to routes
3. Remove manual grade/age/difficulty validation from `getSubjects()` and `getSubjectConcepts()`

**Effort:** 1 hour
**Risk:** Low (non-auth, isolated to query parameters)

---

### Phase 4: Auth (Highest Impact)
**Files:**
- Create: `src/auth/auth.schema.ts`
- Modify: `src/auth/auth.routes.ts` (add validation middleware)
- Modify: `src/auth/auth.controller.ts` (remove all manual validation)

**Changes:**
1. Define `registerSchema`, `loginSchema`, `refreshSchema`, `userIdParamSchema`
2. Add `validateBody()` and `validateParams()` to all auth routes
3. Remove ~50 lines of manual validation from controller methods

**Effort:** 1.5 hours
**Risk:** Medium (critical auth paths - requires thorough testing)

**Testing Required:**
- Registration flow with valid/invalid UUIDs
- Registration with valid/invalid invite codes
- Login with valid/invalid UUIDs
- Token refresh with valid/invalid tokens
- Error message quality (ensure user-friendly)

---

### Phase 5: Type Cleanup
**Files:**
- Modify: `src/cache/taskCache.ts` (convert interface to Zod schema)
- Remove: Any duplicate TypeScript interfaces replaced by `z.infer<>`

**Changes:**
1. Define `taskContextSchema`
2. Replace `interface TaskContext` with `type TaskContext = z.infer<typeof taskContextSchema>`
3. Search for duplicate interfaces and remove them

**Effort:** 30 minutes
**Risk:** Low (type-only changes)

---

## Testing Strategy

### Automated Testing
- Run existing backend test suite after each phase
- Ensure all tests pass before proceeding

### Manual Testing (Per Phase)
1. **Test valid inputs** - ensure business logic works
2. **Test invalid inputs** - verify validation errors are descriptive
3. **Test edge cases** - empty strings, wrong types, out-of-range numbers
4. **Test error responses** - confirm ZodError details are user-friendly

### Critical Auth Testing
- Valid UUID + valid invite code → success
- Invalid UUID format → 400 with "must be a valid UUID"
- Invalid invite code format → 400 with "Invalid invite code format"
- Missing fields → 400 with specific field errors
- Expired/used invite codes → proper business logic errors (not validation errors)

---

## Benefits Summary

### Code Reduction
- **Auth controller:** ~50 lines removed
- **Task controller:** ~40 lines removed
- **Invite controller:** ~10 lines removed
- **Manual interfaces:** ~30 lines removed
- **Total:** ~130 lines removed

### Type Safety Improvements
- Eliminate `any` types (e.g., `TaskContext.solution`)
- Automatic type inference from validation rules
- Catch type errors at compile time
- IDE autocomplete for validated data

### Developer Experience
- Single source of truth (Zod schema = TypeScript type)
- Reusable validation middleware (zero boilerplate)
- Consistent error messages
- Less code to maintain

### Runtime Safety
- Guaranteed validation before controller execution
- Structured error responses
- No silent type coercion bugs
- Registry validation integrated into schemas

---

## Design Decisions & Constraints

### Decisions Made
1. **Strict schema-first approach** - Use `.parse()` everywhere (fail fast)
2. **Colocate schemas** - Schema files next to controllers for clarity
3. **Keep AI JSON schemas separate** - No conversion to Zod (they work well as-is)
4. **Trust database integrity** - No Zod validation on DB query results
5. **Reusable middleware** - Create `validateBody/Query/Params` utilities

### Out of Scope
- Converting AI provider JSON schemas to Zod (unnecessary complexity)
- Database result validation (trust DB constraints)
- Frontend validation (separate concern)
- Existing Zod schemas (already working well)

### Constraints
- Maintain backward compatibility with API responses
- No changes to existing error handler structure
- Preserve existing test suite (all tests must pass)
- AI provider integrations remain unchanged

---

## Success Criteria

1. ✅ All manual validation code removed from controllers
2. ✅ All TypeScript types inferred from Zod schemas (no duplicate interfaces)
3. ✅ All backend tests pass
4. ✅ Manual testing confirms validation errors are user-friendly
5. ✅ Code reduction: minimum 100 lines removed
6. ✅ Zero runtime errors introduced
7. ✅ Existing API contract preserved (response formats unchanged)

---

## Rollback Plan

If issues arise during migration:

1. **Per-phase rollback:** Each phase is independent - can revert individual commits
2. **Route-level rollback:** Can disable validation middleware on specific routes
3. **Full rollback:** Git revert to pre-migration state

**Mitigation:** Migrate one phase at a time, test thoroughly, commit after each phase.

---

## Future Enhancements (Post-Migration)

1. **Response validation** - Add Zod schemas for API responses (OpenAPI integration)
2. **Enhanced cache validation** - Optionally validate cached data on retrieval
3. **Database query builders** - Type-safe query builders with Zod integration
4. **Auto-generated API docs** - Use Zod schemas to generate OpenAPI/Swagger specs

---

## Conclusion

This migration establishes Zod as the single source of truth for validation and types across the backend. By creating reusable validation middleware and comprehensive schemas, we eliminate ~130 lines of repetitive code while significantly improving type safety and developer experience.

The phased approach minimizes risk by starting with low-traffic endpoints (invites) and ending with critical paths (auth), ensuring thorough testing at each step.

**Next Steps:**
1. Review and approve this design
2. Set up git worktree for isolated development
3. Create detailed implementation plan
4. Execute migration phase by phase
