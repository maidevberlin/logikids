import { ReactNode } from 'react'
import { BaseVariant, BaseStyleProps, BaseInteractiveProps } from '../types'
import { MultipleChoiceVariant } from '../../../components/Task/TaskAnswer/MultipleChoiceAnswer/types'

export interface CardProps extends BaseStyleProps, BaseInteractiveProps {
  /** The content to render inside the card */
  children: ReactNode
  /** Whether to show elevated shadow */
  elevated?: boolean
  /** The visual variant of the card */
  variant?: BaseVariant | MultipleChoiceVariant
} 