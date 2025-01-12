import { SubjectId } from "../../Subject/types"

export interface BreadcrumbProps {
  /** The current page name */
  currentPage: string
  /** Optional subject for subject selection */
  subject?: SubjectId
  /** Optional concept for concept selection */
  concept?: string
  /** Callback when subject changes */
  onSubjectChange?: (subject: SubjectId) => void
  /** Callback when concept changes */
  onConceptChange?: (concept: string) => void
  /** Additional CSS classes */
  className?: string
} 