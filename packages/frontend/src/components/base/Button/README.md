# Button Component

A versatile button component that supports different variants, sizes, and states.

## Props

- `variant`: 'primary' | 'success' | 'error' | 'warning' | 'outline' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `fullWidth`: boolean (default: false)
- `disabled`: boolean (default: false)
- `className`: string for additional styling
- All standard HTML button attributes

## Usage

```tsx
import { Button } from './Button'

// Primary button
<Button>Click me</Button>

// Small warning button
<Button variant="warning" size="sm">Warning</Button>

// Full width outline button
<Button variant="outline" fullWidth>Full Width</Button>

// Disabled error button
<Button variant="error" disabled>Error</Button>
``` 