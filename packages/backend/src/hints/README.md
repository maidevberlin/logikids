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

Features:
- Language-aware responses (using Accept-Language header)
- Supports both JSON and plain text AI responses
- Zod schema validation for requests and responses
- Considers previous hints for context-aware help

## Prompt Templates

Hint prompts are stored in `/prompts/prompt.yaml`.

Variables available in prompts:
- `{{task}}` - The task text
- `{{solution}}` - The task's solution
- `{{difficulty}}` - Task difficulty
- `{{age}}` - Target age
- `{{language}}` - Target language
- `{{previousHints}}` - Previously given hints 