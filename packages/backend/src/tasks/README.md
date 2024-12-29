# Task Domain

This domain handles the generation of age-appropriate mathematical and logical tasks using AI.

## Structure

- `router.ts` - Express router for task endpoints
- `task.controller.ts` - Request handling and response formatting
- `task.service.ts` - Core business logic for task generation
- `types.ts` - Type definitions and Zod schemas
- `/prompts` - YAML files containing AI prompts

## API Endpoints

### GET /api/task
Generates a new task based on query parameters.

Query Parameters:
- `age`: number (6-21) - Target age group
- `difficulty`: 'easy' | 'medium' | 'hard' - Task difficulty
- `subject`: 'math' | 'logic' - Task subject

Features:
- Language-aware responses (using Accept-Language header)
- Zod schema validation for requests and responses
- AI-powered task generation using templates

## Prompt Templates

Task prompts are stored in YAML files in the `/prompts` directory:
- `math.yaml` - Templates for mathematical tasks
- `logic.yaml` - Templates for logical tasks

Variables available in prompts:
- `{{language}}` - Target language
- `{{age}}` - Target age
- `{{difficulty}}` - Task difficulty 