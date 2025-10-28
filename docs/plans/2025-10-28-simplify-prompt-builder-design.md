# PromptBuilder Simplification Design

**Date:** 2025-10-28
**Status:** Approved

## Problem Statement

The current `PromptBuilder.buildPrompt()` implementation uses a complex scoped variable approach that makes the code difficult to understand and maintain:

- Four separate variable objects (variationVariables, subjectVariables, conceptVariables, taskTypeVariables)
- Multiple `TemplateProcessor.replaceScoped()` calls for each sub-template
- Cognitive overhead tracking which variables are available in which scope
- Duplicated variables across scopes (age, grade, difficulty, language)

**Goal:** Simplify to "merge templates, then replace variables" - a straightforward two-step process.

## Solution Overview

Refactor `buildPrompt()` to use a three-step flow:

1. **Compose Template Hierarchy** - Insert raw sub-templates into base template
2. **Build Flat Variable Object** - Create single object with all variables
3. **Single Replacement Pass** - Replace all placeholders in one go

This reduces cognitive complexity while maintaining identical output.

## Detailed Design

### Architecture

**Current flow (complex):**
```
variationsTemplate + variationVariables → processed variations
subjectTemplate + subjectVariables → processed subject
conceptTemplate + conceptVariables → processed concept
taskTypeTemplate + taskTypeVariables → processed task type
baseTemplate + (all processed templates) → final prompt
```

**New flow (simplified):**
```
baseTemplate + (raw sub-templates) → composed template
composed template + allVariables → final prompt
```

### Implementation

**Step 1: Compose Template Hierarchy**

```typescript
const compositionVariables = {
  variations_template: this.variationsTemplate,
  subject_base_template: this.subject.basePromptTemplate,
  concept_template: params.concept.prompt,
  task_type_template: this.taskType.promptTemplate,
};

const composedTemplate = TemplateProcessor.replace(
  this.basePrompt,
  compositionVariables
);
```

This inserts raw sub-template content (with placeholders still intact) into the base template structure.

**Step 2: Build Flat Variable Object**

```typescript
const allVariables = {
  // Variation variables
  scenario: this.variationLoader.getScenario(params.grade),
  language_style: params.grade ? this.getLanguageStyle(params.grade) : '',
  student_context: params.gender ? `The student identifies as ${params.gender}...` : '',
  enrichment_instruction: this.variationLoader.getRandomEnrichment()?.value || '',

  // Subject/Concept/TaskType variables (duplicates OK - same values)
  age: params.grade * 6,
  grade: params.grade,
  difficulty: params.difficulty,
  language: this.formatLanguage(params.language),
  concept_name: params.concept.name,
  concept_focus: params.concept.focus,
  concept_difficulty: params.concept.difficulty,
  subject_name: this.subject.name,
  task_type_name: this.taskType.name,
  learning_objectives: params.concept.learning_objectives?.join('\n- ') || '',
  prerequisites: params.concept.prerequisites?.join(', ') || '',
  example_tasks: params.concept.example_tasks?.join('\n- ') || '',
  real_world_context: params.concept.real_world_context || '',
};
```

**Key decision:** Flat namespace with duplicates allowed. Variables like `age`, `grade`, `difficulty` appear multiple times but always have identical values, so duplication is harmless.

**Step 3: Single Replacement Pass**

```typescript
const finalPrompt = TemplateProcessor.replace(composedTemplate, allVariables);

// Validate and return
TemplateProcessor.validateNoPlaceholders(finalPrompt, 'PromptBuilder.buildPrompt');
return finalPrompt;
```

One replacement call handles all placeholders across the entire composed template.

### Template Structure

**Base template structure (unchanged):**
- Contains `{{variations_template}}`, `{{subject_base_template}}`, `{{concept_template}}`, `{{task_type_template}}`
- These are replaced in Step 1 with raw sub-template content
- Sub-template placeholders (like `{{scenario}}`, `{{age}}`, `{{concept_name}}`) remain intact after Step 1
- All remaining placeholders replaced in Step 3

**No changes to template syntax or markdown files required.**

## Edge Cases

| Case | Handling |
|------|----------|
| Empty optional fields | `|| ''` fallback syntax for empty strings |
| Missing enrichment | Returns empty string, no special handling needed |
| No gender specified | `student_context` becomes empty string |
| Missing concept metadata | Falls back to empty strings or empty arrays |
| Duplicate variable names | Harmless - same values across all contexts |

## Testing Strategy

### Bug Fix Required First

`packages/backend/src/cli/test-prompt.ts:98` has a bug:

```typescript
// Current (broken)
const prompt = promptBuilder.buildPrompt(params, enrichedConcept);

// Fixed
const params: TaskGenerationParams = {
  subject,
  concept: enrichedConcept,  // Pass enriched concept here
  taskType,
  grade,
  difficulty,
  language,
  gender: gender || undefined,
};
const prompt = promptBuilder.buildPrompt(params);  // Remove second argument
```

### Verification Workflow

1. **Fix test script bug**
2. **Generate baseline prompts** (before refactoring):
   ```bash
   docker compose exec backend-dev bun run test:prompt --subject=logic --concept=patterns --grade=5 --output=/tmp/before-logic-patterns.txt
   docker compose exec backend-dev bun run test:prompt --subject=math --concept=arithmetic --grade=3 --output=/tmp/before-math-arithmetic.txt
   docker compose exec backend-dev bun run test:prompt --subject=physics --concept=mechanics --grade=8 --gender=female --output=/tmp/before-physics-mechanics.txt
   ```

3. **Refactor code**

4. **Regenerate prompts** (after refactoring):
   ```bash
   docker compose exec backend-dev bun run test:prompt --subject=logic --concept=patterns --grade=5 --output=/tmp/after-logic-patterns.txt
   docker compose exec backend-dev bun run test:prompt --subject=math --concept=arithmetic --grade=3 --output=/tmp/after-math-arithmetic.txt
   docker compose exec backend-dev bun run test:prompt --subject=physics --concept=mechanics --grade=8 --gender=female --output=/tmp/after-physics-mechanics.txt
   ```

5. **Compare outputs**:
   ```bash
   docker compose exec backend-dev diff /tmp/before-logic-patterns.txt /tmp/after-logic-patterns.txt
   docker compose exec backend-dev diff /tmp/before-math-arithmetic.txt /tmp/after-math-arithmetic.txt
   docker compose exec backend-dev diff /tmp/before-physics-mechanics.txt /tmp/after-physics-mechanics.txt
   ```

**Expected result:** All diffs should be empty (zero functional changes).

### Test Coverage

- Different subjects: logic, math, physics
- Different ages: grade 3, 5, 8
- With/without optional fields: gender
- Different difficulties: easy, medium, hard
- Different languages: en, de

## Files Modified

### Primary Changes

**`packages/backend/src/tasks/prompt.builder.ts`**
- Refactor `buildPrompt()` method to use three-step flow
- Remove scoped variable objects
- Create single flat `allVariables` object
- Simplify debug logging to show single variable object

**`packages/backend/src/cli/test-prompt.ts`**
- Fix bug on line 98: remove second argument to `buildPrompt()`
- Update params construction to include enriched concept in params object

### Unchanged Files

- `packages/backend/src/tasks/template.ts` - No changes to TemplateProcessor
- `packages/backend/src/tasks/loader.ts` - No changes needed
- `packages/backend/src/tasks/variation.loader.ts` - No changes needed
- All prompt markdown files in `/prompts/` - No template syntax changes

## Error Handling

**Validation:**
- `TemplateProcessor.validateNoPlaceholders()` catches unreplaced placeholders
- Throws descriptive error showing which placeholder wasn't replaced
- Same validation behavior as current implementation

**Debug output:**
- Simplified to show single `allVariables` object (instead of four separate objects)
- Still logs subject, concept, task type, and composed prompt
- Easier to debug since all variables are in one place

## Benefits

1. **Cognitive simplicity:** One variable object instead of four scoped objects
2. **Easier maintenance:** Clear two-step flow: compose, then replace
3. **Reduced code complexity:** Fewer method calls, simpler logic
4. **Better debuggability:** All variables visible in one object
5. **Zero functional changes:** Identical output to current implementation

## Non-Goals

- Not changing template syntax or markdown files
- Not adding unused frontmatter fields (description, grade, ages from concept files)
- Not changing how difficulty is determined (use request param, not frontmatter)
- Not modifying `buildHintPrompt()` (already uses flat variables)
