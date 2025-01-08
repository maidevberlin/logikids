import { SubjectId } from "../types"

export interface ConceptSelectorProps {
  subject: SubjectId
  value: string
  onChange: (value: string) => void
  className?: string
} 