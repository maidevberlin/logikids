import { Subject } from '../types'

export interface SubjectSelectProps {
  value: Subject
  onChange: (subject: Subject) => void
  disabled?: boolean
} 