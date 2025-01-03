import { Subject } from '@logikids/backend/tasks/types'

export interface SubjectSelectProps {
  value: Subject
  onChange: (subject: Subject) => void
  disabled?: boolean
  className?: string
} 