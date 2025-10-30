import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { cn } from '../../../utils/cn';
import { useTranslation } from 'react-i18next';
import { ConceptSelectorProps } from './types';
import { styles } from './styles';
import { useSubjects } from '../useSubjects';
import { useUserData } from '../../UserData';

export function ConceptSelector({ subject, value, onChange, className }: ConceptSelectorProps) {
  const { t } = useTranslation();
  const { data: userData } = useUserData();

  const { data: subjectsResponse } = useSubjects({
    grade: userData?.settings.grade ?? 5,
    age: userData?.settings.age ?? 10,
    difficulty: undefined // Optional - can be added later if needed
  });

  const subjectConfig = subjectsResponse?.subjects.find(s => s.id === subject);

  if (!subjectConfig) return null;

  const concepts = [
    { value: undefined as const },
    ...subjectConfig.concepts.map(concept => ({ value: concept.id }))
  ];

  const selectedConcept = concepts.find(c => c.value === value) || concepts[0];

  return (
    <Menu as="div" className={cn(styles.base, className)}>
      <Menu.Button className={styles.button}>
        <span>
          {selectedConcept.value === undefined
            ? t('subjects.random')
            : t(`subjects.${subject}.concepts.${selectedConcept.value}`)
          }
        </span>
        <ChevronDownIcon className={styles.icon} />
      </Menu.Button>
      <Menu.Items className={styles.menu}>
        {concepts.map((concept, index) => (
          <Menu.Item key={concept.value ?? `random-${index}`}>
            {({ active }) => (
              <button
                className={cn(
                  styles.item.base,
                  active && styles.item.active
                )}
                onClick={() => onChange(concept.value)}
              >
                {concept.value === undefined
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