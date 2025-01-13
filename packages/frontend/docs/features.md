# Component Structure Guidelines

## Overview
Our component architecture follows a domain-driven design approach, organizing components by their business domain and ensuring consistent structure and patterns across the codebase.

## Directory Structure

### Domain-Driven Organization
Components and their related logic are organized into domains, with each domain having its own directory:

```
src/features/
├── Account/             # Domain for account-related components
│   ├── LanguageSettings/
│   ├── PersonalInfo/
│   └── ...
├── Task/               # Domain for task-related components
│   ├── TaskCard/       # Component with its structure
│   ├── TaskContent/    # Component with its structure
│   ├── Hint/          # Component with nested components
│   │   ├── HintButton/
│   │   └── HintSection/
│   ├── types.ts       # Shared types for the domain
│   ├── index.ts       # Domain exports
│   ├── useTask.ts     # Domain-specific hooks
│   └── useTaskAnswer.ts
└── base/               # Base/shared components
    ├── Button/
    ├── Form/
    └── Layout/
```

### Domain Structure
A domain directory can contain:
1. Component folders (following component structure)
2. Domain-specific hooks (`useTask.ts`, `useTaskAnswer.ts`, etc.)
3. Shared types for the domain (`types.ts`)
4. Domain exports (`index.ts`)
5. Other domain-specific utilities

### Component Structure
Each component follows a consistent structure:

```
ComponentName/
├── ComponentName.tsx    # Main component implementation
├── styles.ts           # Component-specific styles using Tailwind
├── types.ts            # Component-specific types and interfaces
├── constants.ts        # Component-specific constants (if needed)
├── index.ts           # Clean exports
└── SubComponents/     # Nested components (if needed)
    └── ...           # Following the same structure
```

## File Conventions

### ComponentName.tsx
- Main component implementation
- Imports styles and types from co-located files
- Uses functional components with TypeScript
- Example:
```typescript
import { useTranslation } from 'react-i18next'
import { ComponentProps } from './types'
import { styles } from './styles'

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  return (
    <div className={styles.base}>
      {/* Component content */}
    </div>
  )
}
```

### styles.ts
- Uses TypeScript template literals with Tailwind classes
- Structured object with `as const` for type safety
- Example:
```typescript
export const styles = {
  base: `
    flex flex-col space-y-4
  `,
  label: `
    font-medium text-gray-700
  `
} as const
```

### types.ts
- Contains component props interface/type
- Any other component-specific types
- Example:
```typescript
export interface ComponentProps {
  label: string
  onChange: (value: string) => void
  className?: string
}
```

### index.ts
- Clean exports for better imports
- Example:
```typescript
export { ComponentName } from './ComponentName'
export type { ComponentProps } from './types'
```

## Domain-Specific Hooks
- Located at the domain root level
- Handle domain-specific logic and state management
- Follow the `use` prefix naming convention
- Example structure:
```typescript
// useTask.ts
export function useTask() {
  // Task-specific logic
  return {
    // Task-related state and functions
  }
}

// useTaskAnswer.ts
export function useTaskAnswer() {
  // Answer-specific logic
  return {
    // Answer-related state and functions
  }
}
```

### Hook Guidelines
1. Keep hooks focused on specific domain functionality
2. Use TypeScript for type safety
3. Export types if needed by components
4. Document complex logic or state management
5. Consider breaking down large hooks into smaller ones
6. Place shared hook logic in the domain root

### When to Create Domain Hooks
- Complex state management for the domain
- Shared logic between components
- API interactions specific to the domain
- Complex calculations or validations
- State persistence logic

## Component Categories

### Base Components (`/base`)
- Reusable, generic components
- Examples: Button, Input, Layout
- Often have more complex structures with nested components
- Example structure:
```
base/
├── Form/
│   ├── Input/
│   ├── Select/
│   └── NumberInput/
└── Layout/
    ├── Container/
    ├── Header/
    └── .../
```

### Domain Components
- Specific to business domains
- Implement domain-specific logic and UI
- Example structure:
```
Account/
├── LanguageSettings/
│   ├── LanguageSettings.tsx
│   ├── styles.ts
│   ├── types.ts
│   └── index.ts
└── PersonalInfo/
    ├── PersonalInfo.tsx
    ├── styles.ts
    ├── types.ts
    └── index.ts
```

## Styling Guidelines

### Using styles.ts
- Each component has its own `styles.ts`
- Uses Tailwind classes in template literals
- Structured for reusability and maintainability
- Example:
```typescript
export const styles = {
  base: `
    flex flex-col
  `,
  variant: {
    primary: `
      bg-primary-600 text-white
    `,
    secondary: `
      bg-gray-200 text-gray-800
    `
  }
} as const
```

### Class Composition
- Use the `cn` utility for class composition
- Combine styles with conditional classes
- Example:
```typescript
className={cn(
  styles.base,
  styles.variant[variant],
  disabled && styles.disabled,
  className
)}
```

## Best Practices

### Component Organization
1. Keep components focused and single-responsibility
2. Use sub-components for complex UIs
3. Co-locate related files (styles, types, etc.)
4. Use clear, descriptive naming

### Type Safety
1. Always define prop types in `types.ts`
2. Use TypeScript interfaces/types consistently
3. Leverage `as const` for style objects
4. Export types when needed by other components

### Styling
1. Keep styles modular and component-specific
2. Use Tailwind classes for consistency
3. Leverage the `cn` utility for class composition
4. Follow the project's design system

### Code Quality
1. Keep components pure when possible
2. Use proper TypeScript types
3. Follow consistent naming conventions
4. Document complex logic or patterns

## Examples

### Basic Component
```typescript
// ComponentName.tsx
import { ComponentProps } from './types'
import { styles } from './styles'

export function ComponentName({ label }: ComponentProps) {
  return <div className={styles.base}>{label}</div>
}

// styles.ts
export const styles = {
  base: `
    p-4 rounded-lg
  `
} as const

// types.ts
export interface ComponentProps {
  label: string
}

// index.ts
export { ComponentName } from './ComponentName'
```

### Complex Component with Variants
```typescript
// Button.tsx
import { ButtonProps } from './types'
import { styles } from './styles'

export function Button({ 
  variant = 'primary',
  disabled,
  children 
}: ButtonProps) {
  return (
    <button 
      className={cn(
        styles.base,
        styles.variant[variant],
        disabled && styles.disabled
      )}
    >
      {children}
    </button>
  )
}
``` 