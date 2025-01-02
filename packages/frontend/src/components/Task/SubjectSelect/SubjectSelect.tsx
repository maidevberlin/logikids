import { useTranslation } from 'react-i18next'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { cn } from '../../../utils/cn'
import { SubjectSelectProps } from './types'
import { styles } from './styles'

export function SubjectSelect({ value, onChange, disabled }: SubjectSelectProps) {
  const { t } = useTranslation()

  const options = [
    { 
      value: 'math', 
      label: t('subject.math')
    },
    { 
      value: 'logic',
      label: t('subject.logic')
    }
  ] as const

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <Menu as="div" className={styles.base}>
      <Menu.Button 
        className={styles.button}
        disabled={disabled}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDownIcon className={styles.icon} />
      </Menu.Button>
      <Menu.Items className={styles.menu}>
        {options.map((option) => (
          <Menu.Item key={option.value}>
            {({ active }) => (
              <button
                className={cn(
                  styles.item.base,
                  active && styles.item.active
                )}
                onClick={() => onChange(option.value)}
              >
                {option.label}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  )
} 