# Frontend Subject Configuration

This guide explains how to add new subjects and concepts to the LogiKids platform's frontend.

## Frontend Changes

1. Add translations:
   - Open `public/locales/de/common.json` and `public/locales/en/common.json`
   - Add translations for your subject and concepts:
   ```json
   {
     "subjects": {
       "newSubject": {
         "label": "Subject Name in German",
         "concepts": {
           "concept1": "Concept 1 in German",
           "concept2": "Concept 2 in German"
         }
       }
     }
   }
   ```

2. Add background image:
   - Create a WebP format background image for your subject
   - Save it as `src/assets/[subject-id].webp`
   - Update backgrounds in `src/features/Task/TaskPage/TaskPage.tsx`:
   ```typescript
   import newSubjectBg from '../../../assets/newSubject.webp';
   
   const backgrounds = {
     // ... existing backgrounds
     newSubject: newSubjectBg
   } as const;
   ```

Note: If a background image is not available for a subject, you should explicitly set it to use the default background:
```typescript
const backgrounds = {
  // ... existing backgrounds
  newSubject: defaultBg // Fallback to default pattern until subject pattern is available
} as const;
```
This ensures the application won't try to load a non-existent image and will use the default background pattern instead.
