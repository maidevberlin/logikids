# Backend Authentication & Authorization Analysis

**Date:** 2025-11-16
**Scope:** Authentication, Authorization, and Invite System
**Focus:** DRY, SOLID, Minimal Code Principles

## Executive Summary

The authentication and authorization domain demonstrates a generally clean architecture with good separation of concerns. The code uses modern patterns including Zod schemas, middleware composition, and service-oriented design. However, several critical issues exist around error handling, service instantiation, deprecation, and violation of SOLID principles.

### Health Score: 6.5/10

**Strengths:**
- Clean schema validation using Zod
- Proper JWT implementation with token verification
- Good middleware composition pattern
- Database transaction handling in critical flows
- Clear separation between auth and invite concerns

**Critical Issues:**
1. **Multiple service instances violating Singleton pattern** - AuthService and InviteService instantiated multiple times across controllers and middleware
2. **Inconsistent error handling pattern** - Mix of error codes, string matching, and ApplicationError classes
3. **Deprecated code in production** - InviteService.validateAndUse deprecated but still exposed via API endpoint

---

## Detailed Analysis

### 1. DRY Violations

#### CRITICAL: Error Message Duplication
**Location:** `auth.controller.ts`, `auth.service.ts`
**Severity:** High

Error messages and status code mappings are duplicated across controller and service layers:

```typescript
// auth.controller.ts - register()
if (error.message === 'User ID already exists') {
  res.status(409).json({ error: error.message })
}
if (error.message === 'Invite code not found') {
  res.status(404).json({ error: error.message })
}
if (error.message === 'Invite code expired' || error.message === 'Invite code already used') {
  res.status(400).json({ error: error.message })
}

// Similar pattern repeated in login(), refresh(), with slight variations
```

**Problem:**
- Error messages hardcoded in service as strings
- Controller must string-match error messages to determine HTTP status codes
- Same pattern duplicated across 3+ controller functions
- Brittle: typo in error message breaks error handling
- No type safety for error codes

**Impact:**
- Maintenance burden: changing error message requires updates in 2+ places
- Risk of inconsistent error responses
- Violates DRY: error-to-status mapping logic repeated

#### HIGH: Database Query Pattern Duplication
**Location:** `auth.service.ts` - `renewAccessToken()` and `login()`
**Severity:** Medium

Nearly identical database query and validation logic:

```typescript
// renewAccessToken() - lines 186-210
const result = await pool.query<UserAccount & { revoked: boolean }>(
  'SELECT user_id, invite_code, created_at, last_seen, revoked FROM user_accounts WHERE user_id = $1',
  [userId]
)

if (result.rows.length === 0) {
  throw new Error('Account not found')
}

const accountRow = result.rows[0]

if (accountRow.revoked) {
  throw new Error('Account has been revoked')
}

// login() - lines 218-232
// IDENTICAL CODE (only difference is what happens after validation)
```

**Problem:**
- 15 lines of code duplicated verbatim
- Both methods: fetch account, check exists, check revoked, update last_seen
- Violates DRY principle

**Impact:**
- Bug fixes require updating multiple locations
- Inconsistency risk if one is updated without the other

#### MEDIUM: Invite Code Normalization Duplication
**Location:** `auth.service.ts`, `invite.service.ts`
**Severity:** Low

```typescript
// auth.service.ts:28
const normalizedCode = inviteCode.toUpperCase().trim()

// invite.service.ts:32
const normalizedCode = code.toUpperCase().trim()
```

**Problem:**
- Same transformation logic in 2+ places
- No central utility function

#### MEDIUM: Timestamp Conversion Pattern
**Location:** Multiple service files
**Severity:** Low

```typescript
// auth.service.ts:173-178
return {
  ...result.rows[0],
  created_at: Number(result.rows[0].created_at),
  last_seen: Number(result.rows[0].last_seen)
}

// invite.service.ts:44-49
const invite = {
  ...result.rows[0],
  created_at: Number(result.rows[0].created_at),
  expires_at: Number(result.rows[0].expires_at),
  used_at: result.rows[0].used_at ? Number(result.rows[0].used_at) : null
}

// cli/invite-codes.ts:64-69
return result.rows.map(row => ({
  ...row,
  created_at: Number(row.created_at),
  expires_at: Number(row.expires_at),
  used_at: row.used_at ? Number(row.used_at) : null,
}))
```

**Problem:**
- PostgreSQL BIGINT conversion scattered across codebase
- No database layer abstraction for type conversion
- Violates DRY: repeated in 5+ locations

**Impact:**
- If PostgreSQL driver changes, requires updates in multiple files
- Inconsistent handling of NULL values

---

### 2. SOLID Violations

#### CRITICAL: Multiple Service Instances (Violates Singleton Pattern)
**Location:** `auth.controller.ts:5`, `auth.middleware.ts:4`, `invite.controller.ts:4`
**Severity:** High

```typescript
// auth.controller.ts
const authService = new AuthService()

// auth.middleware.ts
const authService = new AuthService()

// invite.controller.ts
const inviteService = new InviteService()
```

**Problem:**
- Each file creates its own service instance
- Services are stateless but instantiated multiple times
- No dependency injection
- Violates Singleton pattern for stateless services
- Makes testing difficult (can't inject mocks)

**Impact:**
- Memory waste (small but unnecessary)
- Cannot inject different implementations (testing, feature flags)
- Tight coupling to concrete implementations

#### HIGH: Single Responsibility Violation in AuthService
**Location:** `auth.service.ts`
**Severity:** Medium

AuthService has multiple responsibilities:

```typescript
export class AuthService {
  // User registration (business logic + invite validation)
  async register(userId: string, inviteCode: string)

  // Token generation (security)
  generateAccessToken(userId: string, inviteCode: string)

  // Token verification (security)
  verifyToken(token: string)

  // User validation (data access)
  async validateUser(userId: string)

  // User updates (data access)
  async updateLastSeen(userId: string)

  // User queries (data access)
  async getAccount(userId: string)

  // Token renewal (business logic + validation)
  async renewAccessToken(userId: string)

  // User login (business logic + validation)
  async login(userId: string)
}
```

**Responsibilities identified:**
1. **Token Management** - generateAccessToken, verifyToken
2. **User Repository** - validateUser, updateLastSeen, getAccount
3. **Business Logic** - register, login, renewAccessToken (orchestrate validation + token generation)

**Problem:**
- Single class handles 3 distinct concerns
- Violates Single Responsibility Principle
- Difficult to test individual concerns in isolation
- Changes to database schema affect token logic and vice versa

**Better structure:**
```
TokenService - generateAccessToken, verifyToken
UserRepository - validateUser, updateLastSeen, getAccount, findByUserId, checkRevoked
AuthBusinessLogic - register, login, renewAccessToken (uses TokenService + UserRepository)
```

#### MEDIUM: Open/Closed Principle Violation in Error Handling
**Location:** `auth.controller.ts`
**Severity:** Medium

```typescript
export async function register(req: RegisterRequestTyped, res: Response): Promise<void> {
  try {
    const result = await authService.register(userId, inviteCode)
    res.status(201).json({ ... })
  } catch (error) {
    if (error instanceof Error) {
      // Hardcoded string matching for error types
      if (error.message === 'User ID already exists') {
        res.status(409).json({ error: error.message })
        return
      }
      if (error.message === 'Invite code not found') {
        res.status(404).json({ error: error.message })
        return
      }
      // ... more string matching
    }
  }
}
```

**Problem:**
- Adding new error type requires modifying controller code
- Violates Open/Closed Principle (should be open for extension, closed for modification)
- Controller must know all possible service errors
- Cannot extend error handling without modifying existing code

**Better approach:**
```typescript
// Define error classes with status codes
class UserExistsError extends ApplicationError {
  constructor() { super('User ID already exists', 409) }
}

// Service throws typed errors
throw new UserExistsError()

// Controller catches ApplicationError and uses statusCode property
if (error instanceof ApplicationError) {
  res.status(error.statusCode).json({ error: error.message })
}
```

#### MEDIUM: Interface Segregation Violation
**Location:** `auth.middleware.ts` Express Request extension
**Severity:** Low

```typescript
declare global {
  namespace Express {
    interface Request {
      userId?: string
      inviteCode?: string  // Not used in most endpoints
    }
  }
}
```

**Problem:**
- `inviteCode` added to all Request objects but only used in specific scenarios
- Forces all routes to have `inviteCode` property even when irrelevant
- Violates Interface Segregation Principle (clients shouldn't depend on interfaces they don't use)

**Impact:**
- Minor: TypeScript allows optional properties, so no runtime issue
- Conceptual: pollutes Request interface with context-specific data

---

### 3. Minimal Code Violations

#### CRITICAL: Deprecated Code Still in Production
**Location:** `invite.service.ts:21-26`, `invite.controller.ts:10-28`
**Severity:** High

```typescript
/**
 * Validate invite code (no longer deletes - use auth.service.register instead)
 * @deprecated Use /api/auth/register endpoint instead
 */
async validateAndUse(code: string): Promise<{ valid: boolean; reason?: string }> {
  // This method is deprecated - registration now happens via auth.service
  console.warn('validateAndUse is deprecated. Use /api/auth/register endpoint instead.')
  return this.check(code)
}

// Still exposed via API endpoint:
router.post('/validate', validateBody(validateInviteSchema), validateInviteCode)
```

**Problem:**
- Deprecated method still exposed via public API endpoint
- Warning message in console (noise)
- Dead code: calls check() but no longer marks invite as used
- Misleading API endpoint name (suggests it validates AND uses, but only validates)

**Impact:**
- Clients may still use deprecated endpoint
- Confusion about which endpoint to use
- Maintenance burden keeping deprecated code alive
- Potential bugs if client expects invite to be marked as used

**Recommendation:**
- Remove `/api/invite/validate` endpoint entirely
- Remove `validateAndUse()` method
- Document breaking change if necessary

#### HIGH: Unnecessary Code in Middleware
**Location:** `auth.middleware.ts:47-49`
**Severity:** Low

```typescript
// Add userId and inviteCode to request for downstream handlers
req.userId = payload.userId
req.inviteCode = payload.inviteCode  // Never used downstream
```

**Problem:**
- `inviteCode` is extracted from JWT and added to request
- Grep of codebase shows `req.inviteCode` is never accessed anywhere
- Unnecessary code adding unused data to request

**Verification:**
```bash
grep -r "req.inviteCode" packages/backend/src
# Only found in auth.middleware.ts (assignment), never accessed
```

**Impact:**
- Minor performance: extra property assignment
- Code clutter
- Misleading: suggests inviteCode is used downstream

#### MEDIUM: Dead Code in CLI
**Location:** `cli/invite-codes.ts:72`
**Severity:** Low

Comment mentions "Used codes are automatically deleted" but this is incorrect:

```typescript
// Line 208 comment:
Note: Used codes are automatically deleted after successful validation.
```

**Reality:**
- Used codes are NOT deleted
- They are marked with `used_by` and `used_at` (migration 003)
- Comment is outdated from old implementation

**Impact:**
- Misleading documentation
- Confusion for operators using CLI

#### MEDIUM: Redundant Try-Catch in Controllers
**Location:** `auth.controller.ts` - all controller functions
**Severity:** Medium

Every controller function has identical error handling structure:

```typescript
export async function register(...) {
  try {
    const result = await authService.register(...)
    res.status(201).json({ ... })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'User ID already exists') {
        res.status(409).json({ error: error.message })
        return
      }
      // ... more error handling

      console.error('Registration error:', error)
      res.status(500).json({ error: 'Registration failed' })
      return
    }

    console.error('Unknown registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
}
```

**Problem:**
- 20+ lines of boilerplate per controller function
- Error handler middleware already exists (`errorHandler.ts`)
- Controllers manually handling errors instead of using centralized error handler
- All catch blocks have same structure: check error type → match string → send response

**Better approach:**
```typescript
// Service throws ApplicationError subclasses
throw new UserExistsError()

// Controller doesn't catch - let error propagate to error handler middleware
export async function register(...) {
  const result = await authService.register(...)
  res.status(201).json({ accessToken: result.accessToken, account: result.account })
}
```

**Impact:**
- 60+ lines of duplicated error handling code across 5 controller functions
- Inconsistent with error handler middleware pattern already in codebase
- Harder to maintain: error handling changes require updating multiple functions

---

### 4. Security Concerns

#### HIGH: JWT Secret Defaults to Weak Value
**Location:** `auth.service.ts:5`
**Severity:** High

```typescript
const JWT_SECRET = process.env.JWT_SECRET || 'logikids-dev-secret-change-in-production'
```

**Problem:**
- Default secret is hardcoded in source code
- If `JWT_SECRET` env var not set, uses predictable default
- Default value committed to Git (publicly visible)
- Allows token forgery if default is used

**Mitigation:**
- Code comment says "change in production"
- Docker setup should enforce JWT_SECRET via env var
- But: no runtime validation that JWT_SECRET is set

**Recommendation:**
```typescript
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set')
}
```

#### MEDIUM: Token Expiry Time Not Configurable
**Location:** `auth.service.ts:6`
**Severity:** Low

```typescript
const ACCESS_TOKEN_EXPIRES_IN = '1h' // Short-lived access token
```

**Problem:**
- Hardcoded expiry time
- Cannot adjust for different environments (dev vs prod)
- No way to increase/decrease expiry without code change

**Impact:**
- Minor: 1 hour is reasonable default
- Flexibility: may want longer expiry for dev, shorter for production

#### LOW: No Token Blacklisting on Revocation
**Location:** `auth.service.ts` - `validateUser()`, `renewAccessToken()`, `login()`
**Severity:** Low

**Problem:**
- When account is revoked (`revoked = TRUE`), existing JWTs remain valid until expiry
- No token blacklist or refresh token invalidation
- User could have valid JWT for up to 1 hour after revocation

**Current behavior:**
- `requireAuth` middleware calls `authService.validateUser()` on every request
- Returns false if account is revoked
- So: revoked users cannot use API even with valid JWT

**Reality check:**
- Actually handles this correctly via per-request validation
- No issue here

**Conclusion:** Not a security issue - revocation is enforced on every request.

---

### 5. Architecture & Design Issues

#### HIGH: No Dependency Injection
**Location:** All controllers and middleware
**Severity:** Medium

```typescript
// auth.controller.ts
const authService = new AuthService()

export async function register(req, res) {
  await authService.register(...)
}
```

**Problem:**
- Controllers create their own dependencies
- Cannot inject mock services for testing
- Cannot swap implementations (e.g., different auth providers)
- Tight coupling to concrete AuthService class

**Better approach:**
```typescript
export class AuthController {
  constructor(private authService: IAuthService) {}

  async register(req, res) {
    await this.authService.register(...)
  }
}

// In router:
const authService = new AuthService()
const controller = new AuthController(authService)
router.post('/register', controller.register)
```

**Impact:**
- Difficult to unit test controllers without hitting database
- Cannot easily extend or replace authentication logic
- Violates Dependency Inversion Principle (depend on abstractions, not concretions)

#### MEDIUM: Transaction Handling Only in One Place
**Location:** `auth.service.ts:register()`
**Severity:** Medium

```typescript
async register(userId: string, inviteCode: string) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    // ... multiple operations
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
```

**Good:** Register operation properly uses transaction for atomicity

**Inconsistency:**
- `login()` does NOT use transaction but calls `updateLastSeen()` separately
- `renewAccessToken()` does NOT use transaction but calls `updateLastSeen()` separately
- Risk: last_seen update could fail after successful token generation

**Impact:**
- Minor: last_seen is non-critical data
- Inconsistency: why transactions for register but not login/refresh?

#### MEDIUM: Missing Indexes on Frequently Queried Fields
**Location:** Database migrations
**Severity:** Low

**Existing indexes:**
```sql
-- 002_invite_codes.sql
CREATE INDEX idx_invite_codes_expires_at ON invite_codes(expires_at);

-- 003_user_accounts.sql
CREATE INDEX idx_user_accounts_invite ON user_accounts(invite_code);
CREATE INDEX idx_invite_codes_used_by ON invite_codes(used_by);

-- 005_add_revoked_to_accounts.sql
CREATE INDEX idx_user_accounts_revoked ON user_accounts(revoked);
```

**Missing indexes:**
- No index on `user_accounts(user_id)` - but this is the PRIMARY KEY, so automatically indexed
- No composite index for common query patterns

**Queries performed:**
```sql
-- auth.service.ts - called on every authenticated request
SELECT user_id, revoked FROM user_accounts WHERE user_id = $1
```

**Conclusion:** PRIMARY KEY provides index, so no issue here.

---

### 6. Testing & Testability

#### CRITICAL: No Tests Found
**Location:** Backend codebase
**Severity:** High

```bash
find packages/backend -name "*.test.ts" -o -name "*.spec.ts" | grep -E "(auth|invite)"
# No results
```

**Problem:**
- Authentication and authorization are security-critical
- No unit tests for auth service
- No integration tests for auth endpoints
- No tests for invite validation logic
- Cannot refactor with confidence

**Impact:**
- High risk of regression when making changes
- Cannot verify edge cases (expired tokens, revoked accounts, etc.)
- No documentation of expected behavior via tests

**Recommendation:**
Priority tests to write:
1. JWT token generation and verification
2. Invite code validation (not found, expired, already used)
3. User registration flow (happy path + all error cases)
4. Middleware authentication (valid token, expired token, invalid token)
5. Authorization (requireOwnUserId with mismatched userId)

#### HIGH: Hard to Test Due to Lack of Dependency Injection
**Location:** Controllers and middleware
**Severity:** Medium

**Problem:**
- Controllers create their own service instances
- Cannot inject mock services without complex mocking
- Middleware creates AuthService instance at module level
- Cannot test controller logic without database

**Example difficulty:**
```typescript
// Want to test: does register() return 409 for duplicate userId?
// Problem: authService.register() hits real database
// No way to inject mock that throws 'User ID already exists' error
```

---

## Recommendations

### Priority 1: Critical Issues

1. **Create Custom Error Classes**
   - Define error hierarchy extending ApplicationError
   - Each error class has statusCode property
   - Service throws typed errors, controller catches ApplicationError
   - Eliminates string matching and error code duplication

   **Files to change:**
   - `src/common/errors.ts` - add UserExistsError, InviteNotFoundError, etc.
   - `src/auth/auth.service.ts` - throw typed errors
   - `src/auth/auth.controller.ts` - remove error string matching, use error.statusCode

2. **Remove Deprecated Code**
   - Remove `/api/invite/validate` endpoint
   - Remove `InviteService.validateAndUse()` method
   - Update CLI help text to remove incorrect comment about deletion

   **Files to change:**
   - `src/invites/router.ts` - remove validate route
   - `src/invites/invite.controller.ts` - remove validateInviteCode function
   - `src/invites/invite.service.ts` - remove validateAndUse method
   - `src/cli/invite-codes.ts` - fix comment on line 208

3. **Enforce JWT_SECRET Validation**
   - Add runtime check that JWT_SECRET is set
   - Throw error on startup if missing
   - Remove default fallback value

   **Files to change:**
   - `src/auth/auth.service.ts` - add validation at module level

4. **Implement Dependency Injection**
   - Convert controllers to classes with constructor injection
   - Create singleton instances in router files
   - Makes testing possible

   **Files to change:**
   - `src/auth/auth.controller.ts` - convert to AuthController class
   - `src/auth/router.ts` - instantiate AuthController, pass to routes
   - `src/auth/auth.middleware.ts` - accept AuthService in factory function
   - `src/invites/invite.controller.ts` - convert to InviteController class
   - `src/invites/router.ts` - instantiate InviteController

### Priority 2: High-Value Improvements

5. **Extract Reusable Account Validation Logic**
   - Create `getUserAccountValidated()` helper method
   - Used by login, renewAccessToken, and any other methods needing validated account
   - Eliminates 15 lines of duplicated code

   **Files to change:**
   - `src/auth/auth.service.ts` - add private helper method, refactor login/renewAccessToken

6. **Simplify Controller Error Handling**
   - Remove try-catch from controller functions
   - Let errors propagate to error handler middleware
   - Requires custom error classes from Priority 1

   **Files to change:**
   - `src/auth/auth.controller.ts` - remove try-catch from all functions
   - `src/common/middleware/errorHandler.ts` - ensure handles all ApplicationError subclasses

7. **Split AuthService Responsibilities**
   - Create TokenService for JWT operations
   - Create UserRepository for database operations
   - Keep AuthService as orchestrator (uses TokenService + UserRepository)

   **Files to create:**
   - `src/auth/token.service.ts` - generateAccessToken, verifyToken
   - `src/auth/user.repository.ts` - validateUser, updateLastSeen, getAccount, findByUserId

   **Files to change:**
   - `src/auth/auth.service.ts` - refactor to use TokenService + UserRepository

8. **Add Database Type Conversion Layer**
   - Create utility function for converting BIGINT to number
   - Apply consistently across all database queries

   **Files to create:**
   - `src/database/types.ts` - convertBigIntFields<T>(row: T, fields: string[]): T

   **Files to change:**
   - All service files querying database with BIGINT columns

### Priority 3: Polish & Cleanup

9. **Remove Unused Code**
   - Remove `req.inviteCode` from middleware (never used)
   - Update CLI help text to match reality (codes not auto-deleted)

   **Files to change:**
   - `src/auth/auth.middleware.ts` - remove line 49
   - `src/cli/invite-codes.ts` - fix help text

10. **Create Invite Code Normalization Utility**
    - Single function for normalizing invite codes
    - Used by all services

    **Files to create:**
    - `src/invites/invite.utils.ts` - normalizeInviteCode(code: string): string

    **Files to change:**
    - `src/auth/auth.service.ts` - use normalizeInviteCode
    - `src/invites/invite.service.ts` - use normalizeInviteCode

11. **Add Configuration for Token Expiry**
    - Load from environment variable or config file
    - Allow different values per environment

    **Files to change:**
    - `src/auth/auth.service.ts` - read from config instead of hardcoding

12. **Write Comprehensive Tests**
    - Unit tests for TokenService, UserRepository
    - Integration tests for AuthService
    - API endpoint tests for auth routes
    - Middleware tests for requireAuth and requireOwnUserId

    **Files to create:**
    - `src/auth/token.service.test.ts`
    - `src/auth/user.repository.test.ts`
    - `src/auth/auth.service.test.ts`
    - `src/auth/auth.middleware.test.ts`
    - `src/auth/router.test.ts`

---

## Code Examples

### Example 1: Custom Error Classes (Priority 1)

**File:** `src/common/errors.ts`
```typescript
// Add to existing errors.ts
export class UserExistsError extends ApplicationError {
  constructor() {
    super('User ID already exists', 409)
  }
}

export class InviteNotFoundError extends ApplicationError {
  constructor() {
    super('Invite code not found', 404)
  }
}

export class InviteExpiredError extends ApplicationError {
  constructor() {
    super('Invite code expired', 400)
  }
}

export class InviteAlreadyUsedError extends ApplicationError {
  constructor() {
    super('Invite code already used', 400)
  }
}

export class AccountNotFoundError extends ApplicationError {
  constructor() {
    super('Account not found', 404)
  }
}

export class AccountRevokedError extends ApplicationError {
  constructor() {
    super('Account has been revoked', 403)
  }
}

export class TokenExpiredError extends ApplicationError {
  constructor() {
    super('Token expired', 401)
  }
}

export class InvalidTokenError extends ApplicationError {
  constructor() {
    super('Invalid token', 401)
  }
}
```

**File:** `src/auth/auth.service.ts` (changes)
```typescript
import {
  UserExistsError,
  InviteNotFoundError,
  InviteExpiredError,
  InviteAlreadyUsedError,
  AccountNotFoundError,
  AccountRevokedError,
  TokenExpiredError,
  InvalidTokenError
} from '../common/errors'

export class AuthService {
  async register(userId: string, inviteCode: string) {
    // ... existing code ...

    if (existingUser.rows.length > 0) {
      throw new UserExistsError()
    }

    if (inviteResult.rows.length === 0) {
      throw new InviteNotFoundError()
    }

    if (invite.expires_at < Date.now()) {
      throw new InviteExpiredError()
    }

    if (invite.used_by) {
      throw new InviteAlreadyUsedError()
    }

    // ... rest of method
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError()
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new InvalidTokenError()
      }
      throw error
    }
  }

  async renewAccessToken(userId: string) {
    const account = await this.getUserAccountValidated(userId)
    const accessToken = this.generateAccessToken(account.user_id, account.invite_code)
    await this.updateLastSeen(account.user_id)
    return { accessToken }
  }

  async login(userId: string) {
    const accountRow = await this.getUserAccountValidated(userId)

    const account: UserAccount = {
      user_id: accountRow.user_id,
      invite_code: accountRow.invite_code,
      created_at: Number(accountRow.created_at),
      last_seen: Number(accountRow.last_seen)
    }

    const accessToken = this.generateAccessToken(account.user_id, account.invite_code)
    await this.updateLastSeen(account.user_id)

    return { accessToken, account }
  }

  // NEW: Extracted validation logic
  private async getUserAccountValidated(userId: string): Promise<UserAccount & { revoked: boolean }> {
    const result = await pool.query<UserAccount & { revoked: boolean }>(
      'SELECT user_id, invite_code, created_at, last_seen, revoked FROM user_accounts WHERE user_id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      throw new AccountNotFoundError()
    }

    const account = result.rows[0]

    if (account.revoked) {
      throw new AccountRevokedError()
    }

    return account
  }
}
```

**File:** `src/auth/auth.controller.ts` (simplified)
```typescript
export async function register(req: RegisterRequestTyped, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, inviteCode } = req.body
    const result = await authService.register(userId, inviteCode)

    res.status(201).json({
      accessToken: result.accessToken,
      account: result.account
    })
  } catch (error) {
    next(error) // Let error handler middleware handle it
  }
}

export async function login(req: LoginRequestTyped, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = req.body
    const result = await authService.login(userId)

    res.json({
      accessToken: result.accessToken,
      account: result.account
    })
  } catch (error) {
    next(error)
  }
}

export async function refresh(req: RefreshRequestTyped, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = req.body
    const result = await authService.renewAccessToken(userId)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

// Other functions follow same pattern: try { ... } catch (error) { next(error) }
```

**Verification:**
- Error handling logic reduced from 20+ lines per function to 3 lines
- All error-to-status mappings centralized in error class definitions
- Type-safe error handling (no string matching)
- Easy to add new error types without modifying controller

---

### Example 2: Dependency Injection (Priority 1)

**File:** `src/auth/auth.controller.ts` (refactored to class)
```typescript
import { Request, Response, NextFunction } from 'express'
import { AuthService } from './auth.service'
import { RegisterRequestTyped, LoginRequestTyped, RefreshRequestTyped } from './auth.schema'

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: RegisterRequestTyped, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, inviteCode } = req.body
      const result = await this.authService.register(userId, inviteCode)

      res.status(201).json({
        accessToken: result.accessToken,
        account: result.account
      })
    } catch (error) {
      next(error)
    }
  }

  verify = async (req: Request, res: Response): Promise<void> => {
    res.json({
      valid: true,
      userId: req.userId
    })
  }

  getAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Not authenticated' })
        return
      }

      const account = await this.authService.getAccount(req.userId)

      if (!account) {
        res.status(404).json({ error: 'Account not found' })
        return
      }

      res.json(account)
    } catch (error) {
      next(error)
    }
  }

  refresh = async (req: RefreshRequestTyped, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.body
      const result = await this.authService.renewAccessToken(userId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  login = async (req: LoginRequestTyped, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.body
      const result = await this.authService.login(userId)

      res.json({
        accessToken: result.accessToken,
        account: result.account
      })
    } catch (error) {
      next(error)
    }
  }
}
```

**File:** `src/auth/router.ts` (updated)
```typescript
import { Router } from 'express'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { requireAuth } from './auth.middleware'
import { validateBody } from '../common/middleware/validation'
import { registerSchema, loginSchema, refreshSchema } from './auth.schema'

const router = Router()

// Singleton instances
const authService = new AuthService()
const authController = new AuthController(authService)

// Public routes
router.post('/register', validateBody(registerSchema), authController.register)
router.post('/login', validateBody(loginSchema), authController.login)
router.post('/refresh', validateBody(refreshSchema), authController.refresh)

// Protected routes
router.get('/verify', requireAuth, authController.verify)
router.get('/account', requireAuth, authController.getAccount)

export default router
```

**File:** `src/auth/auth.middleware.ts` (refactored)
```typescript
import { Request, Response, NextFunction } from 'express'
import { AuthService } from './auth.service'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

/**
 * Factory function to create auth middleware with injected service
 */
export function createAuthMiddleware(authService: AuthService) {
  return async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader) {
        res.status(401).json({ error: 'No authorization token provided' })
        return
      }

      if (!authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Invalid authorization format. Use: Bearer <token>' })
        return
      }

      const token = authHeader.substring(7)
      const payload = authService.verifyToken(token)

      const userExists = await authService.validateUser(payload.userId)
      if (!userExists) {
        res.status(401).json({ error: 'User account not found' })
        return
      }

      req.userId = payload.userId

      authService.updateLastSeen(payload.userId).catch(err => {
        console.error('Failed to update last_seen:', err)
      })

      next()
    } catch (error) {
      next(error)
    }
  }
}

export function requireOwnUserId(req: Request, res: Response, next: NextFunction): void {
  const routeUserId = req.params.userId
  const authenticatedUserId = req.userId

  if (!authenticatedUserId) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  if (routeUserId !== authenticatedUserId) {
    res.status(403).json({ error: 'Cannot access another user\'s data' })
    return
  }

  next()
}

// Export singleton instance for convenience
const authService = new AuthService()
export const requireAuth = createAuthMiddleware(authService)
```

**Benefits:**
- Controllers can be tested with mock AuthService
- Can swap implementations (e.g., OAuth provider) without changing controller
- Clear dependency graph
- Follows Dependency Inversion Principle

---

## Metrics

### Code Duplication
- **Error handling:** 60+ lines duplicated across 5 controller functions
- **Database queries:** 15 lines duplicated in renewAccessToken/login
- **Normalization:** 2 instances of invite code normalization
- **Type conversion:** 5+ instances of BIGINT to number conversion

### Complexity
- **AuthService:** 9 public methods with 3 distinct responsibilities (SRP violation)
- **Controllers:** 20+ lines of error handling per function (could be 3 lines)
- **Middleware:** Reasonable complexity, but tight coupling

### Test Coverage
- **Unit tests:** 0%
- **Integration tests:** 0%
- **Security-critical code with no tests**

### Technical Debt
- **High:** Multiple service instances, no DI
- **High:** String-based error handling
- **Medium:** Deprecated code in production
- **Low:** Missing utility functions

---

## Conclusion

The authentication and authorization domain has a solid foundation with good separation of concerns and proper use of modern patterns (Zod schemas, middleware, transactions). However, it suffers from classic issues:

1. **Error handling anti-pattern** - string matching instead of typed errors
2. **Lack of dependency injection** - tight coupling, hard to test
3. **Deprecated code** - still exposed in production API
4. **Code duplication** - especially in error handling and database queries

The good news: these are straightforward to fix with the provided examples. The codebase is small enough that refactoring can be done incrementally without breaking changes (except removing deprecated endpoint).

**Recommended approach:**
1. Start with custom error classes (Priority 1, item 1) - enables all other improvements
2. Remove deprecated code (Priority 1, item 2) - reduces confusion
3. Implement DI (Priority 1, item 4) - enables testing
4. Extract helper methods (Priority 2, item 5) - reduces duplication
5. Write tests (Priority 3, item 12) - prevents regressions

This will bring the code quality from 6.5/10 to 8.5/10+ with manageable effort.
