# Adding a New Subject to LogiKids

This guide explains how to add a new subject to the LogiKids platform. The process involves updating both backend and frontend components.

## Required File Updates

### Backend Files
- `packages/backend/src/tasks/subjects/types.ts` - Add subject definition and types
- `packages/backend/src/tasks/subjects/[yourSubject]/index.ts` - Create subject implementation
- `packages/backend/src/tasks/prompts/[yourSubject]/index.ts` - Create prompt templates
- `packages/backend/src/tasks/prompts/[yourSubject]/[concept].ts` - Create concept-specific prompts

### Frontend Files
- `packages/frontend/src/components/Subject/types.ts` - Add subject types
- `packages/frontend/src/components/Subject/subjects.ts` - Add subject configuration
- `packages/frontend/src/components/Subject/SubjectSelect/SubjectSelect.tsx` - Update subject selector
- `packages/frontend/src/components/Task/ConceptSelector/ConceptSelector.tsx` - Update concept selector

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
- Associated prompt templates
- Frontend UI components
- Translations for all user-facing text

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