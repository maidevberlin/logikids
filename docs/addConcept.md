# Adding a New Concept to a Subject

This guide explains how to add a new concept to an existing subject in LogiKids. Concepts are specific topics within a subject (like 'arithmetic' in Math or 'patterns' in Logic).

## Required File Updates

### Backend Files
- `packages/backend/src/tasks/subjects/types.ts` - Add concept to subject definition
- `packages/backend/src/tasks/subjects/[subjectName]/index.ts` - Update subject implementation
- `packages/backend/src/tasks/prompts/[subjectName]/concepts/[yourConcept].ts` - Create concept prompts

### Frontend Files
- `packages/frontend/src/components/Subject/types.ts` - Add concept to subject config
- `packages/frontend/src/components/Task/ConceptSelector/ConceptSelector.tsx` - Update concept selector
- `packages/frontend/src/components/Task/ConceptSelector/types.ts` - Update concept types if needed

### Translation Files
- `packages/frontend/public/locales/de/common.json` - Add German translation:
  ```json
  {
    "concepts": {
      "subjectName": {
        "yourNewConcept": "German Translation"
      }
    }
  }
  ```

## Overview

A concept in LogiKids needs:
- A unique identifier within its subject
- Prompt templates for generating questions
- Frontend UI support
- Integration with the existing task system

## Step-by-Step Guide

### 1. Backend Changes

#### a. Update Subject Types (`packages/backend/src/tasks/subjects/types.ts`)

```typescript
export const SUBJECTS = {
  subjectName: {
    id: 'subjectName',
    concepts: [
      // ... existing concepts ...
      'yourNewConcept'  // Add your new concept here
    ]
  }
} as const;
```

#### b. Add Concept Implementation

1. Navigate to `packages/backend/src/tasks/subjects/[subjectName]/`
2. Add or update the concept implementation following existing patterns
3. Implement any specific logic needed for the new concept

#### c. Create Prompt Templates

1. Go to `packages/backend/src/tasks/prompts/[subjectName]/concepts/`
2. Create a new file for your concept's prompts
3. Follow this structure and use available parameters:

```typescript
export const prompt = `
You are a tutor helping students understand [your concept].
Create questions that help students learn and practice [concept skills].
Use clear, age-appropriate language and provide enough context.

Available parameters that will be injected:
- {{age}} - Student's age
- {{difficulty}} - Task difficulty (easy, medium, hard)
- {{language}} - Language name (e.g., "English", "German")
- {{subject_name}} - Full subject name
- {{concept_name}} - Full concept name

Create questions with these guidelines based on difficulty ({{difficulty}}):

For easy:
- Simple guidelines for easy level
- Adapt complexity for age {{age}}
- Keep concepts straightforward

For medium:
- Guidelines for medium level
- Age-appropriate complexity
- Combine multiple elements

For hard:
- Guidelines for hard level
- Complex scenarios for age {{age}}
- Multiple rules or steps

Always:
1. Present questions in {{language}}
2. Provide clear instructions
3. Include 4 possible answers
4. Add appropriate explanations
`;
```

### 2. Frontend Changes

#### a. Update Subject Configuration (`packages/frontend/src/components/Subject/types.ts`)

```typescript
export const subjects: Record<SubjectId, SubjectConfig> = {
  subjectName: {
    id: 'subjectName',
    concepts: [
      // ... existing concepts ...
      'yourNewConcept'  // Add your new concept here
    ]
  }
};
```

#### b. UI Components

1. Update concept selector components to include the new concept
2. Add any concept-specific UI components if needed
3. Add appropriate icons and styling

## Best Practices

1. Naming Conventions:
   - Use snake_case for concept IDs
   - Keep names descriptive and consistent
   - Follow existing patterns in math and logic subjects

2. Prompt Design:
   - Make prompts clear and age-appropriate
   - Include various difficulty levels
   - Ensure educational value

3. Code Organization:
   - Keep related files together
   - Follow existing patterns from math and logic
   - Maintain clean separation of concerns

## Validation Checklist

Before submitting:
- [ ] Concept implementation complete
- [ ] Prompt templates added
- [ ] UI components updated
- [ ] Prompts reviewed for quality
- [ ] UI tested in all viewports

## Common Pitfalls

1. Avoid:
   - Overly complex prompts
   - Inconsistent difficulty scaling
   - Unclear instructions
   - Duplicate concept logic

2. Remember to:
   - Consider edge cases
   - Maintain consistent style
   - Update all relevant documentation

## Need Help?

1. Review existing concepts in math and logic for examples
2. Consult the development team
3. Update this documentation with learnings 