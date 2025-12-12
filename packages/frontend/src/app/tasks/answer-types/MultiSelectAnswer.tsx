import { Checkbox } from '@/app/common/ui/checkbox'
import { MarkdownRenderer } from '@/app/common/MarkdownRenderer'
import { PlayButton } from '@/app/common/PlayButton'
import { cn } from '@/app/common/cn'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { AnswerOptionCard } from './AnswerOptionCard'

interface MultiSelectOption {
  id: number
  text: string
  isCorrect: boolean
}

interface MultiSelectAnswerProps {
  taskId?: string
  options: MultiSelectOption[]
  expectedCount: number
  selectedAnswer: number[] | null
  onAnswerSelect: (selectedIndices: number[]) => void
  isLocked?: boolean
}

export function MultiSelectAnswer({
  taskId,
  options,
  expectedCount,
  selectedAnswer,
  onAnswerSelect,
  isLocked = false,
}: MultiSelectAnswerProps) {
  const { t } = useTranslation()

  // Defensive check: ensure selectedAnswer is actually an array (handles race condition during task type changes)
  const selectedIndices = selectedAnswer && Array.isArray(selectedAnswer) ? selectedAnswer : []

  const handleToggle = (index: number) => {
    const newSelection = selectedIndices.includes(index)
      ? selectedIndices.filter((i) => i !== index)
      : [...selectedIndices, index]

    onAnswerSelect(newSelection)
  }

  const isOverSelected = selectedIndices.length > expectedCount

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
            <AnswerOptionCard
              key={index}
              content={option.text}
              index={index}
              isSelected={isSelected}
              onClick={() => handleToggle(index)}
              isLocked={isLocked}
              taskId={taskId}
              ttsField={`options:${index}`}
              className="flex items-center gap-4"
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
              {taskId && <PlayButton taskId={taskId} field={`options:${index}`} />}
            </AnswerOptionCard>
          )
        })}
      </div>
    </div>
  )
}
