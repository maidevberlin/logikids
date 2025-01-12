import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { cn } from '../../../utils/cn';
import { subjects, SubjectId, Concept } from '../../Subject';
import { useTranslation } from 'react-i18next';
import { ConceptSelectorProps } from './types';
import { styles } from './styles';

export function ConceptSelector({ subject, value, onChange, className }: ConceptSelectorProps) {
  const { t } = useTranslation();
  const subjectConfig = subjects[subject as SubjectId];

  const concepts = [
    { value: 'random' as const },
    ...subjectConfig.concepts.map(concept => ({ value: concept as Concept }))
  ];

  const selectedConcept = concepts.find(c => c.value === value);

  return (
    <Menu as="div" className={cn(styles.base, className)}>
      <Menu.Button className={styles.button}>
        <span>
          {selectedConcept && t(selectedConcept.value === 'random' 
            ? 'concepts.random' 
            : `concepts.${subject}.${selectedConcept.value}`
          )}
        </span>
        <ChevronDownIcon className="w-3 h-3" />
      </Menu.Button>
      <Menu.Items className={styles.menu}>
        {concepts.map((concept) => (
          <Menu.Item key={concept.value}>
            {({ active }) => (
              <button
                className={cn(
                  styles.item.base,
                  active && styles.item.active
                )}
                onClick={() => onChange(concept.value)}
              >
                {t(concept.value === 'random' 
                  ? 'concepts.random' 
                  : `concepts.${subject}.${concept.value}`
                )}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
} 