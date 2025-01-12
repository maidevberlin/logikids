# Backend Tasks Module

This module handles task generation for different subjects and task types.

## Structure

```
src/tasks/
├── subjects/        
│   ├── base.ts      # Base subject class and interfaces
│   ├── index.ts     # Exports all subjects
│   ├── registry.ts  # Subject registry (singleton)
│   ├── math.ts      # Math subject implementation
│   ├── logic.ts     # Logic subject implementation
│   ├── music.ts     # Music subject implementation
│   └── physics.ts   # Physics subject implementation
└── types/          
    ├── base.ts      # Base task type class and interfaces
    ├── index.ts     # Exports all task types
    ├── registry.ts  # Task type registry (singleton)
    ├── multipleChoice.ts
    └── yesNo.ts
```

## Adding New Components

### Adding a New Subject
1. Create a new file in `src/tasks/subjects/` (e.g., `chemistry.ts`)
2. Extend `BaseSubject` from `subjects/base.ts`
3. Export a singleton instance
4. Add export to `subjects/index.ts`

Example:
```typescript
import { Concept, BaseSubject } from './base';

class ChemistrySubject extends BaseSubject {
  readonly id = 'chemistry';
  readonly name = 'Chemistry';
  readonly description = 'Chemical concepts and reactions';
  readonly basePromptTemplate = '...';
  
  readonly concepts: Record<string, Concept> = {
    atoms: {
      id: 'atoms',
      name: 'Atoms',
      description: 'Basic building blocks of matter',
      promptTemplate: `
Focus on creating an atoms-related problem that:
- Explains atomic structure
- Uses age-appropriate examples
- Connects to real-world applications
- Includes basic atomic concepts`
    }
  };
}

export const chemistrySubject = new ChemistrySubject();
```

### Adding a New Task Type
1. Create a new file in `src/tasks/types/` (e.g., `matching.ts`)
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
- `src/tasks/subjects/registry.ts` - Singleton registry for subjects
- `src/tasks/types/registry.ts` - Singleton registry for task types
- Both use automatic registration through imports

### Base Classes
- `src/tasks/subjects/base.ts` - Defines `Subject` interface and `BaseSubject` class
- `src/tasks/types/base.ts` - Defines `TaskResponse` interface and `BaseTaskType` class

### Common Types
- `types.ts` - Common types and validation schemas
- Uses Zod for runtime validation
- Defines request/response types 