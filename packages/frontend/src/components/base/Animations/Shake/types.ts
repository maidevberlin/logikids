import { ReactNode } from 'react'

export interface ShakeProps {
  /** The content to animate */
  children: ReactNode
  /** Whether the shake animation is active */
  active?: boolean
  /** Additional CSS classes */
  className?: string
}

/** Return type for useShake hook: [isShaking, startShake, stopShake] */
export type UseShakeReturn = [
  /** Whether the shake animation is active */
  boolean,
  /** Function to start the shake animation */
  () => void,
  /** Function to stop the shake animation */
  () => void
] 