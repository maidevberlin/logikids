# Backend Refactoring Plan

This document describes refactoring tasks for the backend codebase. Each section is independent and can be worked on by separate agents.

---

## 1. Consistent Dependency Injection (tsyringe)

### Current Situation

- Some services use `@injectable()` decorator, others don't
- Some controllers use `@inject()` for dependencies, others receive them without decorators
- Several services import singletons directly (e.g., `subjectRegistry`, `taskCache`) instead of receiving them via injection
- `container.ts` only explicitly registers a few services; others rely on auto-resolution
- `HintService` and `PromptService` create their own `PromptLoader` and `VariationLoader` instances internally

### Goal

- Every service and controller class must have `@injectable()` decorator
- Every constructor dependency must use `@inject(TOKEN)` decorator
- All singletons must be injected, never imported directly in service/controller files
- All services must be explicitly registered in `container.ts`

### Files to Modify

- `src/container.ts` - add registrations for all services
- `src/tasks/service.ts` - add `@injectable()` decorator
- `src/tasks/hints/service.ts` - add `@injectable()`, inject PromptLoader and VariationLoader
- `src/prompts/service.ts` - add `@injectable()` decorator
- `src/tts/controller.ts` - add `@inject()` decorators to constructor params
- `src/tts/service.ts` - verify DI setup
- `src/subjects/service.ts` - inject `SubjectRegistry` instead of importing
- `src/concepts/service.ts` - inject `SubjectRegistry` instead of importing

### Search Patterns

- Find direct singleton imports: `import { subjectRegistry }` or `import { taskCache }` or `import { taskTypeRegistry }`
- Find classes without injectable: `export class.*Service {` (should have decorator above)
- Find constructors without inject: `constructor(private` without `@inject` on same line or line above
- Find internal instantiation: `new PromptLoader()` or `new VariationLoader()`

---

## 2. Lightweight Error Handling

### Current Situation

- Large error class hierarchy in `src/common/errors/` with 30+ custom error classes
- Each error extends `ApplicationError` with statusCode and code
- Some controllers throw `TRPCError` directly, others throw custom errors
- No central error translation - errors bubble up inconsistently
- Custom errors are not automatically mapped to tRPC error codes

### Goal

- Remove most custom error wrapper classes
- Keep only a minimal set of errors that carry genuinely useful information
- Add a single tRPC error handler middleware that catches all errors
- The middleware should: log to Sentry, map to appropriate HTTP status, return clean error to client
- Controllers and services should throw plain `Error` with descriptive message, or use a minimal `AppError` class with just message and statusCode
- Remove `code` field from errors (redundant with statusCode)

### Approach

1. Create a single `AppError` class with just `message` and `statusCode` (replace entire hierarchy)
2. Add error handling middleware in `src/trpc.ts` that catches errors and converts to TRPCError
3. Replace all custom error throws with simple `new AppError(message, statusCode)` or plain throws
4. Remove all files in `src/common/errors/` except a single `i18n.ts` with the minimal implementation

### Files to Modify

- `src/trpc.ts` - add error handling middleware
- `src/common/errors/` - replace entire directory with single minimal file
- All service files that import from `../common/errors` - simplify throws
- `src/sync/controller.ts` - remove direct TRPCError throws, use AppError

### Search Patterns

- Find all error imports: `from '../common/errors'` or `from '../../common/errors'`
- Find TRPCError throws: `throw new TRPCError`
- Find custom error throws: `throw new.*Error(` (in src/ excluding node_modules)
- List all error files: files in `src/common/errors/*.ts`

---

## 3. Schema and Validation Consistency

### Current Situation

- Zod schemas defined in `schemas.ts` files per module
- Some modules export type inference (`z.infer`), others define types separately in `types.ts`
- Manual validation in some controllers (e.g., SyncController checks payload size manually)
- Some schemas use `.refine()` for complex validation, others don't

### Goal

- Every module has a `schemas.ts` with Zod schemas
- All input types are derived from schemas using `z.infer<typeof schema>`
- All validation logic lives in schemas (use `.refine()` for complex rules)
- Remove manual validation from controllers
- Consistent naming: `{action}InputSchema` (e.g., `getTaskInputSchema`, `synthesizeInputSchema`)

### Files to Modify

- `src/sync/controller.ts` - move size validation to schema
- `src/sync/schemas.ts` - add payload size validation with refine
- `src/auth/types.ts` - derive types from schemas or keep separate (decide on pattern)
- All `schemas.ts` files - ensure consistent naming convention

### Search Patterns

- Find manual validation in controllers: `if.*throw` in controller.ts files
- Find type definitions not using z.infer: `export interface.*Input` or `export type.*Input =` (not using z.infer)
- Find schemas without Input suffix: `export const.*Schema` that don't end with InputSchema

---

## 4. Remove Logging

### Current Situation

- `src/common/logger.ts` provides `createLogger(name)` function
- Almost every service and controller file imports and uses the logger
- Logs include debug, info, warn, error levels
- Errors are already sent to Sentry via tRPC middleware

### Goal

- Remove all logging from the codebase
- Errors go to Sentry (already configured)
- Delete `src/common/logger.ts`
- Remove all `logger.debug()`, `logger.info()`, `logger.warn()`, `logger.error()` calls
- Remove all `const logger = createLogger(...)` declarations
- Remove all `import { createLogger }` statements

### Files to Modify

- Delete: `src/common/logger.ts`
- All files that import createLogger (search will reveal them)

### Search Patterns

- Find logger imports: `import { createLogger }`
- Find logger declarations: `const logger = createLogger`
- Find logger calls: `logger.debug(` or `logger.info(` or `logger.warn(` or `logger.error(`

---

## 5. Type Definition Cleanup

### Current Situation

- Some interfaces defined in `service.ts` files (e.g., `JWTPayload`, `UserAccount` in auth/service.ts)
- Some interfaces defined in `types.ts` files
- Some types derived from Zod schemas, others standalone
- Inconsistent export patterns

### Goal

- All shared type definitions live in `types.ts` files
- Service-internal types can stay in service files (but should be minimal)
- Types used across module boundaries must be in `types.ts`
- Response types should match what the API actually returns
- Input types should be derived from Zod schemas where applicable

### Files to Modify

- `src/auth/service.ts` - move `JWTPayload`, `UserAccount` to types.ts
- `src/auth/types.ts` - receive moved types
- `src/invites/service.ts` - move `InviteCode` interface to types.ts (or create types.ts)
- `src/tts/` - ensure types.ts exists and contains shared types

### Search Patterns

- Find interfaces in service files: `export interface` in `**/service.ts`
- Find type definitions in service files: `export type` in `**/service.ts`
- Find modules without types.ts: directories in src/ with controller.ts but no types.ts

---

## Execution Order

Recommended order for minimal conflicts:

1. **Remove Logging** (4) - standalone, touches many files but simple deletions
2. **Type Definition Cleanup** (5) - standalone, moves code around
3. **Schema/Validation Consistency** (3) - depends on clean types
4. **Error Handling** (2) - significant change, do after types are clean
5. **Dependency Injection** (1) - most complex, do last when code is cleaner

---

## Notes for Agents

- Always run `bun run typecheck` after changes to verify TypeScript compiles
- Run `bun test` if tests exist for modified modules
- Each section is designed to be atomic - complete one fully before starting another
- When in doubt about a pattern, look at the `sync` module as reference (it's the most consistent)
- The `cli/` directory is out of scope for this refactoring
