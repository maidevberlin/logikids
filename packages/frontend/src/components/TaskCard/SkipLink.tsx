import { useTranslation } from 'react-i18next'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

interface SkipLinkProps {
  onClick: () => void
}

export function SkipLink({ onClick }: SkipLinkProps) {
  const { t } = useTranslation('common')

  return (
    <button
      onClick={onClick}
      className="mt-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
    >
      <span>{t('task.skip')}</span>
      <ArrowRightIcon className="h-4 w-4" />
    </button>
  )
} 