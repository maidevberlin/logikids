import { useTranslation } from 'react-i18next'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { cn } from '../../../utils/cn'
import { SubjectSelectProps } from './types'
import { styles } from './styles'
import { useSubjects } from '../useSubjects'
import { useUserData } from '../../UserData'

export function SubjectSelect({ value, onChange, disabled, className }: SubjectSelectProps) {
  const { t } = useTranslation()
  const { data: userData } = useUserData()

  const { data: subjectsResponse, isLoading } = useSubjects({
    grade: userData?.settings.grade ?? 5,
    age: userData?.settings.age ?? 10,
    difficulty: undefined // Optional - can be added later if needed
  })

  if (isLoading || !subjectsResponse) {
    return (
      <div className={cn(styles.base, className)}>
        <div className={styles.button}>
          <span>{t(`subjects.${value}.label`)}</span>
          <ChevronDownIcon className={styles.icon} />
        </div>
      </div>
    )
  }

  const subjects = subjectsResponse.subjects

  return (
    <Menu as="div" className={cn(styles.base, className)}>
      <Menu.Button
        className={styles.button}
        disabled={disabled}
      >
        <span>{t(`subjects.${value}.label`)}</span>
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
                {t(`subjects.${subject.id}.label`)}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  )
} 