import { useTranslation } from 'react-i18next'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { SkipLinkProps } from './types'
import { styles } from './styles'

export function SkipLink({ onClick }: SkipLinkProps) {
  const { t } = useTranslation('common')

  return (
    <button
      onClick={onClick}
      className={styles.base}
    >
      <span>{t('task.skip')}</span>
      <ArrowRightIcon className={styles.icon} />
    </button>
  )
} 