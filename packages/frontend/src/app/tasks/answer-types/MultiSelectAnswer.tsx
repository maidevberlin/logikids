import { Card } from '@/app/common/ui/card'
import { Checkbox } from '@/app/common/ui/checkbox'
import { MarkdownRenderer } from '@/app/common/MarkdownRenderer'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/app/common/ui/skeleton'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { OPTION_COLORS } from '@/app/common/colors.ts'

interface MultiSelectOption {
  id: number
  text: string
  isCorrect: boolean
}

interface MultiSelectAnswerProps {
  options: MultiSelectOption[]
  expectedCount: number
  selectedAnswer: number[] | null
  onAnswerSelect: (selectedIndices: number[]) => void
  isLoading?: boolean
  isLocked?: boolean
}

export function MultiSelectAnswer({
  options,
  expectedCount,
  selectedAnswer,
  onAnswerSelect,
  isLoading = false,
  isLocked = false,
}: MultiSelectAnswerProps) {
  const { t } = useTranslation()

  // Defensive check: ensure selectedAnswer is actually an array (handles race condition during task type changes)
  const selectedIndices = selectedAnswer && Array.isArray(selectedAnswer) ? selectedAnswer : []

  const handleToggle = (index: number) => {
    const newSelection = selectedIndices.includes(index)
      ? selectedIndices.filter(i => i !== index)
      : [...selectedIndices, index]

    onAnswerSelect(newSelection)
  }

  const isOverSelected = selectedIndices.length > expectedCount

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {options.map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="my-6 space-y-4">
      {/* Instructions and Counter */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="text-sm text-muted-foreground">
          {t('task.selectCorrectAnswers', { count: expectedCount })}
        </div>
        <div
          className={cn(
            'px-3 py-1 rounded-full text-sm font-semibold',
            isOverSelected
              ? 'bg-red-100 text-red-700'
              : selectedIndices.length === expectedCount
              ? 'bg-green-100 text-green-700'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {t('task.selectedCount', { selected: selectedIndices.length, total: expectedCount })}
        </div>
      </div>

      {/* Warning for over-selection */}
      {isOverSelected && (
        <div className="flex items-center gap-2 justify-center p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{t('task.tooManySelected')}</span>
        </div>
      )}

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => {
          const isSelected = selectedIndices.includes(index)

          return (
            <Card
              key={index}
              data-selected={isSelected}
              onClick={isLocked ? undefined : () => handleToggle(index)}
              className={cn(
                'p-6 transition-all duration-200 border-2 flex items-center gap-4 min-h-24',
                isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer',
                OPTION_COLORS[index % OPTION_COLORS.length]
              )}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => !isLocked && handleToggle(index)}
                disabled={isLocked}
                className="w-6 h-6"
              />
              <div className="flex-1">
                <MarkdownRenderer
                  content={option.text}
                  enableMath={true}
                  enableMermaid={false}
                  enableCode={false}
                  noParagraphMargin={true}
                />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
