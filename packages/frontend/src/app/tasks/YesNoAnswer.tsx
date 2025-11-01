import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'

interface YesNoAnswerProps {
  selectedAnswer: boolean | null
  onAnswerSelect: (answer: boolean) => void
  isLoading?: boolean
}

export function YesNoAnswer({
  selectedAnswer,
  onAnswerSelect,
  isLoading = false,
}: YesNoAnswerProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex gap-4 justify-center my-6">
        <Skeleton className="h-32 w-48 rounded-2xl" />
        <Skeleton className="h-32 w-48 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="flex gap-4 justify-center my-6">
      {/* Yes Option */}
      <Card
        data-selected={selectedAnswer === true}
        onClick={() => onAnswerSelect(true)}
        className={cn(
          'p-8 cursor-pointer transition-all duration-200 border-2 flex flex-col items-center gap-3 min-w-48',
          'hover:border-emerald-400',
          'data-[selected=true]:border-emerald-500 data-[selected=true]:bg-emerald-50 data-[selected=true]:shadow-lg'
        )}
      >
        <Check className="w-12 h-12 text-emerald-600" />
        <span className="text-xl font-semibold text-emerald-700">
          {t('task.yes', { defaultValue: 'Yes' })}
        </span>
      </Card>

      {/* No Option */}
      <Card
        data-selected={selectedAnswer === false}
        onClick={() => onAnswerSelect(false)}
        className={cn(
          'p-8 cursor-pointer transition-all duration-200 border-2 flex flex-col items-center gap-3 min-w-48',
          'hover:border-red-400',
          'data-[selected=true]:border-red-500 data-[selected=true]:bg-red-50 data-[selected=true]:shadow-lg'
        )}
      >
        <X className="w-12 h-12 text-red-600" />
        <span className="text-xl font-semibold text-red-700">
          {t('task.no', { defaultValue: 'No' })}
        </span>
      </Card>
    </div>
  )
}
