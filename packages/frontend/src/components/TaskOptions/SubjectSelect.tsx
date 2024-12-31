import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Subject } from '@logikids/backend/tasks/types';
import { useTranslation } from 'react-i18next';
import { cn } from '../base/styles/utils';
import { interactive } from '../base/styles/common';

interface SubjectSelectProps {
  subject: Subject;
  onSubjectChange: (subject: Subject) => void;
}

export function SubjectSelect({ subject, onSubjectChange }: SubjectSelectProps) {
  const { t } = useTranslation();

  const subjects = [
    { value: 'math' as Subject, translationKey: 'subject.math' },
    { value: 'logic' as Subject, translationKey: 'subject.logic' }
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className={cn(
        'text-gray-500 hover:text-primary-600',
        'flex items-center space-x-1',
        'text-sm',
        interactive.transition
      )}>
        <span>{t(subjects.find(s => s.value === subject)?.translationKey || '')}</span>
        <ChevronDownIcon className="w-3 h-3" />
      </Menu.Button>
      <Menu.Items className={cn(
        'absolute left-0 mt-1',
        'bg-white rounded-md shadow-lg',
        'py-1 w-48',
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
                {t(subj.translationKey)}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
} 