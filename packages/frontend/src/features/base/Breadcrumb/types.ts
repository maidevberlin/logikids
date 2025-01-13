export interface BreadcrumbProps {
  /** The current page name */
  currentPage: string
  /** Optional subject for subject selection */
  subject?: string
  /** Optional concept for concept selection */
  concept?: string
  /** Callback when subject changes */
  onSubjectChange?: (subject: string) => void
  /** Callback when concept changes */
  onConceptChange?: (concept: string) => void
  /** Additional CSS classes */
  className?: string
} 