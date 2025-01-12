import { useTranslation } from 'react-i18next'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { cn } from '../../../utils/cn'
import { SubjectSelectProps } from './types'
import { styles } from './styles'
import { useSubjects } from '../useSubjects'

export function SubjectSelect({ value, onChange, disabled, className }: SubjectSelectProps) {
  const { t } = useTranslation()
  const { data: subjects, isLoading } = useSubjects()

  if (isLoading || !subjects) {
    return (
      <div className={cn(styles.base, className)}>
        <div className={styles.button}>
          <span>{t(`subject.${value}`)}</span>
          <ChevronDownIcon className={styles.icon} />
        </div>
      </div>
    )
  }

  return (
    <Menu as="div" className={cn(styles.base, className)}>
      <Menu.Button 
        className={styles.button}
        disabled={disabled}
      >
        <span>{t(`subject.${value}`)}</span>
        <ChevronDownIcon className={styles.icon} />
      </Menu.Button>
      <Menu.Items className={styles.menu}>
        {subjects.map((subject) => (
          <Menu.Item key={subject.id}>
            {({ active }) => (
              <button
                className={cn(
                  styles.item.base,
                  active && styles.item.active
                )}
                onClick={() => onChange(subject.id)}
              >
                {t(`subject.${subject.id}`)}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  )
} 