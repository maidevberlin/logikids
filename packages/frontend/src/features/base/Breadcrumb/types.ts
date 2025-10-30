export interface BreadcrumbProps {
  /** The current page name */
  currentPage: string
  /** Optional subject for subject selection */
  subject?: string
  /** Optional concept for concept selection (undefined means random) */
  concept?: string
  /** Callback when subject changes */
  onSubjectChange?: (subject: string) => void
  /** Callback when concept changes (undefined means random) */
  onConceptChange?: (concept: string | undefined) => void
  /** Additional CSS classes */
  className?: string
} 