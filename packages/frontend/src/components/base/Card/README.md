# Card Component

A flexible card component that supports different variants, elevation states, and interactive behaviors.

## Props

- `variant`: 'default' | 'primary' | 'success' | 'error' | 'warning' (default: 'default')
- `elevated`: boolean - Adds stronger shadow (default: false)
- `disabled`: boolean - Disables interaction (default: false)
- `onClick`: () => void - Makes the card interactive
- `className`: string for additional styling
- `children`: ReactNode - Card content

## Usage

```tsx
import { Card } from './Card'

// Basic card
<Card>
  <p>Card content</p>
</Card>

// Primary elevated card
<Card variant="primary" elevated>
  <p>Elevated card</p>
</Card>

// Interactive card
<Card onClick={() => console.log('clicked')}>
  <p>Click me!</p>
</Card>

// Disabled warning card
<Card variant="warning" disabled onClick={() => console.log('not called')}>
  <p>Disabled card</p>
</Card>
``` 