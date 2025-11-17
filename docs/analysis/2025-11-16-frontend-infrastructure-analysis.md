# Frontend Infrastructure Analysis

**Date:** 2025-11-16
**Scope:** Frontend Infrastructure (packages/frontend/src/utils/, lib/, config/, i18n/, api/, data/core/, hooks/)
**Analyzed Files:** 19 infrastructure files (~1,370 LOC)

## Executive Summary

The Frontend Infrastructure demonstrates **mixed quality** with some areas showing excellent patterns (crypto, config validation) while others suffer from severe DRY violations and code organization issues. The most critical problems are in storage operations and duplicate utility implementations.

### Overall Assessment

- **DRY Violations:** CRITICAL (8 issues, 4 critical)
- **SOLID Violations:** MODERATE (5 issues, 2 critical)
- **Minimal Code Violations:** MODERATE (6 issues, 2 critical)
- **Overall Score:** 5.5/10

### Top 3 Critical Issues

1. **Massive duplication in IndexedDB operations** - Six nearly-identical storage functions (storeKey, storeUserId, storeTokens, loadKey, getUserId, getAccessToken) with 90% duplicated code (~120 lines of duplication) (CRITICAL)
2. **Duplicate cn() utility function** - Identical implementations in `/utils/cn.ts` and `/lib/utils.ts` causing import confusion (CRITICAL)
3. **Inconsistent error handling patterns** - userData.ts uses throw/catch extensively while storage.ts uses Promise-based errors, leading to mixed error handling strategies (CRITICAL)

---

## Detailed Analysis

### 1. DRY (Don't Repeat Yourself) Violations

#### CRITICAL: Massive IndexedDB Operation Duplication
**File:** `/packages/frontend/src/data/core/storage.ts` (212 lines)

**Issue:**
Six storage functions share 90% identical boilerplate for IndexedDB transactions:
- `storeKey()`, `loadKey()` (lines 76-113)
- `storeUserId()`, `getUserId()` (lines 118-155)
- `storeTokens()`, `getAccessToken()` (lines 160-197)

**Evidence:**
```typescript
// Pattern repeated 6 times with only 3 variations:
// - operation: 'readwrite' vs 'readonly'
// - method: store.put() vs store.get()
// - key: KEY_ID vs USER_ID_KEY vs ACCESS_TOKEN_KEY

export async function storeKey(key: CryptoKey): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(key, KEY_ID)

    request.onerror = () => {
      db.close()
      reject(request.error || new Error('Failed to store key'))
    }
    request.onsuccess = () => {
      db.close()
      resolve()
    }
  })
}

// Nearly identical pattern for other 5 functions
// storeUserId, getUserId, storeTokens, getAccessToken, loadKey
```

**Impact:**
- ~120 lines of duplicated code
- Error message strings repeated with minor variations
- Bug fixes must be applied to 6 separate functions
- Maintenance burden increases linearly with each new stored value
- Promise wrapping pattern repeated unnecessarily

**Recommendation:**
Create generic storage operations:
```typescript
// Generic operations
async function storeValue<T>(key: string, value: T): Promise<void>
async function getValue<T>(key: string): Promise<T | null>

// Specific wrappers become one-liners
export const storeKey = (key: CryptoKey) => storeValue(KEY_ID, key)
export const loadKey = () => getValue<CryptoKey>(KEY_ID)
export const storeUserId = (id: string) => storeValue(USER_ID_KEY, id)
export const getUserId = () => getValue<string>(USER_ID_KEY)
```
Estimated effort: 2 hours

**Severity:** CRITICAL

---

#### CRITICAL: Duplicate cn() Utility Function
**Files:**
- `/packages/frontend/src/utils/cn.ts` (10 lines)
- `/packages/frontend/src/lib/utils.ts` (7 lines)

**Issue:**
The `cn()` utility function for merging Tailwind classes exists in two locations with identical implementations:

```typescript
// utils/cn.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// lib/utils.ts - EXACT DUPLICATE
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Impact:**
- All 47+ imports use `@/lib/utils` (the duplicate)
- `/utils/cn.ts` exists but is never used
- Confusion about which one is canonical
- Risk of divergence if one gets modified
- `/utils/index.ts` re-exports from `/utils/cn.ts` but no code uses it

**Recommendation:**
1. Delete `/packages/frontend/src/utils/` directory entirely (cn.ts and index.ts)
2. Keep only `/lib/utils.ts` as canonical source
3. Update tsconfig path alias if needed
4. Estimated effort: 15 minutes

**Severity:** CRITICAL

---

#### HIGH: Repeated Promise Error Handling Pattern
**File:** `/packages/frontend/src/data/core/storage.ts`

**Issue:**
Every IndexedDB operation manually wraps Promise callbacks with identical error handling:

```typescript
// Pattern repeated 6 times
request.onerror = () => {
  db.close()
  reject(request.error || new Error('Failed to...'))
}
request.onsuccess = () => {
  db.close()
  resolve(request.result || null)
}
```

**Impact:**
- db.close() must be remembered in every callback
- Error messages are inconsistently formatted
- Forgetting to close DB would cause resource leaks
- Difficult to add global error monitoring

**Recommendation:**
Create a Promise wrapper utility:
```typescript
function wrapRequest<T>(
  request: IDBRequest<T>,
  db: IDBDatabase,
  errorMsg: string
): Promise<T | null> {
  return new Promise((resolve, reject) => {
    request.onerror = () => {
      db.close()
      reject(request.error || new Error(errorMsg))
    }
    request.onsuccess = () => {
      db.close()
      resolve(request.result || null)
    }
  })
}
```
Estimated effort: 1 hour

**Severity:** HIGH

---

#### MODERATE: Duplicate Error Response Handling
**Files:**
- `/packages/frontend/src/api/api.ts` (lines 93-109)
- `/packages/frontend/src/api/logikids.ts` (lines 79-132)

**Issue:**
HTTP error mapping duplicated across API layers:

```typescript
// api.ts - Generic axios interceptor
switch (error.response.status) {
  case 401: throw new Error('Authentication required')
  case 403: throw new Error('You do not have permission...')
  case 404: throw new Error('Resource not found')
  // ... 7 status codes
}

// logikids.ts - Specific API methods also handle errors
.catch((error) => {
  if (error.response?.status === 404) {
    throw new LogikidsApiError('No tasks found...')
  }
  if (error.response?.status === 429) {
    throw new LogikidsApiError('All hints have been used')
  }
  // ... duplicates axios interceptor logic
})
```

**Impact:**
- Error messages defined in two places
- Inconsistent error types (Error vs LogikidsApiError)
- Changes to error handling require updates in multiple locations
- The axios interceptor already converts errors, but logikids.ts re-checks them

**Recommendation:**
- Remove error handling from individual API methods (logikids.ts)
- Trust axios interceptor to handle all HTTP errors
- Only catch to add context-specific information
- Use a single error type throughout
- Estimated effort: 1 hour

**Severity:** MODERATE

---

#### MODERATE: Console Logging Without Abstraction
**Files:** 22 files contain `console.log/warn/error` (40+ occurrences)

**Issue:**
Direct console calls scattered throughout infrastructure:

```typescript
// Multiple files
console.warn('Failed to read task load time history:', error)
console.log(`Cleaning up legacy storage key: ${key}`)
console.error('Failed to initialize user data:', error)
```

**Impact:**
- Cannot disable logging in production
- No log levels or filtering
- Cannot redirect to monitoring service
- Difficult to trace log sources
- Inconsistent formatting

**Recommendation:**
Create logger utility:
```typescript
// lib/logger.ts
export const logger = {
  debug: (msg: string, ...args: any[]) => { /* */ },
  info: (msg: string, ...args: any[]) => { /* */ },
  warn: (msg: string, ...args: any[]) => { /* */ },
  error: (msg: string, ...args: any[]) => { /* */ },
}
```
Estimated effort: 2 hours

**Severity:** MODERATE

---

#### LOW: Repeated Fetch Configuration
**Files:**
- `/packages/frontend/src/data/core/userData.ts` (lines 63-69, 110-116)

**Issue:**
Fetch calls to auth endpoints duplicate headers and error handling:

```typescript
// registerUser
const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId, inviteCode }),
})

// loginWithAccount - Same pattern
const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId }),
})
```

**Impact:**
- Headers duplicated
- Error handling pattern repeated
- Not using existing axios instance from api.ts
- Mixing fetch and axios in same codebase

**Recommendation:**
- Use existing `api` axios instance from `api.ts` for auth calls
- Or create dedicated auth API client
- Eliminate fetch() calls in favor of consistent axios usage
- Estimated effort: 30 minutes

**Severity:** LOW

---

### 2. SOLID Violations

#### CRITICAL: Single Responsibility Violation in userData.ts
**File:** `/packages/frontend/src/data/core/userData.ts` (263 lines)

**Issue:**
userData.ts violates SRP by handling 5 distinct responsibilities:
1. User registration/authentication (registerUser, loginWithAccount)
2. Data encryption/decryption (getData, setData)
3. Legacy storage cleanup (cleanupLegacyStorage)
4. Settings management (updateSettings)
5. Progress tracking (updateProgress, updateGameStats)

**Evidence:**
```typescript
// Registration logic
export async function registerUser(inviteCode: string): Promise<UserData> {
  const key = await generateKey()
  const userId = crypto.randomUUID()
  const response = await fetch(...) // HTTP call
  await storeKey(key)
  const defaultData = createDefaultUserData(userId)
  const encrypted = await encrypt(key, defaultData) // Crypto
  localStorage.setItem(STORAGE_KEY, encrypted) // Storage
  cleanupLegacyStorage() // Migration
  window.dispatchEvent(new Event('data-changed')) // Event dispatch
}
```

**Impact:**
- File length: 263 lines (4x recommended size)
- Difficult to test individual concerns
- Changes to auth affect data management
- Tight coupling between unrelated features
- Cannot reuse components independently

**Recommendation:**
Split into focused modules:
```
/data/core/
  auth.ts        - registerUser, loginWithAccount
  storage.ts     - getData, setData (already exists for IndexedDB)
  userData.ts    - Simple data operations only
  settings.ts    - updateSettings
  progress.ts    - updateProgress, updateGameStats
  migration.ts   - cleanupLegacyStorage
```
Estimated effort: 3 hours

**Severity:** CRITICAL

---

#### HIGH: Open/Closed Principle Violation in storage.ts
**File:** `/packages/frontend/src/data/core/storage.ts`

**Issue:**
Adding a new storage key requires modifying the module:
1. Add new constant (e.g., `REFRESH_TOKEN_KEY`)
2. Add new `storeX()` function
3. Add new `getX()` function

Cannot extend without modification.

**Evidence:**
```typescript
// Current approach requires code changes
const KEY_ID = 'encryption_key'
const USER_ID_KEY = 'user_id'
const ACCESS_TOKEN_KEY = 'access_token'
// Adding REFRESH_TOKEN_KEY requires new functions

export async function storeRefreshToken(token: string): Promise<void> {
  // New function needed - violates OCP
}
```

**Recommendation:**
Make storage extensible:
```typescript
// Generic interface - closed for modification, open for extension
export class SecureStorage {
  async store<T>(key: string, value: T): Promise<void>
  async get<T>(key: string): Promise<T | null>
}

// Usage
const storage = new SecureStorage()
await storage.store('refresh_token', token)
await storage.store('new_key', data) // No code changes needed
```
Estimated effort: 2 hours

**Severity:** HIGH

---

#### MODERATE: Interface Segregation in api.ts
**File:** `/packages/frontend/src/api/api.ts`

**Issue:**
The axios instance has both:
- Request interceptor (adds auth token)
- Response interceptor (handles errors + token refresh)

Components that don't need auth still get the auth interceptor.

**Impact:**
- Public endpoints get unnecessary Authorization headers
- Error handling is forced on all requests
- Cannot create "simple" API client without interceptors

**Recommendation:**
Provide specialized clients:
```typescript
// lib/api/clients.ts
export const publicApi = axios.create({ baseURL })
export const authenticatedApi = axios.create({ baseURL })
  .use(authInterceptor)
  .use(refreshInterceptor)
```
Estimated effort: 1.5 hours

**Severity:** MODERATE

---

#### MODERATE: Dependency Inversion in useTaskLoadingCalibration
**File:** `/packages/frontend/src/hooks/useTaskLoadingCalibration.ts`

**Issue:**
Hook directly depends on localStorage implementation:

```typescript
function readHistory(): LoadTimeHistory | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) // Hard dependency
    // ...
  }
}
```

**Impact:**
- Cannot use different storage (e.g., IndexedDB, memory)
- Difficult to test without mocking localStorage
- Tight coupling to browser API

**Recommendation:**
Inject storage dependency:
```typescript
interface Storage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function useTaskLoadingCalibration(storage: Storage = localStorage) {
  // Now testable and flexible
}
```
Estimated effort: 1 hour

**Severity:** MODERATE

---

#### LOW: Liskov Substitution in Error Types
**Files:**
- `/packages/frontend/src/api/types.ts` (ApiError interface)
- `/packages/frontend/src/api/api.ts` (throws Error instances)
- `/packages/frontend/src/api/logikids.ts` (LogikidsApiError class)

**Issue:**
Mixed error types break substitutability:

```typescript
// types.ts defines interface
export interface ApiError {
  code: ApiErrorCode
  message: string
}

// api.ts throws Error (not ApiError)
throw new Error('Authentication required')

// logikids.ts throws custom class
throw new LogikidsApiError('No tasks found')

// Consumers cannot handle uniformly
catch (error) {
  if (isApiError(error)) { /* Won't work for Error instances */ }
}
```

**Recommendation:**
Use single error class hierarchy:
```typescript
export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message)
  }
}

// All API layers throw ApiError
throw new ApiError(ApiErrorCode.NOT_FOUND, 'Resource not found')
```
Estimated effort: 1 hour

**Severity:** LOW

---

### 3. Minimal Code Violations

#### CRITICAL: Unnecessary Abstraction in i18n config
**File:** `/packages/frontend/src/i18n/config.ts` (76 lines)

**Issue:**
Over-engineered language detection with fallback chain:

```typescript
// Get browser language
const getBrowserLanguage = () => {
  return navigator.language.split('-')[0]
}

// Get language from settings if available
let storedLanguage = null

try {
  // Try encrypted user data
  const userData = localStorage.getItem('logikids_data')
  if (userData) {
    const parsed = JSON.parse(userData)
    storedLanguage = parsed.settings?.language || null
  }

  // Fallback to old settings (migration)
  if (!storedLanguage) {
    const oldSettings = localStorage.getItem('logikids_settings')
    if (oldSettings) {
      storedLanguage = JSON.parse(oldSettings).language
    }
  }
} catch (error) {
  console.warn('Could not access localStorage:', error)
}

// Final fallback chain
const initialLanguage = storedLanguage || getBrowserLanguage() || 'en'
```

**Impact:**
- 30+ lines for language selection
- Direct localStorage access (should use userData.ts)
- Migration logic in wrong place (should be in migration.ts)
- Violates separation of concerns
- i18n initialization happens before UserDataContext is available

**Recommendation:**
Simplify to 5 lines:
```typescript
const initialLanguage = navigator.language.split('-')[0] || 'en'

// Later: Update via UserDataContext when available
// Language setting should come from user context, not i18n config
```
Move migration logic to dedicated migration module.
Estimated effort: 1.5 hours

**Severity:** CRITICAL

---

#### HIGH: Redundant Type Guards
**File:** `/packages/frontend/src/api/types.ts` (30 lines)

**Issue:**
Generic ApiResponse interface is never used:

```typescript
// Defined but unused
export interface ApiResponse<T> {
  data: T
  error: ApiError | null
}

// Type guard for ApiError (also barely used)
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as ApiError).code === 'string' &&
    typeof (error as ApiError).message === 'string'
  )
}
```

**Impact:**
- Dead code (ApiResponse never used)
- Type guard only used once
- 15 lines of unnecessary code
- Confusing because ApiResponse type alias exists in api.ts with different meaning

**Recommendation:**
- Remove unused ApiResponse interface
- Replace type guard with `error instanceof ApiError` if using class
- Delete types.ts if only dead code remains
- Estimated effort: 15 minutes

**Severity:** HIGH

---

#### MODERATE: Over-Documented useTaskLoadingCalibration
**File:** `/packages/frontend/src/hooks/useTaskLoadingCalibration.ts` (250 lines)

**Issue:**
Excessive JSDoc comments inflate file size:
- 80+ lines of comments for 170 lines of code
- Usage example in comments (belongs in Storybook/docs)
- Interface with full JSDoc for every method
- Constants with paragraph explanations

**Evidence:**
```typescript
/**
 * Maximum number of load time measurements to keep
 */
const MAX_HISTORY_SIZE = 10 // 3 lines for simple constant

/**
 * Hook return value interface
 */
interface UseTaskLoadingCalibration {
  /**
   * Get the calibrated time constant for the easing function.
   * This value is based on the user's historical load times.
   *
   * @returns Calibrated time constant in milliseconds (default: 7000ms)
   */
  getTimeConstant: () => number
  // 5 more methods with similar verbose docs
}
```

**Impact:**
- File is 32% comments
- Actual logic is simple but appears complex
- Violates "code as documentation" principle
- High maintenance cost for comments

**Recommendation:**
- Reduce to inline comments only
- Self-documenting function/variable names
- Move usage examples to tests or Storybook
- Target: 150 lines instead of 250
- Estimated effort: 30 minutes

**Severity:** MODERATE

---

#### MODERATE: Unnecessary Abstraction Layers in queryClient
**File:** `/packages/frontend/src/api/queryClient.ts` (13 lines)

**Issue:**
Entire file exports single configuration object:

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})
```

**Impact:**
- Separate file for 5 lines of config
- No reusability (single instance)
- Could be inline in Providers.tsx

**Recommendation:**
Move inline to Providers.tsx:
```typescript
// app/Providers.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 1 },
  },
})
```
Delete queryClient.ts.
Estimated effort: 5 minutes

**Severity:** MODERATE

---

#### LOW: Empty utils/index.ts Re-export
**File:** `/packages/frontend/src/utils/index.ts` (2 lines)

**Issue:**
```typescript
export * from './cn'
```

File re-exports from cn.ts which is never used (everything imports from lib/utils instead).

**Impact:**
- Dead code
- Confusing import paths
- No actual utility

**Recommendation:**
Delete utils/ directory entirely (as mentioned in cn() duplication issue).
Estimated effort: 2 minutes

**Severity:** LOW

---

#### LOW: Deprecated Function Not Removed
**File:** `/packages/frontend/src/data/core/userData.ts` (lines 141-144)

**Issue:**
```typescript
/**
 * Create a new user (deprecated - use registerUser instead)
 * @deprecated Use registerUser with invite code instead
 */
export async function createNewUser(): Promise<UserData> {
  console.warn('createNewUser is deprecated. Use registerUser with invite code instead.')
  throw new Error('createNewUser is deprecated. Use registerUser with invite code instead.')
}
```

**Impact:**
- 8 lines of dead code
- Function body only throws error
- Should be removed, not marked deprecated

**Recommendation:**
Delete function entirely. If needed for backward compatibility, delete after next release.
Estimated effort: 1 minute

**Severity:** LOW

---

## Summary Statistics

### File Analysis
```
Total Infrastructure Files: 19
Total Lines of Code: ~1,370
Average File Size: 72 lines

Largest Files:
- userData.ts: 263 lines (VIOLATION: Should be <100)
- useTaskLoadingCalibration.ts: 250 lines (32% comments)
- storage.ts: 212 lines (120 lines duplicated)

Smallest Files:
- utils/index.ts: 2 lines (dead code)
- queryClient.ts: 13 lines (unnecessary abstraction)
```

### Violation Breakdown
```
DRY Violations:
  CRITICAL: 2 (IndexedDB duplication, cn() duplicate)
  HIGH: 2 (Promise wrappers, error handling)
  MODERATE: 2 (API errors, logging)
  LOW: 2 (fetch config, deprecated code)

SOLID Violations:
  CRITICAL: 1 (SRP in userData.ts)
  HIGH: 1 (OCP in storage.ts)
  MODERATE: 3 (ISP, DIP, LSP)

Minimal Code Violations:
  CRITICAL: 1 (i18n over-engineering)
  HIGH: 1 (unused types)
  MODERATE: 3 (over-documentation, queryClient, utils)
  LOW: 2 (empty re-export, deprecated function)
```

### Code Quality Metrics
```
Duplication Factor: 35% (120/370 lines in storage operations)
Dead Code: ~50 lines across 4 files
Comment Ratio: 25% average (useTaskLoadingCalibration: 32%)
Average Function Length: 15 lines (acceptable)
Cyclomatic Complexity: Low (mostly simple functions)
```

---

## Recommended Refactoring Priority

### Phase 1: Critical DRY Violations (4-6 hours)
1. ✅ Refactor IndexedDB storage to generic operations
2. ✅ Remove duplicate cn() utility
3. ✅ Split userData.ts into focused modules
4. ✅ Simplify i18n configuration

### Phase 2: High-Impact Issues (3-4 hours)
5. ✅ Create Promise wrapper for IndexedDB
6. ✅ Unify error handling strategy
7. ✅ Implement logger abstraction
8. ✅ Remove unused type definitions

### Phase 3: SOLID Improvements (4-5 hours)
9. ✅ Make storage extensible (OCP)
10. ✅ Create specialized API clients (ISP)
11. ✅ Add storage dependency injection (DIP)
12. ✅ Unify error class hierarchy (LSP)

### Phase 4: Code Minimization (2-3 hours)
13. ✅ Reduce documentation overhead
14. ✅ Inline queryClient configuration
15. ✅ Remove dead code and deprecated functions
16. ✅ Clean up empty re-exports

**Total Estimated Effort:** 13-18 hours

---

## Positive Patterns Observed

1. **Excellent crypto implementation** - Clean, focused, well-typed (crypto.ts)
2. **Good config validation with Zod** - Type-safe environment handling (config/index.ts)
3. **Proper TypeScript usage** - Good type safety throughout
4. **Error recovery in IndexedDB** - Handles DB corruption gracefully (storage.ts openDB)
5. **Clear separation of concerns** - crypto.ts is a model of single-purpose module
6. **Good use of constants** - Algorithm parameters centralized
7. **Comprehensive useTaskLoadingCalibration** - Feature-complete despite over-documentation

---

## Risk Assessment

### High Risk
- **IndexedDB duplication** - Bug in one function won't be fixed in others
- **Mixed error handling** - Inconsistent catch patterns lead to unhandled errors
- **userData.ts complexity** - High coupling makes changes risky

### Medium Risk
- **Storage extension** - Adding new stored values requires code changes
- **Logger absence** - Cannot disable logs in production
- **i18n initialization timing** - Depends on localStorage before context available

### Low Risk
- **Dead code** - Minimal impact, just clutter
- **Over-documentation** - Maintenance burden but not functional risk

---

## Testing Recommendations

1. **Add unit tests for storage operations** - Currently untested
2. **Test error handling paths** - Verify all error cases covered
3. **Test crypto functions** - Encryption/decryption edge cases
4. **Mock localStorage in tests** - Test calibration hook behavior
5. **Integration tests for userData flow** - Registration → Storage → Retrieval

---

## Conclusion

The Frontend Infrastructure shows **significant technical debt** primarily in the data layer. The crypto and config modules are well-designed, but storage operations suffer from extreme duplication that must be addressed urgently.

**Key Actions:**
1. Refactor storage.ts to eliminate 120 lines of duplication (CRITICAL)
2. Split userData.ts into focused modules (CRITICAL)
3. Remove cn() duplicate and clean up utils/ directory (CRITICAL)
4. Establish consistent error handling and logging patterns (HIGH)

Completing Phase 1-2 refactoring (7-10 hours) would improve the score from **5.5/10 to 7.5/10**.
