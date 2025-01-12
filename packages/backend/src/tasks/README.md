# Tasks Module

This module handles task generation for different subjects and task types.

## Structure

```
tasks/
├── registry.ts       # Subject registry (singleton)
├── typeRegistry.ts   # Task type registry (singleton)
├── types.ts         # Common types and schemas
├── subjects/        # Subject implementations
│   ├── base.ts      # Base subject class and interfaces
│   ├── index.ts     # Exports all subjects
│   ├── math.ts      # Math subject implementation
│   ├── logic.ts     # Logic subject implementation
│   ├── music.ts     # Music subject implementation
│   └── physics.ts   # Physics subject implementation
└── types/          # Task type implementations
    ├── base.ts      # Base task type class and interfaces
    ├── index.ts     # Exports all task types
    ├── multipleChoice.ts
    └── yesNo.ts

```

## Adding New Components

### Adding a New Subject
1. Create a new file in `subjects/` (e.g., `chemistry.ts`)
2. Extend `BaseSubject` from `subjects/base.ts`
3. Export a singleton instance
4. Add export to `subjects/index.ts`

Example:
```typescript
import { Concept, BaseSubject } from './base';

class ChemistrySubject extends BaseSubject {
  readonly id = 'chemistry';
  readonly name = 'Chemistry';
  readonly description = '...';
  readonly basePromptTemplate = '...';
  readonly concepts = {
    atoms: {
      id: 'atoms',
      name: 'Atoms',
      description: '...',
      promptTemplate: '...'
    }
  };
}

export const chemistrySubject = new ChemistrySubject();
```

### Adding a New Task Type
1. Create a new file in `types/` (e.g., `matching.ts`)
2. Extend `BaseTaskType` from `types/base.ts`
3. Define response schema using Zod
4. Export a singleton instance
5. Add export to `types/index.ts`

Example:
```typescript
import { z } from 'zod';
import { BaseTaskType, TaskResponse } from './base';

interface MatchingResponse extends TaskResponse {
  pairs: Array<{
    left: string;
    right: string;
  }>;
}

const matchingSchema = z.object({
  type: z.literal('matching'),
  title: z.string().min(1),
  task: z.string().min(1),
  hints: z.array(z.string()).length(4),
  pairs: z.array(z.object({
    left: z.string(),
    right: z.string()
  }))
});

class MatchingType extends BaseTaskType<MatchingResponse> {
  readonly id = 'matching';
  readonly name = 'Matching';
  readonly description = '...';
  readonly responseSchema = matchingSchema;
  readonly promptTemplate = '...';
}

export const matchingType = new MatchingType();
```

## Key Components

### Registries
- `registry.ts` - Singleton registry for subjects
- `typeRegistry.ts` - Singleton registry for task types
- Both use automatic registration through imports

### Base Classes
- `subjects/base.ts` - Defines `Subject` interface and `BaseSubject` class
- `types/base.ts` - Defines `TaskResponse` interface and `BaseTaskType` class

### Common Types
- `types.ts` - Common types and validation schemas
- Uses Zod for runtime validation
- Defines request/response types 