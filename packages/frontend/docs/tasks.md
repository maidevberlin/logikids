# Frontend Subject Configuration

This guide explains how to add new subjects and concepts to the LogiKids platform's frontend.

## Frontend Changes

1. Add translations:
   - You MUST add translations to BOTH language files:
     - `public/locales/de/common.json` (German translations)
     - `public/locales/en/common.json` (English translations)
   - Add translations for your subject and concepts in BOTH files:
   ```json
   // English translations (common.json)
   {
     "subjects": {
       "newSubject": {
         "label": "Subject Name in English",
         "concepts": {
           "concept1": "Concept 1 in English",
           "concept2": "Concept 2 in English"
         }
       }
     }
   }

   // German translations (common.json)
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
   Important: 
   - Make sure to add the translations to BOTH files, or the subject/concepts will appear untranslated in one of the languages!
   - Translation files are cached by the browser. They will be automatically refreshed when a new version is released.
   - The cache breaker uses the version from `package.json`. When you release a new version:
     1. Update the version in `package.json`
     2. Build and deploy the application
     3. Users will automatically get fresh translations
   - During development, you might need to do a hard refresh (Ctrl/Cmd + Shift + R) to see translation changes.

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
