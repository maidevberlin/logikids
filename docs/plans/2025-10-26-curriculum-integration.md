# Curriculum Integration Design

**Date:** 2025-10-26
**Status:** Approved for Implementation

## Overview

Integrate professional curriculum files (German educational standards) with custom educational content, using a unified markdown-based format for all subjects and concepts. This enables grade-based filtering, richer metadata for task generation, and clear separation between official curriculum and custom enrichment content.

## Requirements Summary

### User Input
- Users provide both **age** and **grade** during onboarding
- Both values stored in user profile for precise educational level targeting

### Content Structure
- **Unified format:** All concepts (curriculum and custom) use markdown files with YAML frontmatter
- **Two source directories:**
  - `curriculums/{subject}/*.md` - Generated from official curriculum YAML files
  - `prompts/subjects/{subject}/*.md` - Custom developer-created concepts
- **Shared base prompt:** Single `prompts/base-prompt.md` for all subjects
- **Existing variations:** Keep current `prompts/variations/scenarios.md` system unchanged

### Filtering Logic
- **Grade filtering:** Always applied - only show concepts matching requested grade
- **Difficulty filtering:** Optional - if provided, filter by difficulty level (easy/medium/hard)
- **Duplicate handling:** If concept names match across sources, auto-append "(Custom)" suffix to custom version

### Enhanced Prompts
- Send complete concept metadata to LLM:
  - name, focus, learning_objectives, difficulty, prerequisites, example_tasks, real_world_context
- Richer context enables better-aligned task generation

## File Structure

```
/curriculums/
  math.yaml                    # Source curriculum (not committed long-term)
  math/                        # Generated from yaml (committed)
    grade1-addition-up-to-10.md
    grade1-subtraction-up-to-10.md
    grade2-multiplication.md
    ...

/prompts/
  base-prompt.md              # Shared role/guidelines for all subjects
  variations/
    scenarios.md              # Existing variation system (unchanged)
  subjects/
    math/                     # Custom math concepts
      advanced-calculus.md
      fun-puzzles.md
    logic/                    # Custom logic concepts
      patterns.md
      sequences.md
    ...

/scripts/
  convert-curriculum.js       # One-time YAML → MD converter
```

## Unified Concept Format

All concept markdown files use this frontmatter structure:

```yaml
---
id: addition-up-to-10
name: Addition up to 10
grade: 1
ages: [6, 7]
focus: Number range up to 10
difficulty: easy
learning_objectives:
  - Understand addition problems
  - Number decompositions up to 10
  - Recognize commutative property
prerequisites: [number-concept-development]
example_tasks:
  - "3 + 4 = ?"
  - "5 + 2 = ?"
real_world_context: Counting objects, simple shopping
---

Additional prompt instructions specific to this concept...
```

**Required fields:** id, name, grade, ages, focus, difficulty, learning_objectives
**Optional fields:** prerequisites, example_tasks, real_world_context

## API Changes

### GET /api/task/subjects

**New query parameters:**
- `grade` (required) - Filter concepts by grade level
- `age` (required) - User age for context
- `difficulty` (optional) - Filter by difficulty level

**Response structure:**
```json
{
  "subjects": [
    {
      "id": "math",
      "name": "Mathematics",
      "concepts": [
        {
          "id": "addition-up-to-10",
          "name": "Addition up to 10",
          "grade": 1,
          "difficulty": "easy",
          "source": "curriculum"
        },
        {
          "id": "fun-puzzles",
          "name": "Fun Math Puzzles",
          "grade": 1,
          "difficulty": "medium",
          "source": "custom"
        }
      ]
    }
  ]
}
```

### GET /api/task

**New query parameters:**
- `grade` (required) - Added to existing params

**Existing params:** subject, concept, taskType, age, difficulty

**Behavior:** Returns task generated with full concept metadata injected into prompt

## Backend Architecture

### ConceptLoader (Enhanced)

**Responsibilities:**
- Scan **both** directories: `curriculums/{subject}/` and `prompts/subjects/{subject}/`
- Load all .md files with YAML frontmatter
- Validate frontmatter against enhanced schema
- Merge concepts from both sources
- Handle duplicates: auto-append "(Custom)" to custom version if names match
- Return unified concept array with source tracking

**Key changes:**
- Add second directory to scan path
- Add duplicate detection logic
- Track concept source (curriculum/custom) in metadata

### SubjectRegistry (Enhanced)

**Responsibilities:**
- Use ConceptLoader for unified concept loading
- Cache loaded concepts in memory
- Hot-reload watches both directories (existing chokidar)
- Expose filtering: `getConceptsByGrade(grade, difficulty?)`

**Key changes:**
- Add grade-based filtering method
- Add optional difficulty filtering
- Update cache invalidation for both directories

### PromptBuilder (Enhanced)

**Responsibilities:**
- Receive full concept object (not just concept name)
- Inject all concept metadata into LLM prompt
- Use shared `base-prompt.md` for role/guidelines
- Inject variations from `variations/scenarios.md`

**Key changes:**
- Accept concept object instead of concept name
- Build prompt section with all metadata fields
- Format for LLM consumption (clear structure)

### API Controllers (Enhanced)

**task.controller.ts:**
- Add `grade` parameter validation
- Pass grade to filtering logic
- Maintain existing response structure

**subjects.controller.ts (new or enhanced):**
- Create endpoint for subject/concept listing
- Apply grade + difficulty filters
- Return enriched concept metadata

### Zod Schemas (Enhanced)

**Concept frontmatter schema:**
```typescript
conceptFrontmatterSchema = z.object({
  id: z.string(),
  name: z.string(),
  grade: z.number().int().min(1).max(13),
  ages: z.array(z.number().int()),
  focus: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  learning_objectives: z.array(z.string()),
  prerequisites: z.array(z.string()).optional(),
  example_tasks: z.array(z.string()).optional(),
  real_world_context: z.string().optional(),
})
```

**API request schemas:**
- Add `grade` to task generation params
- Add `grade`, `age`, `difficulty` to subjects endpoint params

## Frontend Changes

### UserData (Enhanced)

**New fields:**
- `grade: number` (1-13 for German school system)

**Existing:**
- `age: number` (already exists)

### Onboarding Flow (WelcomePage)

**Changes:**
- Add grade selection input
- Validate grade/age consistency (warn if mismatched, allow override)
- Store both values in UserData

### Subject Selection

**Changes:**
- Send `grade` and `age` to `GET /api/task/subjects?grade=X&age=Y&difficulty=Z`
- Display concepts with difficulty badges
- Optional: Show source (curriculum/custom) as subtle badge

### Task Generation

**Changes:**
- Include `grade` parameter in `GET /api/task` calls
- Otherwise unchanged (same task display, hint flow)

### Translation Keys (New)

```json
{
  "profile": {
    "grade": "Grade",
    "gradeDescription": "Your current school grade"
  },
  "subjects": {
    "sourceCurriculum": "Curriculum",
    "sourceCustom": "Custom"
  }
}
```

## Conversion Script

### scripts/convert-curriculum.js

**Purpose:** One-time conversion of curriculum YAML → individual markdown files

**Usage:**
```bash
bun run scripts/convert-curriculum.js curriculums/math.yaml
```

**Process:**
1. Parse YAML file (using js-yaml or gray-matter)
2. For each grade → for each concept:
   - Generate filename: `grade{N}-{concept-name-slugified}.md`
   - Create frontmatter with all fields from YAML
   - Add minimal prompt body (or empty for manual customization)
3. Write to `curriculums/{subject}/` directory
4. Report summary: "Generated N concepts from X.yaml"

**Note:** Script is manual/one-time. Not part of server startup. After running, YAML can be archived or deleted.

## Migration Strategy

This is a "Big Bang" migration - all changes happen together:

### Phase 1: Tooling & Conversion
1. Create conversion script
2. Convert math.yaml to markdown files
3. Verify generated files

### Phase 2: Content Migration
4. Create shared `base-prompt.md`
5. Migrate existing custom concepts (logic, physics, german, music) to new frontmatter format
6. Add required fields: grade, ages, focus, difficulty, learning_objectives

### Phase 3: Backend Implementation
7. Update ConceptLoader with dual-directory scanning
8. Update SubjectRegistry with filtering logic
9. Update PromptBuilder with metadata injection
10. Update API controllers for grade parameter
11. Update Zod schemas for validation

### Phase 4: Frontend Implementation
12. Add grade field to UserData
13. Update onboarding flow
14. Update API calls to include grade parameter

### Phase 5: Testing
15. Test grade filtering returns correct concepts
16. Test difficulty filtering (with/without param)
17. Test duplicate concept handling
18. Test task generation with new prompt structure
19. Test hot-reload still works

## Testing Verification

**Unit tests:**
- ConceptLoader handles duplicates correctly
- Filtering logic returns expected concepts
- Frontmatter validation catches invalid schemas

**Integration tests:**
- API endpoints return correct filtered concepts
- Task generation includes all metadata fields
- Both curriculum and custom concepts load successfully

**Manual testing:**
- Select grade 1 → see only grade 1 concepts
- Change difficulty → see filtered concepts
- Generate tasks from curriculum vs custom concepts
- Verify hot-reload detects changes in both directories

## Benefits

1. **Grade-appropriate content:** Concepts automatically filtered to student's level
2. **Richer task generation:** LLM receives detailed learning objectives and context
3. **Professional standards:** Curriculum content aligned with official educational standards
4. **Custom enrichment:** Developers can add engaging supplementary content
5. **Unified system:** Single format, single loader, simple architecture
6. **Maintainable:** Clear separation allows safe curriculum updates without affecting custom content

## Future Enhancements

- Multiple curriculum sources (different countries/standards)
- Prerequisite-based concept ordering/suggestions
- Progress tracking against curriculum standards
- Adaptive difficulty within grade level
