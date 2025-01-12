import { ReactNode } from 'react'

export interface LabelProps {
  /** The content to display */
  children: ReactNode
  /** The ID of the form element this label is for */
  htmlFor?: string
  /** Whether the field is required */
  required?: boolean
  /** Additional CSS classes */
  className?: string
} 