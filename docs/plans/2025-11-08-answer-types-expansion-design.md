# Answer Types Expansion Design

**Date**: 2025-11-08
**Status**: Approved Design
**Goal**: Expand answer types from 2 to 6 types to reduce repetition, increase engagement, and support diverse learning scenarios

## Background

Currently, Logikids has only 2 answer types:
- `yesNo` - Boolean questions
- `multipleChoice` - 4 options, 1 correct (to be renamed `singleChoice`)

This limited variety becomes repetitive for students and doesn't support all learning scenarios effectively.

## Design Goals

1. **Reduce Repetition**: More variety keeps students engaged across multiple tasks
2. **Support More Subjects**: Different subjects benefit from different answer formats
3. **Increase Engagement**: More interactive types make learning feel game-like
4. **Better Learning Outcomes**: Different formats test understanding in different ways
5. **Scalable System**: Architecture should easily support adding more types later

## Technical Constraints

- **Mobile-First**: Must work well on touch devices
- **AI Generation**: AI must reliably generate all answer formats
- **Auto-Gradable**: Deterministic grading (no AI validation in initial phase)
- **Subject-Agnostic**: Types should work across all subjects (with optional mapping later)

## New Answer Types

### 1. fillInBlank

**Description**: Text with 1-3 blanks where students type short answers

**Use Cases**:
- Grammar: articles, verb conjugations, prepositions
- Math: missing numbers in equations
- Science: terminology, formulas
- History: names, dates, events

**Schema**:
```json
{
  "type": "fill_in_blank",
  "task": "The capital of France is {{blank}} and it has {{blank}} million inhabitants.",
  "blanks": [
    {
      "id": 0,
      "acceptedAnswers": ["Paris", "paris"],
      "caseSensitive": false
    },
    {
      "id": 1,
      "acceptedAnswers": ["2.1", "2.2", "2"],
      "caseSensitive": false
    }
  ],
  "explanation": "Paris is the capital and largest city of France..."
}
```

**Grading**: Exact string match against `acceptedAnswers` array (with case sensitivity flag)

**UI**:
- Inline input fields with clear blank markers
- Auto-focus next blank on completion
- Show blank count (e.g., "Fill in 3 blanks")

### 2. numberInput

**Description**: Numeric input with optional unit and range validation

**Use Cases**:
- Math: calculations, equations, decimals, fractions
- Physics: measurements with units (45.5 km, 9.8 m/s²)
- Chemistry: molecular weights, percentages
- Statistics: probabilities, percentages

**Schema**:
```json
{
  "type": "number_input",
  "task": "Calculate the area of a rectangle with width 4.5m and height 6m.",
  "solution": {
    "value": 27,
    "unit": "m²",
    "tolerance": 0.01,
    "acceptedUnits": ["m²", "m^2", "sq m"]
  },
  "explanation": "Area = width × height = 4.5 × 6 = 27 m²"
}
```

**Grading**:
- Numeric equality within tolerance
- Unit matching (if specified)
- Support for scientific notation, negative numbers, decimals

**UI**:
- Number keyboard on mobile
- Unit selector dropdown (if applicable)
- Clear precision requirements
- Support for special characters (², ³, ×, ÷, ±)

### 3. ordering

**Description**: Drag-and-drop to arrange 3-5 items in correct sequence

**Use Cases**:
- Timeline: chronological events
- Process: steps in correct order
- Math: number ordering (smallest to largest)
- Language: alphabetizing, sentence structure
- Science: life cycle stages, experimental steps

**Schema**:
```json
{
  "type": "ordering",
  "task": "Arrange these historical events in chronological order:",
  "items": [
    { "id": "a", "content": "World War II ends" },
    { "id": "b", "content": "First moon landing" },
    { "id": "c", "content": "Fall of Berlin Wall" }
  ],
  "correctOrder": ["a", "b", "c"],
  "explanation": "WWII ended in 1945, moon landing was 1969, Berlin Wall fell in 1989"
}
```

**Grading**: Exact sequence match (could add partial credit later)

**UI**:
- Vertical draggable cards with drag handles
- Touch-friendly (min 44px tap targets)
- Visual feedback during drag
- Clear numbering/ordering indicators
- Fallback: up/down buttons for accessibility

### 4. multiSelect

**Description**: Select 2-4 correct answers from 5-7 options (checkboxes)

**Use Cases**:
- "Select all that apply" questions
- Properties/characteristics identification
- Categorization (which items belong to group X?)
- Multiple correct solutions

**Schema**:
```json
{
  "type": "multi_select",
  "task": "Which of these numbers are prime?",
  "options": [
    { "id": 0, "text": "2", "isCorrect": true },
    { "id": 1, "text": "4", "isCorrect": false },
    { "id": 2, "text": "7", "isCorrect": true },
    { "id": 3, "text": "9", "isCorrect": false },
    { "id": 4, "text": "11", "isCorrect": true }
  ],
  "expectedCount": 3,
  "explanation": "Prime numbers are only divisible by 1 and themselves: 2, 7, and 11 are prime."
}
```

**Grading**: All correct answers selected, no incorrect answers selected (exact set match)

**UI**:
- Checkbox grid layout
- Show guidance: "Select 3 correct answers"
- Prevent over-selection or show warning
- Clear selected count indicator

## Architecture

### Backend Structure

**Task Type Registry** (`packages/backend/src/tasks/types/registry.ts`):
- Each type registered with: `id`, `name`, `description`, `jsonSchema`
- AI generates responses matching the schema
- Existing pattern already supports this

**Prompt Files** (`packages/backend/prompts/task-types/`):
```
task-types/
├── yesNo.md
├── singleChoice.md          # Renamed from multipleChoice.md
├── fillInBlank.md           # NEW
├── numberInput.md           # NEW
├── ordering.md              # NEW
└── multiSelect.md           # NEW
```

**Grading Service**:
- Each type has deterministic grading function
- Located in `packages/backend/src/tasks/grading/` (new directory)
- Functions: `gradeFillInBlank()`, `gradeNumberInput()`, etc.
- Called from task submission endpoint

### Frontend Structure

**Component Directory**:
```
packages/frontend/src/app/tasks/
├── TaskCard.tsx                    # Main container (exists)
├── answer-types/                   # NEW directory
│   ├── index.ts                    # Component registry
│   ├── YesNoAnswer.tsx
│   ├── SingleChoiceAnswer.tsx
│   ├── FillInBlankAnswer.tsx       # NEW
│   ├── NumberInputAnswer.tsx       # NEW
│   ├── OrderingAnswer.tsx          # NEW
│   └── MultiSelectAnswer.tsx       # NEW
└── types.ts                        # Type definitions
```

**Component Registry Pattern**:
```typescript
// answer-types/index.ts
export const answerTypeComponents = {
  yesNo: YesNoAnswer,
  singleChoice: SingleChoiceAnswer,
  fillInBlank: FillInBlankAnswer,
  numberInput: NumberInputAnswer,
  ordering: OrderingAnswer,
  multiSelect: MultiSelectAnswer,
}

// TaskCard renders:
const AnswerComponent = answerTypeComponents[task.type]
```

**Shared Component Interface**:
```typescript
interface AnswerComponentProps<T> {
  task: T                           // Typed by discriminated union
  selectedAnswer: any | null
  isCorrect: boolean | null         // null = not submitted
  onAnswerSelect: (answer: any) => void
  disabled: boolean                 // After submission
}
```

### Type System

**Discriminated Union**:
```typescript
type TaskResponse =
  | YesNoTask
  | SingleChoiceTask
  | FillInBlankTask
  | NumberInputTask
  | OrderingTask
  | MultiSelectTask

// Each has unique `type` field for type narrowing
```

**Answer Format** (submitted to backend):
- `yesNo`: `{ answer: boolean }`
- `singleChoice`: `{ selectedIndex: number }`
- `fillInBlank`: `{ answers: string[] }` (ordered array)
- `numberInput`: `{ value: number, unit?: string }`
- `ordering`: `{ orderedIds: string[] }`
- `multiSelect`: `{ selectedIndices: number[] }`

## AI Generation Guidelines

### fillInBlank
- Generate 1-3 blanks per task (not overwhelming)
- Blanks test key concepts, not trivial words
- Provide 2-3 accepted synonyms/variations per blank
- Use `{{blank}}` markers in task text
- Mark case-sensitive only when necessary (proper nouns, abbreviations)

### numberInput
- Specify acceptable tolerance in schema (e.g., ±0.01)
- Include unit if relevant (km, kg, %, °C)
- Support decimal places, negative numbers, scientific notation
- Clear about exact vs approximate answers
- Validate range is reasonable for age/grade

### ordering
- 3-5 items (manageable, not overwhelming)
- Clear correct sequence (chronological, alphabetical, size, process)
- Items should be distinct and unambiguous
- Randomize initial order in presentation

### multiSelect
- 2-4 correct answers from 5-7 total options
- Clearly state "Select X correct answers" in task text
- Include plausible distractors
- Balance difficulty (not all obvious, not impossible)
- Randomize option order

## Implementation Phases

### Phase 1: Backend Foundation
1. Rename `multipleChoice` → `singleChoice`
   - Rename file `multipleChoice.md` → `singleChoice.md`
   - Update registry references
   - Update existing TypeScript types
2. Create 4 new prompt files with YAML frontmatter + JSON schemas
3. Add grading functions for each new type
4. Test AI generation for each type (reliability check)

### Phase 2: Frontend Components
1. Create `answer-types/` directory structure
2. Build 4 new answer components (mobile-first design)
3. Create component registry/mapper
4. Update `TaskCard` to use dynamic component rendering
5. Update TypeScript types (discriminated unions)
6. Add translations (English + German)

### Phase 3: Testing & Refinement
1. Test AI generation across subjects (Math, Physics, German, Logic)
2. Test grading accuracy (edge cases, synonyms, tolerance)
3. Test mobile UX (touch targets, drag-and-drop, keyboards)
4. Adjust prompts based on AI output quality
5. Add subject-specific mappings if needed

## Subject Compatibility

All 4 types work universally, but subjects naturally favor certain types:

**Math**:
- Primary: `numberInput`, `singleChoice`
- Secondary: `fillInBlank` (equations), `ordering` (number sequences)

**Physics**:
- Primary: `numberInput` (with units), `singleChoice`
- Secondary: `multiSelect` (properties), `ordering` (process steps)

**German/Language**:
- Primary: `fillInBlank` (grammar), `singleChoice`
- Secondary: `ordering` (sentence structure), `multiSelect` (categories)

**Logic**:
- Primary: `ordering` (sequences), `singleChoice`
- Secondary: `multiSelect` (pattern elements), `fillInBlank`

**Future Consideration**: Optional type weighting/mapping per subject if randomization needs tuning.

## Success Metrics

- **Variety**: Students see mixed answer types within a session
- **AI Reliability**: >95% valid schema outputs for each type
- **Grading Accuracy**: >99% correct grading for deterministic types
- **Mobile UX**: All interactions work smoothly on touch devices
- **Engagement**: Reduced bounce rate, longer session times

## Future Enhancements (Out of Scope)

- **shortAnswer**: Open text with AI semantic validation (requires new grading flow)
- **dragAndDropMatching**: Pair items between two columns
- **imageHotspot**: Click regions on an image
- **slider/range**: Select value on a continuous scale
- **partialCredit**: Award points for partially correct answers
- **timeAttack**: Bonus points for speed
- **adaptiveDifficulty**: Adjust based on performance
