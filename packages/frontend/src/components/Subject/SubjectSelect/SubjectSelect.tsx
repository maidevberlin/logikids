import { useTranslation } from 'react-i18next'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { cn } from '../../../utils/cn'
import { SubjectSelectProps } from './types'
import { SUBJECT_VALUES } from '../types'
import { styles } from './styles'

export function SubjectSelect({ value, onChange, disabled, className }: SubjectSelectProps) {
  const { t } = useTranslation()

  const getLabel = (subject: typeof value) => t(`subject.${subject}`)

  return (
    <Menu as="div" className={cn(styles.base, className)}>
      <Menu.Button 
        className={styles.button}
        disabled={disabled}
      >
        <span>{getLabel(value)}</span>
        <ChevronDownIcon className={styles.icon} />
      </Menu.Button>
      <Menu.Items className={styles.menu}>
        {SUBJECT_VALUES.map((subject) => (
          <Menu.Item key={subject}>
            {({ active }) => (
              <button
                className={cn(
                  styles.item.base,
                  active && styles.item.active
                )}
                onClick={() => onChange(subject)}
              >
                {getLabel(subject)}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  )
} 