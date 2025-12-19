# Task Generation System

How Logikids generates AI-powered educational tasks from concept files.

## Architecture Overview

```
HTTP Request → TaskController → TaskService → PromptBuilder → AI Client → Task Response
                                     ↓
                              SubjectRegistry
                                     ↓
                               Concept File
```

## Request Flow

### 1. API Entry Point

`GET /tasks/?subject=math&concept=grade1-...&grade=1&difficulty=easy&language=en`

**Required parameters:**

- `subject` — Subject ID (e.g., `math`)
- `concept` — Concept ID (e.g., `grade1-basic-arithmetic-operations`)
- `grade` — Student grade level (1-13)
- `difficulty` — Task difficulty (`easy`, `medium`, `hard`)
- `language` — Response language (`en`, `de`)

**Files:** `src/tasks/router.ts`, `src/tasks/task.controller.ts`

### 2. Concept Loading

`SubjectRegistry` loads and caches concepts from `packages/content/subjects/{subject}/`.

**Directories scanned:**

- `official/` — Curriculum-aligned concepts
- `custom/` — User-created concepts

**Filtering:**

- By grade (exact match, fallback to lower grades)
- By difficulty

**Files:** `src/subjects/registry.ts`, `src/prompts/loader.ts`

### 3. Prompt Building

`PromptBuilder` assembles the final AI prompt from multiple template layers.

#### Template Hierarchy

```
base-prompt.md
├── <%variations_template%>     → variations.md
├── <%subject_base_template%>   → subjects/{subject}/base.md
├── <%task_type_template%>      → prompts/task-types/{type}.md
└── <%concept_template%>        → Concept body (compiled)
```

#### Delimiter System

| Delimiter | Purpose              | Example                   |
| --------- | -------------------- | ------------------------- |
| `<% %>`   | Template composition | `<%variations_template%>` |
| `[[ ]]`   | Variable replacement | `[[selected_objective]]`  |
| `{{ }}`   | Preserved for LLM    | `{{a1}}`, `{{x1}}`        |

**Files:** `src/prompts/builder.ts`, `src/prompts/template-replacer.ts`

### 4. Variable Resolution

#### Random Selection (per task)

```typescript
selectedObjective = randomChoice(concept.learning_objectives)
selectedProblemType = randomChoice(concept.problem_types)
```

Each objective/type has equal probability. With 5 objectives, each appears in ~20% of tasks.

#### Difficulty Guidelines

Direct index lookup:

```typescript
difficultyGuidelines = concept.difficulty_guidelines[difficulty]
// difficulty = "medium" → concept.difficulty_guidelines.medium
```

#### All Variables

| Variable                    | Source     | Description                              |
| --------------------------- | ---------- | ---------------------------------------- |
| `[[grade]]`                 | Request    | Student grade                            |
| `[[difficulty]]`            | Request    | Task difficulty                          |
| `[[language]]`              | Request    | "English" or "German"                    |
| `[[concept_name]]`          | Concept    | Display name                             |
| `[[concept_focus]]`         | Concept    | Thematic focus                           |
| `[[selected_objective]]`    | Concept    | Random learning objective                |
| `[[selected_problem_type]]` | Concept    | Random problem type                      |
| `[[difficulty_guidelines]]` | Concept    | Difficulty guidelines (bullet list)      |
| `[[real_world_context]]`    | Concept    | Context for scenarios                    |
| `[[anti_patterns]]`         | Concept    | Things AI should avoid (bullet list)     |
| `[[scenario]]`              | Variations | Grade-filtered scenario context          |
| `[[enrichment_formatted]]`  | Variations | Creative enrichments (formatted bullets) |

### 5. AI Generation

The assembled prompt is sent to the AI client with a JSON schema for structured output.

**Supported providers:** OpenAI, Anthropic, Ollama

**Task types:** `singleChoice`, `multiSelect`, `fillInBlank`, `ordering`, `numberInput`, `yesNo`

**Files:** `src/common/ai/factory.ts`, `src/tasks/types/`

### 6. Response

```json
{
  "taskId": "uuid",
  "type": "single_choice",
  "title": "Counting Cards",
  "task": "You have 8 blue cards and 6 red cards...",
  "options": [...],
  "solution": {...},
  "usage": { "inputTokens": 500, "outputTokens": 200 }
}
```

## Key Files

| File                               | Purpose              |
| ---------------------------------- | -------------------- |
| `src/tasks/router.ts`              | API routes           |
| `src/tasks/task.controller.ts`     | Request handling     |
| `src/tasks/task.service.ts`        | Business logic       |
| `src/prompts/builder.ts`           | Prompt assembly      |
| `src/prompts/loader.ts`            | Template loading     |
| `src/prompts/template-replacer.ts` | Variable replacement |
| `src/subjects/registry.ts`         | Concept management   |
| `src/variations/loader.ts`         | Variation loading    |
| `prompts/base-prompt.md`           | Master template      |
| `prompts/variations.md`            | Variation template   |
| `prompts/task-types/*.md`          | Task type templates  |

## Variations System

Variations add variety to tasks through grade-filtered enrichments.
**Location:** `prompts/variations/`
Each variation item has a grade range for filtering.

## Concept Impact Summary

| Concept Field           | Task Generation Impact                                       |
| ----------------------- | ------------------------------------------------------------ |
| `id`                    | Concept selection                                            |
| `name`                  | Displayed, inserted as `[[concept_name]]`                    |
| `grade`                 | Filtering by student grade                                   |
| `focus`                 | Inserted as `[[concept_focus]]`                              |
| `difficulty`            | UI display only (not used in generation)                     |
| `learning_objectives`   | ONE randomly selected → `[[selected_objective]]`             |
| `problem_types`         | ONE randomly selected → `[[selected_problem_type]]`          |
| `difficulty_guidelines` | Indexed by difficulty → `[[difficulty_guidelines]]`          |
| `real_world_context`    | Inserted as `[[real_world_context]]`                         |
| `anti_patterns`         | Inserted as `[[anti_patterns]]` (optional)                   |
| `prerequisites`         | Informational (UI navigation)                                |
| `prompt` (body)         | Compiled with Handlebars, inserted as `<%concept_template%>` |

## Adding New Task Types

1. Create schema in `src/tasks/types/{type}.ts`
2. Create prompt template in `prompts/task-types/{type}.md`
3. Add grading logic in `src/tasks/grading/`
4. Create answer component in frontend `src/app/tasks/answer-types/`

## Debugging

Enable debug logging in development:

```typescript
// src/prompts/builder.ts logs:
// - All resolved variables
// - Final assembled prompt
```

Check `NODE_ENV=development` for verbose output.
