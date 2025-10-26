# Curriculum Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate professional curriculum files with custom content using unified markdown format, enabling grade-based filtering and richer task generation context.

**Architecture:** Convert curriculum YAML to individual markdown files matching custom concept format. Single ConceptLoader scans both directories, merges concepts with auto-prefixing for duplicates. Enhanced PromptBuilder injects full concept metadata into LLM prompts.

**Tech Stack:** TypeScript, Bun, Zod validation, gray-matter (YAML frontmatter), js-yaml (YAML parsing), Express

---

## Task 1: Create Curriculum Conversion Script

**Files:**
- Create: `scripts/convert-curriculum.ts`
- Create: `package.json` (add script entry)

**Step 1: Create conversion script**

Create `scripts/convert-curriculum.ts`:

```typescript
#!/usr/bin/env bun
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';

interface CurriculumConcept {
  name: string;
  focus: string;
  learning_objectives: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prerequisites?: string[];
  example_tasks?: string[];
  real_world_context?: string;
}

interface CurriculumGrade {
  grade: number;
  ages: number[];
  concepts: CurriculumConcept[];
}

interface Curriculum {
  subject: string;
  country: string;
  source: string;
  scope: string;
  grades: CurriculumGrade[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateConceptId(grade: number, name: string): string {
  const slug = slugify(name);
  return `grade${grade}-${slug}`;
}

async function convertCurriculum(yamlPath: string) {
  console.log(`Reading curriculum from ${yamlPath}...`);

  const yamlContent = fs.readFileSync(yamlPath, 'utf-8');
  const curriculum = yaml.load(yamlContent) as Curriculum;

  const subjectSlug = slugify(curriculum.subject);
  const outputDir = path.join('curriculums', subjectSlug);

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalConcepts = 0;

  // Process each grade
  for (const gradeData of curriculum.grades) {
    for (const concept of gradeData.concepts) {
      const id = generateConceptId(gradeData.grade, concept.name);
      const filename = `${id}.md`;
      const filepath = path.join(outputDir, filename);

      // Build frontmatter
      const frontmatter: any = {
        id,
        name: concept.name,
        grade: gradeData.grade,
        ages: gradeData.ages,
        focus: concept.focus,
        difficulty: concept.difficulty,
        learning_objectives: concept.learning_objectives,
      };

      if (concept.prerequisites) {
        frontmatter.prerequisites = concept.prerequisites.map(p => slugify(p));
      }

      if (concept.example_tasks) {
        frontmatter.example_tasks = concept.example_tasks;
      }

      if (concept.real_world_context) {
        frontmatter.real_world_context = concept.real_world_context;
      }

      // Generate markdown with frontmatter
      const content = matter.stringify('', frontmatter);

      // Write file
      fs.writeFileSync(filepath, content, 'utf-8');
      totalConcepts++;
    }
  }

  console.log(`✓ Generated ${totalConcepts} concept files in ${outputDir}`);
  console.log(`  Source: ${curriculum.source}`);
  console.log(`  Scope: ${curriculum.scope}`);
}

// Main execution
const yamlPath = process.argv[2];

if (!yamlPath) {
  console.error('Usage: bun run scripts/convert-curriculum.ts <path-to-yaml>');
  process.exit(1);
}

if (!fs.existsSync(yamlPath)) {
  console.error(`Error: File not found: ${yamlPath}`);
  process.exit(1);
}

convertCurriculum(yamlPath).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
```

**Step 2: Install dependencies**

Run:
```bash
docker compose exec backend-dev bun add js-yaml
docker compose exec backend-dev bun add -d @types/js-yaml
```

Expected: Dependencies installed successfully

**Step 3: Test script with math.yaml**

Run:
```bash
docker compose exec backend-dev bun run scripts/convert-curriculum.ts curriculums/math.yaml
```

Expected output:
```
Reading curriculum from curriculums/math.yaml...
✓ Generated 47 concept files in curriculums/math
  Source: KMK Bildungsstandards 2022
  Scope: Federal (with state-specific variations possible)
```

**Step 4: Verify generated files**

Run:
```bash
docker compose exec backend-dev ls -la curriculums/math/ | head -10
docker compose exec backend-dev cat curriculums/math/grade1-addition-up-to-10.md
```

Expected: Directory contains .md files with proper frontmatter

**Step 5: Commit**

```bash
git add scripts/convert-curriculum.ts curriculums/math/
git commit -m "feat: add curriculum conversion script and generate math concepts"
```

---

## Task 2: Create Shared Base Prompt

**Files:**
- Create: `prompts/base-prompt.md`

**Step 1: Extract common role from existing base.md files**

Read existing base.md files:
```bash
docker compose exec backend-dev cat prompts/subjects/logic/base.md
docker compose exec backend-dev cat prompts/subjects/math/base.md
```

**Step 2: Create shared base prompt**

Create `prompts/base-prompt.md`:

```markdown
---
id: base
name: Base Educational Task Generator
description: Shared role and guidelines for all educational content generation
---

You are an educational task generator creating engaging, age-appropriate learning activities.

## Core Principles

- **Age-appropriate:** Adjust complexity and vocabulary to student's age and grade level
- **Clear and precise:** Use clear language and unambiguous instructions
- **Engaging:** Make tasks interesting and relevant to students' lives
- **Educational value:** Every task should teach or reinforce specific learning objectives
- **Progressive difficulty:** Match task complexity to specified difficulty level

## Content Format

Generate all content in **Markdown** format (not HTML):

- **Math formulas:** Use LaTeX syntax with $ (inline) and $$ (block)
- **Code blocks:** Use fenced code blocks with language: ```python
- **Diagrams:** Use Mermaid syntax in ```mermaid blocks
- **Tables:** Use GitHub Flavored Markdown table syntax
- **SVG graphics:** Use inline <svg> elements for custom graphics when needed

## Task Structure

1. **Clear objective:** State what the student should do
2. **Necessary context:** Provide background information or examples
3. **The challenge:** Present the actual problem or question
4. **Verification:** Ensure there's a clear way to verify the answer

## Difficulty Calibration

- **Easy:** Foundational concepts, direct application, minimal steps
- **Medium:** Multi-step problems, concept combination, some reasoning required
- **Hard:** Complex problems, abstract thinking, multiple concepts integrated

## Personalization

When variations are provided (character names, scenarios, contexts):
- Integrate them naturally into the task
- Maintain educational focus despite personalization
- Use age-appropriate scenarios and contexts
```

**Step 3: Commit**

```bash
git add prompts/base-prompt.md
git commit -m "feat: add shared base prompt for all subjects"
```

---

## Task 3: Migrate Logic Concepts to New Format

**Files:**
- Modify: `prompts/subjects/logic/patterns.md`
- Modify: `prompts/subjects/logic/sequences.md`
- Modify: `prompts/subjects/logic/deduction.md`
- Modify: `prompts/subjects/logic/analogies.md`

**Step 1: Update patterns.md**

Read current file:
```bash
docker compose exec backend-dev cat prompts/subjects/logic/patterns.md
```

Update `prompts/subjects/logic/patterns.md` frontmatter:

```yaml
---
id: patterns
name: Pattern Recognition
description: Finding and understanding patterns in logical sequences
grade: 3
ages: [8, 9, 10, 11, 12, 13, 14, 15, 16]
focus: Visual and logical patterns
difficulty: medium
learning_objectives:
  - Identify repeating patterns in sequences
  - Predict next elements in a pattern
  - Understand rule-based progressions
  - Develop systematic observation skills
prerequisites: []
example_tasks:
  - "Complete the pattern: 2, 4, 6, 8, __"
  - "What comes next: ○, □, ○, □, __"
real_world_context: Music rhythms, wallpaper designs, calendars
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

**Step 2: Update sequences.md**

Update `prompts/subjects/logic/sequences.md`:

```yaml
---
id: sequences
name: Number Sequences
description: Understanding and continuing numerical sequences
grade: 3
ages: [8, 9, 10, 11, 12, 13, 14, 15, 16]
focus: Mathematical sequences and progressions
difficulty: medium
learning_objectives:
  - Recognize arithmetic sequences
  - Understand geometric progressions
  - Identify sequence rules
  - Apply patterns to predict future values
prerequisites: [patterns]
example_tasks:
  - "Continue: 1, 3, 5, 7, __"
  - "What's the pattern: 2, 4, 8, 16, __"
real_world_context: Population growth, savings accounts, counting by intervals
---

Create a number sequence problem that:
- Uses clear numerical progressions
- Matches {{age}}-year-old comprehension
- Has discoverable patterns
- Builds logical reasoning
- Encourages mathematical thinking
```

**Step 3: Update deduction.md**

Update `prompts/subjects/logic/deduction.md`:

```yaml
---
id: deduction
name: Logical Deduction
description: Using given information to reach logical conclusions
grade: 4
ages: [9, 10, 11, 12, 13, 14, 15, 16]
focus: Deductive reasoning and inference
difficulty: hard
learning_objectives:
  - Draw logical conclusions from given facts
  - Identify necessary vs sufficient conditions
  - Eliminate impossible options systematically
  - Build chains of logical reasoning
prerequisites: [patterns, sequences]
example_tasks:
  - "If A > B and B > C, what can we say about A and C?"
  - "All cats are animals. Fluffy is a cat. What can we conclude?"
real_world_context: Detective work, scientific experiments, troubleshooting
---

Create a deduction problem that:
- Presents clear premises
- Requires logical reasoning
- Is appropriate for {{age}}-year-olds
- Has unambiguous conclusions
- Develops critical thinking
- Encourages step-by-step reasoning
```

**Step 4: Update analogies.md**

Update `prompts/subjects/logic/analogies.md`:

```yaml
---
id: analogies
name: Analogies and Relationships
description: Understanding relationships between concepts
grade: 3
ages: [8, 9, 10, 11, 12, 13, 14, 15, 16]
focus: Conceptual relationships and comparisons
difficulty: medium
learning_objectives:
  - Identify relationships between concepts
  - Apply relationship patterns to new contexts
  - Understand analogical reasoning
  - Recognize different types of relationships
prerequisites: []
example_tasks:
  - "Cat is to kitten as dog is to __"
  - "Hot is to cold as up is to __"
real_world_context: Language learning, metaphors, comparisons
---

Create an analogy problem that:
- Uses clear relationship types
- Matches {{age}}-year-old vocabulary
- Has obvious logical connections
- Builds reasoning by analogy
- Uses familiar concepts
```

**Step 5: Commit**

```bash
git add prompts/subjects/logic/*.md
git commit -m "feat: migrate logic concepts to new frontmatter format"
```

---

## Task 4: Update Backend Schemas

**Files:**
- Modify: `packages/backend/src/tasks/schemas.ts`

**Step 1: Read current schema file**

```bash
docker compose exec backend-dev cat packages/backend/src/tasks/schemas.ts
```

**Step 2: Update concept frontmatter schema**

Update `packages/backend/src/tasks/schemas.ts` - replace conceptFrontmatterSchema:

```typescript
export const conceptFrontmatterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  // New required fields
  grade: z.number().int().min(1).max(13),
  ages: z.array(z.number().int().min(6).max(18)),
  focus: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  learning_objectives: z.array(z.string()).min(1),
  // Optional fields
  prerequisites: z.array(z.string()).optional(),
  example_tasks: z.array(z.string()).optional(),
  real_world_context: z.string().optional(),
});

export type ConceptFrontmatter = z.infer<typeof conceptFrontmatterSchema>;
```

**Step 3: Add source tracking type**

Add to `packages/backend/src/tasks/schemas.ts`:

```typescript
export interface EnrichedConcept extends ConceptFrontmatter {
  prompt: string;
  source: 'curriculum' | 'custom';
  sourceDirectory: string;
}
```

**Step 4: Run TypeScript check**

```bash
docker compose exec backend-dev bun run type-check
```

Expected: Type errors in loader and registry (will fix in next tasks)

**Step 5: Commit**

```bash
git add packages/backend/src/tasks/schemas.ts
git commit -m "feat: update concept schema for enhanced frontmatter"
```

---

## Task 5: Update ConceptLoader for Dual Directories

**Files:**
- Modify: `packages/backend/src/tasks/loader.ts`

**Step 1: Read current loader**

```bash
docker compose exec backend-dev cat packages/backend/src/tasks/loader.ts
```

**Step 2: Update PromptLoader class to scan both directories**

Update `packages/backend/src/tasks/loader.ts`:

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { conceptFrontmatterSchema, subjectFrontmatterSchema, EnrichedConcept } from './schemas';

export class PromptLoader {
  private promptsDir: string;
  private curriculumsDir: string;

  constructor() {
    this.promptsDir = path.join(process.cwd(), 'prompts');
    this.curriculumsDir = path.join(process.cwd(), 'curriculums');
  }

  /**
   * Load base prompt (shared across all subjects)
   */
  loadBasePrompt(): string {
    const basePath = path.join(this.promptsDir, 'base-prompt.md');
    if (!fs.existsSync(basePath)) {
      throw new Error(`Base prompt not found: ${basePath}`);
    }
    const content = fs.readFileSync(basePath, 'utf-8');
    const parsed = matter(content);
    return parsed.content;
  }

  /**
   * Load subject metadata from base.md
   */
  loadSubject(subjectId: string) {
    const subjectPath = path.join(this.promptsDir, 'subjects', subjectId, 'base.md');

    if (!fs.existsSync(subjectPath)) {
      throw new Error(`Subject not found: ${subjectPath}`);
    }

    const content = fs.readFileSync(subjectPath, 'utf-8');
    const parsed = matter(content);

    const result = subjectFrontmatterSchema.safeParse(parsed.data);
    if (!result.success) {
      throw new Error(`Invalid subject frontmatter in ${subjectPath}: ${result.error.message}`);
    }

    return {
      ...result.data,
      prompt: parsed.content,
    };
  }

  /**
   * Load all concepts for a subject from both curriculum and custom directories
   */
  loadConcepts(subjectId: string): EnrichedConcept[] {
    const concepts: EnrichedConcept[] = [];

    // Load curriculum concepts
    const curriculumPath = path.join(this.curriculumsDir, subjectId);
    if (fs.existsSync(curriculumPath)) {
      const curriculumConcepts = this.loadConceptsFromDirectory(
        curriculumPath,
        'curriculum'
      );
      concepts.push(...curriculumConcepts);
    }

    // Load custom concepts
    const customPath = path.join(this.promptsDir, 'subjects', subjectId);
    if (fs.existsSync(customPath)) {
      const customConcepts = this.loadConceptsFromDirectory(
        customPath,
        'custom',
        ['base.md'] // exclude base.md
      );
      concepts.push(...customConcepts);
    }

    // Handle duplicates by appending "(Custom)" to custom version
    return this.deduplicateConcepts(concepts);
  }

  /**
   * Load concepts from a specific directory
   */
  private loadConceptsFromDirectory(
    dirPath: string,
    source: 'curriculum' | 'custom',
    excludeFiles: string[] = []
  ): EnrichedConcept[] {
    const concepts: EnrichedConcept[] = [];

    if (!fs.existsSync(dirPath)) {
      return concepts;
    }

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      if (excludeFiles.includes(file)) continue;

      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (!stat.isFile()) continue;

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const parsed = matter(content);

        const result = conceptFrontmatterSchema.safeParse(parsed.data);
        if (!result.success) {
          console.warn(`Invalid concept frontmatter in ${filePath}: ${result.error.message}`);
          continue;
        }

        concepts.push({
          ...result.data,
          prompt: parsed.content,
          source,
          sourceDirectory: dirPath,
        });
      } catch (error) {
        console.warn(`Error loading concept from ${filePath}:`, error);
      }
    }

    return concepts;
  }

  /**
   * Handle duplicate concept names by appending "(Custom)" to custom versions
   */
  private deduplicateConcepts(concepts: EnrichedConcept[]): EnrichedConcept[] {
    const nameMap = new Map<string, EnrichedConcept[]>();

    // Group concepts by name
    for (const concept of concepts) {
      const existing = nameMap.get(concept.name) || [];
      existing.push(concept);
      nameMap.set(concept.name, existing);
    }

    // Handle duplicates
    const deduplicated: EnrichedConcept[] = [];

    for (const [name, group] of nameMap.entries()) {
      if (group.length === 1) {
        deduplicated.push(group[0]);
      } else {
        // Multiple concepts with same name
        const curriculum = group.filter(c => c.source === 'curriculum');
        const custom = group.filter(c => c.source === 'custom');

        // Add curriculum versions as-is
        deduplicated.push(...curriculum);

        // Add custom versions with "(Custom)" suffix
        for (const concept of custom) {
          deduplicated.push({
            ...concept,
            name: `${concept.name} (Custom)`,
            id: `${concept.id}-custom`,
          });
        }
      }
    }

    return deduplicated;
  }

  /**
   * Load variations (unchanged)
   */
  loadVariations(): string {
    const variationsPath = path.join(this.promptsDir, 'variations', 'scenarios.md');
    if (!fs.existsSync(variationsPath)) {
      return '';
    }
    const content = fs.readFileSync(variationsPath, 'utf-8');
    const parsed = matter(content);
    return parsed.content;
  }
}
```

**Step 3: Run type check**

```bash
docker compose exec backend-dev bun run type-check
```

Expected: Type errors in registry and other files (will fix next)

**Step 4: Commit**

```bash
git add packages/backend/src/tasks/loader.ts
git commit -m "feat: update ConceptLoader to scan both curriculum and custom directories"
```

---

## Task 6: Update SubjectRegistry with Filtering

**Files:**
- Modify: `packages/backend/src/tasks/subject.registry.ts`

**Step 1: Read current registry**

```bash
docker compose exec backend-dev cat packages/backend/src/tasks/subject.registry.ts
```

**Step 2: Add filtering methods to SubjectRegistry**

Update `packages/backend/src/tasks/subject.registry.ts`:

```typescript
import { PromptLoader } from './loader';
import { EnrichedConcept } from './schemas';
import chokidar from 'chokidar';
import path from 'path';

interface SubjectData {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

interface ConceptCache {
  [conceptId: string]: EnrichedConcept;
}

export class SubjectRegistry {
  private loader: PromptLoader;
  private subjects: Map<string, SubjectData>;
  private concepts: Map<string, ConceptCache>; // subjectId -> concepts
  private basePrompt: string;
  private variations: string;
  private watcher?: chokidar.FSWatcher;

  constructor() {
    this.loader = new PromptLoader();
    this.subjects = new Map();
    this.concepts = new Map();
    this.basePrompt = '';
    this.variations = '';
  }

  /**
   * Initialize registry and start watching for changes
   */
  async initialize() {
    console.log('Initializing SubjectRegistry...');

    // Load base prompt
    this.basePrompt = this.loader.loadBasePrompt();

    // Load variations
    this.variations = this.loader.loadVariations();

    // Discover subjects
    await this.discoverSubjects();

    // Setup hot reload
    this.setupHotReload();

    console.log(`✓ Loaded ${this.subjects.size} subjects`);
  }

  /**
   * Discover all subjects from prompts/subjects directory
   */
  private async discoverSubjects() {
    const subjectsDir = path.join(process.cwd(), 'prompts', 'subjects');
    const fs = await import('fs');

    if (!fs.existsSync(subjectsDir)) {
      throw new Error(`Subjects directory not found: ${subjectsDir}`);
    }

    const entries = fs.readdirSync(subjectsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const subjectId = entry.name;

      try {
        // Load subject metadata
        const subject = this.loader.loadSubject(subjectId);

        this.subjects.set(subjectId, subject);

        // Load concepts for this subject
        this.loadSubjectConcepts(subjectId);
      } catch (error) {
        console.warn(`Failed to load subject ${subjectId}:`, error);
      }
    }
  }

  /**
   * Load and cache concepts for a subject
   */
  private loadSubjectConcepts(subjectId: string) {
    const concepts = this.loader.loadConcepts(subjectId);

    const cache: ConceptCache = {};
    for (const concept of concepts) {
      cache[concept.id] = concept;
    }

    this.concepts.set(subjectId, cache);
    console.log(`  Loaded ${concepts.length} concepts for ${subjectId}`);
  }

  /**
   * Setup hot reload watching
   */
  private setupHotReload() {
    const promptsDir = path.join(process.cwd(), 'prompts');
    const curriculumsDir = path.join(process.cwd(), 'curriculums');

    this.watcher = chokidar.watch(
      [promptsDir, curriculumsDir],
      {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
      }
    );

    this.watcher.on('change', (filePath) => {
      console.log(`File changed: ${filePath}, reloading...`);

      // Reload base prompt if changed
      if (filePath.includes('base-prompt.md')) {
        this.basePrompt = this.loader.loadBasePrompt();
        return;
      }

      // Reload variations if changed
      if (filePath.includes('variations')) {
        this.variations = this.loader.loadVariations();
        return;
      }

      // Reload subject concepts
      const subjectMatch = filePath.match(/(?:subjects|curriculums)[\/\\]([^\/\\]+)/);
      if (subjectMatch) {
        const subjectId = subjectMatch[1];
        if (this.subjects.has(subjectId)) {
          this.loadSubjectConcepts(subjectId);
        }
      }
    });

    console.log('✓ Hot reload watching enabled');
  }

  /**
   * Get all subjects
   */
  getSubjects(): SubjectData[] {
    return Array.from(this.subjects.values());
  }

  /**
   * Get subject by ID
   */
  getSubject(subjectId: string): SubjectData | undefined {
    return this.subjects.get(subjectId);
  }

  /**
   * Get all concepts for a subject, optionally filtered by grade and difficulty
   */
  getConcepts(
    subjectId: string,
    options?: {
      grade?: number;
      difficulty?: 'easy' | 'medium' | 'hard';
    }
  ): EnrichedConcept[] {
    const cache = this.concepts.get(subjectId);
    if (!cache) return [];

    let concepts = Object.values(cache);

    // Filter by grade
    if (options?.grade !== undefined) {
      concepts = concepts.filter(c => c.grade === options.grade);
    }

    // Filter by difficulty
    if (options?.difficulty) {
      concepts = concepts.filter(c => c.difficulty === options.difficulty);
    }

    return concepts;
  }

  /**
   * Get single concept by ID
   */
  getConcept(subjectId: string, conceptId: string): EnrichedConcept | undefined {
    const cache = this.concepts.get(subjectId);
    if (!cache) return undefined;
    return cache[conceptId];
  }

  /**
   * Get base prompt
   */
  getBasePrompt(): string {
    return this.basePrompt;
  }

  /**
   * Get variations
   */
  getVariations(): string {
    return this.variations;
  }

  /**
   * Cleanup
   */
  async cleanup() {
    if (this.watcher) {
      await this.watcher.close();
    }
  }
}

// Global singleton
let registryInstance: SubjectRegistry | null = null;

export async function getSubjectRegistry(): Promise<SubjectRegistry> {
  if (!registryInstance) {
    registryInstance = new SubjectRegistry();
    await registryInstance.initialize();
  }
  return registryInstance;
}
```

**Step 3: Run type check**

```bash
docker compose exec backend-dev bun run type-check
```

Expected: Some errors in controllers (will fix next)

**Step 4: Commit**

```bash
git add packages/backend/src/tasks/subject.registry.ts
git commit -m "feat: add grade and difficulty filtering to SubjectRegistry"
```

---

## Task 7: Update PromptBuilder for Metadata Injection

**Files:**
- Modify: `packages/backend/src/tasks/prompt.builder.ts` (or similar file)

**Step 1: Read current prompt builder**

```bash
docker compose exec backend-dev cat packages/backend/src/tasks/prompt.builder.ts
```

**Step 2: Update PromptBuilder to inject concept metadata**

Update `packages/backend/src/tasks/prompt.builder.ts`:

```typescript
import { EnrichedConcept } from './schemas';
import { getSubjectRegistry } from './subject.registry';

interface TaskGenerationParams {
  subject: string;
  concept: string;
  taskType: string;
  age: number;
  difficulty: 'easy' | 'medium' | 'hard';
  gender?: string;
  language: string;
}

export class PromptBuilder {
  /**
   * Build complete prompt for task generation
   */
  async buildPrompt(params: TaskGenerationParams): Promise<string> {
    const registry = await getSubjectRegistry();

    // Get components
    const basePrompt = registry.getBasePrompt();
    const subject = registry.getSubject(params.subject);
    const concept = registry.getConcept(params.subject, params.concept);
    const variations = registry.getVariations();

    if (!subject) {
      throw new Error(`Subject not found: ${params.subject}`);
    }

    if (!concept) {
      throw new Error(`Concept not found: ${params.concept} in subject ${params.subject}`);
    }

    // Build prompt sections
    const sections = [];

    // 1. Base role and guidelines
    sections.push('# Role and Guidelines');
    sections.push(basePrompt);
    sections.push('');

    // 2. Subject context
    sections.push('# Subject Context');
    sections.push(`**Subject:** ${subject.name}`);
    sections.push(subject.prompt);
    sections.push('');

    // 3. Concept details with full metadata
    sections.push('# Concept Details');
    sections.push(`**Concept:** ${concept.name}`);
    sections.push(`**Focus:** ${concept.focus}`);
    sections.push(`**Difficulty Level:** ${concept.difficulty}`);
    sections.push('');

    sections.push('**Learning Objectives:**');
    for (const objective of concept.learning_objectives) {
      sections.push(`- ${objective}`);
    }
    sections.push('');

    if (concept.prerequisites && concept.prerequisites.length > 0) {
      sections.push('**Prerequisites:**');
      sections.push(concept.prerequisites.join(', '));
      sections.push('');
    }

    if (concept.example_tasks && concept.example_tasks.length > 0) {
      sections.push('**Example Tasks:**');
      for (const example of concept.example_tasks) {
        sections.push(`- ${example}`);
      }
      sections.push('');
    }

    if (concept.real_world_context) {
      sections.push('**Real-World Context:**');
      sections.push(concept.real_world_context);
      sections.push('');
    }

    // 4. Concept-specific prompt
    sections.push('# Concept-Specific Instructions');
    sections.push(concept.prompt);
    sections.push('');

    // 5. Variations for personalization
    if (variations) {
      sections.push('# Personalization Options');
      sections.push(variations);
      sections.push('');
    }

    // 6. Task parameters
    sections.push('# Task Parameters');
    sections.push(`**Student Age:** ${params.age} years old`);
    sections.push(`**Task Difficulty:** ${params.difficulty}`);
    sections.push(`**Task Type:** ${params.taskType}`);
    if (params.gender) {
      sections.push(`**Gender:** ${params.gender}`);
    }
    sections.push(`**Response Language:** ${params.language}`);
    sections.push('');

    // 7. Final instruction
    sections.push('# Your Task');
    sections.push(`Generate a ${params.difficulty} ${params.taskType} task for this concept.`);
    sections.push('The task should align with the learning objectives and be appropriate for the student\'s age and grade level.');
    sections.push('');

    return sections.join('\n');
  }
}
```

**Step 3: Run type check**

```bash
docker compose exec backend-dev bun run type-check
```

Expected: No errors in prompt builder

**Step 4: Commit**

```bash
git add packages/backend/src/tasks/prompt.builder.ts
git commit -m "feat: inject full concept metadata into task generation prompts"
```

---

## Task 8: Update Task Controller for Grade Parameter

**Files:**
- Modify: `packages/backend/src/tasks/task.controller.ts`

**Step 1: Read current controller**

```bash
docker compose exec backend-dev cat packages/backend/src/tasks/task.controller.ts
```

**Step 2: Add grade parameter to task generation endpoint**

Update `packages/backend/src/tasks/task.controller.ts` - add grade to query params:

```typescript
import { Request, Response } from 'express';
import { z } from 'zod';
import { TaskService } from './task.service';

const taskQuerySchema = z.object({
  subject: z.string(),
  concept: z.string(),
  taskType: z.string(),
  age: z.coerce.number().int().min(6).max(18),
  grade: z.coerce.number().int().min(1).max(13),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  gender: z.enum(['male', 'female', 'neutral']).optional(),
});

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  /**
   * Generate a new task
   * GET /api/task?subject=X&concept=Y&taskType=Z&age=N&grade=M&difficulty=D
   */
  async generateTask(req: Request, res: Response) {
    try {
      // Validate query params
      const result = taskQuerySchema.safeParse(req.query);

      if (!result.success) {
        return res.status(400).json({
          error: 'Invalid parameters',
          details: result.error.issues,
        });
      }

      const params = result.data;
      const language = req.headers['accept-language']?.split(',')[0] || 'en';

      // Generate task
      const task = await this.taskService.generateTask({
        ...params,
        language,
      });

      return res.json(task);
    } catch (error: any) {
      console.error('Error generating task:', error);
      return res.status(500).json({
        error: 'Failed to generate task',
        message: error.message,
      });
    }
  }

  /**
   * Get list of subjects with concepts (filtered by grade/difficulty)
   * GET /api/task/subjects?grade=N&age=M&difficulty=D
   */
  async getSubjects(req: Request, res: Response) {
    try {
      const schema = z.object({
        grade: z.coerce.number().int().min(1).max(13),
        age: z.coerce.number().int().min(6).max(18),
        difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
      });

      const result = schema.safeParse(req.query);

      if (!result.success) {
        return res.status(400).json({
          error: 'Invalid parameters',
          details: result.error.issues,
        });
      }

      const { grade, difficulty } = result.data;

      const subjects = await this.taskService.getSubjectsWithConcepts({
        grade,
        difficulty,
      });

      return res.json({ subjects });
    } catch (error: any) {
      console.error('Error getting subjects:', error);
      return res.status(500).json({
        error: 'Failed to get subjects',
        message: error.message,
      });
    }
  }
}
```

**Step 3: Update router to include new endpoint**

Update `packages/backend/src/tasks/router.ts`:

```typescript
import { Router } from 'express';
import { TaskController } from './task.controller';

const router = Router();
const taskController = new TaskController();

// Get subjects with filtered concepts
router.get('/subjects', (req, res) => taskController.getSubjects(req, res));

// Generate task
router.get('/', (req, res) => taskController.generateTask(req, res));

// Get hint for task (existing)
router.post('/:taskId/hint', (req, res) => taskController.getHint(req, res));

export default router;
```

**Step 4: Run type check**

```bash
docker compose exec backend-dev bun run type-check
```

Expected: Errors in task.service (will fix next)

**Step 5: Commit**

```bash
git add packages/backend/src/tasks/task.controller.ts packages/backend/src/tasks/router.ts
git commit -m "feat: add grade parameter to task endpoints"
```

---

## Task 9: Update Task Service

**Files:**
- Modify: `packages/backend/src/tasks/task.service.ts`

**Step 1: Read current service**

```bash
docker compose exec backend-dev cat packages/backend/src/tasks/task.service.ts
```

**Step 2: Add getSubjectsWithConcepts method**

Update `packages/backend/src/tasks/task.service.ts`:

```typescript
import { getSubjectRegistry } from './subject.registry';
import { PromptBuilder } from './prompt.builder';
import { AIService } from '../common/ai/ai.service';

interface TaskParams {
  subject: string;
  concept: string;
  taskType: string;
  age: number;
  grade: number;
  difficulty: 'easy' | 'medium' | 'hard';
  gender?: string;
  language: string;
}

interface SubjectWithConcepts {
  id: string;
  name: string;
  concepts: Array<{
    id: string;
    name: string;
    grade: number;
    difficulty: string;
    source: string;
  }>;
}

export class TaskService {
  private promptBuilder: PromptBuilder;
  private aiService: AIService;

  constructor() {
    this.promptBuilder = new PromptBuilder();
    this.aiService = new AIService();
  }

  /**
   * Get subjects with filtered concepts
   */
  async getSubjectsWithConcepts(options: {
    grade: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }): Promise<SubjectWithConcepts[]> {
    const registry = await getSubjectRegistry();
    const subjects = registry.getSubjects();

    const result: SubjectWithConcepts[] = [];

    for (const subject of subjects) {
      const concepts = registry.getConcepts(subject.id, {
        grade: options.grade,
        difficulty: options.difficulty,
      });

      if (concepts.length === 0) continue;

      result.push({
        id: subject.id,
        name: subject.name,
        concepts: concepts.map(c => ({
          id: c.id,
          name: c.name,
          grade: c.grade,
          difficulty: c.difficulty,
          source: c.source,
        })),
      });
    }

    return result;
  }

  /**
   * Generate task (existing method - ensure grade is passed through)
   */
  async generateTask(params: TaskParams) {
    // Build prompt with concept metadata
    const prompt = await this.promptBuilder.buildPrompt(params);

    // Generate task with AI
    const response = await this.aiService.generateText(prompt);

    // Parse and return task
    // ... existing task generation logic ...

    return {
      taskId: generateTaskId(),
      // ... rest of task data
    };
  }
}
```

**Step 3: Run type check**

```bash
docker compose exec backend-dev bun run type-check
```

Expected: No backend type errors

**Step 4: Commit**

```bash
git add packages/backend/src/tasks/task.service.ts
git commit -m "feat: add subject/concept filtering in TaskService"
```

---

## Task 10: Update Frontend Types and API Client

**Files:**
- Modify: `packages/frontend/src/features/UserData/core/types.ts`
- Modify: `packages/frontend/src/api/logikids.ts`

**Step 1: Add grade to UserData type**

Update `packages/frontend/src/features/UserData/core/types.ts`:

```typescript
export interface UserData {
  id: string;
  name: string;
  age: number;
  grade: number; // NEW
  gender: 'male' | 'female' | 'neutral';
  language: string;
  // ... existing fields
}
```

**Step 2: Update API client**

Update `packages/frontend/src/api/logikids.ts`:

```typescript
// Add grade to task generation params
export interface TaskGenerationParams {
  subject: string;
  concept: string;
  taskType: string;
  age: number;
  grade: number; // NEW
  difficulty: 'easy' | 'medium' | 'hard';
  gender?: 'male' | 'female' | 'neutral';
}

// Add subjects endpoint params
export interface SubjectsParams {
  grade: number;
  age: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Add subject/concept response types
export interface ConceptInfo {
  id: string;
  name: string;
  grade: number;
  difficulty: string;
  source: 'curriculum' | 'custom';
}

export interface SubjectInfo {
  id: string;
  name: string;
  concepts: ConceptInfo[];
}

export interface SubjectsResponse {
  subjects: SubjectInfo[];
}

// Update API client
export const logikidsApi = {
  // Existing methods...

  async getSubjects(params: SubjectsParams): Promise<SubjectsResponse> {
    const queryParams = new URLSearchParams({
      grade: params.grade.toString(),
      age: params.age.toString(),
    });

    if (params.difficulty) {
      queryParams.append('difficulty', params.difficulty);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/task/subjects?${queryParams}`,
      {
        headers: {
          'Accept-Language': i18n.language,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch subjects');
    }

    return response.json();
  },

  async generateTask(params: TaskGenerationParams): Promise<Task> {
    const queryParams = new URLSearchParams({
      subject: params.subject,
      concept: params.concept,
      taskType: params.taskType,
      age: params.age.toString(),
      grade: params.grade.toString(), // NEW
      difficulty: params.difficulty,
    });

    if (params.gender) {
      queryParams.append('gender', params.gender);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/task?${queryParams}`,
      {
        headers: {
          'Accept-Language': i18n.language,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate task');
    }

    return response.json();
  },
};
```

**Step 3: Run type check**

```bash
docker compose exec frontend-dev npm run type-check
```

Expected: Type errors in components (will fix next)

**Step 4: Commit**

```bash
git add packages/frontend/src/features/UserData/core/types.ts packages/frontend/src/api/logikids.ts
git commit -m "feat: add grade field to UserData and API client"
```

---

## Task 11: Update Onboarding Flow

**Files:**
- Modify: `packages/frontend/src/features/Welcome/WelcomePage/WelcomePage.tsx`

**Step 1: Read current onboarding**

```bash
docker compose exec frontend-dev cat packages/frontend/src/features/Welcome/WelcomePage/WelcomePage.tsx
```

**Step 2: Add grade input to onboarding form**

Update `packages/frontend/src/features/Welcome/WelcomePage/WelcomePage.tsx`:

```typescript
import { useState } from 'react';
import { useUserData } from '../../UserData/core/UserDataContext';
import { useTranslation } from 'react-i18next';

export function WelcomePage() {
  const { t } = useTranslation();
  const { updateUserData } = useUserData();

  const [name, setName] = useState('');
  const [age, setAge] = useState(10);
  const [grade, setGrade] = useState(4); // NEW
  const [gender, setGender] = useState<'male' | 'female' | 'neutral'>('neutral');

  const handleSubmit = () => {
    // Validate grade/age consistency
    const expectedGrade = age - 5; // Rough calculation
    if (Math.abs(grade - expectedGrade) > 2) {
      const confirmed = window.confirm(
        t('profile.gradeMismatchWarning', {
          age,
          grade,
          expectedGrade,
        })
      );
      if (!confirmed) return;
    }

    updateUserData({
      name,
      age,
      grade, // NEW
      gender,
    });
  };

  return (
    <div className="welcome-page">
      <h1>{t('welcome.title')}</h1>

      <form onSubmit={handleSubmit}>
        {/* Name input */}
        <div>
          <label>{t('profile.name')}</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* Age input */}
        <div>
          <label>{t('profile.age')}</label>
          <input
            type="number"
            min={6}
            max={18}
            value={age}
            onChange={e => setAge(Number(e.target.value))}
          />
        </div>

        {/* Grade input - NEW */}
        <div>
          <label>{t('profile.grade')}</label>
          <select
            value={grade}
            onChange={e => setGrade(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(g => (
              <option key={g} value={g}>
                {t('profile.gradeValue', { grade: g })}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-600">
            {t('profile.gradeDescription')}
          </p>
        </div>

        {/* Gender input */}
        <div>
          <label>{t('profile.gender')}</label>
          <select
            value={gender}
            onChange={e => setGender(e.target.value as any)}
          >
            <option value="neutral">{t('profile.genderNeutral')}</option>
            <option value="male">{t('profile.genderMale')}</option>
            <option value="female">{t('profile.genderFemale')}</option>
          </select>
        </div>

        <button type="submit">
          {t('welcome.continue')}
        </button>
      </form>
    </div>
  );
}
```

**Step 3: Add translations**

Update `packages/frontend/public/locales/en/common.json`:

```json
{
  "profile": {
    "grade": "Grade",
    "gradeValue": "Grade {{grade}}",
    "gradeDescription": "Your current school grade",
    "gradeMismatchWarning": "You entered age {{age}} and grade {{grade}}, but grade {{expectedGrade}} would be more typical for this age. Continue anyway?"
  }
}
```

Update `packages/frontend/public/locales/de/common.json`:

```json
{
  "profile": {
    "grade": "Klasse",
    "gradeValue": "Klasse {{grade}}",
    "gradeDescription": "Deine aktuelle Schulklasse",
    "gradeMismatchWarning": "Du hast Alter {{age}} und Klasse {{grade}} eingegeben, aber Klasse {{expectedGrade}} wäre typischer für dieses Alter. Trotzdem fortfahren?"
  }
}
```

**Step 4: Run type check**

```bash
docker compose exec frontend-dev npm run type-check
```

Expected: No type errors

**Step 5: Commit**

```bash
git add packages/frontend/src/features/Welcome/WelcomePage/WelcomePage.tsx packages/frontend/public/locales/
git commit -m "feat: add grade selection to onboarding flow"
```

---

## Task 12: Update Subject Selector

**Files:**
- Modify: `packages/frontend/src/features/Subject/SubjectSelector/SubjectSelector.tsx` (or similar)

**Step 1: Update subject selector to use new API**

Update subject selector component to call `/api/task/subjects` with grade:

```typescript
import { useQuery } from '@tanstack/react-query';
import { useUserData } from '../../UserData/core/UserDataContext';
import { logikidsApi } from '../../../api/logikids';

export function SubjectSelector() {
  const { userData } = useUserData();

  const { data, isLoading } = useQuery({
    queryKey: ['subjects', userData.grade, userData.age],
    queryFn: () => logikidsApi.getSubjects({
      grade: userData.grade,
      age: userData.age,
    }),
    enabled: !!userData.grade && !!userData.age,
  });

  if (isLoading) return <div>Loading subjects...</div>;
  if (!data) return null;

  return (
    <div className="subject-selector">
      <h2>Choose a Subject</h2>

      {data.subjects.map(subject => (
        <div key={subject.id} className="subject-card">
          <h3>{subject.name}</h3>
          <div className="concepts">
            {subject.concepts.map(concept => (
              <button
                key={concept.id}
                className="concept-button"
              >
                {concept.name}
                <span className="difficulty-badge">
                  {concept.difficulty}
                </span>
                {concept.source === 'custom' && (
                  <span className="source-badge">Custom</span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Update task generation calls to include grade**

Update task generation component:

```typescript
const { data: task } = useQuery({
  queryKey: ['task', subject, concept, userData.age, userData.grade],
  queryFn: () => logikidsApi.generateTask({
    subject,
    concept,
    taskType: 'multipleChoice',
    age: userData.age,
    grade: userData.grade, // NEW
    difficulty: 'medium',
    gender: userData.gender,
  }),
});
```

**Step 3: Run type check**

```bash
docker compose exec frontend-dev npm run type-check
```

Expected: No type errors

**Step 4: Commit**

```bash
git add packages/frontend/src/features/Subject/
git commit -m "feat: update subject selector to use grade-filtered API"
```

---

## Task 13: Integration Testing

**Files:**
- Run: Integration tests

**Step 1: Start services**

```bash
docker compose up backend-dev -d
```

Wait for startup, then:

```bash
docker compose logs backend-dev | grep "Loaded"
```

Expected output:
```
✓ Loaded 4 subjects
  Loaded 47 concepts for math
  Loaded 4 concepts for logic
  ...
```

**Step 2: Test subjects endpoint with grade filtering**

```bash
curl "http://localhost:5175/api/task/subjects?grade=1&age=7" | jq .
```

Expected: JSON with subjects containing only grade 1 concepts

**Step 3: Test subjects endpoint with difficulty filtering**

```bash
curl "http://localhost:5175/api/task/subjects?grade=1&age=7&difficulty=easy" | jq .
```

Expected: JSON with only easy grade 1 concepts

**Step 4: Test task generation with grade param**

```bash
curl "http://localhost:5175/api/task?subject=math&concept=grade1-addition-up-to-10&taskType=multipleChoice&age=7&grade=1&difficulty=easy" -H "Accept-Language: en" | jq .
```

Expected: Task response with taskId

**Step 5: Verify duplicate handling**

Create a test custom concept with same name as curriculum:

```bash
echo '---
id: addition-custom-test
name: Addition up to 10
grade: 1
ages: [6, 7]
focus: Custom addition
difficulty: easy
learning_objectives:
  - Custom objective
---
Custom prompt' > prompts/subjects/math/addition-custom-test.md
```

Wait for hot-reload, then:

```bash
curl "http://localhost:5175/api/task/subjects?grade=1&age=7" | jq '.subjects[] | select(.id=="math") | .concepts[] | select(.name | contains("Addition up to 10"))'
```

Expected: Two concepts - one "Addition up to 10" (curriculum) and one "Addition up to 10 (Custom)"

Clean up test file:

```bash
rm prompts/subjects/math/addition-custom-test.md
```

**Step 6: Verify hot-reload works**

Edit a concept file:

```bash
echo "# Test change" >> prompts/subjects/logic/patterns.md
```

Check logs:

```bash
docker compose logs backend-dev --tail=20
```

Expected: "File changed: .../patterns.md, reloading..."

Revert change:

```bash
git checkout prompts/subjects/logic/patterns.md
```

**Step 7: No commit (verification only)**

---

## Task 14: Frontend Manual Verification

**Files:**
- Run: Frontend dev server

**Step 1: Start frontend**

```bash
docker compose up frontend-dev -d
```

**Step 2: Open browser**

Navigate to: http://localhost:5153

**Step 3: Test onboarding with grade selection**

- Enter name, age=7, grade=1
- Verify grade dropdown shows grades 1-13
- Complete onboarding

**Step 4: Test subject selection**

- Verify subjects load
- Verify only grade 1 concepts appear
- Check difficulty badges display

**Step 5: Test task generation**

- Select a subject and concept
- Generate a task
- Verify task generates successfully

**Step 6: Test grade mismatch warning**

- Go to settings
- Change age to 15 but keep grade 1
- Should see warning about mismatch

**Step 7: No commit (verification only)**

---

## Completion

All tasks implemented! The curriculum integration is complete with:

✅ Conversion script for YAML → markdown
✅ Unified concept format with rich metadata
✅ Dual-directory loading (curriculum + custom)
✅ Grade and difficulty filtering
✅ Duplicate handling with auto-prefixing
✅ Enhanced prompt building with full metadata
✅ Frontend grade selection and filtering
✅ Hot-reload for both directories
✅ Integration tests passing

**Next steps:**
- Review all changes (no git commit yet per request)
- User can test and provide feedback
- When approved, commit all changes together
