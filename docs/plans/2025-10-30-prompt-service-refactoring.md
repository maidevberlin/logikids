# PromptService Refactoring

**Date:** 2025-10-30
**Status:** Design Approved

## Problem

Prompt building logic is duplicated between `TaskService` and `test-prompt.ts`. The test script copies the same initialization and prompt building code (lines 64-120 in test-prompt.ts), which makes it fragile and not a true test of the production code path.

## Solution

Extract prompt building logic into a dedicated `PromptService` that both `TaskService` and `test-prompt.ts` can use.

## Architecture

### New Component

**File:** `packages/backend/src/prompts/prompt.service.ts`

**Responsibilities:**
- Initialize and manage `PromptLoader` and `VariationLoader`
- Provide clean API to build prompts from task generation parameters
- Encapsulate all prompt building logic in one reusable place

### Interface

```typescript
interface PromptBuildingParams {
  subject: Subject;           // From subjectRegistry
  taskType: TaskType;         // From taskTypeRegistry
  concept: Concept;           // From subjectRegistry (renamed from EnrichedConcept)
  age: number;                // Used in templates (e.g., {{age}})
  grade: number;              // Used in templates (e.g., {{grade}})
  difficulty: Difficulty;     // Used in templates (e.g., {{difficulty}})
  language: string;           // Used in templates (e.g., {{language}})
  gender?: Gender;            // Optional, used in templates
}

class PromptService {
  private promptLoader: PromptLoader;
  private variationLoader: VariationLoader;

  constructor()

  async initialize(): Promise<void>
  // Load all variations via variationLoader.loadAll()

  async buildPrompt(params: PromptBuildingParams): Promise<string>
  // 1. Load base prompt, variations template, hint prompt
  // 2. Create PromptBuilder with subject, taskType, loaders, templates
  // 3. Build and return final prompt string
}
```

## Implementation Changes

### 1. Create PromptService

Extract TaskService lines 64-98 into `PromptService.buildPrompt()`:
- Load base prompt, variations template, hint prompt
- Instantiate PromptBuilder
- Call `promptBuilder.buildPrompt(params)`
- Return prompt string

### 2. Update TaskService

Replace lines 64-98 with:
```typescript
const prompt = await this.promptService.buildPrompt({
  subject,
  taskType,
  concept,
  age: request.age,
  grade: request.grade,
  difficulty: request.difficulty,
  language,
  gender: request.gender
});
```

Add PromptService as dependency:
```typescript
constructor(
  private readonly aiClient: AIClient,
  private readonly promptService: PromptService
) {}
```

### 3. Simplify test-prompt.ts

Replace lines 90-120 with:
```typescript
const promptService = new PromptService();
await promptService.initialize();

const prompt = await promptService.buildPrompt({
  subject: subjectObj,
  taskType: taskTypeObj,
  concept: enrichedConcept,
  age: calculateAgeFromGrade(grade),
  grade,
  difficulty,
  language,
  gender: gender || undefined
});

console.log(prompt);
```

## Benefits

1. **Single Source of Truth**: Prompt building logic lives in one place
2. **True Testing**: test-prompt.ts uses actual production code path
3. **Maintainability**: Changes to prompt building happen in one file
4. **Reusability**: Other services can use PromptService if needed
5. **Separation of Concerns**: TaskService focuses on orchestration, PromptService handles prompts

## Migration Notes

- No breaking changes to external API (task.controller.ts unchanged)
- Internal refactoring only
- Concept type renamed from `EnrichedConcept` to `Concept` (simpler naming)
- Added `age` parameter to PromptBuildingParams (already used in templates)

## Files Affected

- **New:** `packages/backend/src/prompts/prompt.service.ts`
- **Modified:** `packages/backend/src/tasks/task.service.ts`
- **Modified:** `packages/backend/src/cli/test-prompt.ts`
- **Modified:** `packages/backend/src/index.ts` (initialize PromptService)
