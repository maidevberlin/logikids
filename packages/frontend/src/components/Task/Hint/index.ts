export { HintButton } from './HintButton'
export { HintSection } from './HintSection'
export type { HintButtonProps } from './HintButton'
export type { HintSectionProps } from './HintSection'

// Constants
export const HINT_TIMING = {
  glowTimeout: 10000, // 10 seconds of inactivity before starting to glow
  wrongAnswerDelay: 5000, // 5 seconds after wrong answer before showing hint automatically
} as const
