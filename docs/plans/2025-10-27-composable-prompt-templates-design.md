# Composable Prompt Templates Design

**Date:** 2025-10-27
**Status:** Approved
**Related Bug:** docs/bugs/2025-10-27-variation-injection-bug.md

## Problem Statement

The current variation injection system has a critical bug: variation variables (`scenario`, `enrichment_instruction`, `language_style`, `student_context`) are prepared but never injected into templates, resulting in literal placeholder text appearing in LLM prompts.

Additionally, the current system has architectural issues:
1. Duplicate variation sections across all subject base.md files (DRY violation)
2. Unused `processedVariables` object in code
3. Inconsistent approaches (template placeholders vs. programmatic sections)
4. No validation tooling to catch undefined placeholders
5. Difficult to debug what prompt was actually sent to LLM

## Design Goals

**Primary Goals:**
1. Fix variation injection bug
2. Establish maintainable template system for non-technical educators
3. Provide clear visibility into prompt composition
4. Enable fast iteration with validation tooling

**Key Constraints:**
- Non-technical educators edit markdown files
- Must be able to trace/debug final prompts
- Minimize variable repetition in templates (DRY)
- Pre-production system (no backward compatibility needed)

## Proposed Solution: Composable Template System

### Architecture Overview

A **composable template system** where each template is a standalone file that can be composed together. The master template (`/prompts/base.md`) acts as the "map" showing where each piece fits.

**Core Principles:**
1. **Template Composition** - Templates can include other templates
2. **Scoped Variables** - Each template only receives variables it should access
3. **Single Responsibility** - Each template file handles one concern
4. **Visible Structure** - Open base.md to see entire prompt composition
5. **DRY** - Common elements (like variations) defined once

### File Structure

```
/prompts/
  base.md                    # Master composition template (shows structure)
  variations.md              # Common variation instructions (DRY)
  subjects/
    logic/
      base.md               # Logic-specific guidelines
      patterns.md           # Concept-specific prompts
    math/
      base.md
      arithmetic.md
  task-types/
    multipleChoice.md
```

### Two-Level Variable System

**Level 1: Template Composition Variables** (structural)
- `{{variations_template}}` - includes variations.md
- `{{subject_base_template}}` - includes subjects/logic/base.md
- `{{concept_template}}` - includes specific concept
- `{{task_type_template}}` - includes task type

**Level 2: Content Variables** (only in specific places)
- `{{scenario}}` - only in variations.md (used once)
- `{{language_style}}` - only in variations.md (used once)
- `{{student_context}}` - only in variations.md (used once)
- `{{age}}`, `{{difficulty}}`, `{{language}}` - only where needed for content

**Key Principle:** Each variable appears **once** in the template that logically owns it. No duplication across files.

### Prompt Composition Flow with Scoped Variables

```
1. Load Template Files (raw)
   ├─ base.md (master template)
   ├─ variations.md (raw)
   ├─ subjects/{subject}/base.md (raw)
   └─ task-types/{type}.md (raw)

2. Prepare Scoped Variables
   ├─ Variation variables: {scenario, language_style, student_context, enrichment_instruction}
   ├─ Subject variables: {age, grade, difficulty, concept_name, concept_focus, ...}
   ├─ Task type variables: {difficulty, task_type_name, ...}
   └─ Concept variables: {concept_name, focus, learning_objectives, ...}

3. Replace Variables PER TEMPLATE (scoped)
   ├─ Process variations.md with ONLY variation variables → processed_variations
   ├─ Process subjects/logic/base.md with ONLY subject variables → processed_subject
   ├─ Process concept.md with ONLY concept variables → processed_concept
   └─ Process task-type.md with ONLY task type variables → processed_task_type

4. Compose Processed Templates
   ├─ Replace {{variations_template}} with processed_variations
   ├─ Replace {{subject_base_template}} with processed_subject
   ├─ Replace {{concept_template}} with processed_concept
   └─ Replace {{task_type_template}} with processed_task_type
   Result: Final prompt with NO remaining placeholders

5. Validation Check
   └─ If any {{placeholders}} remain → ERROR: undefined variable
```

**Why Scoped Replacement:**
- Prevents templates from accessing variables outside their scope
- Catches typos and undefined variables immediately
- Makes it clear which variables each template can use
- Prevents hidden placeholder injection across files

### Example Templates

**base.md (master composition):**
```markdown
# Role and Guidelines
You are an AI tutor creating educational tasks.

{{variations_template}}

# Subject Context
{{subject_base_template}}

# Concept Details
{{concept_template}}

# Task Type
{{task_type_template}}
```

**variations.md:**
```markdown
## SCENARIO CONTEXT
Set this task in the following context: **{{scenario}}**

Use this scenario creatively to frame the problem. Make it engaging and relevant.

{{enrichment_instruction}}

{{language_style}}

{{student_context}}
```

**subjects/logic/base.md:**
```markdown
You are teaching logic to grade {{grade}} students.
Focus on: {{concept_focus}}

## Content Guidelines
- Use Mermaid for decision trees
- Use Markdown tables for truth tables
- Keep logical complexity appropriate for age {{age}}
```

## Developer Tooling

### 1. Template Validation Script

**Command:** `npm run validate:prompts`

**Implementation:**
- Imports and runs actual server initialization code
- Calls `SubjectRegistry.initialize()`, `TaskTypeRegistry.initialize()`
- If initialization succeeds, all templates are valid
- Uses same Zod schemas and loaders (no duplicate validation logic)

**Checks:**
- ✅ Required frontmatter fields (id, name, description)
- ✅ Template composition references valid files
- ✅ Zod schema validation for frontmatter
- ✅ No broken template chains

**Output:**
```
❌ Template Error: Missing template file
   Referenced in: /prompts/base.md (line 12)
   Looking for: {{subject_base_template}}
   Expected file: /prompts/subjects/logic/base.md
   Status: File not found
```

### 2. Prompt Generation Test Script

**Command:** `npm run test:prompt`

**Usage:**
```bash
# Test specific combination
npm run test:prompt -- --subject=logic --concept=patterns --grade=5 --difficulty=medium

# Output to file
npm run test:prompt -- --subject=math --concept=arithmetic --output=test-output.txt

# Verbose mode (shows composition steps)
npm run test:prompt -- --subject=logic --concept=patterns --verbose

# Test all combinations
npm run test:prompt -- --test-all
```

**Implementation:**
```typescript
// packages/backend/src/scripts/test-prompt.ts
import { SubjectRegistry } from '../tasks/subject.registry';
import { TaskTypeRegistry } from '../tasks/types/registry';
import { PromptBuilder } from '../tasks/prompt.builder';
import { VariationLoader } from '../tasks/variation.loader';

// Uses ACTUAL production code path
const subject = SubjectRegistry.getSubject('logic');
const taskType = TaskTypeRegistry.getTaskType('multipleChoice');
const variationLoader = new VariationLoader();
const promptBuilder = new PromptBuilder(subject, taskType, variationLoader, basePrompt);

// Calls ACTUAL buildPrompt method
const finalPrompt = promptBuilder.buildPrompt(params, enrichedConcept);

// Output result (no LLM call)
console.log(finalPrompt);
```

**Key Principle:** The script uses the exact same classes, methods, and code paths that production uses. It just stops before the LLM call.

**Benefits:**
- Fast iteration: Edit template → run script → see result (no LLM delay)
- Cost-free testing
- If script works, production works
- No drift between test and production

### 3. Runtime Behavior

**Server Startup:**
- `validate:prompts` logic runs automatically
- Fail-fast if any template is invalid
- Clear error messages for educators

**Development Mode:**
- Console logs show composition steps
- Each template replacement logged
- Final prompt logged before LLM call
- Variable scopes logged for each template

## Error Handling & Debugging

### Error Messages

```
❌ Template Error: Undefined variable 'scenarrio' (typo?)
   File: /prompts/variations.md
   Line: 8
   Context: Set this task in: **{{scenarrio}}**
   Available variables: [scenario, language_style, student_context, enrichment_instruction]

❌ Scope Error: Variable not available in this template
   File: /prompts/variations.md
   Variable: {{concept_name}}
   Scope: variation_variables
   Suggestion: This variable belongs in concept scope
```

### Traceability

- Every generated task includes metadata: `prompt_version`, `templates_used`, `variables_applied`
- Can reconstruct exact prompt from task metadata
- Test script can reproduce any production prompt

## Migration Strategy

### Current State Problems

1. `processedVariables` object created but never used (prompt.builder.ts:115-121)
2. Only `baseVariables` passed to template processor (lines 128, 134)
3. Variation placeholders in subject base.md files not replaced
4. Manual "Personalization" section (lines 156-166) duplicates variations
5. Math subject missing variations entirely

### Migration Steps

**Step 1: Create New Template Structure**
- Create `/prompts/variations.md` with common variation instructions
- Update `/prompts/base.md` to use `{{variations_template}}`, `{{subject_base_template}}`, etc.
- Remove variation placeholders from individual `subjects/*/base.md` files (DRY)

**Step 2: Implement Scoped Variable Replacement**
- Refactor `PromptBuilder.buildPrompt()` to process each template with scoped variables
- Remove unused `processedVariables` object
- Remove manual "Personalization" section (lines 156-166) - now handled by variations.md

**Step 3: Add Template Composition Support**
- Extend `TemplateProcessor` or create new `TemplateComposer` class
- Support `{{template_name}}` placeholder resolution to file loading
- Process templates → compose → validate

**Step 4: Add Validation & Testing**
- Implement `npm run validate:prompts` script
- Implement `npm run test:prompt` script
- Add validation to server startup

## Implementation Scope

### What Changes

1. **Template Files** - Restructure to composable system
2. **PromptBuilder** - Implement scoped variable replacement + composition
3. **TemplateProcessor** - Add template composition support
4. **Validation Scripts** - Add CLI tools for testing

### What Stays the Same

1. **Loading system** - SubjectRegistry, TaskTypeRegistry still auto-discover files
2. **Frontmatter validation** - Existing Zod schemas remain
3. **API contracts** - Same endpoints, same responses
4. **Hint generation** - No changes to buildHintPrompt()
5. **Caching** - TaskCache unchanged

### Why This Scope

- Fixes the variation injection bug
- Establishes maintainable template system for educators
- Adds tooling for safe iteration
- Doesn't touch working systems (registries, API, caching)
- Pre-production: no backward compatibility needed

**Key Principle:** Surgical fix to prompt composition. Everything else keeps working as-is.

## Benefits

**For Educators:**
- Single place to edit variation instructions (DRY)
- Clear visibility of prompt structure in base.md
- Fast validation feedback (no LLM calls needed)
- Can test prompts before deployment

**For Developers:**
- Scoped variables prevent hidden bugs
- Clear composition flow
- Excellent error messages
- Production code is test code

**For System:**
- Fixes variation injection bug
- Reduces prompt token duplication
- Maintainable architecture
- Traceable prompt generation

## Open Questions

None - design approved.
