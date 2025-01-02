import { BaseStyleProps } from '../../types'
import { SpinnerSize, SpinnerColor } from '../LoadingSpinner/types'

export interface LoadingStateProps extends BaseStyleProps {
  /** Whether to display the loading state fullscreen with a backdrop */
  fullScreen?: boolean
  /** The size of the spinner */
  size?: SpinnerSize
  /** The color variant of the spinner */
  variant?: SpinnerColor
} 