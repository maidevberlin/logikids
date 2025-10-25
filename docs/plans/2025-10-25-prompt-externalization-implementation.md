# Prompt Externalization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor subject and task type prompts from TypeScript classes to external Markdown files with YAML frontmatter for easier editing and better separation of concerns.

**Architecture:** Replace class-based subjects with plain objects loaded from `/prompts/` directory. Use gray-matter for parsing frontmatter, chokidar for hot-reload, and maintain singleton registries for access.

**Tech Stack:** Bun runtime, gray-matter (YAML parsing), chokidar (file watching), Zod (validation)

**Reference:** See `docs/plans/2025-10-25-prompt-externalization-design.md` for full architecture

---

## Task 1: Add Dependencies

**Files:**
- Modify: `packages/backend/package.json`

**Step 1: Add dependencies to package.json**

```bash
cd packages/backend
docker compose exec backend-dev bun add gray-matter chokidar
docker compose exec backend-dev bun add -d @types/chokidar
```

**Step 2: Verify installation**

Run: `docker compose exec backend-dev bun pm ls | grep -E "(gray-matter|chokidar)"`
Expected: Both packages listed

**Step 3: Commit**

```bash
git add packages/backend/package.json packages/backend/bun.lockb
git commit -m "deps: add gray-matter and chokidar for prompt loading"
```

---

## Task 2: Create Prompt Directory Structure

**Files:**
- Create: `prompts/subjects/math/base.md`
- Create: `prompts/subjects/math/arithmetic.md`
- Create: `prompts/subjects/math/mental_math.md`
- Create: `prompts/subjects/math/word_problems.md`
- Create: `prompts/subjects/math/fractions.md`
- Create: `prompts/subjects/math/geometry.md`
- Create: `prompts/subjects/math/measurement.md`
- Create: `prompts/subjects/logic/base.md`
- Create: `prompts/subjects/logic/patterns.md`
- Create: `prompts/subjects/logic/conditional.md`
- Create: `prompts/subjects/logic/sorting.md`
- Create: `prompts/subjects/logic/sequences.md`
- Create: `prompts/subjects/logic/analogical.md`
- Create: `prompts/subjects/logic/deductive.md`
- Create: `prompts/subjects/german/base.md` (+ all german concepts)
- Create: `prompts/subjects/music/base.md` (+ all music concepts)
- Create: `prompts/subjects/physics/base.md` (+ all physics concepts)
- Create: `prompts/task-types/multipleChoice.md`
- Create: `prompts/task-types/yesNo.md`

**Step 1: Create directory structure**

```bash
mkdir -p prompts/subjects/{math,logic,german,music,physics}
mkdir -p prompts/task-types
```

**Step 2: Create math base.md**

File: `prompts/subjects/math/base.md`
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
Your goal is to enhance their math skills in a fun and educational way.
Focus on creating clear, engaging story contexts with step-by-step mathematical problem-solving and real-world applications.

## Concept to focus on when creating the task
{{concept_template}}

## Task Requirements
{{task_type_template}}

## Final Verification Checklist
Before submitting, verify:
1. ✓ ALL text is in {{language}}
2. ✓ No HTML formatting errors
```

**Step 3: Create math concept files**

File: `prompts/subjects/math/arithmetic.md`
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
- Uses real-world examples when possible
- Avoids complex numbers or decimals unless necessary
- Includes visual elements if helpful (e.g., "3 apples + 2 apples")
```

File: `prompts/subjects/math/mental_math.md`
```markdown
---
id: mental_math
name: Mental Math
description: Quick calculations and number sense without writing
---

Focus on creating a mental math problem that:
- Can be solved without writing calculations
- Uses number relationships and patterns
- Is appropriate for age {{age}} students
- Involves practical everyday scenarios
- Teaches mental math strategies
- Encourages estimation and rounding when helpful
```

File: `prompts/subjects/math/word_problems.md`
```markdown
---
id: word_problems
name: Word Problems
description: Real-world problem solving using mathematical concepts
---

Focus on creating a word problem that:
- Uses a clear, engaging story context
- Is relatable for age {{age}} students
- Has all necessary information provided
- Requires step-by-step problem-solving
- Uses real-world scenarios
- Has numbers that make sense in context
```

File: `prompts/subjects/math/fractions.md`
```markdown
---
id: fractions
name: Fractions & Decimals
description: Understanding and working with fractions, decimals, and percentages
---

Focus on creating a fraction/decimal problem that:
- Uses clear visual representations when possible
- Is appropriate for age {{age}} students
- Connects to real-world usage
- Builds understanding of part-whole relationships
- Uses common fractions/decimals
- Includes practical examples (e.g., sharing, measuring)
```

File: `prompts/subjects/math/geometry.md`
```markdown
---
id: geometry
name: Geometry
description: Geometric concepts including shapes, angles, and spatial reasoning
---

Focus on creating a geometry problem that:
- Uses clear shape descriptions
- Is appropriate for age {{age}} students
- Involves spatial reasoning
- Uses real-world examples of shapes
- Includes visual thinking
- Connects to practical applications
```

File: `prompts/subjects/math/measurement.md`
```markdown
---
id: measurement
name: Measurement & Units
description: Working with different units of measurement and conversions
---

Focus on creating a measurement problem that:
- Uses appropriate units for age {{age}}
- Involves practical measuring scenarios
- Includes unit conversions if appropriate
- Uses real-world contexts
- Connects to everyday experiences
- Emphasizes proper unit usage
```

**Step 4: Create logic base.md**

File: `prompts/subjects/logic/base.md`
```markdown
---
id: logic
name: Logic
description: Logical thinking and problem solving
---

## CRITICAL REQUIREMENTS
1. CONTENT APPROPRIATENESS
   A. Language Requirements
      - ALL content MUST be in {{language}}
      - This includes task, options, explanations, and hints
      - No mixing of languages

   B. Age Requirements ({{age}} years)
      - Logical complexity and reasoning
      - Vocabulary and language complexity
      - Context and examples

   C. Difficulty Level ({{difficulty}})
      - Match logical complexity to specified difficulty
      - Ensure consistency throughout the task
      - Appropriate challenge level for age group

## Your Role
You are an expert in logic and reasoning, developing tasks for students of age {{age}}.
Your goal is to enhance their logical thinking skills in an engaging way.
Focus on creating clear scenarios with step-by-step logical deduction and real-world applications of logic.

## Concept to focus on when creating the task
{{concept_template}}

## Task Requirements
{{task_type_template}}

## Final Verification Checklist
Before submitting, verify:
1. ✓ ALL text is in {{language}}
2. ✓ No HTML formatting errors
```

**Step 5: Create logic concept files**

File: `prompts/subjects/logic/patterns.md`
```markdown
---
id: patterns
name: Pattern Recognition
description: Finding and understanding patterns in logical sequences
---

Focus on creating a pattern recognition problem that:
- Uses clear, visual patterns when possible
- Is appropriate for age {{age}} students
- Has a logical sequence or progression
- Builds pattern recognition skills
- Uses age-appropriate complexity
- Can be solved through careful observation
- Encourages systematic thinking
```

File: `prompts/subjects/logic/conditional.md`
```markdown
---
id: conditional
name: Conditional Logic
description: Understanding cause and effect relationships
---

Focus on creating a conditional logic problem that:
- Uses clear if-then relationships
- Is appropriate for age {{age}} students
- Uses real-world scenarios
- Has unambiguous conditions
- Builds logical reasoning skills
- Encourages step-by-step thinking
- Uses familiar situations
```

File: `prompts/subjects/logic/sorting.md`
```markdown
---
id: sorting
name: Logical Sorting
description: Classifying items based on logical rules
---

Focus on creating a sorting problem that:
- Has clear classification rules
- Is appropriate for age {{age}} students
- Uses familiar categories
- Builds categorization skills
- Encourages systematic thinking
- Uses concrete examples
- Can be solved through logical grouping
```

File: `prompts/subjects/logic/sequences.md`
```markdown
---
id: sequences
name: Logical Sequences
description: Understanding and completing logical sequences
---

Focus on creating a logical sequence problem that:
- Uses clear, discoverable patterns
- Is appropriate for age {{age}} students
- Uses numbers, letters, or shapes
- Builds sequential thinking skills
- Has logical progression rules
- Uses age-appropriate complexity
- Encourages systematic observation
```

File: `prompts/subjects/logic/analogical.md`
```markdown
---
id: analogical
name: Analogical Thinking
description: Understanding relationships between different concepts
---

Focus on creating an analogical thinking problem that:
- Uses relationships between different concepts
- Is appropriate for age {{age}} students
- Uses clear, familiar examples for comparisons
- Builds relationship recognition skills
- Encourages systematic thinking
- Uses age-appropriate complexity
- Ensures cultural appropriateness
```

File: `prompts/subjects/logic/deductive.md`
```markdown
---
id: deductive
name: Deductive Reasoning
description: Drawing logical conclusions from given premises
---

Focus on creating a deductive reasoning problem that:
- Uses clear premises to reach logical conclusions
- Is appropriate for age {{age}} students
- Uses familiar scenarios and examples
- Builds step-by-step reasoning skills
- Encourages methodical thinking
- Uses age-appropriate complexity
- Ensures valid logical connections
```

**Step 6: Create task type files**

File: `prompts/task-types/multipleChoice.md`
```markdown
---
id: multipleChoice
name: Multiple Choice
description: A task with exactly 4 options where one is correct
---

## INSTRUCTIONS FOR TASK CREATION

### CREATE TASK TITLE AND DESCRIPTION
   - Write a clear, focused, but creative title
   - Write a complete problem statement using age-appropriate language, concepts, and scenarios
   - Include ALL necessary information for solving the problem
   - Use HTML formatting to improve readability and structure/highlight important information

### CREATE THE SOLUTION OPTION
   - Think through the correct answer logically before creating options
   - Write the correct answer with isCorrect=true and provide a detailed explanation
   - Ensure the explanation clearly shows WHY this answer is correct

### VALIDATE THE CORRECTNESS
   - Ensure the selected correct option aligns with the reasoning and explanation
   - If the selected correct answer is wrong, **correct it immediately and update the response**

### CREATE THE INCORRECT OPTIONS AND SHUFFLE
   - Create EXACTLY THREE plausible but incorrect answers with isCorrect=false
   - Do NOT provide explanations for incorrect options
   - Make incorrect options believable to challenge the student
   - Shuffle all four options randomly (don't put correct answer in same position every time)

### ADDITIONAL REQUIREMENTS
   - The task must have EXACTLY 4 options total (1 correct, 3 incorrect)
   - Only the correct option should have an explanation field
   - Ensure no conflicting statements exist between the correct option and its explanation
   - The final response should always be internally consistent
```

File: `prompts/task-types/yesNo.md`
```markdown
---
id: yesNo
name: Yes/No
description: A task that can be answered with yes or no
---

## TASK CREATION GUIDELINES

### CREATE TASK TITLE AND DESCRIPTION
   - Write a clear, focused, creative title
   - Create a question that can ONLY be answered with Yes or No
   - Include ALL necessary information for solving
   - Use simple, age-appropriate language
   - Format in HTML for readability
   - Make the question unambiguous with a clear correct answer

### CREATE THE SOLUTION
   - Set answer to true (for Yes) or false (for No)
   - Provide a detailed explanation of WHY this answer is correct
   - Include key reasoning points
   - Reference specific details from the question
   - Make the explanation educational and clear

### ADDITIONAL REQUIREMENTS
   - The question must have exactly ONE correct answer (true or false)
   - The explanation should be thorough enough that a student understands the reasoning
   - Ensure the task is age-appropriate ({{age}} years old) and matches difficulty level ({{difficulty}})
```

**Step 7: Copy remaining subjects**

Note: For german, music, and physics subjects, read their existing TypeScript files and convert to markdown using the same pattern as math and logic.

**Step 8: Commit**

```bash
git add prompts/
git commit -m "feat: create prompts directory with all subjects and task types in markdown"
```

---

## Task 3: Create Zod Schemas for Frontmatter Validation

**Files:**
- Create: `packages/backend/src/tasks/schemas.ts`

**Step 1: Create schemas file**

File: `packages/backend/src/tasks/schemas.ts`
```typescript
import { z } from 'zod';

/**
 * Schema for concept frontmatter metadata
 */
export const conceptFrontmatterSchema = z.object({
  id: z.string().min(1, 'Concept id is required'),
  name: z.string().min(1, 'Concept name is required'),
  description: z.string().min(1, 'Concept description is required'),
});

export type ConceptFrontmatter = z.infer<typeof conceptFrontmatterSchema>;

/**
 * Schema for subject base.md frontmatter metadata
 */
export const subjectFrontmatterSchema = z.object({
  id: z.string().min(1, 'Subject id is required'),
  name: z.string().min(1, 'Subject name is required'),
  description: z.string().min(1, 'Subject description is required'),
});

export type SubjectFrontmatter = z.infer<typeof subjectFrontmatterSchema>;

/**
 * Schema for task type frontmatter metadata
 */
export const taskTypeFrontmatterSchema = z.object({
  id: z.string().min(1, 'Task type id is required'),
  name: z.string().min(1, 'Task type name is required'),
  description: z.string().min(1, 'Task type description is required'),
});

export type TaskTypeFrontmatter = z.infer<typeof taskTypeFrontmatterSchema>;
```

**Step 2: Commit**

```bash
git add packages/backend/src/tasks/schemas.ts
git commit -m "feat: add Zod schemas for frontmatter validation"
```

---

## Task 4: Create PromptLoader Class with Tests

**Files:**
- Create: `packages/backend/src/tasks/loader.ts`
- Create: `packages/backend/src/tasks/__tests__/loader.test.ts`

**Step 1: Write the failing test**

File: `packages/backend/src/tasks/__tests__/loader.test.ts`
```typescript
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { PromptLoader } from '../loader';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('PromptLoader', () => {
  const testPromptsDir = path.join(process.cwd(), 'test-prompts');
  let loader: PromptLoader;

  beforeAll(async () => {
    // Create test prompts directory
    await fs.mkdir(path.join(testPromptsDir, 'subjects', 'test'), { recursive: true });

    // Create test base.md
    await fs.writeFile(
      path.join(testPromptsDir, 'subjects', 'test', 'base.md'),
      `---
id: test
name: Test Subject
description: A test subject for unit testing
---

This is the base prompt template with {{placeholders}}.`
    );

    // Create test concept.md
    await fs.writeFile(
      path.join(testPromptsDir, 'subjects', 'test', 'testConcept.md'),
      `---
id: testConcept
name: Test Concept
description: A test concept
---

This is the concept prompt template.`
    );

    loader = new PromptLoader(testPromptsDir);
  });

  afterAll(async () => {
    // Cleanup
    await fs.rm(testPromptsDir, { recursive: true, force: true });
    loader.destroy();
  });

  test('loads subject base.md with valid frontmatter', async () => {
    const subject = await loader.loadSubject('test');

    expect(subject.id).toBe('test');
    expect(subject.name).toBe('Test Subject');
    expect(subject.description).toBe('A test subject for unit testing');
    expect(subject.basePromptTemplate).toContain('{{placeholders}}');
  });

  test('loads all concept files for subject', async () => {
    const subject = await loader.loadSubject('test');

    expect(subject.concepts.size).toBe(1);
    expect(subject.concepts.has('testConcept')).toBe(true);

    const concept = subject.concepts.get('testConcept');
    expect(concept?.id).toBe('testConcept');
    expect(concept?.name).toBe('Test Concept');
    expect(concept?.promptTemplate).toContain('concept prompt template');
  });

  test('throws error on missing required fields in frontmatter', async () => {
    // Create invalid file
    await fs.writeFile(
      path.join(testPromptsDir, 'subjects', 'invalid', 'base.md'),
      `---
name: Invalid
---

Missing id field`
    );

    await expect(loader.loadSubject('invalid')).rejects.toThrow();
  });

  test('caches loaded prompts', async () => {
    const subject1 = await loader.loadSubject('test');
    const subject2 = await loader.loadSubject('test');

    // Should return same instance from cache
    expect(subject1).toBe(subject2);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `docker compose exec backend-dev bun test packages/backend/src/tasks/__tests__/loader.test.ts`
Expected: FAIL with "Cannot find module '../loader'"

**Step 3: Write minimal implementation**

File: `packages/backend/src/tasks/loader.ts`
```typescript
import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import chokidar, { FSWatcher } from 'chokidar';
import {
  conceptFrontmatterSchema,
  subjectFrontmatterSchema,
  taskTypeFrontmatterSchema,
  ConceptFrontmatter,
  SubjectFrontmatter,
  TaskTypeFrontmatter,
} from './schemas';

export interface Concept {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  basePromptTemplate: string;
  concepts: Map<string, Concept>;
}

export interface TaskType {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
}

interface LoadedPrompt<T = any> {
  metadata: T;
  content: string;
}

export class PromptLoader {
  private subjectCache = new Map<string, Subject>();
  private taskTypeCache = new Map<string, TaskType>();
  private watcher: FSWatcher | null = null;
  private promptsDir: string;

  constructor(promptsDir: string = path.join(process.cwd(), 'prompts')) {
    this.promptsDir = promptsDir;
  }

  /**
   * Load a subject and all its concepts from markdown files
   */
  async loadSubject(subjectId: string): Promise<Subject> {
    // Check cache first
    if (this.subjectCache.has(subjectId)) {
      return this.subjectCache.get(subjectId)!;
    }

    const subjectDir = path.join(this.promptsDir, 'subjects', subjectId);

    // Load base.md
    const basePath = path.join(subjectDir, 'base.md');
    const basePrompt = await this.parsePromptFile<SubjectFrontmatter>(
      basePath,
      subjectFrontmatterSchema
    );

    // Load all concept files
    const conceptFiles = await this.getConceptFiles(subjectDir);
    const concepts = new Map<string, Concept>();

    for (const conceptFile of conceptFiles) {
      const conceptPath = path.join(subjectDir, conceptFile);
      const conceptPrompt = await this.parsePromptFile<ConceptFrontmatter>(
        conceptPath,
        conceptFrontmatterSchema
      );

      concepts.set(conceptPrompt.metadata.id, {
        id: conceptPrompt.metadata.id,
        name: conceptPrompt.metadata.name,
        description: conceptPrompt.metadata.description,
        promptTemplate: conceptPrompt.content,
      });
    }

    const subject: Subject = {
      id: basePrompt.metadata.id,
      name: basePrompt.metadata.name,
      description: basePrompt.metadata.description,
      basePromptTemplate: basePrompt.content,
      concepts,
    };

    // Cache the subject
    this.subjectCache.set(subjectId, subject);

    return subject;
  }

  /**
   * Load a task type from markdown file
   */
  async loadTaskType(taskTypeId: string): Promise<TaskType> {
    // Check cache first
    if (this.taskTypeCache.has(taskTypeId)) {
      return this.taskTypeCache.get(taskTypeId)!;
    }

    const taskTypePath = path.join(this.promptsDir, 'task-types', `${taskTypeId}.md`);
    const taskTypePrompt = await this.parsePromptFile<TaskTypeFrontmatter>(
      taskTypePath,
      taskTypeFrontmatterSchema
    );

    const taskType: TaskType = {
      id: taskTypePrompt.metadata.id,
      name: taskTypePrompt.metadata.name,
      description: taskTypePrompt.metadata.description,
      promptTemplate: taskTypePrompt.content,
    };

    // Cache the task type
    this.taskTypeCache.set(taskTypeId, taskType);

    return taskType;
  }

  /**
   * Enable hot-reload for development
   */
  enableHotReload(): void {
    if (this.watcher) return; // Already enabled

    this.watcher = chokidar.watch(`${this.promptsDir}/**/*.md`, {
      ignoreInitial: true,
      persistent: true,
    });

    this.watcher.on('change', (filePath) => {
      console.log(`[PromptLoader] Prompt updated: ${filePath}`);
      this.invalidateCache(filePath);
    });

    this.watcher.on('add', (filePath) => {
      console.log(`[PromptLoader] New prompt added: ${filePath}`);
      this.invalidateCache(filePath);
    });

    this.watcher.on('unlink', (filePath) => {
      console.log(`[PromptLoader] Prompt deleted: ${filePath}`);
      this.invalidateCache(filePath);
    });

    console.log('[PromptLoader] Hot-reload enabled');
  }

  /**
   * Disable hot-reload and cleanup
   */
  destroy(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }

  /**
   * Parse markdown file with frontmatter and validate
   */
  private async parsePromptFile<T>(
    filePath: string,
    schema: any
  ): Promise<LoadedPrompt<T>> {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const parsed = matter(fileContent);

      // Validate frontmatter with Zod
      const validatedMetadata = schema.parse(parsed.data);

      return {
        metadata: validatedMetadata,
        content: parsed.content.trim(),
      };
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const issues = error.issues.map((issue: any) =>
          `  - ${issue.path.join('.')}: ${issue.message}`
        ).join('\n');

        throw new Error(
          `Error loading prompt: ${filePath}\n${issues}\n\nPlease check the frontmatter format.`
        );
      }
      throw new Error(`Error reading file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Get all concept markdown files in a subject directory
   */
  private async getConceptFiles(subjectDir: string): Promise<string[]> {
    try {
      const files = await fs.readdir(subjectDir);
      return files.filter(
        (file) => file.endsWith('.md') && file !== 'base.md'
      );
    } catch (error) {
      return [];
    }
  }

  /**
   * Invalidate cache for a specific file path
   */
  private invalidateCache(filePath: string): void {
    // Determine if it's a subject or task type file
    if (filePath.includes('/subjects/')) {
      // Extract subject id from path
      const match = filePath.match(/\/subjects\/([^/]+)\//);
      if (match) {
        const subjectId = match[1];
        this.subjectCache.delete(subjectId);
        console.log(`[PromptLoader] Cache invalidated for subject: ${subjectId}`);
      }
    } else if (filePath.includes('/task-types/')) {
      // Extract task type id from filename
      const match = filePath.match(/\/task-types\/([^/]+)\.md$/);
      if (match) {
        const taskTypeId = match[1];
        this.taskTypeCache.delete(taskTypeId);
        console.log(`[PromptLoader] Cache invalidated for task type: ${taskTypeId}`);
      }
    }
  }
}
```

**Step 4: Run test to verify it passes**

Run: `docker compose exec backend-dev bun test packages/backend/src/tasks/__tests__/loader.test.ts`
Expected: PASS (all tests passing)

**Step 5: Commit**

```bash
git add packages/backend/src/tasks/loader.ts packages/backend/src/tasks/__tests__/loader.test.ts
git commit -m "feat: implement PromptLoader with hot-reload support"
```

---

## Task 5: Update SubjectRegistry to Use Loader

**Files:**
- Modify: `packages/backend/src/tasks/subjects/registry.ts`
- Create: `packages/backend/src/tasks/subjects/__tests__/registry.test.ts`

**Step 1: Write the failing test**

File: `packages/backend/src/tasks/subjects/__tests__/registry.test.ts`
```typescript
import { describe, test, expect, beforeAll } from 'bun:test';
import { SubjectRegistry } from '../registry';

describe('SubjectRegistry', () => {
  let registry: SubjectRegistry;

  beforeAll(async () => {
    registry = new SubjectRegistry();
    await registry.initialize();
  });

  test('initializes with all subjects from /prompts/subjects/', async () => {
    const subjects = registry.getAll();

    // Should have at least math and logic
    expect(subjects.length).toBeGreaterThanOrEqual(2);
    expect(subjects.some(s => s.id === 'math')).toBe(true);
    expect(subjects.some(s => s.id === 'logic')).toBe(true);
  });

  test('returns subject by id', () => {
    const math = registry.get('math');

    expect(math).toBeDefined();
    expect(math?.id).toBe('math');
    expect(math?.name).toBe('Math');
    expect(math?.concepts.size).toBeGreaterThan(0);
  });

  test('returns all subjects', () => {
    const subjects = registry.getAll();

    expect(subjects.length).toBeGreaterThan(0);
    subjects.forEach(subject => {
      expect(subject.id).toBeDefined();
      expect(subject.name).toBeDefined();
      expect(subject.concepts).toBeDefined();
    });
  });

  test('returns random concept for subject', () => {
    const concept = registry.getRandomConcept('math');

    expect(concept).toBeDefined();
    expect(concept?.id).toBeDefined();
    expect(concept?.promptTemplate).toBeDefined();
  });

  test('returns undefined for non-existent subject', () => {
    const subject = registry.get('nonexistent');
    expect(subject).toBeUndefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `docker compose exec backend-dev bun test packages/backend/src/tasks/subjects/__tests__/registry.test.ts`
Expected: FAIL (registry not yet refactored)

**Step 3: Refactor SubjectRegistry implementation**

File: `packages/backend/src/tasks/subjects/registry.ts`
```typescript
import * as fs from 'fs/promises';
import * as path from 'path';
import { PromptLoader, Subject, Concept } from '../loader';

/**
 * Registry for managing all available subjects
 */
export class SubjectRegistry {
  private subjects = new Map<string, Subject>();
  private loader: PromptLoader;
  private initialized = false;

  constructor(loader?: PromptLoader) {
    this.loader = loader || new PromptLoader();
  }

  /**
   * Initialize registry by loading all subjects from /prompts/subjects/
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('[SubjectRegistry] Already initialized');
      return;
    }

    const promptsDir = path.join(process.cwd(), 'prompts');
    const subjectsDir = path.join(promptsDir, 'subjects');

    try {
      // Get all subject directories
      const subjectDirs = await fs.readdir(subjectsDir, { withFileTypes: true });
      const subjectIds = subjectDirs
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      console.log(`[SubjectRegistry] Loading ${subjectIds.length} subjects...`);

      // Load each subject
      for (const subjectId of subjectIds) {
        try {
          const subject = await this.loader.loadSubject(subjectId);
          this.subjects.set(subject.id, subject);
          console.log(`[SubjectRegistry] Loaded subject: ${subject.id} (${subject.concepts.size} concepts)`);
        } catch (error: any) {
          console.error(`[SubjectRegistry] Failed to load subject ${subjectId}:`, error.message);
          throw error; // Fail fast on invalid prompts
        }
      }

      this.initialized = true;
      console.log(`[SubjectRegistry] Initialization complete: ${this.subjects.size} subjects loaded`);

      // Enable hot-reload in development
      if (process.env.NODE_ENV !== 'production') {
        this.loader.enableHotReload();
      }
    } catch (error: any) {
      throw new Error(`Failed to initialize SubjectRegistry: ${error.message}`);
    }
  }

  /**
   * Get a subject by its ID
   */
  get(id: string): Subject | undefined {
    return this.subjects.get(id);
  }

  /**
   * Get all registered subjects
   */
  getAll(): Subject[] {
    return Array.from(this.subjects.values());
  }

  /**
   * Get a random concept from a subject
   */
  getRandomConcept(subjectId: string): Concept | undefined {
    const subject = this.subjects.get(subjectId);
    if (!subject || subject.concepts.size === 0) {
      return undefined;
    }

    const conceptIds = Array.from(subject.concepts.keys());
    const randomId = conceptIds[Math.floor(Math.random() * conceptIds.length)];
    return subject.concepts.get(randomId);
  }

  /**
   * Get a specific concept from a subject
   */
  getConcept(subjectId: string, conceptId: string): Concept | undefined {
    const subject = this.subjects.get(subjectId);
    return subject?.concepts.get(conceptId);
  }
}

// Export singleton instance
export const subjectRegistry = new SubjectRegistry();
```

**Step 4: Run test to verify it passes**

Run: `docker compose exec backend-dev bun test packages/backend/src/tasks/subjects/__tests__/registry.test.ts`
Expected: PASS (all tests passing)

**Step 5: Commit**

```bash
git add packages/backend/src/tasks/subjects/registry.ts packages/backend/src/tasks/subjects/__tests__/registry.test.ts
git commit -m "refactor: update SubjectRegistry to load from markdown files"
```

---

## Task 6: Update TaskTypeRegistry to Use Loader

**Files:**
- Modify: `packages/backend/src/tasks/types/registry.ts`
- Create: `packages/backend/src/tasks/types/__tests__/registry.test.ts`

**Step 1: Write the failing test**

File: `packages/backend/src/tasks/types/__tests__/registry.test.ts`
```typescript
import { describe, test, expect, beforeAll } from 'bun:test';
import { TaskTypeRegistry } from '../registry';

describe('TaskTypeRegistry', () => {
  let registry: TaskTypeRegistry;

  beforeAll(async () => {
    registry = new TaskTypeRegistry();
    await registry.initialize();
  });

  test('initializes with all task types from /prompts/task-types/', async () => {
    const taskTypes = registry.getAll();

    // Should have multipleChoice and yesNo
    expect(taskTypes.length).toBeGreaterThanOrEqual(2);
    expect(taskTypes.some(t => t.id === 'multipleChoice')).toBe(true);
    expect(taskTypes.some(t => t.id === 'yesNo')).toBe(true);
  });

  test('returns task type by id', () => {
    const multipleChoice = registry.get('multipleChoice');

    expect(multipleChoice).toBeDefined();
    expect(multipleChoice?.id).toBe('multipleChoice');
    expect(multipleChoice?.name).toBe('Multiple Choice');
    expect(multipleChoice?.promptTemplate).toBeDefined();
  });

  test('returns all task types', () => {
    const taskTypes = registry.getAll();

    expect(taskTypes.length).toBeGreaterThan(0);
    taskTypes.forEach(taskType => {
      expect(taskType.id).toBeDefined();
      expect(taskType.name).toBeDefined();
      expect(taskType.promptTemplate).toBeDefined();
    });
  });

  test('returns undefined for non-existent task type', () => {
    const taskType = registry.get('nonexistent');
    expect(taskType).toBeUndefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `docker compose exec backend-dev bun test packages/backend/src/tasks/types/__tests__/registry.test.ts`
Expected: FAIL (registry not yet refactored)

**Step 3: Refactor TaskTypeRegistry implementation**

File: `packages/backend/src/tasks/types/registry.ts`
```typescript
import * as fs from 'fs/promises';
import * as path from 'path';
import { PromptLoader, TaskType } from '../loader';
import { multipleChoiceSchema } from './multipleChoice';
import { yesNoSchema } from './yesNo';
import { JSONSchema } from '../../common/ai/base';

/**
 * Extended TaskType with JSON schema for validation
 */
export interface TaskTypeWithSchema extends TaskType {
  jsonSchema: JSONSchema;
}

/**
 * Registry for managing all available task types
 */
export class TaskTypeRegistry {
  private taskTypes = new Map<string, TaskTypeWithSchema>();
  private loader: PromptLoader;
  private initialized = false;

  // Map of task type IDs to their JSON schemas
  private readonly schemas: Record<string, JSONSchema> = {
    multipleChoice: multipleChoiceSchema,
    yesNo: yesNoSchema,
  };

  constructor(loader?: PromptLoader) {
    this.loader = loader || new PromptLoader();
  }

  /**
   * Initialize registry by loading all task types from /prompts/task-types/
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('[TaskTypeRegistry] Already initialized');
      return;
    }

    const promptsDir = path.join(process.cwd(), 'prompts');
    const taskTypesDir = path.join(promptsDir, 'task-types');

    try {
      // Get all task type markdown files
      const taskTypeFiles = await fs.readdir(taskTypesDir);
      const taskTypeIds = taskTypeFiles
        .filter((file) => file.endsWith('.md'))
        .map((file) => file.replace('.md', ''));

      console.log(`[TaskTypeRegistry] Loading ${taskTypeIds.length} task types...`);

      // Load each task type
      for (const taskTypeId of taskTypeIds) {
        try {
          const taskType = await this.loader.loadTaskType(taskTypeId);

          // Get the JSON schema for this task type
          const jsonSchema = this.schemas[taskTypeId];
          if (!jsonSchema) {
            throw new Error(`No JSON schema found for task type: ${taskTypeId}`);
          }

          const taskTypeWithSchema: TaskTypeWithSchema = {
            ...taskType,
            jsonSchema,
          };

          this.taskTypes.set(taskType.id, taskTypeWithSchema);
          console.log(`[TaskTypeRegistry] Loaded task type: ${taskType.id}`);
        } catch (error: any) {
          console.error(`[TaskTypeRegistry] Failed to load task type ${taskTypeId}:`, error.message);
          throw error; // Fail fast on invalid prompts
        }
      }

      this.initialized = true;
      console.log(`[TaskTypeRegistry] Initialization complete: ${this.taskTypes.size} task types loaded`);

      // Enable hot-reload in development
      if (process.env.NODE_ENV !== 'production') {
        this.loader.enableHotReload();
      }
    } catch (error: any) {
      throw new Error(`Failed to initialize TaskTypeRegistry: ${error.message}`);
    }
  }

  /**
   * Get a task type by its ID
   */
  get(id: string): TaskTypeWithSchema | undefined {
    return this.taskTypes.get(id);
  }

  /**
   * Get all registered task types
   */
  getAll(): TaskTypeWithSchema[] {
    return Array.from(this.taskTypes.values());
  }
}

// Export singleton instance
export const taskTypeRegistry = new TaskTypeRegistry();
```

**Step 4: Run test to verify it passes**

Run: `docker compose exec backend-dev bun test packages/backend/src/tasks/types/__tests__/registry.test.ts`
Expected: PASS (all tests passing)

**Step 5: Commit**

```bash
git add packages/backend/src/tasks/types/registry.ts packages/backend/src/tasks/types/__tests__/registry.test.ts
git commit -m "refactor: update TaskTypeRegistry to load from markdown files"
```

---

## Task 7: Update Task Service to Use New Registries

**Files:**
- Modify: `packages/backend/src/tasks/task.service.ts`

**Step 1: Update imports and usage**

Find and replace in `packages/backend/src/tasks/task.service.ts`:

OLD:
```typescript
import { mathSubject } from './subjects/math';
import { logicSubject } from './subjects/logic';
// ... other imports
```

NEW:
```typescript
import { subjectRegistry } from './subjects/registry';
import { taskTypeRegistry } from './types/registry';
```

Update all references to use registry:
- Replace `mathSubject` with `subjectRegistry.get('math')`
- Replace `logicSubject` with `subjectRegistry.get('logic')`
- Update to handle undefined cases (subjects not found)

**Step 2: Run tests to verify**

Run: `docker compose exec backend-dev bun test packages/backend/src/tasks/__tests__/task.service.test.ts`
Expected: PASS (all existing tests still passing)

**Step 3: Commit**

```bash
git add packages/backend/src/tasks/task.service.ts
git commit -m "refactor: update task service to use new registries"
```

---

## Task 8: Initialize Registries on Server Startup

**Files:**
- Modify: `packages/backend/src/index.ts`

**Step 1: Add initialization code**

Add near the top of the file, before starting the server:

```typescript
import { subjectRegistry } from './tasks/subjects/registry';
import { taskTypeRegistry } from './tasks/types/registry';

// Initialize registries before starting server
async function initializeRegistries() {
  console.log('Initializing registries...');
  await Promise.all([
    subjectRegistry.initialize(),
    taskTypeRegistry.initialize(),
  ]);
  console.log('Registries initialized successfully');
}

// Call before app.listen()
await initializeRegistries();
```

**Step 2: Test server starts successfully**

Run: `docker compose up backend-dev`
Expected: Server starts, logs show "Registries initialized successfully"

**Step 3: Commit**

```bash
git add packages/backend/src/index.ts
git commit -m "feat: initialize registries on server startup"
```

---

## Task 9: Delete Old Subject and Task Type Classes

**Files:**
- Delete: `packages/backend/src/tasks/subjects/base.ts`
- Delete: `packages/backend/src/tasks/subjects/math.ts`
- Delete: `packages/backend/src/tasks/subjects/logic.ts`
- Delete: `packages/backend/src/tasks/subjects/german.ts`
- Delete: `packages/backend/src/tasks/subjects/music.ts`
- Delete: `packages/backend/src/tasks/subjects/physics.ts`
- Modify: `packages/backend/src/tasks/subjects/index.ts`
- Modify: `packages/backend/src/tasks/types/multipleChoice.ts` (keep only schema)
- Modify: `packages/backend/src/tasks/types/yesNo.ts` (keep only schema)
- Modify: `packages/backend/src/tasks/types/index.ts`

**Step 1: Delete subject class files**

```bash
rm packages/backend/src/tasks/subjects/base.ts
rm packages/backend/src/tasks/subjects/math.ts
rm packages/backend/src/tasks/subjects/logic.ts
rm packages/backend/src/tasks/subjects/german.ts
rm packages/backend/src/tasks/subjects/music.ts
rm packages/backend/src/tasks/subjects/physics.ts
```

**Step 2: Update subjects/index.ts**

File: `packages/backend/src/tasks/subjects/index.ts`
```typescript
export { SubjectRegistry, subjectRegistry } from './registry';
```

**Step 3: Refactor task type files to keep only schemas**

File: `packages/backend/src/tasks/types/multipleChoice.ts`
```typescript
import { JSONSchema } from "../../common/ai/base";

export interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface MultipleChoiceResponse {
  type: 'multiple_choice';
  title: string;
  task: string;
  options: MultipleChoiceOption[];
}

export const multipleChoiceSchema: JSONSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'multiple_choice'
    },
    title: {
      type: 'string',
      minLength: 1
    },
    task: {
      type: 'string',
      minLength: 1
    },
    options: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            minLength: 1
          },
          isCorrect: {
            type: 'boolean'
          },
          explanation: {
            type: 'string',
            minLength: 1
          }
        },
        required: ['text', 'isCorrect'],
        additionalProperties: false
      },
      minItems: 4,
      maxItems: 4
    }
  },
  required: ['type', 'title', 'task', 'options'],
  additionalProperties: false
};
```

File: `packages/backend/src/tasks/types/yesNo.ts`
```typescript
import { JSONSchema } from "../../common/ai/base";

export interface YesNoSolution {
  answer: boolean;
  explanation: string;
}

export interface YesNoResponse {
  type: 'yes_no';
  title: string;
  task: string;
  solution: YesNoSolution;
}

export const yesNoSchema: JSONSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'yes_no'
    },
    title: {
      type: 'string',
      minLength: 1
    },
    task: {
      type: 'string',
      minLength: 1
    },
    solution: {
      type: 'object',
      properties: {
        answer: {
          type: 'boolean'
        },
        explanation: {
          type: 'string',
          minLength: 1
        }
      },
      required: ['answer', 'explanation'],
      additionalProperties: false
    }
  },
  required: ['type', 'title', 'task', 'solution'],
  additionalProperties: false
};
```

**Step 4: Update types/index.ts**

File: `packages/backend/src/tasks/types/index.ts`
```typescript
export { TaskTypeRegistry, taskTypeRegistry } from './registry';
export type { TaskTypeWithSchema } from './registry';
export { multipleChoiceSchema } from './multipleChoice';
export type { MultipleChoiceResponse, MultipleChoiceOption } from './multipleChoice';
export { yesNoSchema } from './yesNo';
export type { YesNoResponse, YesNoSolution } from './yesNo';
```

**Step 5: Delete base.ts if it exists**

```bash
rm packages/backend/src/tasks/types/base.ts 2>/dev/null || true
```

**Step 6: Commit**

```bash
git add -A
git commit -m "refactor: remove old class-based subjects and task types"
```

---

## Task 10: Run Full Test Suite

**Files:**
- Test: All backend tests

**Step 1: Run all backend tests**

Run: `docker compose exec backend-dev bun test`
Expected: All tests passing

**Step 2: If tests fail, debug and fix**

Review test output, identify failures, fix issues.

**Step 3: Commit any fixes**

```bash
git add <fixed-files>
git commit -m "fix: resolve issues found in test suite"
```

---

## Task 11: Integration Testing

**Files:**
- None (manual testing)

**Step 1: Start the development server**

Run: `docker compose up backend-dev frontend-dev`
Expected: Server starts successfully with "Registries initialized" log

**Step 2: Generate tasks from each subject**

Test these API calls:
```bash
# Math - Arithmetic
curl "http://localhost:5175/api/task?subject=math&concept=arithmetic&taskType=multipleChoice&age=10&difficulty=medium"

# Logic - Patterns
curl "http://localhost:5175/api/task?subject=logic&concept=patterns&taskType=yesNo&age=12&difficulty=easy"

# Test all subjects and concepts
```

Expected: Tasks generate successfully, prompts match old behavior

**Step 3: Test hot-reload (development)**

1. Edit a prompt file: `prompts/subjects/math/arithmetic.md`
2. Save the file
3. Generate a new math arithmetic task
4. Verify the changes appear immediately (no server restart needed)

Expected: Prompt changes reflect immediately in generated tasks

**Step 4: Test hint generation**

Generate a task, get the taskId, then request a hint:
```bash
curl -X POST "http://localhost:5175/api/task/{taskId}/hint"
```

Expected: Hint generates successfully using loaded prompts

---

## Task 12: Update Documentation

**Files:**
- Modify: `CLAUDE.md`
- Modify: `packages/backend/docs/tasks.md` (if it exists)

**Step 1: Update CLAUDE.md with new structure**

Add section about prompt management:

```markdown
### Prompt Management

Prompts for subjects and task types are stored in markdown files with YAML frontmatter:

**Structure:**
```
/prompts/
  subjects/
    {subject-id}/
      base.md          # Subject metadata + base prompt
      {concept}.md     # Each concept's prompt
  task-types/
    {task-type}.md     # Task type prompts
```

**Adding a New Concept:**
1. Create `/prompts/subjects/{subject-id}/{concept-id}.md`
2. Add frontmatter:
   ```yaml
   ---
   id: concept-id
   name: Concept Name
   description: Brief description
   ---
   ```
3. Add prompt template below frontmatter
4. Changes apply immediately in development (hot-reload)

**Editing Prompts:**
- Edit markdown files directly
- No code changes needed
- Changes apply immediately in development
- Production requires server restart

**Validation:**
- Frontmatter validated on startup with Zod
- Server fails fast if any prompt is invalid
- Clear error messages show what's wrong
```

**Step 2: Commit documentation**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with prompt management section"
```

---

## Task 13: Final Verification and Cleanup

**Files:**
- Review all changes

**Step 1: Review git status**

Run: `git status`
Expected: No unexpected changes, all intentional changes committed

**Step 2: Run full test suite one more time**

Run: `docker compose exec backend-dev bun test`
Expected: All tests passing

**Step 3: Verify no lingering old files**

```bash
# Check for any remaining old class files
find packages/backend/src/tasks -name "*.ts" -exec grep -l "extends BaseSubject\|extends BaseTaskType" {} \;
```

Expected: No results (all old classes removed)

**Step 4: Final commit if needed**

```bash
git add -A
git commit -m "chore: final cleanup after prompt externalization"
```

---

## Success Criteria

- [ ] All dependencies installed (gray-matter, chokidar)
- [ ] All prompts in `/prompts/` directory with correct frontmatter
- [ ] PromptLoader implemented with tests passing
- [ ] SubjectRegistry loads from markdown files
- [ ] TaskTypeRegistry loads from markdown files
- [ ] All old class files deleted
- [ ] Server initializes registries on startup
- [ ] All backend tests passing
- [ ] Task generation works for all subjects/concepts
- [ ] Hint generation still works
- [ ] Hot-reload works in development
- [ ] Documentation updated (CLAUDE.md)
- [ ] Clean git history with clear commit messages

---

## Rollback Plan

If issues arise during implementation:

1. **Partial rollback:** Use git to revert specific commits
2. **Full rollback:** `git reset --hard <commit-before-refactoring>`
3. **Keep prompts:** The `/prompts/` directory is valuable even if we revert code changes

The design document and prompt files remain useful reference material even if implementation is delayed.
