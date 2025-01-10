# Adding a New Subject to LogiKids

This guide explains how to add a new subject to the LogiKids platform. The process involves updating both backend and frontend components.

## Required File Updates

### Backend Files
- `packages/backend/src/tasks/subjects/types.ts` - Add subject definition and types
- `packages/backend/src/tasks/subjects/[yourSubject]/index.ts` - Create subject implementation
- `packages/backend/src/tasks/subjects/[yourSubject]/subject.ts` - Create subject configuration
- `packages/backend/src/tasks/subjects/index.ts` - Register the new subject
- `packages/backend/src/tasks/types.ts` - Add subject to Zod validation schema and types
- `packages/backend/src/tasks/prompts/[yourSubject]/[yourSubject].prompt.ts` - Create base prompt template
- `packages/backend/src/tasks/prompts/[yourSubject]/concepts/[conceptName].ts` - Create concept-specific prompts

### Frontend Files
- `packages/frontend/src/components/Subject/types.ts` - Add subject types
- `packages/frontend/src/components/Subject/subjects.ts` - Add subject configuration
- `packages/frontend/src/api/logikids.ts` - Add subject to Zod validation schema
- `packages/frontend/src/components/Subject/SubjectSelect/SubjectSelect.tsx` - Update subject selector
- `packages/frontend/src/components/Task/ConceptSelector/ConceptSelector.tsx` - Update concept selector
- `packages/frontend/src/assets/[yourSubject].webp` - Create and add background pattern image (REQUIRED)
- `packages/frontend/src/components/Task/TaskPage/TaskPage.tsx` - Add pattern to patterns object

### Important Note About Background Pattern
The background pattern image is a REQUIRED asset:
1. Create a `.webp` format image for your subject (similar style to existing patterns)
2. Name it exactly as `[yourSubject].webp` (e.g., `physics.webp`, `math.webp`)
3. Place it in `packages/frontend/src/assets/`
4. Import and add it to the patterns object in `TaskPage.tsx`

If the pattern image is missing:
- The UI will fall back to the default pattern
- This is not ideal for production and should be fixed before deployment
- Each subject should have its unique, visually distinct pattern

### Translation Files
- `packages/frontend/public/locales/de/common.json` - Add German translations for:
  ```json
  {
    "subject": {
      "yourSubject": "German Translation"
    },
    "concepts": {
      "yourSubject": {
        "concept1": "German Translation",
        "concept2": "German Translation"
      }
    }
  }
  ```

## Overview

A subject in LogiKids (like Math or Logic) is a top-level category that contains multiple concepts. Each subject needs:
- A unique identifier
- A list of concepts
- A base prompt template (named `[subject].prompt.ts`)
- Concept-specific prompt templates
- Frontend UI components
- Translations for all user-facing text
- A background pattern image (`.webp` format) for the task page

## UI Assets

### Background Pattern
Each subject requires a background pattern image:
- File: `packages/frontend/src/assets/[yourSubject].webp`
- Format: WebP (for optimal performance)
- Usage: Applied as background in the task page
- Default: If no specific pattern is available, the default background (`default.webp`) will be used
- Add to patterns object in `TaskPage.tsx`:
  ```typescript
  import defaultPattern from '../../../assets/default.webp'
  
  const patterns = {
    math: mathPattern,
    logic: logicPattern,
    yourSubject: yourSubjectPattern ?? defaultPattern // Falls back to default if not provided
  } as const;
  ```

## Prompt Structure

### Base Prompt (`[subject].prompt.ts`)
Each subject requires a base prompt file (e.g., `math.prompt.ts`, `logic.prompt.ts`) that defines:
- Critical requirements for content appropriateness
- The AI tutor's role and expertise in the subject
- Age and difficulty level considerations
- Language requirements
- Final verification checklist

Example base prompt structure (`music.prompt.ts`):
```typescript
export const basePrompt = `
## CRITICAL REQUIREMENTS
1. CONTENT APPROPRIATENESS
   A. Language Requirements
      - ALL content MUST be in {{language}}
      ...

   B. Age Requirements ({{age}} years)
      - Subject-specific complexity
      - Vocabulary and language complexity
      - Examples and context

   C. Difficulty Level ({{difficulty}})
      ...

## Your Role
You are an expert in [subject], developing tasks for students of age {{age}}. 
...

## Concept to focus on when creating the task
{{concept_template}}

## Task Requirements
{{task_type_template}}

## Final Verification Checklist
...
`;
```

### Concept Prompts
Each concept within the subject needs its own prompt file. See `conceptPrompts.md` for detailed guidelines on creating concept-specific prompts.

## Step-by-Step Guide

### 1. Backend Changes

#### a. Update Subject Types (`packages/backend/src/tasks/subjects/types.ts`)

```typescript
export const SUBJECTS = {
  math: { /* existing */ },
  logic: { /* existing */ },
  yourSubject: {
    id: 'yourSubject',
    concepts: [
      'concept1',
      'concept2',
      // Add your concepts here
    ]
  }
} as const;

// Update type mappings
export type SubjectsMap = {
  math: Subject<MathConceptId>;
  logic: Subject<LogicConceptId>;
  yourSubject: Subject<YourSubjectConceptId>;  // Add this
};

// Add new concept type
export type YourSubjectConceptId = typeof SUBJECTS.yourSubject.concepts[number];
```

#### b. Create Subject Directory (`packages/backend/src/tasks/subjects/yourSubject/`)

1. Create a new directory for your subject
2. Add implementation files following the pattern in `math/` and `logic/` directories

#### c. Add Prompt Templates (`packages/backend/src/tasks/prompts/yourSubject/`)

1. Create a new directory for your subject's prompts
2. Add prompt templates for each concept
3. Follow the existing structure in `math/` and `logic/` directories

#### d. Register Subject (`packages/backend/src/tasks/subjects/index.ts`)

```typescript
import { SubjectsMap } from './types';
import { mathSubject } from './math/subject';
import { logicSubject } from './logic/subject';
import { yourSubject } from './yourSubject/subject';

export const subjects: SubjectsMap = {
  math: mathSubject,
  logic: logicSubject,
  yourSubject: yourSubject
} as const;

export * from './types';
export * from './math';
export * from './logic';
export * from './yourSubject';
```

### 2. Frontend Changes

#### a. Update Subject Types (`packages/frontend/src/components/Subject/types.ts`)

```typescript
export const SUBJECT_VALUES = ['math', 'logic', 'yourSubject'] as const;

export const subjects: Record<SubjectId, SubjectConfig> = {
  math: { /* existing */ },
  logic: { /* existing */ },
  yourSubject: {
    id: 'yourSubject',
    concepts: [
      'concept1',
      'concept2',
      // Add your concepts here
    ]
  }
};
```

#### b. Add UI Components

1. Update the subject selector component to include your new subject
2. Add any subject-specific UI components if needed
3. Add icons and styling for the new subject

## Best Practices

1. Keep concept names consistent and descriptive
2. Follow existing naming conventions (use snake_case for concept IDs)
3. Ensure all prompts are educational and age-appropriate
4. Maintain consistent difficulty progression

## Validation

Before deploying:
1. Verify prompt templates generate appropriate questions
2. Check UI rendering in all supported viewports
3. Validate accessibility requirements

## Need Help?

If you need assistance:
1. Check existing subjects (math and logic) for implementation patterns
2. Consult the development team
3. Update this documentation if you find areas for improvement 