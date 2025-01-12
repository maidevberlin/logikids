import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { cn } from '../../../utils/cn';
import { useTranslation } from 'react-i18next';
import { ConceptSelectorProps } from './types';
import { styles } from './styles';
import { useSubjects } from '../useSubjects';

export function ConceptSelector({ subject, value, onChange, className }: ConceptSelectorProps) {
  const { t } = useTranslation();
  const { data: subjects, isLoading } = useSubjects();

  if (isLoading || !subjects) {
    return (
      <div className={cn(styles.base, className)}>
        <div className={styles.button}>
          <span>{t(`concepts.${subject}.${value}`)}</span>
          <ChevronDownIcon className="w-3 h-3" />
        </div>
      </div>
    );
  }

  const currentSubject = subjects.find(s => s.id === subject);
  if (!currentSubject) return null;

  const concepts = [
    {
      id: 'random',
      translationKey: 'concepts.random'
    },
    ...currentSubject.concepts.map(concept => ({
      id: concept.id,
      translationKey: `concepts.${subject}.${concept.id}`
    }))
  ];

  const selectedConcept = concepts.find(c => c.id === value);
  if (!selectedConcept) return null;

  return (
    <Menu as="div" className={cn(styles.base, className)}>
      <Menu.Button className={styles.button}>
        <span>{t(selectedConcept.translationKey)}</span>
        <ChevronDownIcon className="w-3 h-3" />
      </Menu.Button>
      <Menu.Items className={styles.menu}>
        {concepts.map((concept) => (
          <Menu.Item key={concept.id}>
            {({ active }) => (
              <button
                className={cn(
                  styles.item.base,
                  active && styles.item.active
                )}
                onClick={() => onChange(concept.id)}
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