import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { cn } from '../../../utils/cn';
import { subjects } from '../subjects';
import { useTranslation } from 'react-i18next';
import { ConceptSelectorProps } from './types';
import { styles } from './styles';

export function ConceptSelector({ subject, value, onChange, className }: ConceptSelectorProps) {
  const { t } = useTranslation();
  const subjectConfig = subjects[subject];
  const concepts = [
    {
      value: 'random',
      translationKey: `concepts.random`
    },
    ...subjectConfig.concepts.map((id) => ({
      value: id,
      translationKey: `concepts.${subject}.${id}`
    }))
  ];

  const selectedConcept = concepts.find(c => c.value === value);

  return (
    <Menu as="div" className={cn(styles.base, className)}>
      <Menu.Button className={styles.button}>
        <span>{selectedConcept ? t(selectedConcept.translationKey) : ''}</span>
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
                {t(concept.translationKey)}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
} 