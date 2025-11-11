import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'

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

const OPTION_COLORS = [
  'border-blue-200 hover:border-blue-400 hover:bg-blue-50 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-50',
  'border-purple-200 hover:border-purple-400 hover:bg-purple-50 data-[selected=true]:border-purple-500 data-[selected=true]:bg-purple-50',
  'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 data-[selected=true]:border-emerald-500 data-[selected=true]:bg-emerald-50',
  'border-pink-200 hover:border-pink-400 hover:bg-pink-50 data-[selected=true]:border-pink-500 data-[selected=true]:bg-pink-50',
  'border-orange-200 hover:border-orange-400 hover:bg-orange-50 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-50',
  'border-teal-200 hover:border-teal-400 hover:bg-teal-50 data-[selected=true]:border-teal-500 data-[selected=true]:bg-teal-50',
  'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 data-[selected=true]:border-indigo-500 data-[selected=true]:bg-indigo-50',
]

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
