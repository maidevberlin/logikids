# Lazy Hint Generation Design

**Date:** 2025-10-25
**Status:** Approved
**Primary Goal:** Reduce initial task generation response time by 70-80%

## Problem Statement

Current task generation creates long-running LLM requests (5-10+ seconds) because we generate everything atomically:
- Task title and description
- Solution/options with explanations
- 4 progressive hints (often unused)
- All formatted as complex JSON

**Key insight:** Many users don't use all hints, yet we pay the generation cost upfront.

## Solution: On-Demand Hint Generation

Split task generation into two phases:

### Phase A: Initial Task (Fast - Required)
Generate only what's immediately needed:
- Task title + description
- Solution/options

**Expected time:** 2-3 seconds (70-80% faster)

### Phase B: Hints (Lazy - Optional)
Generate hints only when user clicks "Get Hint":
- Each hint generated individually on-demand
- Contextual generation based on task details
- Up to 4 hints total

**Expected time per hint:** 1-2 seconds

## Architecture

### Backend Changes

#### 1. In-Memory Task Cache

```typescript
// packages/backend/src/tasks/taskCache.ts
interface TaskContext {
  taskId: string;           // UUID
  subject: string;
  concept: string;
  taskType: string;
  age: number;
  difficulty: number;
  language: string;
  generatedTask: string;
  solution: any;
  hintsGenerated: string[];
  createdAt: number;        // For TTL (30 minutes)
}

class TaskCache {
  private cache = new Map<string, TaskContext>();
  private readonly TTL = 30 * 60 * 1000;

  set(taskId: string, context: TaskContext): void
  get(taskId: string): TaskContext | null
  cleanExpired(): void  // Periodic cleanup
}
```

**Implementation note:** Start with simple in-process Map. Easy to swap for Redis later if multi-instance scaling needed.

#### 2. Modified API Endpoints

**Modified: `GET /api/task`**
```json
Response (no hints field):
{
  "taskId": "uuid-v4",
  "type": "multiple_choice",
  "title": "Task title",
  "task": "<p>Task description HTML</p>",
  "options": [...],
  "solution": {...}
}
```

**New: `POST /api/task/:taskId/hint`**
```json
Response:
{
  "hint": "Progressive hint text",
  "hintNumber": 1,
  "totalHintsAvailable": 4
}

Errors:
- 404: Task expired or not found
- 429: All 4 hints already retrieved
```

#### 3. Service Layer Changes

```typescript
// packages/backend/src/tasks/task.service.ts

// Modified: Remove hints from generation
async generateTask(request: TaskRequest, language: string): Promise<TaskResponse> {
  // Generate task + solution only
  // Store context in cache
  // Return without hints
}

// New: Generate single hint on-demand
async generateHint(taskId: string): Promise<{ hint: string; hintNumber: number }> {
  const context = taskCache.get(taskId);
  if (!context) throw new NotFoundError('Task expired');

  const hintNumber = context.hintsGenerated.length + 1;
  if (hintNumber > 4) throw new TooManyRequestsError('All hints used');

  // Build prompt for specific hint using context
  const hint = await aiClient.generate(buildHintPrompt(context, hintNumber));

  context.hintsGenerated.push(hint);
  taskCache.set(taskId, context);

  return { hint, hintNumber };
}
```

#### 4. File Structure

```
packages/backend/src/tasks/
├── task.controller.ts      # Modified: new response format
├── task.service.ts          # Modified: generateTask(), new: generateHint()
├── taskCache.ts             # New: Cache implementation
├── hint.controller.ts       # New: POST /:taskId/hint
└── utils/
    └── promptBuilder.ts     # Modified: buildHintPrompt() helper
```

### Frontend Changes

#### 1. API Client

```typescript
// packages/frontend/src/api/taskApi.ts

// Modified interface
interface TaskResponse {
  taskId: string;        // Now required
  type: string;
  title: string;
  task: string;
  solution: any;
  // hints removed
}

// New function
async function getHint(taskId: string): Promise<{
  hint: string;
  hintNumber: number;
  totalHintsAvailable: number;
}>
```

#### 2. State Management

```typescript
// packages/frontend/src/features/Task/hooks/useTask.ts

// Add local hint state
const [hints, setHints] = useState<string[]>([]);

// New mutation
const hintMutation = useMutation({
  mutationFn: () => getHint(task.taskId),
  onSuccess: (data) => setHints(prev => [...prev, data.hint])
});

const requestHint = () => {
  if (hints.length < 4) hintMutation.mutate();
};
```

#### 3. UI Components

```typescript
// packages/frontend/src/features/Task/TaskPage/HintButton.tsx

<button
  onClick={requestHint}
  disabled={hints.length >= 4 || hintMutation.isPending}
>
  {hintMutation.isPending ? 'Loading...' : `Get Hint (${hints.length}/4)`}
</button>

{hints.map((hint, index) => (
  <HintDisplay key={index} number={index + 1} text={hint} />
))}
```

## User Experience Flow

1. User selects subject/concept
2. Task loads **FAST** (2-3s, no hints)
3. User reads task and begins thinking
4. User clicks "Get Hint" → Brief loading (1-2s) → Hint appears
5. Repeat up to 4 times as needed
6. Many users will use 0-2 hints, saving generation time

## Benefits

### Performance
- **70-80% faster initial load** (hints represent ~40% of response tokens)
- **Perceived performance boost** (task available immediately)
- **Progressive loading** (hints during natural thinking pauses)

### Cost Efficiency
- **Pay only for used hints** (estimate 30-50% hint usage reduction)
- **Smaller cache footprint** (store context not full hints)

### User Experience
- **Faster time-to-interact** (can start reading task sooner)
- **Progressive disclosure** (hints feel more natural)
- **No wasted bandwidth** (don't send unused hints)

## Implementation Phases

### Phase 1: Backend Core
1. Create `TaskCache` with in-memory Map
2. Modify `TaskService.generateTask()` to exclude hints
3. Create `TaskService.generateHint()`
4. Update prompt templates for hint generation

### Phase 2: Backend API
1. Modify `GET /api/task` response format
2. Create `POST /api/task/:taskId/hint` endpoint
3. Add error handling (404 expired, 429 too many)
4. Add cache cleanup job (periodic expired task removal)

### Phase 3: Frontend Core
1. Update `TaskResponse` interface
2. Create `getHint()` API client function
3. Add hint state management to `useTask` hook
4. Create hint mutation with React Query

### Phase 4: Frontend UI
1. Update `HintButton` component for on-demand loading
2. Add loading states and error handling
3. Update hint display to show progressive list
4. Test hint request flow

### Phase 5: Testing & Validation
1. Test hint generation quality (are individual prompts good?)
2. Verify cache expiration works correctly
3. Load test hint endpoints
4. Measure actual performance improvements

## Future Enhancements

### Immediate (can add during implementation)
- Hint generation retry logic
- Cache hit metrics/logging
- Hint request rate limiting per task

### Later (if needed)
- **Redis cache** for multi-instance scaling
- **Pre-generate first hint** in background after task load
- **Hint personalization** based on user history
- **Analytics** on hint usage patterns

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|----------|
| Cache expires mid-session | User loses hints | Set 30min TTL (longer than typical session) |
| Individual hint quality lower | Poor UX | Use detailed context in hint prompts |
| Multiple hint requests slow | Perceived lag | Add optimistic UI updates, show loading states |
| Memory leak from cache | Server instability | Implement periodic cleanup, monitor cache size |

## Success Metrics

- Initial task load time: Target <3s (from 5-10s)
- Hint generation time: Target <2s per hint
- Hint usage rate: Measure actual usage (hypothesis: 30-50% reduction)
- Error rate: <1% for hint requests (expired cache)

## Breaking Changes

**Frontend API contract changes:**
- `TaskResponse` no longer includes `hints` array
- `taskId` is now required in response
- New endpoint required: `POST /api/task/:taskId/hint`

**No backward compatibility needed** (pre-production system).
