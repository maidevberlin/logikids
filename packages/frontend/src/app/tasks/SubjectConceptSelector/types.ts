import { SubjectInfo, ConceptInfo } from '@/api/logikids'

export interface UnifiedSubjectConceptSelectorProps {
  subject: string
  concept?: string
  filteredSubjects: SubjectInfo[]
  allSubjects: SubjectInfo[]
  showAllByDefault: boolean
  onConceptChange: (concept: string, subject: string) => void
}

export interface SubjectListProps {
  subjects: SubjectInfo[]
  currentSubject: string
  previewSubject: string
  onSubjectClick: (subjectId: string) => void
  onSubjectHover: (subjectId: string) => void
  showAll: boolean
  hasMoreSubjects: boolean
  onToggleShowAll: () => void
}

export interface ConceptListProps {
  subject: string
  concepts: ConceptInfo[]
  currentConcept?: string
  onConceptClick: (conceptId: string) => void
  showAll: boolean
  hasMoreConcepts: boolean
  onToggleShowAll: () => void
}
