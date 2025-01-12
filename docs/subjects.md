# Adding Subjects and Concepts

This guide explains how to add new subjects and concepts to the LogiKids platform using our subject-based configuration system.

## Overview

All subjects are defined in single TypeScript files under `packages/backend/src/tasks/subjects/`. Each subject file contains:
- Subject metadata (id, name, description)
- Base prompt template
- All concepts for that subject

## Adding a New Subject

### Backend Changes

1. Create a new file in `packages/backend/src/tasks/subjects/` named after your subject (e.g., `chemistry.ts`)

2. Implement your subject class extending `BaseSubject`:

```typescript
import { BaseSubject, Concept } from './base';

class ChemistrySubject extends BaseSubject {
  public readonly id = 'chemistry';
  public readonly name = 'Chemistry';
  public readonly description = 'Learn about atoms, molecules, and chemical reactions';
  
  public readonly basePromptTemplate = `
## CRITICAL REQUIREMENTS
1. CONTENT APPROPRIATENESS
   A. Language Requirements
      - ALL content MUST be in {{language}}
      - Use clear, simple explanations
      - Avoid complex terminology unless necessary
      - Break down complex concepts into digestible parts

   B. Age Requirements ({{age}} years)
      - Adjust complexity based on age
      - Use age-appropriate examples
      - Focus on observable phenomena
      - Include visual elements when possible

   C. Difficulty Level ({{difficulty}})
      - Adapt complexity appropriately
      - Scale conceptual depth based on difficulty
      - Maintain engagement while challenging

## Your Role
You are an expert chemistry teacher, developing tasks for students of age {{age}}. 
Your goal is to make chemistry concepts accessible and engaging through practical examples.

## Concept to focus on when creating the task
{{concept_template}}

## Task Requirements
{{task_type_template}}

## Final Verification Checklist
1. Age-appropriate language and concepts ✓
2. Clear connection to real-world applications ✓
3. Scientifically accurate but simplified appropriately ✓
4. Engaging and interactive elements included ✓
5. Safety considerations addressed ✓
6. Complexity matches difficulty level ✓`;

  public readonly concepts: Record<string, Concept> = {
    atoms: {
      id: 'atoms',
      name: 'Atoms and Elements',
      description: 'Learn about the building blocks of matter',
      promptTemplate: `
Create a task about atoms and elements that helps students understand:
- What atoms are and why they matter
- How atoms combine to form elements
- Where we find atoms in everyday life

Key focus areas:
- Visual representations of atoms
- Real-world examples
- Safe and engaging demonstrations
- Age-appropriate analogies`
    },
    // Add more concepts here
  };
}

// Export a singleton instance
export const chemistrySubject = new ChemistrySubject();
```

3. Export your subject in `subjects/index.ts`:
```typescript
// ... existing exports
export { chemistrySubject } from './chemistry';
```

The subject will be automatically registered by the `SubjectRegistry` when exported.

### Frontend Changes

1. Add subject icon:
   - Create a WebP image (400x400px) for your subject
   - Save it in `packages/frontend/src/assets/[subject-id].webp`
   - Use consistent style with existing icons

2. Update subject list:
   - Open `packages/frontend/src/components/Subject/SubjectList/config.ts`
   - Add your subject to the `SUBJECTS` array:
   ```typescript
   import chemistryIcon from '../../../assets/chemistry.webp';
   
   export const SUBJECTS = [
     // ... existing subjects
     {
       id: 'chemistry',
       name: 'Chemistry',
       description: 'Learn about atoms, molecules, and chemical reactions',
       icon: chemistryIcon,
       concepts: [
         {
           id: 'atoms',
           name: 'Atoms and Elements',
           description: 'Learn about the building blocks of matter'
         },
         // ... other concepts
       ]
     }
   ] as const;
   ```

3. Update types:
   - Open `packages/frontend/src/types/subjects.ts`
   - Add your subject ID to the `SubjectId` type:
   ```typescript
   export type SubjectId = 'math' | 'logic' | 'music' | 'physics' | 'chemistry';
   ```

4. Add translations:
   - Open `packages/frontend/public/locales/de/common.json`
   - Add translations for your subject and concepts:
   ```json
   {
     "subject": {
       "chemistry": "Chemie"
     },
     "concepts": {
       "chemistry": {
         "atoms": "Atome und Elemente",
         "reactions": "Chemische Reaktionen"
       }
     }
   }
   ```

5. Add background pattern:
   - Create a WebP format background pattern for your subject
   - Save it as `packages/frontend/src/assets/[subject-id].webp`
   - Update patterns in `packages/frontend/src/components/Task/TaskPage/TaskPage.tsx`:
   ```typescript
   import chemistryPattern from '../../../assets/chemistry.webp';
   
   const patterns = {
     // ... existing patterns
     chemistry: chemistryPattern
   } as const;
   ```

That's it! The subject registry will automatically pick up your new subject.

## Adding New Concepts

To add a new concept to an existing subject:

1. Open the subject file (e.g., `subjects/chemistry.ts`)

2. Add your concept to the concepts record:

```typescript
readonly concepts: Record<string, Concept> = {
  // Existing concepts...
  
  reactions: {
    id: 'reactions',
    name: 'Chemical Reactions',
    description: 'Learn how substances combine and change',
    promptTemplate: `
      Create a task about chemical reactions.
      Focus on:
      - Simple, safe reactions
      - Visual changes
      - Everyday examples
      
      ${this.basePromptTemplate}
    `
  }
};
```

3. Update frontend config:
   - Open `packages/frontend/src/components/Subject/SubjectList/config.ts`
   - Add your concept to the subject's concepts array:
   ```typescript
   export const SUBJECTS = [
     {
       id: 'chemistry',
       // ... other subject properties
       concepts: [
         // ... existing concepts
         {
           id: 'reactions',
           name: 'Chemical Reactions',
           description: 'Learn how substances combine and change'
         }
       ]
     }
   ] as const;
   ```

4. Add translations for the new concept:
   ```json
   {
     "concepts": {
       "chemistry": {
         "reactions": "Chemische Reaktionen"
       }
     }
   }
   ```

## Best Practices

### Subject Design
- Choose a clear, unique ID
- Write a concise but descriptive name
- Provide a detailed description
- Base prompt should define:
  - Teacher persona
  - Age appropriateness
  - Safety considerations
  - Educational goals
  - Quality checks

### Concept Design
- IDs should be URL-friendly (lowercase, no spaces)
- Names should be user-friendly
- Descriptions should help teachers understand the topic
- Prompt templates should:
  - Be specific to the concept
  - Reference the base prompt
  - Include concept-specific requirements
  - Maintain consistent difficulty levels

### Frontend Design
- Icons should be:
  - WebP format for better compression
  - 400x400px size
  - Consistent style with existing icons
  - Clear and recognizable
- Background patterns should be:
  - WebP format for performance
  - Consistent with existing patterns
  - Visually distinct for each subject
  - Suitable for task page background
- Descriptions should be:
  - Concise (1-2 sentences)
  - Engaging for students
  - Clear for parents/teachers
- Translations must be:
  - Complete for all user-facing text
  - Natural in each language
  - Consistent with existing terminology

### Testing
Before submitting:
1. Run all tests (backend and frontend)
2. Test task generation
3. Test random concept selection
4. Verify error handling
5. Check type safety
6. Test UI rendering
7. Verify responsive design
8. Check icon and pattern display
9. Verify translations

## Example Prompts

### Base Prompt Template
```
You are a [subject] teacher helping elementary school students.
Create age-appropriate tasks that are engaging and educational.

Requirements:
- Use simple language suitable for the student's age
- Include visual elements when helpful
- Make real-world connections
- Follow safety guidelines

Final verification:
- Content is age-appropriate
- Clear instructions
- Educational value
- Meets safety standards
```

### Concept Prompt Template
```
Create a task about [concept].
Focus on:
- [Specific concept requirements]
- [Key learning objectives]
- [Safety considerations if applicable]

${this.basePromptTemplate}
```

## Type Reference

```typescript
interface Concept {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
}

interface Subject {
  id: string;
  name: string;
  description: string;
  basePromptTemplate: string;
  concepts: Record<string, Concept>;
}
``` 