# Task Type System Refactoring Plan

## Overview
Moving from a distributed file system for task types to a consolidated single-file configuration system with automatic registration.

## Current Structure
```
packages/backend/src/tasks/taskTypes/
├── types.ts                # Task type interfaces and registry
├── index.ts               # Task type exports
├── multipleChoice/
│   ├── index.ts           # Multiple choice exports
│   ├── type.ts            # Multiple choice implementation
│   └── types.ts           # Multiple choice types
└── yesNo/
    ├── index.ts           # Yes/No exports
    ├── type.ts            # Yes/No implementation
    └── types.ts           # Yes/No types
```

## Target Structure
```
packages/backend/src/tasks/taskTypes/
├── registry.ts           # Task type registration and loading
├── types.ts             # Shared types and base class
└── types/               # All task type implementations
    ├── index.ts         # Exports all task types
    ├── multipleChoice.ts # Multiple choice task type
    └── yesNo.ts         # Yes/No task type
```

## Step-by-Step Refactoring

### 1. Create Base Task Type Class and Types
```typescript
// types.ts
import { z } from 'zod';

export interface TaskResponse {
  type: string;
  title: string;
  task: string;
  hints: string[];
}

export abstract class BaseTaskType<T extends TaskResponse = TaskResponse> {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly promptTemplate: string;
  abstract readonly responseSchema: z.ZodType<T>;

  validateResponse(response: unknown): response is T {
    const result = this.responseSchema.safeParse(response);
    return result.success;
  }
}
```

### 2. Create Task Type Registry
```typescript
// registry.ts
import { BaseTaskType, TaskResponse } from './types';
import * as taskTypes from './types';

export class TaskTypeRegistry {
  private static instance: TaskTypeRegistry;
  private taskTypes: Map<string, BaseTaskType> = new Map();

  private constructor() {
    Object.values(taskTypes).forEach(taskType => {
      if (taskType instanceof BaseTaskType) {
        this.taskTypes.set(taskType.id, taskType);
      }
    });
  }

  public static getInstance(): TaskTypeRegistry {
    if (!TaskTypeRegistry.instance) {
      TaskTypeRegistry.instance = new TaskTypeRegistry();
    }
    return TaskTypeRegistry.instance;
  }

  public get(id: string): BaseTaskType | undefined {
    return this.taskTypes.get(id);
  }

  public getAll(): BaseTaskType[] {
    return Array.from(this.taskTypes.values());
  }
}

export const registry = TaskTypeRegistry.getInstance();
```

### 3. Example Task Type Implementations

#### Multiple Choice Task Type
```typescript
// types/multipleChoice.ts
import { z } from 'zod';
import { BaseTaskType, TaskResponse } from '../types';

interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface MultipleChoiceResponse extends TaskResponse {
  options: MultipleChoiceOption[];
}

const multipleChoiceSchema = z.object({
  type: z.literal('multiple_choice'),
  title: z.string().min(1),
  task: z.string().min(1),
  hints: z.array(z.string().min(1)).length(4),
  options: z.array(z.object({
    text: z.string().min(1),
    isCorrect: z.boolean(),
    explanation: z.string().min(1).optional()
  }))
  .length(4)
  .refine(
    options => options.filter(opt => opt.isCorrect).length === 1,
    'Exactly one option must be correct'
  )
  .refine(
    options => options.every(opt => !opt.isCorrect || opt.explanation),
    'Correct option must have an explanation'
  )
});

export class MultipleChoiceType extends BaseTaskType<MultipleChoiceResponse> {
  readonly id = 'multiple_choice';
  readonly name = 'Multiple Choice';
  readonly description = 'A task with exactly 4 options where one is correct';
  readonly responseSchema = multipleChoiceSchema;
  readonly promptTemplate = `
## TASK STRUCTURE
  A task has this structure:
  {
    "title": "Clear, descriptive, creative title",
    "task": "Complete task description in HTML",
    "options": [
      {
        "text": "Option text",
        "isCorrect": boolean (true/false),
        "explanation": "Explanation for correct option"
      }
    ],
    "hints": ["General approach", "Key concept", "Major step", "Complete Solution"]
  }

## INSTRUCTIONS FOR TASK CREATION

### CREATE TASK TITLE AND DESCRIPTION
   - Write a clear, focused, but creative problem statement.
   - Use age-appropriate language, concepts, and scenarios.
   - Include ALL necessary information for solving the problem.
   - Use HTML formatting to improve readability and structure/highlight important information.

### CREATE THE SOLUTION OPTION
   - Think through the correct answer logically before creating options.
   - Write the correct answer as an option with "isCorrect" set to 'true' and provide an explanation.

### VALIDATE THE CORRECTNESS
   - Ensure the selected "isCorrect" option aligns with the reasoning and explanation.
   - If the selected correct answer is wrong, do not explain why it's wrong; **correct it immediately and update the response**.

### CREATE THE INCORRECT OPTIONS AND SHUFFLE
   - Create EXACTLY THREE plausible but incorrect answers as text, set "isCorrect" to 'false', and omit explanations.
   - Shuffle all four created options.

### CREATE HINTS
   - Create 4 progressive hints that gradually build understanding:
     1. Reframe the problem in simpler terms and highlight the goal (without giving away the solution).
     2. Point out a specific detail or pattern in the problem that's crucial for solving it.
     3. Help narrow down the options by explaining why certain approaches wouldn't work.
     4. Walk through the logical steps to reach the correct answer (but don't directly state it).

## RESPONSE TEMPLATE (JSON)
{
  "title": "Clear, descriptive, creative title",
  "task": "Complete task description in HTML",
  "options": [
    {
      "text": "First option",
      "isCorrect": false
    },
    {
      "text": "Second option",
      "isCorrect": false
    },
    {
      "text": "Correct option",
      "isCorrect": true,
      "explanation": "Detailed explanation why this is the correct answer"
    },
    {
      "text": "Fourth option",
      "isCorrect": false
    }
  ],
  "hints": [
    "General approach",
    "Key concept",
    "Major step",
    "Almost complete"
  ]
}

## ADDITIONAL INSTRUCTION
- If the task generation leads to an incorrect or illogical correct option, **fix the issue and regenerate the options.**
- Ensure no conflicting statements exist between the correct option and its explanation.
- The final response should always be internally consistent.
  `;
}

// Export singleton instance
export const multipleChoiceType = new MultipleChoiceType();
```

#### Yes/No Task Type
```typescript
// types/yesNo.ts
import { z } from 'zod';
import { BaseTaskType, TaskResponse } from '../types';

interface YesNoSolution {
  answer: boolean;
  explanation: string;
}

interface YesNoResponse extends TaskResponse {
  solution: YesNoSolution;
}

const yesNoSchema = z.object({
  type: z.literal('yes_no'),
  title: z.string().min(1),
  task: z.string().min(1),
  hints: z.array(z.string().min(1)).length(4),
  solution: z.object({
    answer: z.boolean(),
    explanation: z.string().min(1)
  })
});

export class YesNoType extends BaseTaskType<YesNoResponse> {
  readonly id = 'yes_no';
  readonly name = 'Yes/No';
  readonly description = 'A task that can be answered with yes or no';
  readonly responseSchema = yesNoSchema;
  readonly promptTemplate = `
## Task Creation Guidelines for Yes/No Questions
Age: {{age}} | Difficulty: {{difficulty}}

1. TASK STRUCTURE
   - Write a clear, focused question that can be answered with Yes or No
   - Include ALL necessary information for solving
   - Use simple, age-appropriate language
   - Format in HTML for readability
   - Question should be unambiguous with a clear correct answer

2. SOLUTION STRUCTURE [CRITICAL]
   - Answer must be strictly true or false
   - Provide a detailed explanation of why the answer is correct
   - Include key reasoning points
   - Reference specific details from the question

3. HINTS STRUCTURE
   - Create 4 progressive hints:
     1. General approach/starting point
     2. Key concept to focus on
     3. Major step in reasoning
     4. Everything except final answer

## Response Template (JSON)
{
  "title": "Clear, descriptive title",
  "task": "Complete task description in HTML, ending with a clear yes/no question",
  "solution": {
    "answer": true,  // or false
    "explanation": "Detailed explanation of why the answer is correct"
  },
  "hints": [
    "General approach",
    "Key concept",
    "Major step",
    "Almost complete"
  ]
}`;
}

// Export singleton instance
export const yesNoType = new YesNoType();
```

### 4. Migration Steps
1. Create new files:
   ```bash
   touch packages/backend/src/tasks/taskTypes/registry.ts
   touch packages/backend/src/tasks/taskTypes/types/index.ts
   ```

2. For each task type:
   - Create single file in `types/` directory
   - Move prompt template into the file
   - Define response schema using Zod
   - Implement BaseTaskType
   - Add export to `types/index.ts`

3. Testing:
   - Test task type loading
   - Test response validation
   - Test prompt generation
   - Verify schema validation

4. Cleanup:
   - Remove old files only after all tests pass
   - Keep backup until verified in production

## Benefits
- Single file per task type
- Schema-based validation using Zod
- Clear response format documentation in the file
- Automatic registration
- Type-safe exports
- Better IDE support
- Easier to add new task types

## Migration Progress Tracking

### 1. Core Setup
- [x] Create `types.ts` with base class and types
- [x] Create `registry.ts` with registry implementation
- [x] Create empty `types/index.ts`

### 2. Multiple Choice Migration
- [x] Create `types/multipleChoice.ts`
- [x] Define response schema
- [x] Copy prompt template
- [x] Add export to `types/index.ts`
- [ ] Test functionality

### 3. Yes/No Migration
- [x] Create `types/yesNo.ts`
- [x] Define response schema
- [x] Copy prompt template
- [x] Add export to `types/index.ts`
- [ ] Test functionality

### 4. Integration
- [x] Update task service to use new registry
- [ ] Run all tests
- [ ] Test task generation
- [ ] Test response validation
- [ ] Test error handling

### 5. Cleanup
- [x] Verify all functionality works
- [x] Remove old files:
  - [x] `taskTypes/*/type.ts` files
  - [x] `taskTypes/*/types.ts` files
  - [x] `taskTypes/*/index.ts` files
  - [x] `prompts/taskTypes/*` files
- [ ] Update documentation

### 6. Verification
- [ ] All tests passing
- [ ] Task generation working
- [ ] Response validation working
- [ ] Error handling working
- [ ] Documentation updated

Note: Keep old files until everything is verified working in production. 