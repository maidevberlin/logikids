// Task-related constants
export const MAX_HINTS = 3
export const HINT_REVEAL_DELAY = 30000 // 30 seconds
export const MIN_AGE = 6
export const MAX_AGE = 20

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: 100,
  default: 200,
  slow: 300,
  slower: 500
} as const

// Size configurations
export const SIZE_CLASSES = {
  sm: {
    text: 'text-sm',
    padding: 'px-3 py-1.5'
  },
  md: {
    text: 'text-base',
    padding: 'px-4 py-2'
  },
  lg: {
    text: 'text-lg',
    padding: 'px-6 py-3'
  }
} as const

// Z-index layers
export const Z_LAYERS = {
  modal: 50,
  dropdown: 40,
  header: 30,
  content: 1
} as const

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
} as const 