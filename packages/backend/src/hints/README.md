# Hint Domain

This domain handles the generation of contextual hints for tasks using AI, helping users solve problems step by step.

## Structure

- `router.ts` - Express router for hint endpoints
- `hint.controller.ts` - Request handling and response formatting
- `hint.service.ts` - Core business logic for hint generation
- `types.ts` - Type definitions and Zod schemas
- `/prompts` - YAML files containing AI prompts

## API Endpoints

### POST /api/hint
Generates a hint for a specific task, considering previous hints.

Request Body:
```typescript
{
  task: {
    task: string;          // The task text
    solution: number;      // The task's solution
    metadata: {           // Task metadata
      difficulty: string;
      age: number;
      subject: string;
      provider: string;
      model: string;
      language: string;
    }
  },
  previousHints: {        // Array of previously given hints
    hint: string;
  }[]
}
```

Response:
```typescript
{
  hint: string;  // The generated hint text
}
```

## Prompt Templates

Hint prompts are stored in `/prompts/prompt.yaml`.

Variables available in prompts:
- `{{task}}` - The task text
- `{{solution}}` - The task's solution
- `{{difficulty}}` - Task difficulty
- `{{age}}` - Target age
- `{{language}}` - Target language
- `{{previousHints}}` - Previously given hints 