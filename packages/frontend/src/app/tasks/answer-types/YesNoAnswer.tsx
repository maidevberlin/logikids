import { Card } from '@/app/common/ui/card'
import { cn } from '@/app/common/cn'
import { Check, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface YesNoAnswerProps {
  selectedAnswer: boolean | null
  onAnswerSelect: (answer: boolean) => void
  isLocked?: boolean
}

export function YesNoAnswer({
  selectedAnswer,
  onAnswerSelect,
  isLocked = false,
}: YesNoAnswerProps) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-3 sm:gap-4 justify-center my-4 sm:my-6">
      {/* Yes Option */}
      <Card
        data-selected={selectedAnswer === true}
        onClick={isLocked ? undefined : () => onAnswerSelect(true)}
        className={cn(
          'p-5 sm:p-8 transition-all duration-200 border-2 flex flex-col items-center gap-2 sm:gap-3 min-w-32 sm:min-w-48',
          isLocked
            ? 'cursor-not-allowed opacity-75'
            : 'cursor-pointer hover:border-emerald-400 hover:-rotate-1',
          'data-[selected=true]:border-emerald-500 data-[selected=true]:bg-emerald-50 data-[selected=true]:shadow-lg data-[selected=true]:scale-[1.02]'
        )}
      >
        <Check className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
        <span className="text-lg sm:text-xl font-semibold text-emerald-700">{t('task.yes')}</span>
      </Card>

      {/* No Option */}
      <Card
        data-selected={selectedAnswer === false}
        onClick={isLocked ? undefined : () => onAnswerSelect(false)}
        className={cn(
          'p-5 sm:p-8 transition-all duration-200 border-2 flex flex-col items-center gap-2 sm:gap-3 min-w-32 sm:min-w-48',
          isLocked
            ? 'cursor-not-allowed opacity-75'
            : 'cursor-pointer hover:border-red-400 hover:rotate-1',
          'data-[selected=true]:border-red-500 data-[selected=true]:bg-red-50 data-[selected=true]:shadow-lg data-[selected=true]:scale-[1.02]'
        )}
      >
        <X className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" />
        <span className="text-lg sm:text-xl font-semibold text-red-700">{t('task.no')}</span>
      </Card>
    </div>
  )
}
