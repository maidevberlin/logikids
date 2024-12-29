# LoadingSpinner Component

A simple spinning loader component with customizable size.

## Props

- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `className`: string for additional styling
- All standard HTML div attributes

## Sizes
- `sm`: 16x16px (w-4 h-4)
- `md`: 24x24px (w-6 h-6)
- `lg`: 32x32px (w-8 h-8)

## Usage

```tsx
import { LoadingSpinner } from './LoadingSpinner'

// Default medium spinner
<LoadingSpinner />

// Small spinner
<LoadingSpinner size="sm" />

// Large spinner with custom colors
<LoadingSpinner 
  size="lg" 
  className="border-blue-200 border-t-blue-600" 
/>
```

## Notes

- Uses Tailwind's `animate-spin` for the spinning animation
- Default colors use the primary color palette
- Can be customized using className to override border colors 