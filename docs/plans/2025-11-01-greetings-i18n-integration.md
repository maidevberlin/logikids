# Greetings i18n Integration Design

**Date:** 2025-11-01
**Status:** Approved
**Author:** Claude Code

## Overview

Expand the welcome page greetings from 5 to 12 variations per time period and integrate them with the existing i18next internationalization system. This removes hardcoded English strings and enables proper German translations.

## Requirements

- **Quantity:** 12 greeting variations per time period (morning, afternoon, evening, night)
- **Tone:** Mix of educational/motivational, playful/friendly, and simple/welcoming
- **Personalization:** Generic greetings only (no subject-specific content)
- **Emojis:** Remove all emojis from greetings
- **Languages:** English and German support via i18next

## Architecture

### Translation Structure

Store greetings as arrays in the existing `common.json` translation files under a new `greetings` namespace:

```json
{
  "greetings": {
    "morning": [
      "Good morning",
      "Rise and shine",
      "Ready to learn?",
      // ... 12 total
    ],
    "afternoon": [ /* 12 greetings */ ],
    "evening": [ /* 12 greetings */ ],
    "night": [ /* 12 greetings */ ]
  }
}
```

**Files to update:**
- `public/locales/en/common.json`
- `public/locales/de/common.json`

### Code Changes

**Modified file:** `packages/frontend/src/ui/welcome/greetings.ts`

```typescript
import { useTranslation } from 'react-i18next'

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 21) return 'evening'
  return 'night'
}

export function useRandomGreeting(timeOfDay?: TimeOfDay): string {
  const { t } = useTranslation()
  const time = timeOfDay || getTimeOfDay()

  // Get the array of greetings for this time period
  const greetings = t(`greetings.${time}`, { returnObjects: true }) as string[]

  // Return random greeting
  return greetings[Math.floor(Math.random() * greetings.length)]
}
```

**Key changes:**
- Remove hardcoded `greetings` object and `TimeBasedGreetings` interface
- Keep `getTimeOfDay()` helper function (still useful)
- Replace `getRandomGreeting()` with `useRandomGreeting()` hook to access i18n context
- Use `returnObjects: true` to retrieve arrays from translation files

**Component usage:**
```typescript
const greeting = useRandomGreeting()
```

## Greeting Content

### English Greetings

**Morning (5AM-12PM):**
1. Good morning
2. Rise and shine
3. Ready to learn?
4. Morning, learner
5. Start your day bright
6. Good morning, thinker
7. Ready for today's challenges?
8. A new day to learn
9. Morning! Let's begin
10. Time to wake up your brain
11. Fresh start, fresh mind
12. Good morning! What will you discover today?

**Afternoon (12PM-6PM):**
1. Good afternoon
2. Time to learn
3. Let's solve puzzles
4. Ready for challenges?
5. Afternoon adventure
6. Keep up the great work
7. Let's think together
8. Afternoon brain time
9. Ready to explore?
10. Time for some thinking
11. Let's challenge ourselves
12. Good afternoon! Ready to grow?

**Evening (6PM-9PM):**
1. Good evening
2. Evening learner
3. Ready for challenges?
4. Let's think
5. Evening brain time
6. Time to reflect and learn
7. Evening exploration
8. Ready for tonight's puzzles?
9. Good evening, thinker
10. Let's finish strong
11. Evening learning session
12. Ready to wind down with learning?

**Night (9PM-5AM):**
1. Good night
2. Night owl
3. Still learning?
4. Midnight thinker
5. Night study session
6. Late night learning
7. Burning the midnight oil
8. Good night, scholar
9. Ready for a night challenge?
10. Night time, brain time
11. Late learner
12. One more puzzle before bed?

### German Greetings

German translations will follow the same structure with culturally appropriate equivalents for each English greeting.

## Migration Plan

### Implementation Steps

1. **Add translations to both language files**
   - Update `public/locales/en/common.json` with English greetings
   - Update `public/locales/de/common.json` with German greetings
   - Add both simultaneously to prevent untranslated content

2. **Update greetings.ts**
   - Remove hardcoded arrays
   - Replace `getRandomGreeting()` with `useRandomGreeting()` hook
   - Remove `TimeBasedGreetings` interface
   - Keep `TimeOfDay` type and `getTimeOfDay()` function

3. **Update component usage**
   - Find all components using `getRandomGreeting()`
   - Update to use `useRandomGreeting()` hook

4. **Clean up**
   - Remove TODO comment about generating 50 variations
   - Delete old code (greetings object, interface)

### Backward Compatibility

- No breaking changes for users
- Translation cache may need hard refresh after deployment
- Old and new code can coexist during migration if needed

## Design Rationale

**Why translation arrays in common.json?**
- Follows standard i18next patterns
- Centralizes all translations in one place per language
- Simpler to maintain than separate files or dual structure
- Better developer experience with existing tooling

**Why remove emojis?**
- Cleaner, more professional appearance
- Reduces visual noise
- Typography-focused design aligns with modern UI trends
- Eliminates potential emoji rendering inconsistencies across platforms

**Why 12 variations instead of 50?**
- Good variety without overwhelming maintenance burden
- Easier to ensure quality across all translations
- Reduces translation costs
- Users unlikely to see repeats in normal usage patterns

**Why generic greetings only?**
- Simpler implementation (no backend integration needed)
- Consistent experience regardless of user state
- Avoids complexity of tracking user context
- Focus on warmth and encouragement rather than personalization
