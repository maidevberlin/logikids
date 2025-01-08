import { SubjectId } from "../types"

export interface SubjectSelectProps {
  value: SubjectId
  onChange: (subject: SubjectId) => void
  disabled?: boolean
  className?: string
} 