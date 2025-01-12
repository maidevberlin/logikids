import { BaseSize } from '../../types'

export type SpinnerSize = BaseSize | 'xl'
export type SpinnerColor = 'primary' | 'secondary' | 'white'

export interface LoadingSpinnerProps {
  /** The size of the spinner */
  size?: SpinnerSize
  /** The color of the spinner */
  color?: SpinnerColor
  /** Additional CSS classes */
  className?: string
} 