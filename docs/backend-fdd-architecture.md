# Backend Architecture

**Core principle:** Layered modules with dependency injection. Each domain is self-contained with clear boundaries.

## Tech Stack

Bun, tRPC, tsyringe (DI), Zod, PostgreSQL (raw queries), Sentry

## Rules

### 1. Module Structure

Each domain is a folder under `src/`. Contains all layers for that domain:

```
src/{module}/
├── router.ts      # tRPC procedures (entry point)
├── controller.ts  # Request handling, auth checks
├── service.ts     # Business logic
├── schemas.ts     # Zod validation + input types
└── types.ts       # Response types, interfaces
```

### 2. Layer Responsibilities

| Layer      | Does                                      | Doesn't              |
| ---------- | ----------------------------------------- | -------------------- |
| Router     | Define procedures, wire to controller     | Contain logic        |
| Controller | Auth checks, map input→service→response   | Database access      |
| Service    | Business logic, DB queries, external APIs | Handle HTTP concerns |

### 3. Dependency Injection

- Every class: `@injectable()` decorator
- Every dependency: `@inject(ClassName)` decorator
- Use class as token: `@inject(TaskCache)` not string tokens
- Abstract classes: use symbol from `di-tokens.ts`
- Register all services in `container.ts`
- No primitives in constructors (DI can't inject them)

### 4. Error Handling

- Single `AppError` class with status code
- Factory functions: `notFound()`, `badRequest()`, `forbidden()`, `unauthorized()`
- Throw errors, don't return them
- Middleware converts to tRPC errors and sends to Sentry

### 5. Validation

- All validation in `schemas.ts` using Zod
- Complex rules: use `.refine()`
- Input types: derive with `z.infer<typeof schema>`
- No manual validation in controllers

### 6. Types

- Input types: in `schemas.ts` (derived from Zod)
- Response types: in `types.ts`
- DB row types: snake_case (match columns)
- API types: camelCase

### 7. What Goes in `common/`

- Error classes and factories
- AI client abstraction
- Registry base class
- Shared utilities (svg, tikz conversion)

**Test:** If it's specific to one domain, it belongs in that domain's folder.

## Dependencies Flow

```
router → controller → service
                   ↘ common/
```

- Routers import controllers
- Controllers import services
- Services import from `common/`
- `common/` never imports from domains
- Avoid circular dependencies (use `di-tokens.ts` for abstract class tokens)

## Anti-Patterns

- `src/controllers/` - organize by domain, not layer
- `src/services/` - same
- Manual validation in controllers - use Zod schemas
- String DI tokens - use class names
- Logging everywhere - errors go to Sentry
- Primitives in constructors - move to class properties
