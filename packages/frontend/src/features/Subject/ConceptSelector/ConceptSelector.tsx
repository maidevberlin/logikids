import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { cn } from '../../../utils/cn';
import { useTranslation } from 'react-i18next';
import { ConceptSelectorProps } from './types';
import { styles } from './styles';
import { useSubjects } from '../useSubjects';

export function ConceptSelector({ subject, value, onChange, className }: ConceptSelectorProps) {
  const { t } = useTranslation();
  const { data: subjects } = useSubjects();
  const subjectConfig = subjects?.find(s => s.id === subject);

  if (!subjectConfig) return null;

  const concepts = [
    { value: 'random' as const },
    ...subjectConfig.concepts.map(concept => ({ value: concept.id }))
  ];

  const selectedConcept = concepts.find(c => c.value === value);

  return (
    <Menu as="div" className={cn(styles.base, className)}>
      <Menu.Button className={styles.button}>
        <span>
          {selectedConcept && (selectedConcept.value === 'random' 
            ? t('subjects.random') 
            : t(`subjects.${subject}.concepts.${selectedConcept.value}`)
          )}
        </span>
        <ChevronDownIcon className={styles.icon} />
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
                {concept.value === 'random' 
                  ? t('subjects.random') 
                  : t(`subjects.${subject}.concepts.${concept.value}`)
                }
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
} 