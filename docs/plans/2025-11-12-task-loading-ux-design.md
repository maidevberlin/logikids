# Task Loading UX Improvement Design

**Date:** 2025-11-12
**Status:** Design Approved
**Problem:** Users wait ~20 seconds for AI-generated tasks, see only skeleton loader, think it's broken, refresh page causing costly duplicate LLM calls.

## Problem Statement

### Current State
- Task generation takes ~20 seconds (LLM call)
- Users see skeleton loader with pulsing elements
- No progress indication or time estimate
- Users frequently refresh, triggering new expensive LLM calls
- High-frequency usage (10+ tasks per session) makes this a major UX problem

### Goals
1. **Prevent page refreshes** - Users understand it's working, save LLM costs
2. **Make waiting feel shorter** - Keep users engaged so time passes faster
3. **Educational value** - Show learning objectives, tips, or preview content

### Constraints
- 20-second generation time is acceptable (quality over speed)
- No backend changes desired
- Must support i18n (en, de, etc.)
- Must work across all subjects (math, physics, logic, music, german)

## Solution: Simulated Progress with Engaging Content

### Approach Selected
Client-side simulated progress bar with rotating educational content. Simple to implement, no backend changes, addresses all three goals.

**Trade-offs:**
- ✅ Quick to implement
- ✅ No backend infrastructure needed
- ✅ Can be enhanced later with real progress signals
- ⚠️ Progress is estimated, not strictly accurate
- ✅ Self-calibrating based on actual load times

## Architecture

### Component Structure

```
TaskLoadingState (new component)
├── TaskLoadingProgress (progress bar + time estimate)
└── TaskLoadingContent (stage messages + educational carousel)
```

**Integration Point:**
`TaskPage.tsx` lines 207-224 - TaskCard receives `isLoading` prop. Modify TaskCard to render `TaskLoadingState` instead of skeleton when loading.

### File Structure

```
src/app/tasks/
  TaskLoadingState.tsx          # Main loading component
  TaskLoadingProgress.tsx       # Progress bar component
  TaskLoadingContent.tsx        # Content carousel component

src/data/loadingContent/
  index.ts                      # Export all content
  math.ts                       # Math-specific content
  physics.ts                    # Physics-specific content
  logic.ts                      # Logic-specific content
  music.ts                      # Music-specific content
  german.ts                     # German-specific content

src/i18n/locales/
  en/loading.json               # English translations
  de/loading.json               # German translations
  # ... other supported languages
```

## Progress Bar Design

### Animation Strategy

**Non-linear easing** to feel responsive without being dishonest:
```javascript
progress = 100 * (1 - Math.exp(-elapsed / 7000))
```

**Characteristics:**
- Reaches ~30% in first 3 seconds (feels fast)
- Reaches ~90% at 15 seconds
- Reaches ~95% at 20 seconds
- Jumps to 100% when task actually loads
- Avoids "stuck at 99%" problem

### Calibration System

**Self-adjusting based on actual performance:**
1. Track last 10 actual load times in localStorage
2. Calculate rolling average
3. Adjust easing function coefficient to match user's typical load time
4. Default to 20s if no history

**Storage:**
```javascript
localStorage.setItem('taskLoadTimes', JSON.stringify([20.1, 19.8, 21.2, ...]))
```

### Visual Design

- **Color:** Subject-themed gradients (math=blue, physics=purple, etc.)
- **Animation:** Smooth CSS transitions (GPU accelerated)
- **Effect:** Subtle pulse/glow to show activity
- **Accessibility:** `role="progressbar"`, `aria-valuenow`, high contrast

### Update Frequency
- Interval: 200ms
- Smooth enough to appear continuous
- Not so frequent as to cause performance issues

## Stage Messages & Content

### Stage-Based Messages

Rotate through messages every 4-5 seconds:

| Progress | Stage | Message Key |
|----------|-------|-------------|
| 0-20% | Analyzing | `loading.stages.analyzing` |
| 20-50% | Crafting | `loading.stages.crafting` |
| 50-80% | Generating | `loading.stages.generating` |
| 80-100% | Finalizing | `loading.stages.finalizing` |

### Educational Content Carousel

Rotate through different content types every 5-6 seconds:

1. **Learning Tips** - Subject-specific study advice
   - Example: "Breaking complex problems into smaller steps makes them easier!"

2. **Concept Previews** - Brief explanation of current concept
   - Pull from concept metadata if available
   - Example: "You're about to practice: Linear equations"

3. **Fun Facts** - Subject-related trivia
   - Example: "Light travels fast enough to circle Earth 7.5 times in one second!"

4. **Encouragement** - Motivational messages
   - Example: "Every mistake is a chance to learn something new!"

### Content Organization

**Per-subject content files:**
```typescript
// src/data/loadingContent/math.ts
export const mathContent = {
  tips: [
    'loading.tips.math.0',
    'loading.tips.math.1',
    // ...
  ],
  facts: [
    'loading.facts.math.0',
    // ...
  ]
}
```

**Subject-agnostic content:**
```typescript
export const encouragement = [
  'loading.encouragement.0',
  'loading.encouragement.1',
  // ...
]
```

### i18n Structure

```json
{
  "loading": {
    "stages": {
      "analyzing": "Analyzing your learning level...",
      "crafting": "Crafting your question...",
      "generating": "Generating hints and solutions...",
      "finalizing": "Final touches..."
    },
    "tips": {
      "math": ["...", "..."],
      "physics": ["...", "..."]
    },
    "facts": {
      "math": ["...", "..."],
      "physics": ["...", "..."]
    },
    "encouragement": ["...", "..."],
    "timeRemaining": "About {{seconds}} seconds remaining...",
    "almostThere": "Almost there... generating a great question for you!",
    "header": "Preparing your task..."
  }
}
```

## Visual Layout

### Component Hierarchy

```
┌─────────────────────────────────────┐
│  [Icon] Preparing your task...      │ ← Header
├─────────────────────────────────────┤
│  ████████████░░░░░░░░░░░░  65%      │ ← Progress bar
├─────────────────────────────────────┤
│  Crafting your question...          │ ← Stage message
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │  Did you know?                  │ │
│ │  Breaking complex problems into │ │ ← Content card
│ │  smaller steps makes them       │ │   (rotates)
│ │  easier to solve!               │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│              About 7 seconds remain │ ← Time estimate
└─────────────────────────────────────┘
```

### Visual Hierarchy

1. **Most prominent:** Progress bar (immediate feedback)
2. **Secondary:** Educational content (engaging, not distracting)
3. **Context:** Stage messages
4. **Utility:** Time estimate (sets expectations)

### Animations

- **Progress bar:** Smooth fill with gradient, CSS transitions
- **Content rotation:** Fade in/out (300ms)
- **Card border:** Subtle pulse effect
- **No aggressive animations** that distract from reading

### Accessibility

- `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Stage changes announced via `aria-live="polite"`
- Content rotation pauses if user focuses text (for slower readers)
- WCAG-compliant color contrast on all text
- Keyboard navigation support

### Mobile Considerations

- Progress bar remains visible on small screens
- Content text scales appropriately (responsive typography)
- Touch-friendly (no accidental interactions)
- Reduced motion support for users with vestibular disorders

## Edge Cases & Error Handling

### 1. Faster Than Expected (< 10s)

**Behavior:**
- Progress jumps to 100% when task arrives
- Brief success state (green checkmark, 300ms)
- Smooth transition to task content

**Purpose:** Don't artifically delay showing the task

### 2. Longer Than Expected (> 30s)

**Behavior:**
- Progress asymptotically approaches 100% but never reaches it
- After 30s, show additional message: `loading.almostThere`
- Continue rotating content
- Don't show frustration/error yet (some tasks legitimately take longer)

**Purpose:** Maintain user confidence during legitimate delays

### 3. Loading Error

**Behavior:**
- Progress bar color changes to error state (red/orange)
- Show error message from API
- Display "Try Again" button
- Keep content visible for 2 seconds (user can read error)
- Clean up timers

**Purpose:** Clear error communication without jarring transitions

### 4. User Navigates Away

**Behavior:**
- useEffect cleanup function cancels all timers/intervals
- Don't record incomplete load time (would skew calibration)

**Purpose:** Prevent memory leaks and data corruption

### 5. Multiple Rapid Loads

**Behavior:**
- Reset progress immediately on new load
- Previous timers cleaned up
- Calibration continues to track each complete load

**Purpose:** Support users working through many tasks quickly

## Performance Considerations

### Optimizations

- **Progress animation:** CSS-driven (GPU accelerated)
- **Content loading:** Lazy load subject-specific content only
- **Time calculations:** Debounced (max once per 200ms)
- **Cleanup:** All timers/intervals cleared in useEffect cleanup
- **Re-renders:** Memoize content arrays, use React.memo for sub-components

### Measurement Points

- Actual load time: `performance.now()` from component mount to task arrival
- Progress update frequency: 200ms intervals
- Content rotation: 5-6 second intervals
- Stage message rotation: 4-5 second intervals

## Implementation Phases

### Phase 1: Core Progress Bar
- TaskLoadingProgress component
- Basic easing function
- Time estimate display
- Integration with TaskCard

### Phase 2: Content System
- Create content files per subject
- TaskLoadingContent component
- Content rotation logic
- Stage messages

### Phase 3: i18n & Polish
- Translation files (en, de, ...)
- Subject-themed colors
- Animations and transitions
- Accessibility features

### Phase 4: Calibration & Error Handling
- localStorage calibration
- Edge case handling
- Error states
- Testing across subjects

## Testing Checklist

- [ ] Mock slow load times (30s+)
- [ ] Mock fast load times (5s)
- [ ] Test error states
- [ ] Verify all subjects have content
- [ ] Verify translations exist for all supported languages
- [ ] Test calibration with various load patterns
- [ ] Test cleanup on navigation
- [ ] Accessibility audit (screen reader, keyboard navigation)
- [ ] Mobile/tablet responsiveness
- [ ] Reduced motion preferences

## Success Metrics

**Primary:**
- Reduction in page refresh rate during task loading

**Secondary:**
- User engagement time during wait (do they read content?)
- Perceived wait time (user surveys/feedback)
- Error rate (users reporting "broken" experience)

**Technical:**
- Calibration accuracy (predicted vs actual load time)
- Component render performance
- Content load time

## Future Enhancements

**After initial implementation:**
1. Real backend progress signals (replace simulated with actual)
2. User preferences for content types (some may want just progress, others want facts)
3. Gamification (streak counter, "you've learned X facts while waiting")
4. Adaptive content based on user's learning history
5. A/B test different timing curves and content strategies

## Related Files

**To Modify:**
- `packages/frontend/src/app/tasks/TaskCard.tsx` - Integrate TaskLoadingState
- `packages/frontend/src/app/tasks/TaskPage.tsx` - Pass loading state

**To Create:**
- `packages/frontend/src/app/tasks/TaskLoadingState.tsx`
- `packages/frontend/src/app/tasks/TaskLoadingProgress.tsx`
- `packages/frontend/src/app/tasks/TaskLoadingContent.tsx`
- `packages/frontend/src/data/loadingContent/index.ts`
- `packages/frontend/src/data/loadingContent/math.ts`
- `packages/frontend/src/data/loadingContent/physics.ts`
- (etc. for other subjects)
- `packages/frontend/src/i18n/locales/en/loading.json`
- `packages/frontend/src/i18n/locales/de/loading.json`

## References

- Current implementation: `packages/frontend/src/app/tasks/TaskPage.tsx:207-224`
- Task generation timing: ~20 seconds average
- User behavior: High frequency usage (10+ tasks/session)
- Design principle: Quality > Speed (maintain 20s generation time)
