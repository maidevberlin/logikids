import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid'
// import { SubjectSelect } from '../../Subject/SubjectSelect' // Removed - Subject folder deleted
// import { ConceptSelector } from '../../Subject/ConceptSelector' // Removed - Subject folder deleted
import { Link } from 'react-router-dom'
import { cn } from '../../../utils/cn'
import { BreadcrumbProps } from './types'
import { styles } from './styles'

export function Breadcrumb({ 
  currentPage, 
  subject, 
  concept,
  onSubjectChange,
  onConceptChange,
  className
}: BreadcrumbProps) {
  return (
    <nav className={cn(styles.base, className)}>
      <ol className={styles.list}>
        <li>
          <Link to="/" className={styles.home}>
            <HomeIcon className={styles.homeIcon} />
          </Link>
        </li>
        <li>
          <ChevronRightIcon className={styles.separator} />
        </li>
        <li>
          <span className={styles.current}>{currentPage}</span>
        </li>
        {/* Subject/Concept selectors removed - old Subject folder deleted */}
        {subject && (
          <>
            <li>
              <ChevronRightIcon className={styles.separator} />
            </li>
            <li>
              <span className={styles.current}>{subject}</span>
            </li>
          </>
        )}
        {concept && (
          <>
            <li>
              <ChevronRightIcon className={styles.separator} />
            </li>
            <li>
              <span className={styles.current}>{concept}</span>
            </li>
          </>
        )}
      </ol>
    </nav>
  )
} 