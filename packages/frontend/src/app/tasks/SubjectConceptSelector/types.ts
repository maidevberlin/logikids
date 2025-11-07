import { SubjectInfo, ConceptInfo } from '@/api/logikids'

export interface UnifiedSubjectConceptSelectorProps {
  subject: string
  concept?: string
  subjects: SubjectInfo[]
  onConceptChange: (concept: string, subject: string) => void
}

export interface SubjectListProps {
  subjects: SubjectInfo[]
  currentSubject: string
  previewSubject: string
  onSubjectClick: (subjectId: string) => void
  onSubjectHover: (subjectId: string) => void
}

export interface ConceptListProps {
  subject: string
  concepts: ConceptInfo[]
  currentConcept?: string
  onConceptClick: (conceptId: string) => void
}
