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

## Concept Prompt Structure

When creating a concept prompt (`[yourConcept].ts`), follow these guidelines:

1. **Core Structure**
   - Start with "Focus on creating a [concept] problem that:"
   - List key requirements as bullet points
   - Keep it concise and focused

2. **Required Elements**
   - Core concept focus
   - Age appropriateness
   - Skill building aspects
   - Problem characteristics
   - Thinking process guidance

3. **Parameters**
   - Use {{age}} for age-specific requirements
   - Avoid mentioning other parameters (handled by base prompt)

4. **Do Not Include**
   - Difficulty levels (handled by task type prompts)
   - Language requirements (handled by base prompt)
   - Answer format instructions (handled by task type prompts)
   - Parameter documentation

### Example Concept Prompts

Here are well-structured concept prompts:

```typescript
// Analogical Thinking
export const prompt = `
Focus on creating an analogical thinking problem that:
- Uses relationships between different concepts
- Is appropriate for age {{age}} students
- Uses clear, familiar examples for comparisons
- Builds relationship recognition skills
- Encourages systematic thinking
- Uses age-appropriate complexity
- Ensures cultural appropriateness
`;

// Pattern Recognition
export const prompt = `
Focus on creating a pattern recognition problem that:
- Uses clear, visual patterns when possible
- Is appropriate for age {{age}} students
- Has a logical sequence or progression
- Builds pattern recognition skills
- Uses age-appropriate complexity
- Can be solved through careful observation
- Encourages systematic thinking
`;
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

2. Code Organization:
   - Keep related files together
   - Follow existing patterns from math and logic
   - Maintain clean separation of concerns

## Validation Checklist

Before submitting:
- [ ] Concept implementation complete
- [ ] Prompt templates added and follow guidelines
- [ ] UI components updated
- [ ] Prompts reviewed for quality
- [ ] UI tested in all viewports

## Need Help?

1. Review existing concepts in math and logic for examples
2. Consult the development team
3. Update this documentation with learnings