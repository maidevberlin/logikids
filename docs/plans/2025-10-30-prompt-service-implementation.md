# PromptService Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract prompt building logic into dedicated PromptService to eliminate code duplication between TaskService and test-prompt.ts

**Architecture:** Create new PromptService that encapsulates PromptLoader, VariationLoader, and PromptBuilder initialization and usage. Both TaskService and test-prompt.ts will use this service.

**Tech Stack:** TypeScript, Bun runtime, existing loader/builder infrastructure

---

## Task 1: Create PromptBuildingParams Interface

**Files:**
- Create: `packages/backend/src/prompts/types.ts`

**Step 1: Create types file with interface**

```typescript
import { Subject, HintPrompt } from './loader';
import { TaskTypeWithSchema } from '../tasks/types/registry';
import { Concept } from './schemas';
import { Difficulty, Gender } from '../tasks/types';

/**
 * Parameters required to build a complete prompt
 */
export interface PromptBuildingParams {
  subject: Subject;           // From subjectRegistry
  taskType: TaskTypeWithSchema;  // From taskTypeRegistry
  concept: Concept;           // From subjectRegistry
  age: number;                // Student age (used in templates)
  grade: number;              // Grade level (used in templates)
  difficulty: Difficulty;     // Task difficulty
  language: string;           // Response language (e.g., "en", "de")
  gender?: Gender;            // Optional student gender
}
```

**Step 2: Commit**

```bash
git add packages/backend/src/prompts/types.ts
git commit -m "feat: add PromptBuildingParams interface"
```

---

## Task 2: Create PromptService

**Files:**
- Create: `packages/backend/src/prompts/prompt.service.ts`

**Step 1: Create service file with basic structure**

```typescript
import { PromptLoader } from './loader';
import { VariationLoader } from '../variations/loader';
import { PromptBuilder } from './builder';
import { PromptBuildingParams } from './types';

/**
 * Service responsible for building prompts for task generation
 * Encapsulates all prompt loading and building logic
 */
export class PromptService {
  private readonly promptLoader: PromptLoader;
  private readonly variationLoader: VariationLoader;

  constructor() {
    this.promptLoader = new PromptLoader();
    this.variationLoader = new VariationLoader();
  }

  /**
   * Initialize the service by loading all variations
   */
  async initialize(): Promise<void> {
    console.log('[PromptService] Initializing...');
    await this.variationLoader.loadAll();
    console.log('[PromptService] Initialization complete');
  }

  /**
   * Build a complete prompt for task generation
   * @param params Parameters for prompt building
   * @returns Complete prompt string ready for AI client
   */
  async buildPrompt(params: PromptBuildingParams): Promise<string> {
    console.log('[PromptService] Building prompt');
    console.log('[PromptService] Subject:', params.subject.id);
    console.log('[PromptService] Concept:', params.concept.id);
    console.log('[PromptService] Task Type:', params.taskType.id);

    // Load base prompt
    const basePrompt = await this.promptLoader.loadBasePrompt();
    console.log('[PromptService] Base prompt loaded');

    // Load variations template
    const variationsTemplate = await this.promptLoader.loadVariationsTemplate();
    console.log('[PromptService] Variations template loaded');

    // Load hint prompt
    const hintPrompt = await this.promptLoader.loadHintPrompt();
    console.log('[PromptService] Hint prompt loaded:', hintPrompt.id);

    // Create prompt builder
    const promptBuilder = new PromptBuilder(
      params.subject,
      params.taskType,
      this.variationLoader,
      basePrompt,
      variationsTemplate,
      hintPrompt
    );

    // Build the final prompt
    const finalPrompt = promptBuilder.buildPrompt({
      subject: params.subject.id,
      concept: params.concept,
      grade: params.grade,
      difficulty: params.difficulty,
      language: params.language,
      taskType: params.taskType.id,
      gender: params.gender
    });

    console.log('[PromptService] Prompt built, length:', finalPrompt.length, 'chars');

    return finalPrompt;
  }
}
```

**Step 2: Commit**

```bash
git add packages/backend/src/prompts/prompt.service.ts
git commit -m "feat: create PromptService for prompt building"
```

---

## Task 3: Update TaskService to Use PromptService

**Files:**
- Modify: `packages/backend/src/tasks/task.service.ts`

**Step 1: Import PromptService and update constructor**

Replace imports and constructor:

```typescript
// Add to imports
import { PromptService } from '../prompts/prompt.service';

// Update constructor
constructor(
  private readonly aiClient: AIClient,
  private readonly promptService: PromptService
) {}

// Remove these lines:
// private readonly promptLoader: PromptLoader;
// private readonly variationLoader: VariationLoader;
//
// constructor(private readonly aiClient: AIClient) {
//   this.promptLoader = new PromptLoader();
//   this.variationLoader = new VariationLoader();
// }
```

**Step 2: Remove initialize method**

Delete the entire initialize method (lines 21-28):

```typescript
// DELETE THIS METHOD - no longer needed
async initialize(): Promise<void> {
  console.log('[TaskService] Initializing...');
  await this.variationLoader.loadAll();
  console.log('[TaskService] Initialization complete');
}
```

**Step 3: Replace prompt building logic in generateTask**

Replace lines 64-98 with PromptService call:

```typescript
// OLD CODE (DELETE lines 64-98):
// Load base prompt
// const basePrompt = await this.promptLoader.loadBasePrompt();
// ... (all the way to)
// const finalPrompt = promptBuilder.buildPrompt(params);

// NEW CODE:
// Calculate age from grade (grade + 6: grade 2 = ~8yo, grade 13 = ~19yo)
const age = request.grade + 6;

// Build prompt using PromptService
const finalPrompt = await this.promptService.buildPrompt({
  subject,
  taskType: selectedTaskType,
  concept,
  age,
  grade: request.grade,
  difficulty: request.difficulty,
  language,
  gender: request.gender
});
```

**Step 4: Run TypeScript check**

```bash
docker compose exec backend-dev bun --check src/tasks/task.service.ts
```

Expected: No type errors

**Step 5: Commit**

```bash
git add packages/backend/src/tasks/task.service.ts
git commit -m "refactor: use PromptService in TaskService"
```

---

## Task 4: Update Router to Initialize PromptService

**Files:**
- Modify: `packages/backend/src/tasks/router.ts`

**Step 1: Import and initialize PromptService**

Update the router creation:

```typescript
// Add import
import { PromptService } from '../prompts/prompt.service';

// Update createTaskRouter function
export async function createTaskRouter(): Promise<Router> {
  const router = Router();
  const aiClient = await createAIClient();

  // Create and initialize PromptService
  const promptService = new PromptService();
  await promptService.initialize();

  // Pass promptService to TaskService
  const taskService = new TaskService(aiClient, promptService);
  // Remove: await taskService.initialize(); // No longer needed

  const taskController = new TaskController(aiClient);
  const hintService = new HintService(aiClient);
  await hintService.initialize();
  const hintController = new HintController(hintService);

  // ... rest of the router setup
}
```

**Step 2: Run TypeScript check**

```bash
docker compose exec backend-dev bun --check src/tasks/router.ts
```

Expected: No type errors

**Step 3: Commit**

```bash
git add packages/backend/src/tasks/router.ts
git commit -m "refactor: initialize PromptService in router"
```

---

## Task 5: Simplify test-prompt.ts

**Files:**
- Modify: `packages/backend/src/cli/test-prompt.ts`

**Step 1: Replace prompt building logic**

Replace lines 90-120:

```typescript
// Add import at top
import { PromptService } from '../prompts/prompt.service';

// DELETE lines 90-120 (from "Load base prompt" to "const prompt = promptBuilder.buildPrompt(params)")

// REPLACE with:

// Create and initialize PromptService
if (verbose) console.log('Initializing PromptService...');
const promptService = new PromptService();
await promptService.initialize();

// Calculate age from grade
const age = grade + 6;

// Build prompt using PromptService
if (verbose) console.log('Building prompt...');
const prompt = await promptService.buildPrompt({
  subject: subjectObj,
  taskType: taskTypeObj,
  concept: enrichedConcept,
  age,
  grade,
  difficulty,
  language,
  gender: gender || undefined
});
```

**Step 2: Remove unused imports**

Remove these imports (no longer needed):

```typescript
// DELETE:
import { PromptBuilder } from '../prompts/builder';
import { VariationLoader } from '../variations/loader';
import { PromptLoader } from '../prompts/loader';
```

**Step 3: Test the CLI script**

```bash
docker compose exec backend-dev bun run src/cli/test-prompt.ts --subject=math --concept=grade5-angles --grade=5 --difficulty=medium --language=en --verbose
```

Expected: Should output a complete prompt without errors

**Step 4: Test without verbose flag**

```bash
docker compose exec backend-dev bun run src/cli/test-prompt.ts --subject=logic --concept=patterns --grade=8 --difficulty=hard --language=de
```

Expected: Should output just the prompt (no debug logs)

**Step 5: Commit**

```bash
git add packages/backend/src/cli/test-prompt.ts
git commit -m "refactor: use PromptService in test-prompt.ts"
```

---

## Task 6: Integration Testing

**Files:**
- Test: Full backend flow

**Step 1: Start backend in dev mode**

```bash
docker compose up backend-dev
```

Expected: Server starts without errors, logs show PromptService initialization

**Step 2: Test task generation API**

```bash
curl -s "http://localhost:5175/api/task?subject=math&concept=grade5-angles&taskType=multipleChoice&grade=5&difficulty=medium" -H "Accept-Language: en" | jq .
```

Expected: Valid task response with taskId, task content, options

**Step 3: Test with different subject**

```bash
curl -s "http://localhost:5175/api/task?subject=logic&concept=patterns&taskType=yesNo&grade=10&difficulty=hard" -H "Accept-Language: de" | jq .
```

Expected: Valid task response in German

**Step 4: Test subjects endpoint**

```bash
curl -s "http://localhost:5175/api/task/subjects" | jq '.subjects[0]'
```

Expected: List of subjects with concepts

**Step 5: Verify logs show PromptService usage**

Check docker logs:

```bash
docker compose logs backend-dev | grep PromptService
```

Expected: Should see `[PromptService] Initializing...` and `[PromptService] Building prompt` logs

---

## Task 7: Final Commit and Cleanup

**Step 1: Check git status**

```bash
git status
```

Expected: All changes committed, working tree clean

**Step 2: Review commit history**

```bash
git log --oneline -7
```

Expected: Should see 6 feature commits for this refactoring

**Step 3: Run full backend test suite**

```bash
docker compose exec backend-dev bun test
```

Expected: All tests pass (no regressions)

**Step 4: Final verification - run multiple test prompts**

```bash
for subject in math logic physics; do
  echo "=== Testing $subject ==="
  docker compose exec backend-dev bun run src/cli/test-prompt.ts --subject=$subject --grade=7 --difficulty=medium --language=en | head -20
  echo ""
done
```

Expected: Each subject generates valid prompt output

---

## Success Criteria

- ✓ PromptService created with clean interface
- ✓ TaskService simplified, no prompt building logic
- ✓ test-prompt.ts simplified, uses PromptService
- ✓ All TypeScript checks pass
- ✓ API endpoints work correctly
- ✓ CLI test script works correctly
- ✓ No code duplication between TaskService and test-prompt.ts
- ✓ All tests pass

## Rollback Plan

If issues arise, revert commits in reverse order:

```bash
git log --oneline -7  # Find commit hashes
git revert <hash>     # Revert problematic commit
```
