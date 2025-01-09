import { useTranslation } from 'react-i18next'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { cn } from '../../../utils/cn'
import { DifficultySelectProps } from './types'
import { styles } from './styles'

export function DifficultySelect({ value, onChange, disabled }: DifficultySelectProps) {
  const { t } = useTranslation()

  const options = [
    { 
      value: 'easy',
      label: t('difficulty.easy')
    },
    { 
      value: 'medium',
      label: t('difficulty.medium')
    },
    { 
      value: 'hard',
      label: t('difficulty.hard')
    }
  ] as const

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button 
        className={cn(styles.button, 'hover:opacity-80')}
        disabled={disabled}
      >
        <span className={styles.difficulty[value]}>{selectedOption?.label}</span>
        <ChevronDownIcon className="w-3 h-3 ml-1 text-gray-400" />
      </Menu.Button>
      <Menu.Items className={styles.menu}>
        {options.map((option) => (
          <Menu.Item key={option.value}>
            {({ active }) => (
              <button
                className={cn(
                  styles.item.base,
                  active && styles.item.active,
                  'flex items-center'
                )}
                onClick={() => onChange(option.value)}
              >
                <span className={styles.difficulty[option.value]}>
                  {option.label}
                </span>
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  )
} 