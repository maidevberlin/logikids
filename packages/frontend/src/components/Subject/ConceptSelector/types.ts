import { Subject } from '@logikids/backend/tasks/types'

export interface ConceptSelectorProps {
  subject: Subject
  value: string
  onChange: (value: string) => void
  className?: string
} 