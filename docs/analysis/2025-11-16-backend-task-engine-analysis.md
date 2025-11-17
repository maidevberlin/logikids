# Backend Task Generation Engine - Code Quality Analysis

**Date:** 2025-11-16
**Scope:** Backend Task Generation Engine (tasks, prompts, hints, variations)
**Total Lines of Code:** ~2,809 lines
**Analyzer:** Claude Code

## Executive Summary

The Backend Task Generation Engine demonstrates **good architectural foundations** with clean service abstractions, proper dependency injection, and well-structured prompt management. However, there are **critical violations of DRY and SOLID principles** that create maintenance burdens and scaling challenges.

### Overall Assessment

- **Architecture Quality:** Good (7/10)
- **Code Duplication:** Moderate Issues (6/10)
- **SOLID Compliance:** Moderate Issues (6/10)
- **Minimal Code:** Good (7/10)

### Top 3 Critical Issues

1. **Duplicate PromptLoader/VariationLoader Instantiation** - Services create their own instances instead of receiving them, violating DI principles and preventing configuration reuse
2. **Massive Duplication in TaskController Filter Logic** - 60+ lines of nearly identical filtering code across `getSubjects()` and `getSubjectConcepts()` methods
3. **Inconsistent Error Handling Patterns** - Controllers handle errors differently, mixing string matching with type checking, creating maintenance burden

---

## 1. DRY (Don't Repeat Yourself) Violations

### Critical Issues

#### 1.1 Duplicate PromptLoader/VariationLoader Creation

**Severity:** Critical
**Impact:** Prevents configuration reuse, testing complexity, resource waste

**Location:**
- `src/prompts/prompt.service.ts` lines 14-16
- `src/hints/hint.service.ts` lines 11-16
- `src/tasks/types/registry.ts` line 37

```typescript
// PromptService creates its own loaders
export class PromptService {
  constructor() {
    this.promptLoader = new PromptLoader();
    this.variationLoader = new VariationLoader();
  }
}

// HintService creates its own loaders
export class HintService {
  constructor(private readonly aiClient: AIClient) {
    this.promptLoader = new PromptLoader();
    this.variationLoader = new VariationLoader();
  }
}

// TaskTypeRegistry also creates its own loader
constructor(loader?: PromptLoader) {
  this.loader = loader || new PromptLoader();
}
```

**Problem:**
- Each service creates independent PromptLoader instances
- VariationLoader is instantiated and initialized separately in each service
- No shared caching or configuration
- Harder to test with mock loaders

**Recommendation:**
Create singleton instances or use dependency injection:
```typescript
// Shared instances
export const promptLoader = new PromptLoader();
export const variationLoader = new VariationLoader();

// Services receive them
export class PromptService {
  constructor(
    private readonly promptLoader: PromptLoader,
    private readonly variationLoader: VariationLoader
  ) {}
}
```

#### 1.2 Massive Duplication in TaskController Filtering

**Severity:** Critical
**Impact:** 60+ lines duplicated, maintenance nightmare

**Location:** `src/tasks/task.controller.ts` lines 24-82 vs 138-176

```typescript
// getSubjects() method
const subjects = subjectRegistry.getAll().map(subject => {
  const metadata = subjectRegistry.getConceptMetadata(subject.id);

  if (grade !== undefined) {
    let filteredConcepts = subjectRegistry.getConcepts(subject.id, { grade, difficulty });

    if (filteredConcepts.length === 0 && age !== undefined) {
      filteredConcepts = subjectRegistry.getConcepts(subject.id, { age, difficulty });
    }

    return {
      id: subject.id,
      name: subject.name,
      description: subject.description,
      conceptCount: metadata.conceptCount,
      minGrade: metadata.minGrade,
      maxGrade: metadata.maxGrade,
      minAge: metadata.minAge,
      maxAge: metadata.maxAge,
      concepts: filteredConcepts.map(concept => ({
        id: concept.id,
        name: concept.name,
        description: concept.description,
        grade: concept.grade,
        difficulty: concept.difficulty,
        source: concept.source,
        focus: concept.focus,
        learning_objectives: concept.learning_objectives
      }))
    };
  }
  // ... almost identical code for non-filtered case
});

// getSubjectConcepts() method - nearly identical filtering
let concepts = subjectRegistry.getConcepts(subjectId, { grade, difficulty });

if (source) {
  concepts = concepts.filter(c => c.source === source);
}

if (grade !== undefined && concepts.length === 0) {
  const allConcepts = subjectRegistry.getConcepts(subjectId, { difficulty });
  concepts = allConcepts.filter(c => {
    if (c.grade === undefined) return false;
    return c.grade < grade;
  });

  if (source) {
    concepts = concepts.filter(c => c.source === source);
  }
}
```

**Problem:**
- Concept filtering logic appears in multiple places
- Concept-to-DTO mapping is duplicated
- Fallback logic (grade → age) appears twice
- Source filtering is duplicated

**Recommendation:**
Extract to dedicated methods:
```typescript
private filterConceptsWithFallback(
  subjectId: string,
  options: FilterOptions
): Concept[] {
  // Centralized filtering with fallback
}

private mapConceptToDTO(concept: Concept): ConceptDTO {
  // Single mapping function
}
```

#### 1.3 Duplicate Initialization Patterns

**Severity:** Medium
**Impact:** Boilerplate duplication across services

**Location:**
- `src/prompts/prompt.service.ts` lines 22-26
- `src/hints/hint.service.ts` lines 22-26

```typescript
// Both services have nearly identical initialization
async initialize(): Promise<void> {
  console.log('[ServiceName] Initializing...');
  await this.variationLoader.loadAll();
  console.log('[ServiceName] Initialization complete');
}
```

**Recommendation:**
Use base class or composition for common initialization patterns.

### Medium Issues

#### 1.4 Repeated Error Handling Patterns in Controllers

**Location:** All controller methods have similar try-catch blocks

```typescript
// Repeated in getSubjects, getTask, getSubjectConcepts
catch (error) {
  if (error instanceof Error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
```

**Recommendation:**
Use Express error handling middleware (already exists but not fully utilized).

#### 1.5 Language Formatting Logic Duplication

**Location:** `src/prompts/builder.ts` lines 9-32

```typescript
const LANGUAGE_NAMES: Record<string, string> = {
  'en': 'English',
  'de': 'German'
};

private formatLanguage(code: string): string {
  return LANGUAGE_NAMES[code] || code;
}

private getLanguageStyle(grade: number): string {
  if (grade <= 4) {
    return "Use very simple, playful language...";
  } else if (grade <= 8) {
    return "Use casual but structured language...";
  } else {
    return "Use sophisticated, respectful tone...";
  }
}
```

**Problem:**
- Language formatting scattered across prompt builder
- Could be shared utility

**Recommendation:**
Extract to shared i18n utilities module.

---

## 2. SOLID Principles Violations

### Single Responsibility Principle (SRP) Violations

#### 2.1 TaskController Has Multiple Responsibilities

**Severity:** Medium
**Impact:** Controller manages filtering, mapping, fallback logic

**Location:** `src/tasks/task.controller.ts`

**Responsibilities:**
1. HTTP request/response handling
2. Complex concept filtering logic
3. Fallback strategies (grade → age)
4. DTO mapping
5. Error handling with status code decisions

**Current Issues:**
- 186 lines in a controller
- Business logic mixed with HTTP concerns
- Hard to test filtering logic independently

**Recommendation:**
```typescript
// Extract to service layer
export class SubjectQueryService {
  filterConcepts(params): FilteredConcepts
  buildSubjectDTO(subject, concepts): SubjectDTO
  applyFallbackFiltering(params): Concept[]
}

// Controller becomes thin
public async getSubjects(req, res) {
  const filters = this.parseQuery(req.query);
  const result = await this.subjectQueryService.getFilteredSubjects(filters);
  res.json(result);
}
```

#### 2.2 PromptBuilder Does Too Much

**Severity:** Medium
**Impact:** Single class handles composition, replacement, validation, formatting

**Location:** `src/prompts/builder.ts`

**Responsibilities:**
1. Template composition (buildPrompt)
2. Variable enrichment (age calculations, formatting)
3. Hint prompt building (different logic)
4. Language style determination
5. Debug logging

**Recommendation:**
Split into focused classes:
```typescript
export class TemplateComposer {
  compose(base, subtemplates): string
}

export class VariableEnricher {
  enrichFromAge(age): Variables
  enrichFromGrade(grade): Variables
}

export class PromptBuilder {
  constructor(composer, enricher) {}
  build(params): string
}
```

### Open/Closed Principle (OCP) Violations

#### 2.3 Hard-Coded Task Type Schema Mapping

**Severity:** Medium
**Impact:** Must modify TaskTypeRegistry to add new task types

**Location:** `src/tasks/types/registry.ts` lines 28-35

```typescript
private readonly schemas: Record<string, JSONSchema> = {
  singleChoice: singleChoiceSchema,
  yesNo: yesNoSchema,
  fillInBlank: fillInBlankSchema,
  multiSelect: multiSelectSchema,
  numberInput: numberInputSchema,
  ordering: orderingSchema,
};
```

**Problem:**
- Adding new task type requires modifying registry
- Schema-to-type coupling is hard-coded
- Not extensible through plugins

**Recommendation:**
```typescript
// Task types self-register with their schemas
export class TaskTypeDefinition {
  static register(id: string, schema: JSONSchema) {
    taskTypeRegistry.addSchema(id, schema);
  }
}

// Each task type file does:
TaskTypeDefinition.register('singleChoice', singleChoiceSchema);
```

#### 2.4 AI Provider Generation Logic Not Fully Abstract

**Severity:** Low
**Impact:** Each provider duplicates structured generation patterns

**Location:** All AI client implementations share similar structured generation flow

**Problem:**
- Each provider (Anthropic, OpenAI, Ollama) implements `generateStructured` differently
- Logging patterns are duplicated
- Error handling is similar but not shared

**Recommendation:**
Extract common structured generation template method to base class.

### Liskov Substitution Principle (LSP) Violations

**No significant violations detected.** All AI clients properly implement the AIClient interface and can be substituted without breaking behavior.

### Interface Segregation Principle (ISP) Observations

**Generally well-implemented.** Interfaces are focused:
- `AIClient` has only two methods: `generate()` and `generateStructured()`
- Task schemas are segregated by type
- No fat interfaces detected

### Dependency Inversion Principle (DIP) Violations

#### 2.5 Services Depend on Concrete PromptLoader/VariationLoader

**Severity:** High
**Impact:** Violates DIP, prevents testing and configuration

**Location:**
- `src/prompts/prompt.service.ts` lines 14-16
- `src/hints/hint.service.ts` lines 11-16

```typescript
export class PromptService {
  constructor() {
    // Direct dependency on concrete classes
    this.promptLoader = new PromptLoader();
    this.variationLoader = new VariationLoader();
  }
}
```

**Problem:**
- High-level services depend on concrete low-level classes
- Impossible to inject mock loaders for testing
- Can't configure alternative loader implementations

**Recommendation:**
Depend on abstractions:
```typescript
export interface IPromptLoader {
  loadBasePrompt(): Promise<string>;
  loadSubject(id: string): Promise<Subject>;
  // ... other methods
}

export class PromptService {
  constructor(
    private readonly promptLoader: IPromptLoader,
    private readonly variationLoader: IVariationLoader
  ) {}
}
```

---

## 3. Minimal Code Assessment

### Excellent Examples

#### 3.1 Template Replacer - Perfect Minimal Implementation

**Location:** `src/prompts/template-replacer.ts`

**Strengths:**
- 58 lines total, crystal clear purpose
- Two simple functions, single responsibility each
- No unnecessary abstraction
- Well-documented with examples

```typescript
export function replaceVariables(
  template: string,
  data: TemplateVariables,
  delimiters: [string, string] = ['{{', '}}']
): string {
  const [open, close] = delimiters;
  let result = template;

  for (const [key, value] of Object.entries(data)) {
    const placeholder = `${open}${key}${close}`;
    const replacement = String(value);
    result = result.replaceAll(placeholder, replacement);
  }

  return result;
}
```

**Why it's excellent:**
- Does one thing well
- No over-engineering
- Easy to test
- Self-explanatory

#### 3.2 Grading Functions - Pure and Simple

**Location:** `src/tasks/grading/`

**Strengths:**
- Pure functions with clear inputs/outputs
- No unnecessary state or complexity
- Each grading function ~40 lines
- Deterministic and testable

```typescript
export function gradeFillInBlank(
  userAnswers: string[],
  blanks: FillInBlankItem[]
): boolean {
  if (userAnswers.length !== blanks.length) {
    return false;
  }

  for (let i = 0; i < blanks.length; i++) {
    const blank = blanks[i];
    const userAnswer = userAnswers[i];

    const isMatch = blank.acceptedAnswers.some(acceptedAnswer => {
      if (blank.caseSensitive) {
        return userAnswer === acceptedAnswer;
      } else {
        return userAnswer.toLowerCase() === acceptedAnswer.toLowerCase();
      }
    });

    if (!isMatch) {
      return false;
    }
  }

  return true;
}
```

#### 3.3 TaskCache - Simple In-Memory Cache

**Location:** `src/cache/taskCache.ts`

**Strengths:**
- 58 lines, minimal implementation
- Simple Map-based storage
- Clear TTL logic
- Exported singleton pattern

### Areas for Improvement

#### 3.4 VariationLoader Could Be Simpler

**Location:** `src/variations/loader.ts` (188 lines)

**Issues:**
- Too many private fields (9 array properties)
- Repetitive loading logic
- Could use Map<EnrichmentType, AgeFilteredItem[]> instead of 9 separate arrays

**Recommendation:**
```typescript
export class VariationLoader {
  private variations = new Map<EnrichmentType, AgeFilteredItem[]>();

  async loadAll() {
    const types = [
      { type: 'scenario', file: 'scenarios.md', key: 'scenarios' },
      { type: 'framing', file: 'problem-framings.md', key: 'framings' },
      // ... etc
    ];

    for (const { type, file, key } of types) {
      this.variations.set(type, await this.loadFile(file, key));
    }
  }
}
```

#### 3.5 PromptLoader Has Too Many Responsibilities

**Location:** `src/prompts/loader.ts` (463 lines)

**Issues:**
- Handles loading, caching, hot-reload, validation
- Mixes subject, task type, and hint loading
- Cache invalidation logic is complex
- Could be split into focused classes

**Recommendation:**
Split into:
- `PromptCache` - Handle caching
- `FileWatcher` - Handle hot-reload
- `PromptParser` - Handle parsing/validation
- `PromptLoader` - Orchestrate the above

---

## 4. Architecture & Design Patterns

### Strengths

#### 4.1 Clean Service Layer Pattern

**Well-implemented:**
- Clear separation: Controller → Service → Repository/Client
- `TaskService` handles business logic
- `TaskController` handles HTTP concerns
- Proper dependency injection via constructors

#### 4.2 Registry Pattern for Subjects/TaskTypes

**Excellent use case:**
- Centralized management of subjects and task types
- Lazy loading with caching
- Hot-reload support in development
- Clear initialization lifecycle

#### 4.3 Strategy Pattern for AI Providers

**Good abstraction:**
- `AIClient` base class
- Provider-specific implementations (Anthropic, OpenAI, Ollama)
- Factory pattern for client creation
- Swappable at runtime

#### 4.4 Template Method Pattern in Prompt Building

**Well-structured:**
- Clear two-step process: composition → variable replacement
- Preserves LLM placeholders ({{ }}) while replacing known variables
- Validation after composition

### Weaknesses

#### 4.5 Missing Facade/Coordinator for Prompt System

**Current issue:**
Multiple services create their own PromptLoader/VariationLoader instances rather than coordinating through a central facade.

**Recommendation:**
```typescript
export class PromptCoordinator {
  constructor(
    private promptLoader: PromptLoader,
    private variationLoader: VariationLoader
  ) {}

  async initialize() {
    await this.variationLoader.loadAll();
  }

  getLoader() { return this.promptLoader; }
  getVariations() { return this.variationLoader; }
}

// Services use coordinator
export class PromptService {
  constructor(private coordinator: PromptCoordinator) {}
}
```

#### 4.6 No Clear Boundary Between Prompt System and Task System

**Issue:**
- TaskService depends directly on PromptService
- HintService creates its own PromptLoader
- Unclear ownership of VariationLoader

**Recommendation:**
Define clear domain boundaries with explicit contracts.

---

## 5. Specific Code Issues

### Type Safety Issues

#### 5.1 `any` Types in Concept Selection

**Location:** `src/tasks/task.service.ts` line 30

```typescript
let concept: any;
```

**Issue:** Should use `Concept` type from schemas.

**Fix:**
```typescript
let concept: Concept;
```

#### 5.2 Type Assertion Without Validation

**Location:** `src/tasks/task.service.ts` line 103

```typescript
solution: (responseWithType as any).solution || (responseWithType as any).options,
```

**Issue:** Unsafe type casting without runtime validation.

**Recommendation:**
```typescript
solution: 'solution' in responseWithType
  ? responseWithType.solution
  : 'options' in responseWithType
    ? responseWithType.options
    : undefined
```

### Error Handling Issues

#### 5.3 Inconsistent Error Handling in HintController

**Location:** `src/hints/hint.controller.ts` lines 23-31

```typescript
if (error.message.includes('not found') || error.message.includes('expired')) {
  res.status(404).json({ error: error.message });
  return;
}
if (error.message.includes('All hints')) {
  res.status(429).json({ error: error.message });
  return;
}
```

**Problem:**
- String matching for error types is fragile
- Changes to error messages break routing
- Should use custom error classes

**Recommendation:**
```typescript
export class TaskNotFoundError extends Error {
  constructor(taskId: string) {
    super(`Task ${taskId} not found or expired`);
    this.name = 'TaskNotFoundError';
  }
}

export class HintLimitExceededError extends Error {
  constructor() {
    super('All hints have been used');
    this.name = 'HintLimitExceededError';
  }
}

// In controller
if (error instanceof TaskNotFoundError) {
  res.status(404).json({ error: error.message });
}
```

### Performance Issues

#### 5.4 Inefficient Enrichment Formatting

**Location:** `src/prompts/builder.ts` lines 71-84

```typescript
const enrichmentLabels: Record<string, string> = {
  framing: 'Creative Framing',
  character: 'Character Perspective',
  // ... etc (defined on every prompt build)
};

const enrichmentsFormatted = enrichments
  .map(e => `\n- **${enrichmentLabels[e.type]}**: ${e.value}`)
  .join('');
```

**Issue:**
- Labels object recreated on every prompt build
- Could be module-level constant

**Fix:**
```typescript
const ENRICHMENT_LABELS: Record<string, string> = {
  framing: 'Creative Framing',
  // ... etc
};
```

### Logging Issues

#### 5.5 Excessive Console Logging in Production

**Location:** Throughout all services

**Issue:**
- Console.log statements in production code
- No log levels (debug, info, warn, error)
- No structured logging

**Recommendation:**
Use proper logger with levels:
```typescript
import logger from './logger';

logger.debug('[TaskService] Starting task generation');
logger.info('[TaskService] Task generated', { taskId, duration });
logger.error('[TaskService] Generation failed', { error });
```

---

## 6. Testing Concerns

### Testability Issues

#### 6.1 Services Create Own Dependencies

**Impact:** Cannot mock PromptLoader, VariationLoader in tests

**Current:**
```typescript
export class PromptService {
  constructor() {
    this.promptLoader = new PromptLoader();
    this.variationLoader = new VariationLoader();
  }
}
```

**Testing would require:**
- File system setup
- Actual prompt files
- Real variation files

**Should be:**
```typescript
export class PromptService {
  constructor(
    private promptLoader: IPromptLoader,
    private variationLoader: IVariationLoader
  ) {}
}

// In tests
const mockLoader = {
  loadBasePrompt: jest.fn().mockResolvedValue('mock prompt')
};
const service = new PromptService(mockLoader, mockVariationLoader);
```

#### 6.2 Controllers Not Easily Testable

**Issue:**
- Business logic embedded in controllers
- Direct Express Request/Response coupling
- Hard to test filtering logic independently

**Recommendation:**
Move logic to services, test services independently of HTTP layer.

---

## 7. Security & Validation

### Strengths

- **Zod validation** on all request schemas
- **Rate limiting** on expensive endpoints
- **Authentication middleware** on protected routes
- **Input validation** middleware properly applied

### Concerns

#### 7.1 No Sanitization of AI Responses

**Location:** All AI client implementations

**Issue:**
- AI responses trusted implicitly
- No validation that structured output matches expected types
- Ollama doesn't validate schema compliance

**Recommendation:**
Add runtime validation with Zod:
```typescript
async generateStructured<T>(prompt: string, schema: JSONSchema): Promise<T> {
  const response = await this.callAI(prompt, schema);

  // Validate with Zod
  const validator = zodSchemaFromJSON(schema);
  return validator.parse(response); // Throws on mismatch
}
```

---

## 8. Documentation Quality

### Good Documentation

- **CLAUDE.md** provides excellent project overview
- **Function-level JSDoc** on most public methods
- **Type definitions** serve as inline documentation

### Missing Documentation

- **Architecture diagrams** of prompt flow
- **Sequence diagrams** for task generation
- **Example prompts** in code comments
- **Decision logs** for design choices (why VariationLoader loads 9 arrays?)

---

## 9. Recommendations Priority List

### Priority 1: Critical (Do First)

1. **Fix Dependency Injection** - Services should receive loaders via constructor
2. **Extract Controller Business Logic** - Move filtering/mapping to service layer
3. **Introduce Custom Error Classes** - Replace string matching with instanceof checks

### Priority 2: High (Do Soon)

4. **Deduplicate Filtering Logic** - Extract to shared methods
5. **Split PromptLoader** - Too many responsibilities (463 lines)
6. **Add Runtime Validation** - Validate AI responses with Zod
7. **Improve Logging** - Use structured logger with levels

### Priority 3: Medium (Plan For)

8. **Simplify VariationLoader** - Use Map instead of 9 arrays
9. **Extract Language Utilities** - Share formatting logic
10. **Make Task Types Extensible** - Self-registration pattern

### Priority 4: Low (Nice to Have)

11. **Add Architecture Documentation** - Diagrams and flow charts
12. **Improve Type Safety** - Remove `any` types
13. **Optimize Constant Creation** - Move to module level

---

## 10. Positive Highlights

### Excellent Code Examples

1. **Template Replacer** (`template-replacer.ts`) - Perfect minimal implementation
2. **Grading Functions** - Pure, testable, simple
3. **TaskCache** - Clean singleton pattern
4. **AI Client Abstraction** - Good use of abstract class
5. **Registry Pattern** - Well-executed for subjects/task types

### Good Architectural Decisions

1. **Service layer separation** - Clear responsibilities
2. **Factory pattern for AI clients** - Easy to swap providers
3. **Zod for validation** - Type-safe schema validation
4. **Singleton registries** - Centralized management
5. **Hot-reload in development** - Great developer experience

---

## Summary

The Backend Task Generation Engine has a **solid architectural foundation** with good use of design patterns and clean abstractions. However, **dependency injection violations** and **code duplication** create maintenance challenges that should be addressed before scaling.

**Key Takeaways:**
- ✅ Good: Service architecture, registry pattern, AI abstraction
- ⚠️ Needs Work: Dependency injection, code duplication, error handling
- ❌ Critical: Services creating own dependencies, massive controller duplication

**Recommended Next Steps:**
1. Refactor dependency injection (1-2 days)
2. Extract controller business logic to services (2-3 days)
3. Introduce custom error classes (1 day)
4. Add comprehensive tests with proper mocking (3-5 days)

**Total Estimated Effort:** 7-11 days for all Priority 1 & 2 items.
