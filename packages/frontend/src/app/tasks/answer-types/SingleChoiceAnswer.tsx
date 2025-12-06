import { Card } from '@/app/common/ui/card'
import { MarkdownRenderer } from '@/app/common/MarkdownRenderer'
import { PlayButton } from '@/app/common/PlayButton'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/app/common/ui/skeleton'
import { OPTION_COLORS } from '@/app/common/colors.ts'

interface Option {
  text: string
  isCorrect: boolean
}

interface SingleChoiceAnswerProps {
  taskId?: string
  options: Option[]
  selectedAnswer: number | null
  onAnswerSelect: (index: number) => void
  isLoading?: boolean
  isLocked?: boolean
}

export function SingleChoiceAnswer({
  taskId,
  options,
  selectedAnswer,
  onAnswerSelect,
  isLoading = false,
  isLocked = false,
}: SingleChoiceAnswerProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {options.map((option, index) => (
        <Card
          key={index}
          data-selected={selectedAnswer === index}
          onClick={isLocked ? undefined : () => onAnswerSelect(index)}
          className={cn(
            'p-6 transition-all duration-200 border-2 min-h-24',
            isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer',
            OPTION_COLORS[index % OPTION_COLORS.length]
          )}
        >
          <div className="flex items-center gap-2 w-full">
            <MarkdownRenderer
              content={option.text}
              className="flex-1"
              enableMath={true}
              enableMermaid={false}
              enableCode={false}
              noParagraphMargin={true}
            />
            {taskId && <PlayButton taskId={taskId} field={`options:${index}`} />}
          </div>
        </Card>
      ))}
    </div>
  )
}
