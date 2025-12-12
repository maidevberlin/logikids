# Rate Limiting Design

## Overview

Simple in-memory rate limiter to prevent casual API abuse. Restricts task generation and TTS to 2 requests per minute per user.

## Requirements

- **Threat model:** Casual abuse prevention (curious users, simple scripts)
- **Identification:** User ID (authenticated) or IP address (fallback)
- **Endpoints:** `tasks.getTask`, `tts.speak`
- **Limit:** 2 requests per minute per identifier
- **Storage:** In-memory (acceptable for casual abuse; resets on restart)
- **Response:** 429 with user-friendly message

## Implementation

### New Files

```
packages/backend/src/common/rateLimit/
├── rateLimiter.ts    # RateLimiter class with sliding window
├── middleware.ts     # tRPC middleware
└── index.ts          # exports

packages/backend/src/common/cleanup/
├── cleanupRegistry.ts  # Registry of cleanable resources
├── cleanupService.ts   # Periodic cleanup runner
├── types.ts            # Cleanable interface
└── index.ts            # exports
```

### Sliding Window Algorithm

- Store timestamps of recent requests per identifier: `Map<string, number[]>`
- On request: filter timestamps older than 60s, check count < limit
- Return remaining capacity and retry-after time

### Identification Strategy

```typescript
// Authenticated: use userId from JWT
// Unauthenticated: use IP from x-forwarded-for or connection
const identifier = ctx.user?.id ?? getClientIp(ctx.req)
```

### Centralized Cleanup

```typescript
interface Cleanable {
  name: string
  cleanup(): void
}
```

- `TaskCache` and `RateLimiter` implement `Cleanable`
- Both register with `CleanupRegistry` on startup
- `CleanupService` runs cleanup every 5 minutes

### Error Response

```typescript
{
  code: 'TOO_MANY_REQUESTS',
  message: 'Please wait before generating another task',
  retryAfter: 45  // seconds until next allowed
}
```

### Frontend Handling

- Check for 429 / `TOO_MANY_REQUESTS` error
- Display message to user (toast or inline)
- Optionally show countdown using `retryAfter`

## Future: Redis Migration

When scaling horizontally, migrate from in-memory to Redis:

1. Remove resources from `CleanupRegistry` (Redis handles TTL)
2. Replace `RateLimiter` with Redis-backed implementation using `INCR` + `EXPIRE`
3. Replace `TaskCache` with Redis-backed implementation
4. `CleanupService` becomes optional (only for non-Redis resources)

Comments in code mark these migration points.

## Translation Keys

- `error.rateLimited` — user-facing rate limit message
