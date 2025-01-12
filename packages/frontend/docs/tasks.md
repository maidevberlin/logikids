# Frontend Subject Configuration

This guide explains how to add new subjects and concepts to the LogiKids platform's frontend.

## Frontend Changes

1. Add translations:
   - Open `public/locales/de/common.json`
   - Add translations for your subject and concepts:
   ```json
   {
     "subject": {
       "newSubject": "Subject Name in German"
     },
     "concepts": {
       "newSubject": {
         "concept1": "Concept 1 in German",
         "concept2": "Concept 2 in German"
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
   
   const patterns = {
     // ... existing patterns
     newSubject: newSubjectPattern
   } as const;
   ```

Note: If a background image is not available for a subject, it will fallback to the default background image (`defaultBg`).
