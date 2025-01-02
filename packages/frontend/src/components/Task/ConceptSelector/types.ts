import { Subject } from '../types'

export interface ConceptSelectorProps {
  subject: Subject
  value: string
  onChange: (value: string) => void
} 