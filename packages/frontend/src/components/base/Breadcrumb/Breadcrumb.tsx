import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { HomeIcon } from '@heroicons/react/24/solid';
import { Subject } from '@logikids/backend/tasks/types';
import { SubjectSelect } from '../../TaskOptions/SubjectSelect';
import { ConceptSelector } from '../ConceptSelector';
import { cn } from '../styles/utils';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  currentPage: string;
  subject?: Subject;
  concept?: string;
  onSubjectChange?: (subject: Subject) => void;
  onConceptChange?: (concept: string) => void;
}

export function Breadcrumb({ 
  currentPage, 
  subject, 
  concept,
  onSubjectChange,
  onConceptChange 
}: BreadcrumbProps) {
  
  return (
    <nav className="bg-white">
      <ol className={cn(
        'flex items-center space-x-4',
        'max-w-7xl mx-auto px-4 py-3'
      )}>
        <li>
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            <HomeIcon className="w-5 h-5" />
          </Link>
        </li>
        <li>
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
        </li>
        <li>
          <span className="text-gray-500">{currentPage}</span>
        </li>
        {subject && onSubjectChange && (
          <>
            <li>
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            </li>
            <li>
              <SubjectSelect
                subject={subject}
                onSubjectChange={onSubjectChange}
              />
            </li>
            {onConceptChange && (
              <>
                <li>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                </li>
                <li>
                  <ConceptSelector
                    subject={subject}
                    value={concept || 'random'}
                    onChange={onConceptChange}
                  />
                </li>
              </>
            )}
          </>
        )}
      </ol>
    </nav>
  );
} 