# Number Input Task Type Refinement Design

**Date:** 2025-11-08
**Status:** Approved

## Overview

Refinement of the `number_input` task type to improve UI, simplify data model, and add flexible unit handling.

## Goals

1. Better UI: Replace browser default number input with stepper + editable field (chevrons like age selector)
2. Flexible unit handling: Support display-only units AND unit selection as part of task
3. Simplified data model: Flatten solution structure, remove tolerance (exact match only)
4. Separate validation: Provide granular feedback on number vs unit correctness

## Design Decisions

### Decision 1: Single Flexible Task Type
**Choice:** One `number_input` type that adapts based on fields provided
**Alternatives considered:** Separate `number_input` and `number_input_with_unit` types
**Rationale:** Simpler for LLM to generate, fewer task types to maintain, natural flexibility

### Decision 2: Exact Match Only
**Choice:** Remove tolerance field, require exact numeric match
**Alternatives considered:** Keep tolerance for rounding scenarios
**Rationale:** Simplifies validation, clearer for students what's expected

### Decision 3: Stepper with Text Input
**Choice:** Chevron buttons + editable center field
**Alternatives considered:** Stepper only, or text input only
**Rationale:** Best of both worlds - quick adjustment and precise entry

### Decision 4: Separate Validation
**Choice:** Return `{numberCorrect, unitCorrect}` separately
**Alternatives considered:** Single boolean pass/fail
**Rationale:** Better feedback helps students learn, can track which part is difficult

### Decision 5: Dedicated Component
**Choice:** Redesign NumberInputAnswer for tasks, keep NumberInput for age/grade
**Alternatives considered:** Unified flexible component, or minimal changes
**Rationale:** Clear separation of concerns, different use cases have different needs

## Data Model

### Backend Types

```typescript
// packages/backend/src/tasks/types/numberInput.ts
export interface NumberInputResponse {
  type: 'number_input';
  title: string;
  task: string;
  answer: number;           // The correct numeric value (required)
  unit?: string;           // Correct unit (when unitOptions present) OR display unit
  unitOptions?: string[];  // Optional: if present, student must choose
  explanation: string;
}
```

### Three Unit Scenarios

**1. No unit:**
```json
{
  "type": "number_input",
  "title": "Simple Calculation",
  "task": "What is 7 × 6?",
  "answer": 42,
  "explanation": "7 × 6 = 42"
}
```

**2. Display-only unit:**
```json
{
  "type": "number_input",
  "title": "Rectangle Area",
  "task": "Calculate the area. Give your answer in cm².",
  "answer": 27,
  "unit": "cm²",
  "explanation": "Area = 4.5 × 6 = 27 cm²"
}
```

**3. Unit selection (part of challenge):**
```json
{
  "type": "number_input",
  "title": "Velocity Calculation",
  "task": "Calculate average velocity and choose the appropriate unit.",
  "answer": 60,
  "unit": "km/h",
  "unitOptions": ["m/s", "km/h", "mph"],
  "explanation": "velocity = 150 km ÷ 2.5 hours = 60 km/h"
}
```

### Frontend Answer Structure

```typescript
// packages/frontend/src/app/tasks/types.ts
export interface NumberInputAnswer {
  value: number;
  unit?: string;
}
```

## Grading Logic

### Grading Function

```typescript
// packages/backend/src/tasks/grading/numberInput.ts
export interface NumberInputGradingResult {
  correct: boolean;
  numberCorrect: boolean;
  unitCorrect?: boolean;  // undefined when no unit validation needed
}

export function gradeNumberInput(
  userAnswer: NumberInputAnswer,
  solution: { answer: number; unit?: string; unitOptions?: string[] }
): NumberInputGradingResult {
  const numberCorrect = userAnswer.value === solution.answer;

  if (solution.unitOptions && solution.unitOptions.length > 0) {
    const unitCorrect = userAnswer.unit === solution.unit;
    return {
      correct: numberCorrect && unitCorrect,
      numberCorrect,
      unitCorrect
    };
  }

  return {
    correct: numberCorrect,
    numberCorrect,
    unitCorrect: undefined
  };
}
```

### Feedback Scenarios

| Number | Unit | Feedback |
|--------|------|----------|
| ✓ | ✓ | "Correct!" |
| ✓ | ✗ | "The number is correct, but check the unit" |
| ✗ | ✓ | "The unit is correct, but check your calculation" |
| ✗ | ✗ | "Not quite right, try again" |

## UI Component Design

### Component: NumberInputAnswer

**Location:** `packages/frontend/src/app/tasks/answer-types/NumberInputAnswer.tsx`

**Visual Layout:**
```
┌─────────────────────────────────┐
│  [instruction text if needed]   │
│                                  │
│   ◀  ┌──────────┐  ▶            │
│      │   42     │                │  ← Stepper + editable
│      └──────────┘                │
│                                  │
│      [unit display/selector]     │  ← Conditional
└─────────────────────────────────┘
```

**Number Input Behavior:**
- Large centered display (similar to age NumberInput)
- Chevron buttons (ChevronLeft/Right from lucide-react)
- Center value is **editable** (click to enter number directly)
- No min/max constraints (answers can be any number)
- Validate on blur: must be valid number
- Use `inputMode="decimal"` for mobile keyboards

**Unit Display (3 modes):**
1. **No unit:** Nothing shown below number
2. **Display-only unit:** Static label below number (e.g., "cm²")
3. **Unit selection:** Dropdown (Select component) with unitOptions

**Props:**
```typescript
interface NumberInputAnswerProps {
  unit?: string;              // Display-only unit
  unitOptions?: string[];     // Unit choices (overrides unit prop)
  selectedAnswer: { value: number | null; unit?: string } | null;
  onAnswerSelect: (answer: { value: number | null; unit?: string }) => void;
  isLoading?: boolean;
  isLocked?: boolean;
}
```

**Styling:**
- Card with `p-8 rounded-2xl shadow-md`
- Chevron buttons: `h-16 w-16 rounded-full` (same as current NumberInput)
- Number display: `h-28 w-28 rounded-3xl text-5xl` (editable input styled as display)
- Unit dropdown: Centered, same width as number display
- Use shadcn/ui Select component for unit selection

## LLM Prompt Updates

**File:** `packages/backend/prompts/task-types/numberInput.md`

**Key changes:**
- Remove tolerance guidance (exact match only)
- Remove acceptedUnits (replaced by unitOptions)
- Add three clear scenarios with examples
- Guidance on when to use unit selection vs display
- Instruction to include plausible wrong units as distractors

**Example prompt section:**
```markdown
## Unit Handling

**Three scenarios:**

1. **No unit** - Pure numeric calculation
   - Omit both `unit` and `unitOptions`
   - Example: "What is 7 × 6?"

2. **Display-only unit** - Unit is obvious/specified in task
   - Provide only `unit`
   - Example: "Calculate area in cm²" → `"unit": "cm²"`

3. **Unit selection** - Choosing correct unit is part of learning
   - Provide both `unit` (correct) and `unitOptions` (choices)
   - Include common wrong units as distractors
   - Example: velocity task → `"unit": "km/h", "unitOptions": ["m/s", "km/h", "mph"]`
```

## Implementation Impact

### Files to Modify

**Backend:**
- `packages/backend/prompts/task-types/numberInput.md` - Update prompt template
- `packages/backend/src/tasks/types/numberInput.ts` - Update interface and schema
- `packages/backend/src/tasks/grading/numberInput.ts` - Update grading logic
- `packages/backend/src/tasks/grading/types.ts` - Add NumberInputGradingResult
- `packages/backend/src/tasks/grading/index.ts` - Update return type

**Frontend:**
- `packages/frontend/src/app/tasks/answer-types/NumberInputAnswer.tsx` - Complete redesign
- `packages/frontend/src/app/tasks/types.ts` - Update types to match backend
- `packages/frontend/src/app/tasks/useTaskAnswer.ts` - Handle new grading result
- `packages/frontend/src/app/tasks/TaskCard.tsx` - Display granular feedback
- Translation files: Add feedback messages for partial correctness

**Keep unchanged:**
- `packages/frontend/src/app/common/NumberInput.tsx` - Used for age/grade selection

### Migration Notes

**Breaking changes:**
- Old tasks with `solution.value` won't work (now `answer`)
- Old tasks with `tolerance` field will fail schema validation
- Old tasks with `acceptedUnits` won't work (now `unitOptions`)

**Migration strategy:**
- Task cache expires after 30 minutes (auto-cleanup)
- No persistent task storage (all generated on-demand)
- New tasks will use new structure immediately
- No data migration needed

## Testing Considerations

**Grading tests:**
- Exact match (no tolerance edge cases)
- All three unit scenarios
- Partial correctness (number right, unit wrong and vice versa)

**UI tests:**
- Number input: stepper buttons work
- Number input: direct text entry works
- Number input: validates numeric input
- Unit display: shows when `unit` provided without `unitOptions`
- Unit selection: dropdown shows when `unitOptions` provided
- Unit selection: default selection behavior

**Integration tests:**
- Full task flow with each unit scenario
- Grading feedback displays correctly
- LLM generates valid task structures

## Open Questions

None - design approved and ready for implementation.
