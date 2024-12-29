# LoadingState Component

A loading state component that displays a centered spinner with a white background overlay.

## Props

- `fullScreen`: boolean - Makes the loading state cover the entire viewport (default: false)
- `className`: string for additional styling

## Usage

```tsx
import { LoadingState } from './LoadingState'

// Container loading state
<div className="relative h-40">
  <LoadingState />
</div>

// Full screen loading state
<LoadingState fullScreen />

// Custom styled loading state
<LoadingState className="bg-gray-50" />
```

## Notes

- The component uses absolute positioning by default, so the parent container must have `position: relative`
- When `fullScreen` is true, it uses fixed positioning and adds a high z-index
- Uses the `LoadingSpinner` component internally 