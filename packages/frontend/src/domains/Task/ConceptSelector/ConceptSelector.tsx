import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { cn } from '../../../utils/cn';
import { subjects } from '../../../components/Subject/subjects';
import { useTranslation } from 'react-i18next';
import { ConceptSelectorProps } from './types';
import './styles.css';

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
      <Menu.Button className="concept-selector-button">
        <span>{selectedConcept ? t(selectedConcept.translationKey) : ''}</span>
        <ChevronDownIcon className="w-3 h-3" />
      </Menu.Button>
      <Menu.Items className="concept-selector-menu">
        {concepts.map((concept) => (
          <Menu.Item key={concept.value}>
            {({ active }) => (
              <button
                className={cn(
                  'concept-selector-item',
                  active && 'concept-selector-item-active'
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