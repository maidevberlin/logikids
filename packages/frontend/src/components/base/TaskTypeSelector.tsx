import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { cn } from './styles/utils';
import { interactive } from './styles/common';
import { Subject, MathTaskType, LogicTaskType } from '../../types/task';
import { useTranslation } from 'react-i18next';
import { getTaskTypes } from '../../config/taskTypes';

interface TaskTypeSelectorProps {
  subject: Subject;
  value: string;
  onChange: (value: MathTaskType | LogicTaskType) => void;
}

export function TaskTypeSelector({ subject, value, onChange }: TaskTypeSelectorProps) {
  const { t } = useTranslation();
  const taskTypes = getTaskTypes(subject);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className={cn(
        'text-gray-500 hover:text-primary-600',
        'flex items-center space-x-1',
        'text-sm',
        interactive.transition
      )}>
        <span>{t(taskTypes.find(type => type.value === value)?.translationKey || '')}</span>
        <ChevronDownIcon className="w-3 h-3" />
      </Menu.Button>
      <Menu.Items className={cn(
        'absolute left-0 mt-1',
        'bg-white rounded-md shadow-lg',
        'py-1 w-48',
        'z-20'
      )}>
        {taskTypes.map((type) => (
          <Menu.Item key={type.value}>
            {({ active }) => (
              <button
                className={cn(
                  'block w-full text-left px-4 py-1 text-sm',
                  active ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                )}
                onClick={() => onChange(type.value as MathTaskType | LogicTaskType)}
              >
                {t(type.translationKey)}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
} 