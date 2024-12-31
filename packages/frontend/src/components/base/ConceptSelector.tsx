import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { cn } from './styles/utils';
import { interactive } from './styles/common';
import { Subject } from '@logikids/backend/tasks/types';
import { subjects } from '../../config/subjects';
import { useTranslation } from 'react-i18next';

interface ConceptSelectorProps {
  subject: Subject;
  value: string;
  onChange: (value: string) => void;
}

export function ConceptSelector({ subject, value, onChange }: ConceptSelectorProps) {
  const { t } = useTranslation();
  const subjectConfig = subjects[subject];
  const concepts = [
    {
      value: 'random',
      translationKey: 'taskType.random'
    },
    ...Object.entries(subjectConfig.concepts).map(([id]) => ({
      value: id,
      translationKey: `taskType.${id}`
    }))
  ];

  const selectedConcept = concepts.find(c => c.value === value);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className={cn(
        'text-gray-500 hover:text-primary-600',
        'flex items-center space-x-1',
        'text-sm',
        interactive.transition
      )}>
        <span>{selectedConcept ? t(selectedConcept.translationKey) : ''}</span>
        <ChevronDownIcon className="w-3 h-3" />
      </Menu.Button>
      <Menu.Items className={cn(
        'absolute left-0 mt-1',
        'bg-white rounded-md shadow-lg',
        'py-1 w-48',
        'z-20'
      )}>
        {concepts.map((concept) => (
          <Menu.Item key={concept.value}>
            {({ active }) => (
              <button
                className={cn(
                  'block w-full text-left px-4 py-1 text-sm',
                  active ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                )}
                onClick={() => onChange(concept.value)}
              >
                {t(concept.translationKey)}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
} 