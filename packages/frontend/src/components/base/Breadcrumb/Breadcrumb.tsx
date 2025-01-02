import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid'
import { Subject } from '@logikids/backend/tasks/types'
import { SubjectSelect } from '../../Task/SubjectSelect'
import { ConceptSelector } from '../../Task/ConceptSelector'
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
        {subject && onSubjectChange && (
          <>
            <li>
              <ChevronRightIcon className={styles.separator} />
            </li>
            <li>
              <SubjectSelect
                subject={subject}
                onSubjectChange={onSubjectChange}
                className={styles.select}
              />
            </li>
          </>
        )}
        {concept && onConceptChange && subject && (
          <>
            <li>
              <ChevronRightIcon className={styles.separator} />
            </li>
            <li>
              <ConceptSelector
                subject={subject}
                value={concept}
                onChange={onConceptChange}
                className={styles.select}
              />
            </li>
          </>
        )}
      </ol>
    </nav>
  )
} 