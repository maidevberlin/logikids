# TaskLoadingProgress Component

**Location:** `packages/frontend/src/app/tasks/TaskLoadingProgress.tsx`

**Purpose:** Display an animated progress bar with time remaining estimate during task generation, making the ~20 second wait feel faster and preventing users from refreshing the page.

## Overview

The TaskLoadingProgress component implements **Phase 1** of the Task Loading UX design (see `/docs/plans/2025-11-12-task-loading-ux-design.md`). It provides visual feedback during AI task generation using a simulated progress bar with non-linear easing.

## Features

### 1. Non-Linear Progress Animation
- **Easing Function:** `progress = 100 * (1 - Math.exp(-elapsed / 7000))`
- **Behavior:**
  - Reaches ~30% in first 3 seconds (feels responsive)
  - Reaches ~63% at 7 seconds
  - Reaches ~90% at 15 seconds
  - Reaches ~95% at 20 seconds
  - Capped at 99.5% to avoid "stuck at 100%" feeling
  - Jumps to 100% when task actually loads (in parent component)

### 2. Subject-Themed Gradients
Automatically applies color gradients based on the subject:

| Subject | Gradient Colors |
|---------|----------------|
| Math | Blue (400-500-600) |
| Logic | Purple (400-500-600) |
| Physics | Emerald (400-500-600) |
| German | Red (400-500-600) |
| English | Amber (400-500-600) |
| Music | Pink (400-500-600) |
| Default | Gray (400-500-600) |

### 3. Time Remaining Estimate
- Displays time remaining in seconds
- Based on typical 20-second load time
- Updates every 200ms
- Shows "Almost there..." when time reaches 0

### 4. Visual Effects
- **Shimmer Animation:** Subtle shine effect moving across the progress bar
- **Smooth Transitions:** GPU-accelerated CSS transitions
- **Percentage Display:** Overlaid on progress bar for clear visibility

### 5. Accessibility
- **ARIA Attributes:**
  - `role="progressbar"`
  - `aria-valuenow={Math.round(progress)}`
  - `aria-valuemin={0}`
  - `aria-valuemax={100}`
  - `aria-label="Task generation progress"`
- **Live Region:** Time remaining updates announced via `aria-live="polite"`
- **Reduced Motion Support:** Disables animations when `prefers-reduced-motion` is set

## Props

```typescript
interface TaskLoadingProgressProps {
  /**
   * Subject identifier for theming (e.g., 'math', 'physics')
   * @optional
   */
  subject?: string

  /**
   * Callback invoked when progress reaches ~99%
   * Note: Called when animation nears completion, not when actual task loads
   * @optional
   */
  onComplete?: () => void

  /**
   * Additional CSS classes for the container
   * @optional
   */
  className?: string
}
```

## Usage

### Basic Example

```tsx
import { TaskLoadingProgress } from './TaskLoadingProgress'

function MyComponent() {
  return (
    <TaskLoadingProgress
      subject="math"
      onComplete={() => console.log('Progress animation complete')}
    />
  )
}
```

### Integration with TaskCard (Future)

```tsx
// In TaskCard.tsx
if (isLoading || !task) {
  return (
    <Card className="p-4 sm:p-8 shadow-2xl bg-card">
      <TaskLoadingProgress
        subject={taskParams.subject}
        onComplete={() => {
          // Optional: prepare UI for task arrival
        }}
      />
      {/* Additional loading content will go here in Phase 2 */}
    </Card>
  )
}
```

## Technical Details

### Update Frequency
- **Interval:** 200ms
- **Rationale:** Smooth enough to appear continuous without causing performance issues

### Easing Function Mathematics

The exponential easing function was chosen for its psychological properties:

```
progress = 100 * (1 - e^(-t/7000))

Where:
- t = elapsed time in milliseconds
- 7000 = time constant (affects curve steepness)
```

**Why this formula?**
1. **Fast initial progress** - Reaches 30% quickly, making wait feel shorter
2. **Asymptotic approach** - Never actually reaches 100%, avoiding "stuck at 100%" problem
3. **Realistic pacing** - Matches typical user expectations for "almost done"
4. **Mathematically smooth** - Continuous derivative (no jerky motion)

### Performance Optimizations
- Uses `useRef` to avoid unnecessary re-renders
- Intervals cleaned up in `useEffect` return function
- CSS animations GPU-accelerated via `transform`
- Percentage capped at 99.5% to prevent premature 100% display

### Memory Management
- All intervals properly cleaned up on unmount
- No memory leaks from dangling timers
- Refs set to null on cleanup

## Mobile Considerations

The component is fully responsive:
- Progress bar maintains visibility on small screens
- Text scales appropriately
- Touch-friendly (no interactive elements to accidentally click)
- Respects reduced motion preferences

## Future Enhancements (Later Phases)

**Phase 2 - Content System:**
- Add stage messages ("Analyzing...", "Crafting...", etc.)
- Integrate content carousel

**Phase 3 - i18n:**
- Translate time remaining text
- Support all languages (en, de, etc.)

**Phase 4 - Calibration:**
- Track actual load times in localStorage
- Adjust easing function coefficient based on user's typical load time
- Improve time estimate accuracy

## Testing

### Manual Testing
1. Open example file: `TaskLoadingProgress.example.tsx`
2. Observe different subject colors
3. Verify progress reaches ~95% at 20 seconds
4. Check accessibility with screen reader
5. Test on mobile devices
6. Verify reduced motion support (System Settings > Accessibility)

### Automated Testing (Future)
```tsx
// Potential test cases
describe('TaskLoadingProgress', () => {
  it('starts at 0% progress', () => { /* ... */ })
  it('updates progress every 200ms', () => { /* ... */ })
  it('applies correct subject gradient', () => { /* ... */ })
  it('calls onComplete when reaching ~99%', () => { /* ... */ })
  it('cleans up intervals on unmount', () => { /* ... */ })
  it('has proper ARIA attributes', () => { /* ... */ })
})
```

## Related Files

- **Design Document:** `/docs/plans/2025-11-12-task-loading-ux-design.md`
- **Subject Themes:** `/packages/frontend/src/app/common/subjectTheme.ts`
- **Integration Point:** `/packages/frontend/src/app/tasks/TaskCard.tsx` (lines 93-109)
- **Example Usage:** `/packages/frontend/src/app/tasks/TaskLoadingProgress.example.tsx`

## Known Limitations

1. **Progress is simulated** - Not tied to actual backend progress
   - *Resolution:* Phase 4 will add calibration based on historical load times
   - *Future:* Backend could send real progress signals

2. **Time estimate assumes 20s** - May be inaccurate for first-time users
   - *Resolution:* Phase 4 calibration will adjust based on user's actual load times

3. **No error handling** - Component assumes happy path
   - *Resolution:* Error handling will be added in Phase 4

## Questions?

- Check the design document for full context
- See `TaskLoadingProgress.example.tsx` for visual examples
- Refer to subjectTheme.ts for color scheme details
