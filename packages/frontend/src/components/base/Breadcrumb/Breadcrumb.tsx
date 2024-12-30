import { Link } from 'react-router-dom'
import { ChevronRightIcon, HomeIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { cn } from '../../base/styles/utils'
import { interactive, position } from '../../base/styles/common'
import { Subject, TaskType } from '../../../types/task'
import { Menu } from '@headlessui/react'
import { TaskTypeSelector } from '../TaskTypeSelector'
import { useTranslation } from 'react-i18next'

interface BreadcrumbProps {
  currentPage: string
  subject?: Subject
  taskType?: TaskType
  onSubjectChange?: (subject: Subject) => void
  onTaskTypeChange?: (taskType: TaskType) => void
}

export function Breadcrumb({ 
  currentPage, 
  subject, 
  taskType,
  onSubjectChange,
  onTaskTypeChange 
}: BreadcrumbProps) {
  const { t } = useTranslation();
  
  const subjects: { value: Subject, label: string }[] = [
    { value: 'math', label: t('subject.math') },
    { value: 'logic', label: t('subject.logic') }
  ]

  return (
    <nav className={cn(
      position.fixed,
      'top-4 left-4',
      'z-10'
    )}>
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/"
            className={cn(
              'text-gray-500 hover:text-primary-600',
              'flex items-center',
              interactive.transition
            )}
          >
            <HomeIcon className="w-4 h-4" />
          </Link>
        </li>
        <li>
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
        </li>
        <li className="text-gray-500 text-sm">
          {currentPage}
        </li>
        {subject && onSubjectChange && (
          <>
            <li>
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            </li>
            <li>
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className={cn(
                  'text-gray-500 hover:text-primary-600',
                  'flex items-center space-x-1',
                  'text-sm',
                  interactive.transition
                )}>
                  <span>{subjects.find(s => s.value === subject)?.label}</span>
                  <ChevronDownIcon className="w-3 h-3" />
                </Menu.Button>
                <Menu.Items className={cn(
                  'absolute left-0 mt-1',
                  'bg-white rounded-md shadow-lg',
                  'py-1 w-24',
                  'z-20'
                )}>
                  {subjects.map((subj) => (
                    <Menu.Item key={subj.value}>
                      {({ active }) => (
                        <button
                          className={cn(
                            'block w-full text-left px-4 py-1 text-sm',
                            active ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                          )}
                          onClick={() => onSubjectChange(subj.value)}
                        >
                          {subj.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Menu>
            </li>
            {taskType && onTaskTypeChange && (
              <>
                <li>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                </li>
                <li>
                  <TaskTypeSelector
                    subject={subject}
                    value={taskType}
                    onChange={onTaskTypeChange}
                  />
                </li>
              </>
            )}
          </>
        )}
      </ol>
    </nav>
  )
} 