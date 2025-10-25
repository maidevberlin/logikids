# Prompt Externalization Design

**Date:** 2025-10-25
**Status:** Design Approved
**Goal:** Refactor subject and task type prompt templates from TypeScript code to external Markdown files with YAML frontmatter

## Problem Statement

Currently, all prompt templates for subjects (math, logic, german, etc.) and task types (multipleChoice, yesNo) are embedded as string literals in TypeScript class files. This creates several issues:

1. **Hard to edit**: Non-developers cannot modify prompts without editing TypeScript
2. **Poor version control**: String template changes create noisy diffs in code
3. **Mixed concerns**: Content (prompts) is mixed with code logic
4. **No hot-reload**: Changing prompts requires server restart

## Goals

- **Easier prompt editing**: Content creators can edit markdown files without touching code
- **Better version control**: Clear diffs showing exactly which prompts changed
- **Separation of concerns**: Prompts are content, code handles logic
- **Hot-reload**: Edit prompts without restarting server (development)
- **Simplified code**: Remove class-based structure in favor of plain data objects

## Architecture

### File Structure

```
/prompts/                          # New root-level folder
  subjects/
    math/
      base.md                      # Subject base prompt + metadata
      arithmetic.md                # Concept-specific prompt + metadata
      mental_math.md
      word_problems.md
      fractions.md
      geometry.md
      measurement.md
    logic/
      base.md
      patterns.md
      sequences.md
      spatial_reasoning.md
      ...
    german/
      base.md
      ...
    music/
      base.md
      ...
    physics/
      base.md
      ...
  task-types/
    multipleChoice.md              # Task type prompt + metadata
    yesNo.md
```

### File Format

Each markdown file uses YAML frontmatter for metadata, followed by the prompt template content.

**Subject `base.md` Example:**
```markdown
---
id: math
name: Math
description: Mathematical concepts and problem solving
---

## CONTENT APPROPRIATENESS (CRITICAL)
   A. Language Requirements: ALL content (task, options, explanations, and hints) MUST be in "{{language}}".
   B. Age Requirements: The Task must be appropriate for age {{age}}.
   C. Difficulty Level: Match complexity to difficulty level {{difficulty}}.

## Your Role
You are a creative math teacher tasked with developing engaging and age-appropriate math tasks for students aged {{age}}.
...
```

**Concept File Example (`arithmetic.md`):**
```markdown
---
id: arithmetic
name: Basic Arithmetic
description: Fundamental operations with numbers including addition, subtraction, multiplication, and division
---

Focus on creating an arithmetic problem that:
- Uses basic operations (addition, subtraction, multiplication, division)
- Is appropriate for age {{age}} students
- Has a clear step-by-step solution path
...
```

**Task Type Example (`multipleChoice.md`):**
```markdown
---
id: multipleChoice
name: Multiple Choice
description: Questions with multiple answer options where one is correct
---

Generate a multiple-choice task with:
- One clear question
- 4 answer options
- Only one correct answer
...
```

### Code Architecture

Replace class-based subjects with plain data objects loaded from markdown files.

**New Data Structures:**
```typescript
interface Subject {
  id: string;
  name: string;
  description: string;
  basePromptTemplate: string;
  concepts: Map<string, Concept>;
}

interface Concept {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
}

interface TaskType {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
  responseSchema: ZodSchema;  // Still defined in code
}
```

**Loader System (`packages/backend/src/tasks/loader.ts`):**
```typescript
interface LoadedPrompt {
  metadata: Record<string, any>;  // from frontmatter
  content: string;                // markdown body
}

class PromptLoader {
  private cache: Map<string, LoadedPrompt>;
  private watcher: FSWatcher | null;

  async loadSubject(subjectId: string): Promise<Subject>
  async loadTaskType(typeId: string): Promise<TaskType>

  // Hot-reload: watches /prompts/ directory (dev only)
  private watchForChanges(): void
  private invalidateCache(filePath: string): void

  // Parses markdown with gray-matter
  private parsePromptFile(filePath: string): LoadedPrompt

  // Validates frontmatter with Zod
  private validateMetadata(metadata: any, schema: ZodSchema): void
}
```

**Registry Updates:**
```typescript
// packages/backend/src/tasks/subjects/registry.ts
class SubjectRegistry {
  private subjects: Map<string, Subject>;
  private loader: PromptLoader;

  async initialize() {
    // Scan /prompts/subjects/, load all via PromptLoader
    const subjectDirs = await fs.readdir('/prompts/subjects');
    for (const dir of subjectDirs) {
      const subject = await this.loader.loadSubject(dir);
      this.subjects.set(subject.id, subject);
    }
  }

  get(id: string): Subject | undefined
  getAll(): Subject[]
  getRandomConcept(subjectId: string): Concept | undefined
}

// Similar for TaskTypeRegistry
```

### Hot-Reload Implementation

Using `chokidar` for file watching in development mode:

```typescript
class PromptLoader {
  private setupHotReload(): void {
    if (process.env.NODE_ENV !== 'development') return;

    this.watcher = chokidar.watch('/prompts/**/*.md', {
      ignoreInitial: true
    });

    this.watcher.on('change', (filePath) => {
      console.log(`Prompt updated: ${filePath}`);
      this.invalidateCache(filePath);
    });

    this.watcher.on('add', (filePath) => {
      console.log(`New prompt added: ${filePath}`);
      this.invalidateCache(filePath);
    });
  }
}
```

**Benefits:**
- Edit markdown → save → changes immediately available
- No server restart needed
- Only enabled in development (configurable)

### Error Handling

**Startup Validation:**
- Load ALL prompts on server start
- Validate frontmatter structure with Zod
- Fail fast if any file is invalid
- Descriptive error messages with file path and missing fields

**Example Error Message:**
```
Error loading prompt: /prompts/subjects/math/arithmetic.md
- Missing required field: "id" in frontmatter
- Expected: string
- Received: undefined

Please add:
---
id: arithmetic
name: Basic Arithmetic
description: ...
---
```

**Runtime Handling:**
- Deleted prompt file → 500 error "Subject not available"
- Hot-reload failure → log error, keep cached version
- Malformed frontmatter → detailed Zod validation error

## Migration Strategy

**Clean break approach** - refactor everything at once.

### Step-by-Step Migration

1. **Create `/prompts/` structure**
   - Convert all existing subjects: math, logic, german, music, physics
   - Convert all task types: multipleChoice, yesNo
   - Preserve exact prompt content (no AI instruction changes)

2. **Build loader system**
   - Implement `PromptLoader` class
   - Add gray-matter for YAML parsing
   - Add chokidar for hot-reload
   - Implement Zod validation for frontmatter

3. **Refactor registries**
   - Update `SubjectRegistry` to use `PromptLoader`
   - Update `TaskTypeRegistry` to use `PromptLoader`
   - Remove initialization from class constructors

4. **Remove old code**
   - Delete subject class files: `math.ts`, `logic.ts`, `german.ts`, etc.
   - Delete `base.ts` with `BaseSubject` class
   - Delete task type class files (keep only Zod schemas)
   - Update exports in `index.ts` files

5. **Update imports**
   - Replace subject class imports with registry calls
   - Update `task.service.ts` to use new registries
   - Update any other files importing subjects directly

6. **Test thoroughly**
   - Unit tests for `PromptLoader`
   - Unit tests for registries
   - Integration tests for task generation
   - Manual validation of each subject/concept

### Files to Create

- `/prompts/subjects/math/base.md` + 6 concept files
- `/prompts/subjects/logic/base.md` + concept files
- `/prompts/subjects/german/base.md` + concept files
- `/prompts/subjects/music/base.md` + concept files
- `/prompts/subjects/physics/base.md` + concept files
- `/prompts/task-types/multipleChoice.md`
- `/prompts/task-types/yesNo.md`
- `/packages/backend/src/tasks/loader.ts`

### Files to Modify

- `/packages/backend/src/tasks/subjects/registry.ts`
- `/packages/backend/src/tasks/types/registry.ts`
- `/packages/backend/src/tasks/task.service.ts`
- `/packages/backend/src/index.ts` (initialize registries)

### Files to Delete

- `/packages/backend/src/tasks/subjects/base.ts`
- `/packages/backend/src/tasks/subjects/math.ts`
- `/packages/backend/src/tasks/subjects/logic.ts`
- `/packages/backend/src/tasks/subjects/german.ts`
- `/packages/backend/src/tasks/subjects/music.ts`
- `/packages/backend/src/tasks/subjects/physics.ts`
- Task type implementation files (keep schemas only)

## Testing Strategy

### Unit Tests

```typescript
describe('PromptLoader', () => {
  test('loads subject base.md with valid frontmatter')
  test('loads all concept files for subject')
  test('throws error on missing required fields in frontmatter')
  test('validates frontmatter with Zod schema')
  test('caches loaded prompts')
  test('invalidates cache on file change')
  test('parses markdown content correctly')
})

describe('SubjectRegistry', () => {
  test('initializes with all subjects from /prompts/subjects/')
  test('returns subject by id')
  test('returns all subjects')
  test('returns random concept for subject')
  test('returns undefined for non-existent subject')
})

describe('TaskTypeRegistry', () => {
  test('initializes with all task types from /prompts/task-types/')
  test('returns task type by id')
  test('returns all task types')
})
```

### Integration Tests

```typescript
describe('Task Generation with new loader', () => {
  test('generates math arithmetic task')
  test('generates logic patterns task')
  test('generates german vocabulary task')
  test('includes correct prompt templates from markdown')
  test('hint generation works with loaded prompts')
  test('all subjects and concepts are available')
  test('all task types are available')
})
```

### Manual Validation

- Generate task from each subject + concept combination
- Verify prompt content matches old version exactly
- Test hot-reload: edit prompt file, generate task, verify changes
- Test error handling: corrupt frontmatter, verify error message
- Test missing file: delete prompt, verify 500 error

## Dependencies

New npm packages to add:

```json
{
  "gray-matter": "^4.0.3",    // YAML frontmatter parser
  "chokidar": "^3.5.3"        // File watcher for hot-reload
}
```

## Benefits

1. **Non-developer friendly**: Content creators can edit prompts in markdown
2. **Better collaboration**: Clear git diffs showing prompt changes
3. **Faster iteration**: Hot-reload means no restart needed
4. **Cleaner code**: Remove ~500 lines of class definitions
5. **Single source of truth**: Each concept = one self-contained file
6. **Self-documenting**: Frontmatter shows metadata alongside content

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Prompts not in memory at startup | Fail fast on server start if any prompt invalid |
| File system access slower than in-memory | Cache all loaded prompts, only disk read on change |
| Hot-reload breaks production | Make hot-reload opt-in via environment variable |
| Missing prompt file | Validate all files exist at startup |
| Invalid frontmatter | Zod validation with descriptive errors |

## Open Questions

- Should we version prompts? (Future: track prompt changes for A/B testing)
- Should we support prompt inheritance? (e.g., all subjects share common sections)
- Should we add prompt previewing tool? (CLI tool to preview rendered prompts)

## Success Criteria

- All existing functionality works identically
- All subjects and concepts load from markdown files
- Hot-reload works in development
- Clear error messages for invalid prompts
- All tests pass
- Documentation updated (CLAUDE.md)
