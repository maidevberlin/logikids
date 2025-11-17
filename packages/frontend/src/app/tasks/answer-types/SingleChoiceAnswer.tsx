import { Card } from '@/components/ui/card'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { OPTION_COLORS } from '@/constants/colors'

interface Option {
  text: string
  isCorrect: boolean
  explanation?: string
}

interface SingleChoiceAnswerProps {
  options: Option[]
  selectedAnswer: number | null
  onAnswerSelect: (index: number) => void
  isLoading?: boolean
  isLocked?: boolean
}

export function SingleChoiceAnswer({
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
            'p-6 transition-all duration-200 border-2 flex items-center justify-center min-h-24',
            isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer',
            OPTION_COLORS[index % OPTION_COLORS.length]
          )}
        >
          <MarkdownRenderer
            content={option.text}
            enableMath={true}
            enableMermaid={false}
            enableCode={false}
            noParagraphMargin={true}
          />
        </Card>
      ))}
    </div>
  )
}
